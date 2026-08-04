import { getAdminSession } from "@/lib/require-admin";
import { readContent, writeContent, SECTION_NAMES, type SectionName } from "@/lib/blob-content";
import { apiRoute } from "@/lib/api-error";

export async function POST(req: Request, { params }: { params: Promise<{ section: string }> }) {
  return apiRoute(async () => {
    const session = await getAdminSession();
    if (!session) return Response.json({ error: "Нэвтрээгүй байна" }, { status: 401 });

    const { section } = await params;
    if (!SECTION_NAMES.includes(section as SectionName)) {
      return Response.json({ error: "Тийм хэсэг алга" }, { status: 404 });
    }

    const body = await req.json();
    const content = await readContent();
    const list = content[section as SectionName] as Record<string, unknown>[];

    const item = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: Date.now(),
    };
    content[section as SectionName] = [...list, item] as never;

    await writeContent(content);
    return Response.json(item, { status: 201 });
  });
}
