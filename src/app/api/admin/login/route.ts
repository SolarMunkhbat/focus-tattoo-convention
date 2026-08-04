import { cookies } from "next/headers";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, verifyPassword } from "@/lib/session";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username !== (process.env.ADMIN_USERNAME ?? "") ||
    !verifyPassword(password)
  ) {
    return Response.json({ error: "Нэвтрэх нэр эсвэл нууц үг буруу байна" }, { status: 401 });
  }

  const token = createSessionToken(username);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return Response.json({ username });
}
