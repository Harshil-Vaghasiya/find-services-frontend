import React from 'react'
import { cn } from '../../lib/cn'

export function Checkbox({
  label,
  error,
  className,
  id,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  error?: string
}) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  return (
    <div className={cn('text-sm', className)}>
      <label className="inline-flex cursor-pointer items-center gap-2">
        <input
          id={inputId}
          type="checkbox"
          className={cn(
            'size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500',
            error ? 'border-rose-300' : undefined,
          )}
          {...props}
        />
        <span className="text-slate-900">{label}</span>
      </label>
      {error ? <div className="mt-1 text-xs text-rose-600">{error}</div> : null}
    </div>
  )
}

