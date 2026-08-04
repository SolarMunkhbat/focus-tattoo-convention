import { getAdminSession } from "@/lib/require-admin";
import { readContent, writeContent, SECTION_NAMES, type SectionName } from "@/lib/blob-content";
import { apiRoute } from "@/lib/api-error";

type Params = { params: Promise<{ section: string; id: string }> };

export async function PUT(req: Request, { params }: Params) {
  return apiRoute(async () => {
    const session = await getAdminSession();
    if (!session) return Response.json({ error: "Нэвтрээгүй байна" }, { status: 401 });

    const { section, id } = await params;
    if (!SECTION_NAMES.includes(section as SectionName)) {
      return Response.json({ error: "Тийм хэсэг алга" }, { status: 404 });
    }

    const body = await req.json();
    const content = await readContent();
    const list = content[section as SectionName] as Record<string, unknown>[];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return Response.json({ error: "Олдсонгүй" }, { status: 404 });

    const updated = { ...list[index], ...body };
    list[index] = updated;
    content[section as SectionName] = list as never;

    await writeContent(content);
    return Response.json(updated);
  });
}

export async function DELETE(req: Request, { params }: Params) {
  return apiRoute(async () => {
    const session = await getAdminSession();
    if (!session) return Response.json({ error: "Нэвтрээгүй байна" }, { status: 401 });

    const { section, id } = await params;
    if (!SECTION_NAMES.includes(section as SectionName)) {
      return Response.json({ error: "Тийм хэсэг алга" }, { status: 404 });
    }

    const content = await readContent();
    const list = content[section as SectionName] as Record<string, unknown>[];
    content[section as SectionName] = list.filter((item) => item.id !== id) as never;

    await writeContent(content);
    return Response.json({ ok: true });
  });
}
