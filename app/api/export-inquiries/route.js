import { collectionHandlers } from "@/lib/crud";

export const dynamic = "force-dynamic";

const h = collectionHandlers("inquiries", {
  idPrefix: "EXP-",
  defaults: { status: "New" },
});

export const GET = h.list; // admin only
export const POST = h.create; // public (export inquiry form)
