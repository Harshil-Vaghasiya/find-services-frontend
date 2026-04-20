import React from 'react'
import { Card } from '../ui/Card'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm">
              <span className="text-sm font-semibold">SA</span>
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
          </div>
          <Card className="p-4 sm:p-6">{children}</Card>
          <p className="mt-6 text-center text-xs text-slate-500">
            Light theme • Tailwind • Vite
          </p>
        </div>
      </div>
    </div>
  )
}

