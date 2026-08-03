import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/products/:id
export async function GET(_request, { params }) {
  try {
    const col = await getCollection("products");
    const product = await col.findOne({ id: params.id }, { projection: { _id: 0 } });
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (e) {
    console.error("GET /api/products/:id", e);
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
  }
}

// PUT /api/products/:id — edit a fan (admin only)
export async function PUT(request, { params }) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    const col = await getCollection("products");

    const patch = {
      ...data,
      price: Number(data.price) || 0,
      oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
      colors: Array.isArray(data.colors)
        ? data.colors
            .filter((c) => c && c.img)
            .map((c) => ({ name: String(c.name || "").trim().slice(0, 40), img: String(c.img) }))
            .slice(0, 12)
        : [],
      variants: Array.isArray(data.variants)
        ? data.variants
            .filter((v) => v && v.label && (v.price === 0 || v.price))
            .map((v) => ({ label: String(v.label).slice(0, 30), price: Number(v.price) || 0 }))
            .slice(0, 8)
        : [],
      rating: Number(data.rating) || 4.5,
      stock: data.stock === "" || data.stock == null ? null : Number(data.stock),
    };
    // never let the client rewrite identity / storage fields
    delete patch._id;
    delete patch.id;
    delete patch.custom;
    delete patch.createdAt;
    delete patch.seq;

    const res = await col.findOneAndUpdate(
      { id: params.id },
      { $set: patch },
      { returnDocument: "after", projection: { _id: 0 } }
    );
    const item = res?.value ?? res; // driver version differences
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    console.error("PUT /api/products/:id", e);
    return NextResponse.json({ ok: false, error: "Could not update the fan." }, { status: 500 });
  }
}

// DELETE /api/products/:id (admin only)
export async function DELETE(_request, { params }) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const col = await getCollection("products");
    await col.deleteOne({ id: params.id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/products/:id", e);
    return NextResponse.json({ ok: false, error: "Could not delete the fan." }, { status: 500 });
  }
}
