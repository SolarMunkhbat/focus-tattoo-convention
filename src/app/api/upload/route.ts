import { del, put } from "@vercel/blob";
import { getAdminSession } from "@/lib/require-admin";
import { apiRoute } from "@/lib/api-error";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(req: Request) {
  return apiRoute(async () => {
    const session = await getAdminSession();
    if (!session) return Response.json({ error: "Нэвтрээгүй байна" }, { status: 401 });

    const form = await req.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "misc").replace(/[^a-z]/gi, "") || "misc";

    if (!(file instanceof File)) {
      return Response.json({ error: "Зураг файл шаардлагатай" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return Response.json({ error: "Зөвхөн jpg/png/webp/gif зураг байршуулна уу" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return Response.json({ error: "Файлын хэмжээ 8MB-с бага байх ёстой" }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const pathname = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

    const blob = await put(pathname, file, { access: "public", addRandomSuffix: false });
    return Response.json({ url: blob.url, path: blob.pathname }, { status: 201 });
  });
}

export async function DELETE(req: Request) {
  return apiRoute(async () => {
    const session = await getAdminSession();
    if (!session) return Response.json({ error: "Нэвтрээгүй байна" }, { status: 401 });

    const { path } = await req.json();
    if (path) {
      try {
        await del(path);
      } catch {
        // already gone — safe to ignore
      }
    }
    return Response.json({ ok: true });
  });
}
