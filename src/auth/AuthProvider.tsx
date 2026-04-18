import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { AuthSession } from './authTypes'
import { clearAccessToken, getAccessToken, persistAccessToken } from './authStorage'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { fetchCurrentUser } from '../features/auth/authApi'

function normalizeUser(user: AuthSession['user']) {
  return {
    id: user.id,
    name: user.name,
    email: user.email.trim().toLowerCase(),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthSession['user'] | null>(null)
  const [accessToken, setAccessTokenState] = useState<string | null>(() => getAccessToken())

  const fetchAndSetUser = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setUser(null)
      setAccessTokenState(null)
      return
    }
    setAccessTokenState(token)
    const me = await fetchCurrentUser()
    setUser(normalizeUser(me))
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      await fetchAndSetUser()
    } catch {
      setUser(null)
    }
  }, [fetchAndSetUser])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const value = useMemo<AuthContextValue>(() => {
    const setAuth = async (session: AuthSession | { accessToken: string }) => {
      persistAccessToken(session.accessToken)
      try {
        await fetchAndSetUser()
      } catch (e) {
        clearAccessToken()
        setUser(null)
        setAccessTokenState(null)
        throw e
      }
    }

    const logout = (opts?: { silent?: boolean }) => {
      clearAccessToken()
      setUser(null)
      setAccessTokenState(null)
      if (!opts?.silent) toast.info('Signed out')
      navigate({ to: '/login', replace: true })
    }

    return {
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken),
      setAuth,
      refreshUser,
      logout,
    }
  }, [fetchAndSetUser, navigate, refreshUser, user, accessToken])

  useEffect(() => {
    const handler = () => {
      const path = window.location.pathname
      const onLoginOrSignup = path === '/login' || path === '/signup'

      clearAccessToken()
      setUser(null)
      setAccessTokenState(null)

      if (!onLoginOrSignup) {
        toast.error('Your session has expired. Please sign in again.')
        navigate({ to: '/login', replace: true })
      }
    }
    window.addEventListener('auth:unauthorized', handler)
    return () => window.removeEventListener('auth:unauthorized', handler)
  }, [navigate])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
