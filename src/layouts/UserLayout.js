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
import { useWalletPersist } from 'src/hooks/useWalletPersist'

const UserLayout = ({ children, contentHeightFixed }) => {
  const { settings, saveSettings } = useSettings()
  const { address, status } = useAccount()
  const router = useRouter()
  const user = useSelector((state) => state?.login?.user?.data)
  const { getLastWallet } = useWalletPersist()

  // hidden must be declared before JSX that uses it
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  // ── Reconnection grace period ─────────────────────────────────────────────
  // MetaMask mobile reloads the page after every transaction confirmation.
  // wagmi's autoConnect takes ~500ms–2s to restore the session.
  //
  // During this window, `address` is undefined even though the wallet IS
  // connected — firing the mismatch redirect here causes the user to be
  // kicked to /wallet-connection-error on every tx confirmation.
  //
  // Strategy:
  //   1. Check localStorage for the last known wallet address immediately
  //   2. If it matches the user's registered wallet, suppress the redirect
  //      for up to 3s while wagmi reconnects
  //   3. Only redirect after wagmi has settled AND the grace period has elapsed
  const [reconnectReady, setReconnectReady] = useState(false)
  const reconnectTimer = useRef(null)

  useEffect(() => {
    reconnectTimer.current = setTimeout(() => setReconnectReady(true), 3000)
    return () => clearTimeout(reconnectTimer.current)
  }, [])

  // Shorten the grace period if wagmi reconnects faster than 3s
  useEffect(() => {
    if (status === 'connected' && address) {
      setReconnectReady(true)
      clearTimeout(reconnectTimer.current)
    }
  }, [status, address])

  // ── Wallet mismatch guard ─────────────────────────────────────────────────
  useEffect(() => {
    if (!reconnectReady) return
    if (status === 'reconnecting' || status === 'connecting') return

    const currentAddress = address || getLastWallet()

    if (user?.walletAddress && (!currentAddress || currentAddress.toLowerCase() !== user.walletAddress.toLowerCase())) {
      router.push('/wallet-connection-error')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.walletAddress, address, status, reconnectReady])

  // ── Mobile guest redirect ─────────────────────────────────────────────────
  // Only for non-MetaMask mobile browsers (Safari, Chrome without extension).
  // MetaMask mobile browser always injects window.ethereum.
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
    if (isMobile() && !window?.ethereum && !address && !getLastWallet()) {
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
