import type { AuthSession, AuthUser } from '../../auth/authTypes'
import { apiFetch } from '../../lib/http'

type RegisterBody = {
  name: string
  email: string
  password: string
}

type LoginBody = {
  email: string
  password: string
}

// Adjust these paths once you share backend routes.
const AUTH = {
  register: '/auth/register',
  login: '/auth/login',
  me: '/users/me',
}

export async function register(body: RegisterBody) {
  return apiFetch<AuthSession>(AUTH.register, { method: 'POST', json: body, auth: false })
}

export async function login(body: LoginBody) {
  return apiFetch<AuthSession>(AUTH.login, { method: 'POST', json: body, auth: false })
}

export async function fetchCurrentUser() {
  return apiFetch<AuthUser>(AUTH.me, { method: 'GET' })
}

