import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";

/**
 * Builds standard route handlers for a simple admin-managed collection that
 * also accepts public submissions (messages, complaints).
 *
 * - GET    (admin)  → list, newest first
 * - POST   (public) → create, server stamps id + date + defaults
 * - PATCH  (admin)  → partial update by id
 * - DELETE (admin)  → remove by id
 */
export function collectionHandlers(name, { idPrefix, defaults = {} }) {
  async function list() {
    if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
      const col = await getCollection(name);
      const items = await col
        .find({}, { projection: { _id: 0 } })
        .sort({ date: -1 })
        .toArray();
      return NextResponse.json({ items });
    } catch (e) {
      console.error(`GET ${name}`, e);
      return NextResponse.json({ error: "Failed to load" }, { status: 500 });
    }
  }

  async function create(request) {
    try {
      const body = await request.json();
      const col = await getCollection(name);
      const doc = {
        ...defaults,
        ...body,
        id: idPrefix + Date.now().toString().slice(-8),
        date: new Date().toISOString(),
      };
      delete doc._id;
      await col.insertOne({ ...doc });
      return NextResponse.json({ ok: true, item: doc });
    } catch (e) {
      console.error(`POST ${name}`, e);
      return NextResponse.json({ ok: false, error: "Could not submit" }, { status: 500 });
    }
  }

  async function update(request, { params }) {
    if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
      const patch = await request.json();
      delete patch._id;
      delete patch.id;
      const col = await getCollection(name);
      await col.updateOne({ id: params.id }, { $set: patch });
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.error(`PATCH ${name}`, e);
      return NextResponse.json({ ok: false, error: "Could not update" }, { status: 500 });
    }
  }

  async function remove(_request, { params }) {
    if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
      const col = await getCollection(name);
      await col.deleteOne({ id: params.id });
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.error(`DELETE ${name}`, e);
      return NextResponse.json({ ok: false, error: "Could not delete" }, { status: 500 });
    }
  }

  return { list, create, update, remove };
}
