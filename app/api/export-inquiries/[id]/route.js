import { collectionHandlers } from "@/lib/crud";

export const dynamic = "force-dynamic";

const h = collectionHandlers("inquiries", { idPrefix: "EXP-", defaults: { status: "New" } });

export const PATCH = h.update; // admin only
export const DELETE = h.remove; // admin only
