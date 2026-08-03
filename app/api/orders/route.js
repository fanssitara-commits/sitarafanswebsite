import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/orders — admin only (newest first)
export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const col = await getCollection("orders");
    const orders = await col
      .find({}, { projection: { _id: 0 } })
      .sort({ date: -1 })
      .toArray();
    return NextResponse.json({ orders });
  } catch (e) {
    console.error("GET /api/orders", e);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

// POST /api/orders — place an order (public: checkout). Recomputes totals
// server-side and decrements stock so prices/stock can't be tampered with.
export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, items } = body;

    if (!customer?.name || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }

    const products = await getCollection("products");
    const orders = await getCollection("orders");

    // rebuild line items from trusted DB prices
    const lineItems = [];
    for (const i of items) {
      // eslint-disable-next-line no-await-in-loop
      const p = await products.findOne({ id: i.id }, { projection: { _id: 0 } });
      if (!p) continue;
      const qty = Math.max(1, Number(i.qty) || 1);

      // price depends on the chosen type/variant, always taken from the DB (not the client)
      let price = p.price;
      if (i.variant && Array.isArray(p.variants)) {
        const v = p.variants.find((x) => x.label === i.variant);
        if (v) price = v.price;
      }

      // work out which colour was chosen — match by name first, then by image
      // URL (so nameless colours still record the exact image ordered)
      const colors = Array.isArray(p.colors) ? p.colors : [];
      const matchedColor =
        (i.color ? colors.find((c) => c.name === i.color) : null) ||
        (i.img ? colors.find((c) => c.img === i.img) : null) ||
        null;

      lineItems.push({
        id: p.id,
        name: p.name,
        price,
        hue: p.hue,
        img: matchedColor?.img || p.img,
        category: p.category,
        color: i.color || matchedColor?.name || null,
        variant: i.variant || null,
        qty,
      });
    }
    if (lineItems.length === 0) {
      return NextResponse.json({ error: "No valid items" }, { status: 400 });
    }

    const subtotal = lineItems.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal > 10000 || subtotal === 0 ? 0 : 300;

    const order = {
      id: "SF-" + Date.now().toString().slice(-8),
      date: new Date().toISOString(),
      customer,
      items: lineItems,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: "Pending",
    };

    await orders.insertOne({ ...order });

    // decrement stock (only for products that track it), floor at 0
    await Promise.all(
      lineItems.map((i) =>
        products.updateOne(
          { id: i.id, stock: { $type: "number" } },
          [
            {
              $set: {
                stock: { $max: [0, { $subtract: ["$stock", i.qty] }] },
              },
            },
          ]
        )
      )
    );

    return NextResponse.json({ ok: true, order });
  } catch (e) {
    console.error("POST /api/orders", e);
    return NextResponse.json({ error: "Could not place order" }, { status: 500 });
  }
}
