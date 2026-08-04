async function asJson(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Хүсэлт амжилтгүй боллоо (${res.status})`);
  }
  return res.json();
}

export async function addItem<T>(section: string, data: Partial<T>): Promise<T> {
  const res = await fetch(`/api/content/${section}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return asJson(res);
}

export async function updateItem<T>(section: string, id: string, data: Partial<T>): Promise<T> {
  const res = await fetch(`/api/content/${section}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return asJson(res);
}

export async function deleteItem(section: string, id: string): Promise<{ ok: true }> {
  const res = await fetch(`/api/content/${section}/${id}`, { method: "DELETE" });
  return asJson(res);
}

export async function uploadImage(folder: string, file: File): Promise<{ url: string; path: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  return asJson(res);
}

export async function deleteImage(path: string): Promise<void> {
  if (!path) return;
  await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
}
