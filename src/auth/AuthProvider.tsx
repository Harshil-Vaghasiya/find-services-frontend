import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { AuthSession, AuthUser, ShopDetails, UserRole } from './authTypes'
import { clearAccessToken, getAccessToken, persistAccessToken } from './authStorage'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { fetchCurrentUser } from '../features/auth/authApi'

const USER_ROLES: UserRole[] = ['user', 'admin', 'serviceOwner']
const SHOP_CATEGORIES: ShopDetails['category'][] = ['hairSalon', 'makeupParlour']

function normalizeUserRole(value: unknown): UserRole {
  if (typeof value === 'string' && USER_ROLES.includes(value as UserRole)) {
    return value as UserRole
  }
  return 'user'
}

function normalizeShopDetails(value: unknown): ShopDetails | null {
  if (value == null) return null
  if (typeof value !== 'object') return null
  const o = value as Record<string, unknown>
  const serviceDetailsRaw = o.serviceDetails
  if (!Array.isArray(serviceDetailsRaw)) return null
  const serviceDetails = serviceDetailsRaw
    .map((s) => {
      if (typeof s !== 'object' || s == null) return null
      const row = s as Record<string, unknown>
      const name = typeof row.name === 'string' ? row.name : ''
      const price = typeof row.price === 'number' ? row.price : Number(row.price)
      if (!name || Number.isNaN(price)) return null
      return { name, price }
    })
    .filter((s): s is { name: string; price: number } => s != null)

  const name = typeof o.name === 'string' ? o.name : ''
  const address = typeof o.address === 'string' ? o.address : ''
  const city = typeof o.city === 'string' ? o.city : ''
  const state = typeof o.state === 'string' ? o.state : ''
  const pincode = typeof o.pincode === 'string' ? o.pincode : ''
  const mobileNumber = typeof o.mobileNumber === 'string' ? o.mobileNumber : ''
  const category = typeof o.category === 'string' && SHOP_CATEGORIES.includes(o.category as ShopDetails['category'])
    ? (o.category as ShopDetails['category'])
    : null

  if (
    !name ||
    !address ||
    !city ||
    !state ||
    !pincode ||
    !mobileNumber ||
    !category ||
    serviceDetails.length === 0
  ) {
    return null
  }

  return { name, address, city, state, pincode, mobileNumber, category, serviceDetails }
}

function normalizeUser(raw: unknown): AuthUser {
  const o = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>
  const id = typeof o.id === 'string' ? o.id : String(o.id ?? '')
  const name = typeof o.name === 'string' ? o.name : String(o.name ?? '')
  const emailRaw = typeof o.email === 'string' ? o.email : String(o.email ?? '')
  const role = normalizeUserRole(o.role)
  const shopDetailsNormalized = normalizeShopDetails(o.shopDetails)

  return {
    id,
    name,
    email: emailRaw.trim().toLowerCase(),
    role,
    shopDetails: role === 'serviceOwner' ? shopDetailsNormalized : null,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthSession['user'] | null>(null)
  const [accessToken, setAccessTokenState] = useState<string | null>(() => getAccessToken())

  const fetchAndSetUser = useCallback(async (): Promise<AuthUser | null> => {
    const token = getAccessToken()
    if (!token) {
      setUser(null)
      setAccessTokenState(null)
      return null
    }
    setAccessTokenState(token)
    const me = await fetchCurrentUser()
    const next = normalizeUser(me)
    setUser(next)
    return next
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
        const next = await fetchAndSetUser()
        if (!next) {
          throw new Error('Could not load profile')
        }
        return next
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
