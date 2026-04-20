import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../auth/useAuth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import {
  shopOnboardingSchema,
  type ShopOnboardingFormValues,
} from '../features/onboarding/onboardingSchema'
import { getMyShop, onboardShop, updateMyShop } from '../features/shop/shopApi'
import { getErrorMessage } from '../lib/errors'
import { cn } from '../lib/cn'

const CATEGORY_OPTIONS = [
  { value: 'hairSalon' as const, label: 'Hair salon' },
  { value: 'makeupParlour' as const, label: 'Makeup parlour' },
]

export function ShopOnboardingPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, refreshUser } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const queryClient = useQueryClient()
  const isEditing = Boolean(user?.shopDetails)

  const myShopQuery = useQuery({
    queryKey: ['shops', 'me'],
    queryFn: getMyShop,
    enabled: Boolean(isAuthenticated && user && user.role === 'serviceOwner' && user.shopDetails),
  })

  useEffect(() => {
    if (!isAuthenticated || !user) return
    if (user.role !== 'serviceOwner') {
      navigate({ to: '/dashboard', replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShopOnboardingFormValues>({
    resolver: zodResolver(shopOnboardingSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      mobileNumber: '',
      category: 'hairSalon',
      serviceDetails: [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'serviceDetails' })

  useEffect(() => {
    if (!myShopQuery.data) return
    reset({
      name: myShopQuery.data.name,
      address: myShopQuery.data.address,
      city: myShopQuery.data.city,
      state: myShopQuery.data.state,
      pincode: myShopQuery.data.pincode,
      mobileNumber: myShopQuery.data.mobileNumber,
      category: myShopQuery.data.category,
      serviceDetails: myShopQuery.data.serviceDetails.map((s) => ({ name: s.name, price: s.price })),
    })
  }, [myShopQuery.data, reset])

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    try {
      const payload = {
        name: values.name.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
        pincode: values.pincode.trim(),
        mobileNumber: values.mobileNumber.trim(),
        category: values.category,
        serviceDetails: values.serviceDetails.map((s) => ({
          name: s.name.trim(),
          price: s.price,
        })),
      }
      if (isEditing) {
        await updateMyShop(payload)
      } else {
        await onboardShop(payload)
      }
      await refreshUser()
      await queryClient.invalidateQueries({ queryKey: ['shops', 'me'] })
      toast.success('Shop details saved')
      navigate({ to: '/dashboard', replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save shop details'))
    } finally {
      setSubmitting(false)
    }
  })

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">
        Loading…
      </div>
    )
  }

  if (user.role !== 'serviceOwner') {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-2xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm">
              <span className="text-sm font-semibold">SA</span>
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              {isEditing ? 'Edit your shop' : 'Set up your shop'}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {isEditing
                ? 'Update your business details and services.'
                : 'Add your business details and services to continue to the dashboard.'}
            </p>
          </div>

          <Card className="p-4 sm:p-6">
            <form className="space-y-4" onSubmit={onSubmit} noValidate>
              <Input label="Shop name" placeholder="My Salon" error={errors.name?.message} {...register('name')} />

              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    label="Category"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={CATEGORY_OPTIONS}
                    error={errors.category?.message}
                  />
                )}
              />

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-slate-900">Address</span>
                <textarea
                  className={cn(
                    'min-h-[88px] w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500',
                    errors.address ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200',
                  )}
                  placeholder="Street, building, area"
                  aria-invalid={Boolean(errors.address) || undefined}
                  {...register('address')}
                />
                {errors.address ? (
                  <span className="mt-1 block text-xs text-rose-600">{errors.address.message}</span>
                ) : null}
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="City" placeholder="City" error={errors.city?.message} {...register('city')} />
                <Input label="State" placeholder="State" error={errors.state?.message} {...register('state')} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Pincode" placeholder="560001" error={errors.pincode?.message} {...register('pincode')} />
                <Input
                  label="Mobile number"
                  placeholder="9876543210"
                  inputMode="tel"
                  autoComplete="tel"
                  error={errors.mobileNumber?.message}
                  {...register('mobileNumber')}
                />
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-900">Services</span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => append({ name: '', price: 0 })}
                  >
                    <Plus className="size-4" aria-hidden />
                    Add service
                  </Button>
                </div>
                {errors.serviceDetails?.message ? (
                  <p className="mb-2 text-xs text-rose-600">{errors.serviceDetails.message}</p>
                ) : null}
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3 sm:flex-row sm:items-start">
                      <div className="flex-1">
                        <Input
                          label="Service name"
                          placeholder="Haircut"
                          error={errors.serviceDetails?.[index]?.name?.message}
                          {...register(`serviceDetails.${index}.name` as const)}
                        />
                      </div>
                      <div className="sm:w-36">
                        <Input
                          label="Price"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="1"
                          error={errors.serviceDetails?.[index]?.price?.message}
                          {...register(`serviceDetails.${index}.price` as const, { valueAsNumber: true })}
                        />
                      </div>
                      <div className="flex sm:pt-7">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-rose-700 hover:bg-rose-50"
                          disabled={fields.length <= 1}
                          onClick={() => remove(index)}
                          aria-label="Remove service"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button type="submit" loading={submitting}>
                  Save and continue
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
