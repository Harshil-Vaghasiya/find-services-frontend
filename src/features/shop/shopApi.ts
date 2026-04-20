import type { AuthUser, ShopDetails } from '../../auth/authTypes'
import { apiFetch } from '../../lib/http'

export type ShopCategory = 'hairSalon' | 'makeupParlour';

export type ServiceDetail = {
  name: string;
  price: number;
};

export type ShopOnboardPayload = {
  name: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  mobileNumber: string;
  category: ShopCategory;
  serviceDetails: ServiceDetail[];
}

// Adjust path to match your backend.
const SHOPS = {
  onboard: '/shops',
  me: '/shops/me',
}

/** Creates shop details for the current service owner; backend should attach shopDetails to the user. */
export async function onboardShop(body: ShopOnboardPayload) {
  return apiFetch<AuthUser>(SHOPS.onboard, { method: 'POST', json: body })
}

export async function getMyShop() {
  return apiFetch<ShopDetails>(SHOPS.me, { method: 'GET' })
}

export async function updateMyShop(body: ShopOnboardPayload) {
  return apiFetch<ShopDetails>(SHOPS.onboard, { method: 'PATCH', json: body })
}
