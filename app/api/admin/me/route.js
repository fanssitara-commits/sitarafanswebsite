import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/me — is the current session authenticated?
export async function GET() {
  return NextResponse.json({ authed: isAdmin() });
}
