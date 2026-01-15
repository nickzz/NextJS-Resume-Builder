export async function apiGet(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export async function apiPost<TResponse, TRequest>(url: string, data: any) : Promise<TResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create data");
  return res.json();
}

export async function apiPut<TResponse, TRequest>(url: string, data: any) : Promise<TResponse> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update data");
  return res.json();
}

export async function apiDelete(url: string, id: string) {
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete data");
  return res.json();
}
