const fetchOptions: RequestInit = {
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
  },
};

export async function apiGet(url: string) {
  const res = await fetch(url, {
    ...fetchOptions,
    method: "GET",
  });

  return handleResponse(res);
}

export async function apiPost<TResponse>(url: string, data: any): Promise<TResponse> {
  const res = await fetch(url, {
    ...fetchOptions,
    method: "POST",
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function apiPut<TResponse>(url: string, data: any): Promise<TResponse> {
  const res = await fetch(url, {
    ...fetchOptions,
    method: "PUT",
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function apiDelete(url: string, id: string) {
  const res = await fetch(url, {
    ...fetchOptions,
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

  return handleResponse(res);
}

/**
 * Centered response handler to manage errors and authentication
 */
async function handleResponse(res: Response) {
  // If the server returns 401, the session is invalid or expired
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      console.warn("Unauthorized. Redirecting to login...");
      // window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "An API error occurred");
  }

  return res.json();
}