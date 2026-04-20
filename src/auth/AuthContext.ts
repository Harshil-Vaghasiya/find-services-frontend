import { createContext } from 'react'
import type { AuthSession, AuthUser } from './authTypes'

export type AuthCredentials = { accessToken: string }

export type AuthContextValue = {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  /** Persists token only, then loads user from `GET /users/me`. Returns the loaded user. */
  setAuth: (session: AuthSession | AuthCredentials) => Promise<AuthUser>
  /** Reload user from `GET /users/me` using the stored token. */
  refreshUser: () => Promise<void>
  logout: (opts?: { silent?: boolean }) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
