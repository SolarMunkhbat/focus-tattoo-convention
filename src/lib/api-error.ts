export async function apiRoute(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error
        ? err.message
        : "Серверийн алдаа гарлаа";
    return Response.json({ error: message }, { status: 500 });
  }
}
