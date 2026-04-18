import React from 'react'
import { cn } from '../../lib/cn'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string
    error?: string
    hint?: string
    endAdornment?: React.ReactNode
  }
>(function Input({ label, error, hint, endAdornment, className, id, ...props }, ref) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-slate-900">{label}</span>
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500',
            endAdornment ? 'pr-11' : undefined,
            error ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200',
            className,
          )}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          {...props}
        />
        {endAdornment ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{endAdornment}</div>
        ) : null}
      </div>
      {hint ? (
        <span id={`${inputId}-hint`} className="mt-1 block text-xs text-slate-500">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${inputId}-error`} className="mt-1 block text-xs text-rose-600">
          {error}
        </span>
      ) : null}
    </label>
  )
})

