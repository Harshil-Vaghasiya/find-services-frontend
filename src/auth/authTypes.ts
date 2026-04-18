export type AuthUser = {
  id: string
  name: string
  email: string
}

export type AuthSession = {
  accessToken: string
  user: AuthUser
}