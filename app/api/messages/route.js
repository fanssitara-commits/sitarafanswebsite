import { collectionHandlers } from "@/lib/crud";

export const dynamic = "force-dynamic";

const h = collectionHandlers("messages", {
  idPrefix: "MSG-",
  defaults: { read: false },
});

export const GET = h.list;
export const POST = h.create;
