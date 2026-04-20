/* eslint-disable react-refresh/only-export-components */
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { AuthProvider } from './auth/AuthProvider'
import { getAccessToken } from './auth/authStorage'
import { DashboardPage } from './pages/DashboardPage'
import { GoogleAuthCallbackPage } from './pages/GoogleAuthCallbackPage'
import { LoginPage } from './pages/LoginPage'
import { ShopOnboardingPage } from './pages/ShopOnboardingPage'
import { SignupPage } from './pages/SignupPage'

function RootLayout() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />
      <Outlet />
    </AuthProvider>
  )
}

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <Navigate to="/" replace />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    const token = getAccessToken()
    throw redirect({ to: token ? '/dashboard' : '/login', replace: true })
  },
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const googleAuthCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/google/callback',
  component: GoogleAuthCallbackPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    if (!getAccessToken()) {
      throw redirect({ to: '/login', replace: true })
    }
  },
  component: DashboardPage,
})

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  beforeLoad: () => {
    if (!getAccessToken()) {
      throw redirect({ to: '/login', replace: true })
    }
  },
  component: ShopOnboardingPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  signupRoute,
  loginRoute,
  googleAuthCallbackRoute,
  onboardingRoute,
  dashboardRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />
}