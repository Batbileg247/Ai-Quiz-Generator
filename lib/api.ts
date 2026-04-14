export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "Request failed")
  }
  return res.json()
}

export const api = {
  getArticles: () => apiFetch<{ id: string; title: string; createdAt: string }[]>("/api/articles"),
  getArticle: (id: string) => apiFetch<any>(`/api/article/${id}`),
  createArticle: (title: string, content: string) =>
    apiFetch<{ articleId: string; summary: string }>("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    }),
  generateQuiz: (articleId: string) =>
    apiFetch<any>(`/api/article/${articleId}/quizzes`, { method: "POST" }),
}
