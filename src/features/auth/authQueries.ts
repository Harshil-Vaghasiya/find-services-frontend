import { useMutation } from '@tanstack/react-query'
import { login as apiLogin, register as apiRegister } from './authApi'

export function useLoginMutation() {
  return useMutation({
    mutationFn: apiLogin,
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: apiRegister,
  })
}