import { z } from 'zod'

export const serviceRowSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  // Use z.number (not z.coerce) so zodResolver input/output match RHF; pair inputs with valueAsNumber.
  price: z.number().min(0, 'Price must be 0 or greater'),
})

export const shopOnboardingSchema = z.object({
  name: z.string().min(1, 'Shop name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  mobileNumber: z.string().min(1, 'Mobile number is required'),
  category: z.enum(['hairSalon', 'makeupParlour']),
  serviceDetails: z.array(serviceRowSchema).min(1, 'Add at least one service'),
})

export type ShopOnboardingFormValues = z.infer<typeof shopOnboardingSchema>
