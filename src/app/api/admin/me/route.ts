import { getAdminSession } from "@/lib/require-admin";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Нэвтрээгүй байна" }, { status: 401 });
  return Response.json(session);
}
