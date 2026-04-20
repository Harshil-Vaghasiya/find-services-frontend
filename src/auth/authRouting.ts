import type { AuthUser } from './authTypes'

export function needsShopOnboarding(user: AuthUser | null | undefined): boolean {
  return user?.role === 'serviceOwner' && !user.shopDetails
}

export function getPostAuthPath(user: AuthUser): '/onboarding' | '/dashboard' {
  return needsShopOnboarding(user) ? '/onboarding' : '/dashboard'
}