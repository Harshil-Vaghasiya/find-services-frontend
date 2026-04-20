import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Eye } from 'lucide-react'
import { EyeSlash } from 'iconsax-react'
import { useAuth } from '../auth/useAuth'
import { getPostAuthPath } from '../auth/authRouting'
import { AuthShell } from '../components/layout/AuthShell'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { getErrorMessage } from '../lib/errors'
import { GoogleOAuthButton } from '../features/auth/GoogleOAuthButton'
import { useRegisterMutation } from '../features/auth/authQueries'
import { signupSchema, type SignupFormValues } from '../features/auth/authSchemas'

export function SignupPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const registerMutation = useRegisterMutation()

  const defaultValues = useMemo<SignupFormValues>(
    () => ({ name: '', email: '', password: '', confirmPassword: '' }),
    [],
  )

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues,
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = {
        name: values.name,
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }
      const session = await registerMutation.mutateAsync(payload)
      const authedUser = await setAuth(session)
      toast.success('Account created')
      navigate({ to: getPostAuthPath(authedUser), replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create account'))
    }
  })

  return (
    <AuthShell title="Create your account" subtitle="Sign up to access your dashboard">
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <Input
          label="Name"
          placeholder="John Doe"
          autoComplete="name"
          error={errors.name?.message}
          {...rhfRegister('name')}
        />

        <Input
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          error={errors.email?.message}
          {...rhfRegister('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          autoComplete="new-password"
          error={errors.password?.message}
          hint="At least 8 characters, including uppercase, lowercase, number, and special character."
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="rounded-md p-1  focus:outline-none focus:ring-0"
            >
              {showPassword ? <EyeSlash color="#0f172b" size={18} /> : <Eye color="#0f172b" size={18} />}
            </button>
          }
          {...rhfRegister('password')}
        />

        <Input
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...rhfRegister('confirmPassword')}
        />

        <Button type="submit" className="w-full" loading={registerMutation.isPending}>
          Create account
        </Button>

        <div className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-medium text-indigo-700 hover:underline" to="/login">
            Log in
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <div className="text-xs font-medium text-slate-500">or</div>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleOAuthButton />
      </form>
    </AuthShell>
  )
}

