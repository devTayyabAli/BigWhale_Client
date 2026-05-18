import useMediaQuery from '@mui/material/useMediaQuery'
import Layout from 'src/@core/layouts/Layout'
import VerticalNavItems from 'src/navigation/vertical'
import HorizontalNavItems from 'src/navigation/horizontal'
import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAccount } from 'wagmi'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import isMobile from 'is-mobile'

const UserLayout = ({ children, contentHeightFixed }) => {
  const { settings, saveSettings } = useSettings()
  const { address, status } = useAccount()
  const router = useRouter()
  const user = useSelector((state) => state?.login?.user?.data)

  // ── hidden must be declared before any JSX that uses it ──────────────────
  // Controls whether the sidebar is a temporary overlay (mobile) or permanent (desktop)
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  // ── Reconnection grace period ─────────────────────────────────────────────
  // MetaMask mobile reloads the page after every transaction confirmation.
  // wagmi's autoConnect takes up to ~1-2s to restore the session.
  // We suppress wallet-mismatch redirects for 2.5s after mount so the
  // reconnection has time to complete before we evaluate the address.
  const [reconnectReady, setReconnectReady] = useState(false)
  const reconnectTimer = useRef(null)

  useEffect(() => {
    reconnectTimer.current = setTimeout(() => setReconnectReady(true), 2500)
    return () => clearTimeout(reconnectTimer.current)
  }, [])

  // ── Wallet mismatch guard ─────────────────────────────────────────────────
  // Only fires after:
  //   1. wagmi has finished reconnecting (status is 'connected' or 'disconnected')
  //   2. The 2.5s grace period has elapsed
  useEffect(() => {
    if (!reconnectReady) return
    if (status === 'reconnecting' || status === 'connecting') return
    if (user?.walletAddress && (!address || address !== user?.walletAddress)) {
      router.push('/wallet-connection-error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.walletAddress, address, status, reconnectReady])

  // ── Mobile guest redirect ─────────────────────────────────────────────────
  // MetaMask mobile browser injects window.ethereum — this guard is for
  // non-MetaMask mobile browsers (e.g. Safari) where no wallet is available.
  useEffect(() => {
    const excludedPaths = [
      '/set-password/[token]',
      '/login',
      '/signup',
      '/wallet-connection-error-guest',
      '/wallet-connection-error',
    ]
    if (!router || excludedPaths.includes(router.pathname)) return
    if (status === 'reconnecting' || status === 'connecting') return
    if (!reconnectReady) return
    // Only redirect if: mobile, no injected provider (not MetaMask browser),
    // and no address after reconnect attempt
    if (isMobile() && !window?.ethereum && !address) {
      router.push('/wallet-connection-error-guest')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, address, status, reconnectReady])

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems: VerticalNavItems(),
        },
        appBar: {
          content: props => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          ),
        },
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: HorizontalNavItems(),
          },
          appBar: {
            content: () => (
              <HorizontalAppBarContent
                hidden={hidden}
                settings={settings}
                saveSettings={saveSettings}
              />
            ),
          },
        },
      })}
    >
      {children}
    </Layout>
  )
}

export default UserLayout
