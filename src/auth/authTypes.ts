export type UserRole = 'user' | 'admin' | 'serviceOwner'

export type ShopServiceDetail = {
  name: string
  price: number
}

export type ShopDetails = {
  name: string
  address: string
  city: string
  state: string
  pincode: string
  mobileNumber: string
  category: 'hairSalon' | 'makeupParlour'
  serviceDetails: ShopServiceDetail[]
}

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
  shopDetails: ShopDetails | null
}

export type AuthSession = {
  accessToken: string
  user: AuthUser
}
