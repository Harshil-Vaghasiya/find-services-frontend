import { Button } from '../../components/ui/Button'

const GOOGLE_OAUTH_START_URL = 'http://localhost:8000/auth/google'

export function GoogleOAuthButton({
  className = 'w-full',
}: {
  className?: string
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      className={className}
      onClick={() => {
        window.location.assign(GOOGLE_OAUTH_START_URL)
      }}
    >
      Continue with Google
    </Button>
  )
}