import crypto from "node:crypto";

const SECRET = process.env.SESSION_SECRET ?? "";
const MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function createSessionToken(username: string) {
  const payload = Buffer.from(JSON.stringify({ u: username, exp: Date.now() + MAX_AGE_MS })).toString(
    "base64url"
  );
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): { username: string } | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const { u, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof exp !== "number" || Date.now() > exp) return null;
    return { username: u };
  } catch {
    return null;
  }
}

export function verifyPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  const a = crypto.createHash("sha256").update(candidate).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return expected.length > 0 && crypto.timingSafeEqual(a, b);
}

export const SESSION_COOKIE = "focus_admin";
export const SESSION_MAX_AGE_SECONDS = MAX_AGE_MS / 1000;
