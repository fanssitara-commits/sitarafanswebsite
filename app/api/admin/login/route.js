import { NextResponse } from "next/server";
import { checkPasscode, adminToken, ADMIN_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/admin/login — verify passcode server-side, set httpOnly cookie
export async function POST(request) {
  let value = "";
  try {
    ({ passcode: value = "" } = await request.json());
  } catch {
    /* empty body */
  }

  if (!checkPasscode(value)) {
    return NextResponse.json({ ok: false, error: "Incorrect passcode." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
