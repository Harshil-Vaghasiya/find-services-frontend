import { useAuth } from '../auth/useAuth'
import { Button } from '../components/ui/Button'

export function DashboardPage() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-sm font-semibold text-white">
              SA
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Dashboard</div>
              <div className="text-xs text-slate-500">Light theme • Indigo accent</div>
            </div>
          </div>
          <Button variant="secondary" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      </header>
    </div>
  )
}

