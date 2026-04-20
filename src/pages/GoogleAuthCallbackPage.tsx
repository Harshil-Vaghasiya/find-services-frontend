import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuth } from '../auth/useAuth'
import { getPostAuthPath } from '../auth/authRouting'
import { Card } from '../components/ui/Card'

const handledKey = (token: string) => `google-oauth-callback:${token}`

export function GoogleAuthCallbackPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()

  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const accessToken = params.get('accessToken')
  const error = params.get('error')

  useEffect(() => {
    console.log(accessToken, 'accessToken', params)
    if (accessToken) {
      const key = handledKey(accessToken)
      if (sessionStorage.getItem(key)) {
        return
      }
      sessionStorage.setItem(key, '1')

      void (async () => {
        try {
          const authedUser = await setAuth({ accessToken })
          window.history.replaceState({}, '', window.location.pathname)
          toast.success('Signed in with Google')
          navigate({ to: getPostAuthPath(authedUser), replace: true })
        } catch {
          sessionStorage.removeItem(key)
          toast.error('Could not load your profile. Please try signing in again.')
          void navigate({ to: '/login', replace: true })
        }
      })()
      return
    }

    if (error) {
      window.history.replaceState({}, '', window.location.pathname)
    }
    // Omit setAuth: it is recreated when auth state updates after login and would rerun while the URL still had the token.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional; see above
  }, [accessToken, error, navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto w-full max-w-lg">
          <Card className="p-6">
            <h1 className="text-base font-semibold text-slate-900">Google sign-in failed</h1>
            <p className="mt-2 text-sm text-slate-600">
              We couldn’t complete your Google sign-in. Please try again.
            </p>
            <div className="mt-4 text-sm">
              <Link className="font-medium text-indigo-700 hover:underline" to="/login">
                Back to login
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        <Card className="p-6">
          <h1 className="text-base font-semibold text-slate-900">Signing you in…</h1>
          <p className="mt-2 text-sm text-slate-600">Please wait while we finish logging you in.</p>
          {!accessToken && (
            <div className="mt-4 text-sm">
              <Link className="font-medium text-indigo-700 hover:underline" to="/login">
                Back to login
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
