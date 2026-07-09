const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api"

interface ApiErrorBody {
  error?: { message?: string }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null
    throw new Error(body?.error?.message ?? `Erreur réseau (${response.status})`)
  }

  if (response.status === 204) return undefined as T

  return (await response.json()) as T
}
