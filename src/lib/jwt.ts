function base64UrlToBase64(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/')
  const padLen = (4 - (padded.length % 4)) % 4
  return padded + '='.repeat(padLen)
}

export function decodeJwtPayload<T extends Record<string, unknown> = Record<string, unknown>>(
  token: string,
): T | null {
  const parts = token.split('.')
  if (parts.length < 2) return null
  try {
    const payloadB64 = base64UrlToBase64(parts[1]!)
    const json = atob(payloadB64)
    return JSON.parse(json) as T
  } catch {
    return null
  }
}