import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCollection } from "@/lib/mongodb";
import { ensureProductsSeeded } from "@/lib/seedProducts";
import { isAdmin } from "@/lib/auth";
import { products as catalog } from "@/data/products";

export const dynamic = "force-dynamic";

const PROJECT = { projection: { _id: 0 } };

// keep only valid { name, img } colour entries
function normalizeColors(colors) {
  if (!Array.isArray(colors)) return [];
  return colors
    // a colour just needs a photo; the name is optional
    .filter((c) => c && c.img)
    .map((c) => ({ name: String(c.name || "").trim().slice(0, 40), img: String(c.img) }))
    .slice(0, 12);
}

// keep only valid { label, price } type/variant entries
export function normalizeVariants(variants) {
  if (!Array.isArray(variants)) return [];
  return variants
    .filter((v) => v && v.label && (v.price === 0 || v.price))
    .map((v) => ({ label: String(v.label).slice(0, 30), price: Number(v.price) || 0 }))
    .slice(0, 8);
}

function slugify(s) {
  return (
    "sitara-" +
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40)
  );
}

// GET /api/products — full list (custom fans first, then catalog)
export async function GET() {
  try {
    const col = await ensureProductsSeeded();
    const items = await col
      .find({}, PROJECT)
      .sort({ custom: -1, createdAt: -1, seq: 1 })
      .toArray();
    return NextResponse.json({ products: items });
  } catch (e) {
    console.error("GET /api/products", e);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

// POST /api/products — add a fan (admin only)
export async function POST(request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    const col = await getCollection("products");

    // build a unique id from the name
    const base = slugify(data.name || "fan");
    let id = base;
    let n = 2;
    // eslint-disable-next-line no-await-in-loop
    while (await col.findOne({ id })) id = `${base}-${n++}`;

    const item = {
      ...data,
      id,
      price: Number(data.price) || 0,
      oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
      colors: normalizeColors(data.colors),
      variants: normalizeVariants(data.variants),
      rating: Number(data.rating) || 4.5,
      stock: data.stock === "" || data.stock == null ? null : Number(data.stock),
      hue: Number(data.hue) || 210,
      custom: true,
      createdAt: new Date().toISOString(),
    };
    delete item._id;

    await col.insertOne({ ...item });
    revalidatePath("/");          // landing page (featured / about / gallery)
    revalidatePath("/products");  // shop listing
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    console.error("POST /api/products", e);
    return NextResponse.json(
      { ok: false, error: "Could not save the fan. Please try again." },
      { status: 500 }
    );
  }
}
