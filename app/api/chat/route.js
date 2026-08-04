import { NextResponse } from "next/server";
import { ensureProductsSeeded } from "@/lib/seedProducts";
import { formatPKR } from "@/data/products";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// --- product context cache (avoid a DB round-trip on every message) ---
const PRODUCT_TTL = 60_000; // 1 min
let productCache = { at: 0, items: [] };

// --- naive per-IP rate limiter (fixed window, in-memory) ---
const RATE_WINDOW = 60_000; // 1 min
const RATE_MAX = 15; // requests / window / IP
const rateHits = new Map(); // ip -> { count, reset }

function rateLimited(ip) {
  const now = Date.now();
  const rec = rateHits.get(ip);
  if (!rec || now > rec.reset) {
    rateHits.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  rec.count += 1;
  return rec.count > RATE_MAX;
}
// opportunistic cleanup so the map can't grow unbounded
function sweepRate(now) {
  if (rateHits.size < 5000) return;
  for (const [ip, rec] of rateHits) if (now > rec.reset) rateHits.delete(ip);
}

// pages the assistant is allowed to send users to
const PAGES = [
  ["/", "Home"],
  ["/products", "All Products / Shop"],
  ["/cart", "Shopping Cart"],
  ["/checkout", "Checkout"],
  ["/contact", "Contact Us"],
  ["/export", "Export info"],
  ["/export-inquiry", "Export Inquiry form"],
  ["/warranty", "Warranty Registration"],
  ["/complaint", "Register a Complaint"],
  ["/customer-service", "Customer Services / FAQ"],
  ["/history", "Our History"],
];

async function getProductContext() {
  const now = Date.now();
  if (now - productCache.at < PRODUCT_TTL) return productCache.items;
  try {
    const col = await ensureProductsSeeded();
    const items = await col
      .find({}, { projection: { _id: 0, id: 1, name: 1, price: 1, category: 1, warranty: 1, stock: 1, short: 1 } })
      .sort({ custom: -1, seq: 1 })
      .toArray();
    productCache = { at: now, items };
    return items;
  } catch {
    // on failure, serve the last good cache if we have one
    return productCache.items;
  }
}

export async function POST(request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "Chat is not configured." }, { status: 500 });
  }

  // rate limit per client IP
  const now = Date.now();
  sweepRate(now);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "You're sending messages too quickly. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  try {
    const { messages = [], language } = await request.json();
    const products = await getProductContext();

    const langLine = language
      ? `\n\nIMPORTANT: The user has selected "${language}" as their language. Reply ONLY in ${language}, no matter what language they type or speak in. Keep it natural and friendly.`
      : "";

    const productLines = products
      .map((p) => `- ${p.name} (id: ${p.id}) · ${p.category} · ${formatPKR(p.price)}${p.warranty ? " · " + p.warranty + " warranty" : ""}${p.stock === 0 ? " · OUT OF STOCK" : ""} → /products/${p.id}`)
      .join("\n");

    const pageLines = PAGES.map(([href, label]) => `- ${label} → ${href}`).join("\n");

    const system = `You are "Sitara Assistant", the friendly AI helper on the Sitara Fans website (a Pakistani fan manufacturer & online store).

You help visitors:
- Answer questions about the company, fans, prices, warranty, delivery, energy saving (our fans use up to 75% less energy), export, etc.
- Recommend fans and OPEN pages/products for them.

Reply in the SAME language the user uses (e.g. English, Urdu, Roman Urdu, Hindi, Arabic or Punjabi). If a specific reply language is requested below, always follow that.
Keep replies short, warm and helpful. Only talk about Sitara Fans and this website; politely decline unrelated topics.
CRITICAL: Refer to fans ONLY by their EXACT names from the PRODUCTS list below — in BOTH your reply text and actions. Never invent or use any product name that is not in the list.

WEBSITE PAGES you can open:
${pageLines}
- A specific fan: /products/{id}

PRODUCTS currently on the store:
${productLines || "(none)"}

When the user wants to open/see/go to something (a page or a fan), include it in "actions" so a button appears for them.

ALWAYS respond with ONLY a valid JSON object, no extra text, in this exact shape:
{"reply": "your message text", "actions": [{"label": "Open Sitara Royal Gold", "href": "/products/sitara-royal-gold"}]}
"actions" must be an array (empty [] if nothing to open). Every href MUST be one of the pages above or /products/{id} for a real product id from the list. Never invent hrefs or product ids. For a product action, the label MUST use that product's EXACT name from the list (e.g. "Open Sitara Prime Black") — never make up a name. Only recommend fans that actually appear in the PRODUCTS list.${langLine}`;

    // keep the last ~10 turns to stay light
    const convo = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && m.content)
      .slice(-10)
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

    // guard against the upstream hanging near our maxDuration
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25_000);
    let res;
    try {
      res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          temperature: 0.4,
          max_tokens: 700,
          response_format: { type: "json_object" },
          messages: [{ role: "system", content: system }, ...convo],
        }),
        signal: ctrl.signal,
      });
    } catch (err) {
      if (err?.name === "AbortError") {
        return NextResponse.json({ error: "The assistant took too long to respond. Please try again." }, { status: 504 });
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }

    if (!res.ok) {
      const t = await res.text();
      console.error("Groq error", res.status, t);
      return NextResponse.json({ error: "AI service error. Please try again." }, { status: 502 });
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content || "{}";
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { reply: raw, actions: [] };
    }

    // validate actions against known hrefs / real product ids
    const validHrefs = new Set(PAGES.map(([h]) => h));
    const productIds = new Set(products.map((p) => p.id));
    const actions = Array.isArray(parsed.actions)
      ? parsed.actions
          .filter((a) => a && a.href && a.label)
          .filter((a) => validHrefs.has(a.href) || (a.href.startsWith("/products/") && productIds.has(a.href.slice("/products/".length))))
          .slice(0, 5)
          .map((a) => ({ label: String(a.label).slice(0, 60), href: a.href }))
      : [];

    return NextResponse.json({ reply: String(parsed.reply || "").slice(0, 2000), actions });
  } catch (e) {
    console.error("POST /api/chat", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
