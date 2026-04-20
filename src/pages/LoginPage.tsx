import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
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
import { GoogleOAuthButton } from '../features/auth/GoogleOAuthButton'
import { useLoginMutation } from '../features/auth/authQueries'
import { loginSchema, type LoginFormValues } from '../features/auth/authSchemas'
import { getErrorMessage } from '../lib/errors'

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLoginMutation()

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const session = await loginMutation.mutateAsync({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      })
      const authedUser = await setAuth(session)
      toast.success('Welcome back')
      navigate({ to: getPostAuthPath(authedUser), replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to sign in'))
    }
  })

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue">
      <div className="space-y-4">
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
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
          autoComplete="current-password"
          error={errors.password?.message}
          hint="At least 8 characters, including uppercase, lowercase, number, and special character."
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="rounded-md p-1  focus:outline-none focus:ring-0"
            >
              {showPassword ? <EyeSlash color="#6b7280" size={18} /> : <Eye color="#6b7280" size={18} />}
            </button>
          }
          {...rhfRegister('password')}
        />

        <Button type="submit" className="w-full" loading={loginMutation.isPending}>
          Log in
        </Button>

        <div className="text-center text-sm text-slate-600">
          New here?{' '}
          <Link className="font-medium text-indigo-700 hover:underline" to="/signup">
            Create an account
          </Link>
        </div>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <div className="text-xs font-medium text-slate-500">or</div>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleOAuthButton />
      </div>
    </AuthShell>
  )
}

