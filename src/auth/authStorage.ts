const TOKEN_KEY = 'auth:accessToken'

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function persistAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY)
}
