const NETWORK_DELAY_MS = 250

/** Simulates real network latency so the UI's loading states behave like a real API. */
export function networkDelay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function readCollection<T>(key: string, fallback: T[]): T[] {
  const raw = localStorage.getItem(key)
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }
  try {
    return JSON.parse(raw) as T[]
  } catch {
    return fallback
  }
}

export function writeCollection<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export const STORAGE_KEYS = {
  tasks: "madishop.tasks",
  members: "madishop.members",
  labels: "madishop.labels",
} as const
