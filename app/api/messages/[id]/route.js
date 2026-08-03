import { collectionHandlers } from "@/lib/crud";

export const dynamic = "force-dynamic";

const h = collectionHandlers("messages", { idPrefix: "MSG-", defaults: { read: false } });

export const PATCH = h.update;
export const DELETE = h.remove;
