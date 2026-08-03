import { collectionHandlers } from "@/lib/crud";

export const dynamic = "force-dynamic";

const h = collectionHandlers("complaints", {
  idPrefix: "CMP-",
  defaults: { status: "New" },
});

export const GET = h.list;
export const POST = h.create;
