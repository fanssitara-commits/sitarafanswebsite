import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// PATCH /api/orders/:id — update status (admin only)
export async function PATCH(request, { params }) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const patch = await request.json();
    const allowed = {};
    if (typeof patch.status === "string") allowed.status = patch.status;

    const col = await getCollection("orders");
    await col.updateOne({ id: params.id }, { $set: allowed });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PATCH /api/orders/:id", e);
    return NextResponse.json({ ok: false, error: "Could not update order" }, { status: 500 });
  }
}
