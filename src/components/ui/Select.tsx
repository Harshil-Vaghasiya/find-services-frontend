import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import React from 'react'
import { cn } from '../../lib/cn'

export type SelectOption<TValue extends string> = {
  value: TValue
  label: string
}

export function Select<TValue extends string>(props: {
  label: string
  value: TValue
  onValueChange: (value: TValue) => void
  options: Array<SelectOption<TValue>>
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  className?: string
  id?: string
}) {
  const {
    label,
    value,
    onValueChange,
    options,
    placeholder = 'Select…',
    error,
    hint,
    disabled,
    className,
    id,
  } = props

  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-slate-900">{label}</span>
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          id={inputId}
          className={cn(
            'flex h-11 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 text-left text-sm text-slate-900 shadow-none outline-none focus:ring-2 focus:ring-indigo-500 data-[placeholder]:text-slate-400',
            error ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200',
            disabled ? 'cursor-not-allowed bg-slate-50 text-slate-500' : undefined,
            className,
          )}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="text-slate-500">
            <ChevronDown className="size-4" aria-hidden />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            side="bottom"
            align="start"
            sideOffset={6}
            collisionPadding={12}
            className={cn(
              'z-50 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
            )}
            style={{
              width: 'var(--radix-select-trigger-width)',
            }}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((o) => (
                <RadixSelect.Item
                  key={o.value}
                  value={o.value}
                  className={cn(
                    'relative flex cursor-default select-none items-center rounded-md py-2 pl-9 pr-3 text-sm text-slate-900 outline-none',
                    'focus:bg-indigo-50 focus:text-slate-900 data-[state=checked]:bg-indigo-50',
                  )}
                >
                  <RadixSelect.ItemIndicator className="absolute left-2 inline-flex size-5 items-center justify-center text-indigo-600">
                    <Check className="size-4" aria-hidden />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{o.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

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
}