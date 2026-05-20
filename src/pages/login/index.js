import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled, useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux'
import { loginUser, resetUser } from 'src/store/apps/auth/loginSlice'
import { useSettings } from 'src/@core/hooks/useSettings'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import InputAdornment from '@mui/material/InputAdornment'
import { keyframes } from '@emotion/react'

// ** WEB3 Imports
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import { useSwitchNetwork } from 'wagmi'
import useValidateAccount from 'src/hooks/useValidateAccount'

// ** Custom Components
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Formik, Field, Form } from 'formik'
import * as yup from 'yup'
import { ENV } from 'src/configs/env'
import isMobile from 'is-mobile'
import { resetCurrentUser } from 'src/store/apps/auth/currentUserSlice'
import NetworkSelector from 'src/views/components/choose-network-modal'
import defaultAuthConfig from 'src/configs/auth'
import Image from 'next/image'
import { useAuth } from 'src/hooks/useAuth'

// ── Animations ──────────────────────────────────────────────────────
const floatAnim = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-12px) rotate(1deg); }
  66%       { transform: translateY(-6px) rotate(-1deg); }
`
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0,229,255,0.4), 0 0 40px rgba(0,229,255,0.15); }
  50%       { box-shadow: 0 0 40px rgba(0,229,255,0.7), 0 0 80px rgba(0,229,255,0.25); }
`
const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`
const scanLine = keyframes`
  0%   { top: -5%; opacity: 0; }
  5%   { opacity: 1; }
  95%  { opacity: 1; }
  100% { top: 105%; opacity: 0; }
`
const fadeInUp = keyframes`
  0%   { opacity: 0; transform: translateY(24px); }
  100% { opacity: 1; transform: translateY(0); }
`

// ── Styled Components ────────────────────────────────────────────────
const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  [theme.breakpoints.up('lg')]: { maxWidth: 560 },
  [theme.breakpoints.up('xl')]: { maxWidth: 640 },
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: '#00E5FF',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#33EBFB',
    textShadow: '0 0 8px rgba(0,229,255,0.5)',
  },
}))

const GlassCard = styled(Box)({
  background: 'rgba(13, 18, 36, 0.85)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(0, 229, 255, 0.15)',
  borderRadius: '24px',
  boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 229, 255, 0.06)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), rgba(168,85,247,0.5), transparent)',
  },
})

const NeonButton = styled(Button)({
  background: 'linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)',
  color: '#050816',
  fontFamily: '"Space Grotesk", sans-serif',
  fontWeight: 700,
  fontSize: '0.95rem',
  letterSpacing: '0.06em',
  borderRadius: '12px',
  padding: '12px 24px',
  border: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #33EBFB 0%, #00E5FF 100%)',
    boxShadow: '0 0 24px rgba(0,229,255,0.55), 0 6px 20px rgba(0,229,255,0.3)',
    transform: 'translateY(-2px)',
  },
  '&:active': { transform: 'translateY(0)' },
  '&.Mui-disabled': {
    background: 'rgba(0,229,255,0.15)',
    color: 'rgba(0,229,255,0.4)',
  },
})

const OutlineButton = styled(Button)({
  background: 'transparent',
  color: '#00E5FF',
  fontFamily: '"Space Grotesk", sans-serif',
  fontWeight: 600,
  fontSize: '0.9rem',
  letterSpacing: '0.04em',
  borderRadius: '12px',
  padding: '11px 24px',
  border: '1px solid rgba(0,229,255,0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(0,229,255,0.08)',
    borderColor: '#00E5FF',
    boxShadow: '0 0 16px rgba(0,229,255,0.25)',
    transform: 'translateY(-1px)',
  },
})

// ── Validation ───────────────────────────────────────────────────────
const schema = yup.object().shape({
  userId: yup.string().required('Login User ID is required'),
  password: yup.string().required('Password is required'),
  address: yup.string(),
})

// ── Hero Left Panel ──────────────────────────────────────────────────
const HeroPanel = () => (
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #050816 0%, #0D1224 40%, #0B1535 100%)',
      borderRadius: '20px',
      margin: theme => theme.spacing(8, 0, 8, 8),
    }}
  >
    {/* Animated scan line */}
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        width: '100%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), transparent)',
        animation: `${scanLine} 5s linear infinite`,
        zIndex: 2,
      }}
    />

    {/* Background grid */}
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        zIndex: 0,
      }}
    />

    {/* Orbs */}
    <Box sx={{
      position: 'absolute', top: '10%', right: '10%',
      width: '300px', height: '300px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)',
      filter: 'blur(40px)', zIndex: 0,
    }} />
    <Box sx={{
      position: 'absolute', bottom: '15%', left: '5%',
      width: '250px', height: '250px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
      filter: 'blur(40px)', zIndex: 0,
    }} />

    {/* Content */}
    <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: 6 }}>
      {/* BW Coin */}
      <Box
        sx={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 60%, #FF2E9F 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          animation: `${floatAnim} 5s ease-in-out infinite, ${pulseGlow} 3s ease-in-out infinite`,
          fontSize: '2.2rem',
          fontWeight: 900,
          color: '#050816',
          fontFamily: '"Orbitron", sans-serif',
          letterSpacing: '-1px',
          boxShadow: '0 0 30px rgba(0,229,255,0.5)',
        }}
      >
                     <Image src="/images/pages/pre-loader-new.png" alt="bw-logo" width="210" height="210"/>
        
      </Box>

      <Typography
        sx={{
          fontFamily: '"Orbitron", sans-serif',
          fontWeight: 900,
          fontSize: '2.8rem',
          letterSpacing: '0.15em',
          background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 50%, #FF2E9F 100%)',
          backgroundSize: '200% 200%',
          animation: `${gradientShift} 4s ease infinite`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          mb: 1,
        }}
      >
        BIGWHALE
      </Typography>

      <Typography
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 500,
          fontSize: '0.85rem',
          letterSpacing: '0.3em',
          color: 'rgba(0,229,255,0.6)',
          textTransform: 'uppercase',
          mb: 4,
        }}
      >
        Crypto Ecosystem
      </Typography>

      {/* Feature pills */}
      {['🐋 Deep Ocean DeFi', '⚡ Lightning Staking', '🌌 Cosmic Rewards', '🔮 Web3 Native'].map((feat, i) => (
        <Box
          key={i}
          sx={{
            display: 'inline-block',
            background: 'rgba(0,229,255,0.08)',
            border: '1px solid rgba(0,229,255,0.2)',
            borderRadius: '20px',
            px: 2,
            py: 0.5,
            m: 0.5,
            fontSize: '0.78rem',
            color: 'rgba(200,215,245,0.8)',
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 500,
            animation: `${fadeInUp} 0.6s ease-out ${i * 0.1}s both`,
          }}
        >
          {feat}
        </Box>
      ))}
    </Box>
  </Box>
)

// ── Main Login Page ──────────────────────────────────────────────────
const LoginPage = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const router = useRouter()
  const { setUser, setLoading } = useAuth()
  const [loader, setLoader] = useState(null)
  const [payload, setPayload] = useState(null)
  const [showWalletError, setShowWalletError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [networkPickerOpen, setNetworkPickerOpen] = useState(false)
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const { open } = useWeb3Modal()
  const { address: walletAddress, status: walletStatus } = useAccount()
  const { chain } = useValidateAccount()
  const { disconnect } = useDisconnect()
  const { switchNetwork } = useSwitchNetwork({
    onSuccess() { login(payload) },
  })

  const initialValues = { userId: '', password: '', address: walletAddress }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window?.localStorage?.removeItem('userOTPEmail')
    }
    dispatch(resetUser())
    dispatch(resetCurrentUser())
  }, [])

  const onSubmit = async values => {
    setPayload(values)
    if (chain?.id !== ENV.chainId) return switchNetwork?.(ENV.chainId)
    login(values)
  }

  const login = async values => {
    setLoader(true)
    const { userId, password } = values
    if (!walletAddress) { setShowWalletError(true); setLoader(false); return }
    setShowWalletError(false)
    try {
      const response = await dispatch(loginUser({ userName: userId, password, walletAddress }))
      if (response?.meta?.requestStatus === 'fulfilled') {
        const { data } = response.payload
        const { storageTokenKeyName, storageUserDataKeyName } = defaultAuthConfig
        window.localStorage.setItem(storageTokenKeyName, data?.token)
        window.localStorage.setItem(storageUserDataKeyName, JSON.stringify(response?.payload))
        // Sync AuthContext so AuthGuard sees the user immediately — no reload needed
        setUser(response?.payload)
        setLoading(false)
        router?.push('/dashboards/analytics').then(() => setLoader(false))
      } else {
        setLoader(false)
      }
    } catch (error) {
      console.error('Authentication failed:', error)
      setLoader(false)
    }
  }

  useEffect(() => {
    const excludedPaths = ['/set-password/[token]', '/login', '/signup', '/wallet-connection-error-guest', '/wallet-connection-error']
    if (router && !excludedPaths.includes(router.pathname)) {
      if (walletStatus === 'reconnecting' || walletStatus === 'connecting') return
      if (isMobile() && !window?.ethereum && !walletAddress) {
        router.push('/wallet-connection-error-guest')
      }
    }
  }, [router.pathname, walletAddress, walletStatus])

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
      <Form>
        <NetworkSelector open={networkPickerOpen} onClose={() => setNetworkPickerOpen(false)} />

        <Box
          className='content-right'
          sx={{
            backgroundColor: '#050816',
            minHeight: '100vh',
            backgroundImage: `
              radial-gradient(ellipse at 80% 10%, rgba(0,229,255,0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 10% 80%, rgba(168,85,247,0.05) 0%, transparent 50%)
            `,
          }}
        >
          {/* Left hero panel */}
          {!hidden && <HeroPanel />}

          {/* Right form panel */}
          <RightWrapper>
            <Box
              sx={{
                p: [6, 10],
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GlassCard sx={{ width: '100%', maxWidth: 420, p: { xs: 4, sm: 5 } }}>
                {/* Logo */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 60%, #FF2E9F 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '1.1rem',
                      fontWeight: 900,
                      color: '#050816',
                      fontFamily: '"Orbitron", sans-serif',
                      boxShadow: '0 0 20px rgba(0,229,255,0.4)',
                      animation: `${pulseGlow} 3s ease-in-out infinite`,
                    }}
                  >
                                   <Image src="/images/pages/pre-loader-new.png" alt="bw-logo" width="70" height="70" />
                   
                  </Box>

                  <Typography
                    variant='h4'
                    sx={{
                      fontFamily: '"Orbitron", sans-serif',
                      fontWeight: 800,
                      fontSize: '1.4rem',
                      letterSpacing: '0.1em',
                      background: 'linear-gradient(135deg, #00E5FF, #A855F7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 0.5,
                    }}
                  >
                    BIGWHALE
                  </Typography>

                  <Typography
                    sx={{
                      color: 'rgba(200,215,245,0.55)',
                      fontSize: '0.78rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      fontFamily: '"Space Grotesk", sans-serif',
                      mb: 2,
                    }}
                  >
                    Sign in to continue
                  </Typography>

                  {/* Divider */}
                  <Box sx={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.3), transparent)',
                  }} />
                </Box>

                {/* User ID */}
                <Box sx={{ mb: 3 }}>
                  <Field name='userId'>
                    {({ field, meta }) => (
                      <CustomTextField
                        fullWidth
                        label='User ID'
                        {...field}
                        placeholder='Enter your User ID'
                        error={Boolean(meta.touched && meta.error)}
                        helperText={meta.touched && meta.error ? meta.error : ''}
                      />
                    )}
                  </Field>
                </Box>

                {/* Password */}
                <Box sx={{ mb: 3 }}>
                  <Field name='password'>
                    {({ field, meta }) => (
                      <CustomTextField
                        fullWidth
                        {...field}
                        label='Password'
                        placeholder='Enter your password'
                        error={Boolean(meta.touched && meta.error)}
                        helperText={meta.touched && meta.error ? meta.error : ''}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowPassword(!showPassword)}
                                sx={{ color: 'rgba(0,229,255,0.6)', '&:hover': { color: '#00E5FF' } }}
                              >
                                <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  </Field>
                </Box>

                {/* Wallet */}
                {walletAddress ? (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Field name='address'>
                        {({ field, meta }) => (
                          <CustomTextField
                            fullWidth
                            {...field}
                            label='Wallet Address'
                            value={walletAddress?.slice(0, 10) + '...' + walletAddress?.slice(-10)}
                            error={Boolean(meta.touched && meta.error)}
                            helperText={meta.touched && meta.error ? meta.error : ''}
                            type='text'
                          />
                        )}
                      </Field>
                    </Box>
                    <OutlineButton fullWidth type='button' sx={{ mb: 3 }} onClick={() => disconnect()}>
                      Disconnect Wallet
                    </OutlineButton>
                  </>
                ) : (
                  <OutlineButton
                    fullWidth
                    type='button'
                    sx={{ mb: 3 }}
                    onClick={() => {
                      if (typeof window !== 'undefined' && isMobile() && !window?.ethereum) {
                        return setNetworkPickerOpen(true)
                      }
                      open({ view: 'Networks' })
                    }}
                  >
                    <Icon icon='tabler:wallet' style={{ marginRight: 8 }} />
                    Connect Wallet
                  </OutlineButton>
                )}

                {/* Wallet error */}
                {showWalletError && (
                  <Typography sx={{ color: '#FF2E9F', fontSize: '0.8rem', mb: 2, textAlign: 'center' }}>
                    Please connect your wallet to continue.
                  </Typography>
                )}

                {/* Forgot password */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Typography component={LinkStyled} href='/forgot-password' sx={{ fontSize: '0.85rem' }}>
                    Forgot Password?
                  </Typography>
                </Box>

                {/* Submit */}
                <NeonButton fullWidth type='submit' disabled={!!loader} sx={{ mb: 3 }}>
                  {loader ? 'Signing in...' : 'Sign In'}
                </NeonButton>

                {/* Sign up link */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography sx={{ color: 'rgba(200,215,245,0.55)', fontSize: '0.875rem' }}>
                    New to BIGWHALE?
                  </Typography>
                  <Typography href='/signup' component={LinkStyled} sx={{ fontSize: '0.875rem' }}>
                    Create Account
                  </Typography>
                </Box>
              </GlassCard>
            </Box>
          </RightWrapper>
        </Box>
      </Form>
    </Formik>
  )
}

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
