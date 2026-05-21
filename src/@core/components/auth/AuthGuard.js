// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

const AuthGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      // ── MetaMask mobile reload guard ──────────────────────────────────────
      // MetaMask mobile reloads the page after every tx confirmation.
      // auth.loading is true while AuthContext reads from localStorage.
      // Do NOT redirect during this window — wait until loading is false.
      if (auth.loading) {
        return
      }

      if (auth.user === null && !window.localStorage.getItem('userData')) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      } else if (router.asPath === '/') {
        router.replace('/dashboards/analytics/')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route, auth.loading]
  )

  // Show fallback spinner while auth is loading OR user is null
  // This prevents a flash of the protected page before redirect
  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
