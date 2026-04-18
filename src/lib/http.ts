import { getAccessToken } from '../auth/authStorage'

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function getBaseUrl() {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined
  return base?.replace(/\/$/, '') ?? ''
}

function toMessage(data: unknown): string {
  if (!data) return 'Something went wrong'
  if (typeof data === 'string') return data
  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>
    const message = obj.message
    if (typeof message === 'string') return message
    if (Array.isArray(message) && message.every((m) => typeof m === 'string')) return message.join(', ')
    const error = obj.error
    if (typeof error === 'string') return error
  }
  return 'Something went wrong'
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown; auth?: boolean },
): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`

  const headers = new Headers(init?.headers)
  if (init?.json !== undefined) headers.set('Content-Type', 'application/json')
  if (init?.auth !== false) {
    const token = getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(url, {
    ...init,
    headers,
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  })

  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null)

  if (!res.ok) {
    if (res.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    throw new ApiError(toMessage(data), res.status, data)
  }

  return data as T
}