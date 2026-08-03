import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "sitara_admin";

/**
 * Deterministic session token derived from the passcode + secret.
 * The raw passcode is never sent to the browser — only this hash is,
 * and it can't be reversed or forged without ADMIN_SECRET.
 */
export function adminToken() {
  const passcode = process.env.ADMIN_PASSCODE || "";
  const secret = process.env.ADMIN_SECRET || "sitara-secret";
  return crypto
    .createHmac("sha256", secret)
    .update(passcode)
    .digest("hex");
}

/** True if the supplied passcode matches the server-side one. */
export function checkPasscode(value) {
  const expected = process.env.ADMIN_PASSCODE || "";
  if (!expected || typeof value !== "string") return false;
  // constant-time compare
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** True if the incoming request carries a valid admin session cookie. */
export function isAdmin() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return !!token && token === adminToken();
}
