import { collectionHandlers } from "@/lib/crud";

export const dynamic = "force-dynamic";

const h = collectionHandlers("complaints", { idPrefix: "CMP-", defaults: { status: "New" } });

export const PATCH = h.update;
export const DELETE = h.remove;
