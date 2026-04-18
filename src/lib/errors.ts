import { ApiError } from './http'

export function getErrorMessage(err: unknown, fallback = 'Something went wrong') {
  if (!err) return fallback
  if (typeof err === 'string') return err
  if (err instanceof ApiError) return err.message || fallback
  if (err instanceof Error) return err.message || fallback
  return fallback
}

