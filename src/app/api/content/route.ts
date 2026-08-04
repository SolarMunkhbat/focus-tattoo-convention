import { readContent } from "@/lib/blob-content";

export async function GET() {
  const content = await readContent();
  return Response.json(content);
}
