import { z } from 'zod'

const passwordSchema = z
  .string({ message: 'Password must be a string' })
  .min(1, { message: 'Password is required' })
  .min(8, { message: 'Password must be at least 8 characters long' })
  .refine((v) => /[a-z]/.test(v), { message: 'Password must include a lowercase letter' })
  .refine((v) => /[A-Z]/.test(v), { message: 'Password must include an uppercase letter' })
  .refine((v) => /[0-9]/.test(v), { message: 'Password must include a number' })
  .refine((v) => /[^A-Za-z0-9]/.test(v), { message: 'Password must include a special character' })

export const signupSchema = z.object({
  name: z
    .string({ message: 'Name must be a string' })
    .min(1, { message: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters long' }),
  email: z
    .string({ message: 'Email must be a valid email' })
    .min(1, { message: 'Email is required' })
    .email({ message: 'Email must be a valid email' }),
  password: passwordSchema,
  confirmPassword: z.string({ message: 'Confirm password is required' }).min(1, {
    message: 'Confirm password is required',
  }),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    })
  }
})

export type SignupFormValues = z.infer<typeof signupSchema>

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Email must be a valid email' }),
  password: passwordSchema,
})

export type LoginFormValues = z.infer<typeof loginSchema>

