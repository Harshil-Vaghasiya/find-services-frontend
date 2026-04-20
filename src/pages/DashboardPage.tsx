import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../auth/useAuth'
import { needsShopOnboarding } from '../auth/authRouting'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { getMyShop } from '../features/shop/shopApi'
import { Pencil } from 'lucide-react'

export function DashboardPage() {
  const navigate = useNavigate()
  const { logout, user, isAuthenticated } = useAuth()

  const shopQuery = useQuery({
    queryKey: ['shops', 'me'],
    queryFn: getMyShop,
    enabled: Boolean(isAuthenticated && user && user.role === 'serviceOwner'),
  })

  useEffect(() => {
    if (!isAuthenticated || !user) return
    if (needsShopOnboarding(user)) {
      navigate({ to: '/onboarding', replace: true })
    }
  }, [isAuthenticated, user, navigate])

  if (!isAuthenticated || !user || needsShopOnboarding(user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">
        Loading…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-sm font-semibold text-white">
              SA
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900">Dashboard</div>
              <div className="text-xs text-slate-500">Light theme • Indigo accent</div>
            </div>
          </div>
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {user.role === 'serviceOwner' ? (
          <Card className="p-6">
            <div className="flex flex-row items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">Service details</div>
              </div>
              <Button variant="secondary" className='!px-2 !h-8' onClick={() => navigate({ to: '/onboarding' })}>
                <Pencil className="size-4" />
              </Button>
            </div>

            {shopQuery.isLoading ? (
              <div className="mt-4 text-sm text-slate-600">Loading shop…</div>
            ) : shopQuery.isError ? (
              <div className="mt-4 space-y-3">
                <div className="text-sm text-rose-700">Could not load shop details.</div>
                <div>
                  <Button size="sm" variant="secondary" onClick={() => shopQuery.refetch()}>
                    Retry
                  </Button>
                </div>
              </div>
            ) : shopQuery.data ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-medium text-slate-500">Name</div>
                  <div className="text-sm text-slate-900">{shopQuery.data.name}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Category</div>
                  <div className="text-sm text-slate-900">{shopQuery.data.category}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs font-medium text-slate-500">Address</div>
                  <div className="text-sm text-slate-900">
                    {shopQuery.data.address}, {shopQuery.data.city}, {shopQuery.data.state} {shopQuery.data.pincode}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Mobile</div>
                  <div className="text-sm text-slate-900">{shopQuery.data.mobileNumber}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs font-medium text-slate-500">Services</div>
                  <div className="mt-2 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
                    {shopQuery.data.serviceDetails.map((s) => (
                      <div
                        key={s.name}
                        className="flex flex-row items-start justify-between px-3 py-2 text-sm gap-4"
                      >
                        <span className="min-w-0 break-words text-slate-900 ">{s.name}</span>
                        <span className="font-medium text-slate-700">{s.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-sm text-slate-600">No shop details found.</div>
            )}
          </Card>
        ) : (
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">Welcome</div>
            <div className="mt-1 text-sm text-slate-600">You’re signed in as {user.email}.</div>
          </Card>
        )}
      </main>
    </div>
  )
}

