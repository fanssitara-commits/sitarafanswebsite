import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import { makeOrders, makeMessages, makeComplaints } from "@/lib/demoSeed";

export const dynamic = "force-dynamic";

// POST /api/seed — load sample orders / messages / complaints (admin only)
export async function POST() {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [orders, messages, complaints] = await Promise.all([
      getCollection("orders"),
      getCollection("messages"),
      getCollection("complaints"),
    ]);
    await Promise.all([
      orders.deleteMany({}),
      messages.deleteMany({}),
      complaints.deleteMany({}),
    ]);
    await Promise.all([
      orders.insertMany(makeOrders()),
      messages.insertMany(makeMessages()),
      complaints.insertMany(makeComplaints()),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/seed", e);
    return NextResponse.json({ ok: false, error: "Could not seed data" }, { status: 500 });
  }
}

// DELETE /api/seed — clear orders / messages / complaints (admin only)
export async function DELETE() {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [orders, messages, complaints] = await Promise.all([
      getCollection("orders"),
      getCollection("messages"),
      getCollection("complaints"),
    ]);
    await Promise.all([
      orders.deleteMany({}),
      messages.deleteMany({}),
      complaints.deleteMany({}),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/seed", e);
    return NextResponse.json({ ok: false, error: "Could not clear data" }, { status: 500 });
  }
}
