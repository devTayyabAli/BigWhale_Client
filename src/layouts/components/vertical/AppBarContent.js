import { useEffect } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useAuth } from 'src/hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from 'src/store/apps/auth/currentUserSlice'
import { useRouter } from 'next/router'
import Image from 'next/image'

// ── BIGWHALE Logo Component ──────────────────────────────────────────
const BigWhaleLogo = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      userSelect: 'none',
    }}
  >
    {/* BW Coin Icon */}
    <Box
      sx={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 60%, #FF2E9F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 12px rgba(0, 229, 255, 0.5)',
        flexShrink: 0,
        fontSize: '13px',
        fontWeight: 900,
        color: '#050816',
        fontFamily: '"Orbitron", sans-serif',
        letterSpacing: '-0.5px',
      }}
    >
   <Image src="/images/pages/pre-loader-new.png" alt="bw-logo" width="60" height="60"/>
   {/* <img src="/images/KGCNightLogo.png" width="170" height="auto" alt="BW-logo" /> */}
    </Box>

    {/* Brand Name */}
    <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <Typography
        sx={{
          fontFamily: '"Orbitron", "Space Grotesk", sans-serif',
          fontWeight: 800,
          fontSize: '1.05rem',
          letterSpacing: '0.12em',
          background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.1,
        }}
      >
        BIGWHALE
      </Typography>
      <Typography
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 500,
          fontSize: '0.55rem',
          letterSpacing: '0.22em',
          color: 'rgba(0, 229, 255, 0.6)',
          textTransform: 'uppercase',
          lineHeight: 1,
          mt: '2px',
        }}
      >
        Ecosystem
      </Typography>
    </Box>
  </Box>
)

const AppBarContent = props => {
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const router = useRouter()
  const { admin } = router.query
  const auth = useAuth()
  const dispatch = useDispatch()
  const user        = useSelector(state => state?.login?.user?.data)
  const currentUser = useSelector(state => state?.getCurrentUser?.user?.data)
  const userStatus  = useSelector(state => state?.getCurrentUser?.status)

  useEffect(() => {
    if (admin) {
      // Admin view — always fetch the target user
      dispatch(getCurrentUser(admin))
    } else if (user?._id) {
      // Only fetch if not already loaded or if the loaded user differs
      // Prevents re-fetching on every navigation
      const alreadyLoaded = userStatus === 'succeeded' && currentUser?._id === user._id
      if (!alreadyLoaded) {
        dispatch(getCurrentUser(user._id))
      }
    }
  }, [admin, user?._id])

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Left — hamburger on mobile */}
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden && !settings.navHidden ? (
          <IconButton
            color='inherit'
            sx={{
              ml: -2.75,
              color: 'rgba(0, 229, 255, 0.8)',
              '&:hover': { color: '#00E5FF', background: 'rgba(0,229,255,0.08)' },
            }}
            onClick={toggleNavVisibility}
          >
            <Icon fontSize='1.5rem' icon='tabler:menu-2' />
          </IconButton>
        ) : null}
      </Box>

      {/* Center — BIGWHALE Logo */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <BigWhaleLogo />
      </Box>

      {/* Right — actions */}
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {auth.user && <UserDropdown settings={settings} />}
      </Box>
    </Box>
  )
}

export default AppBarContent
