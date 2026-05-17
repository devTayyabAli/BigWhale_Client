// ** BIGWHALE — Vertical Nav Header
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import themeConfig from 'src/configs/themeConfig'
import { keyframes } from '@emotion/react'
import Image from 'next/image'

const pulseGlow = keyframes`
  0%,100% { box-shadow: 0 0 10px rgba(0,229,255,0.4); }
  50%      { box-shadow: 0 0 20px rgba(0,229,255,0.7); }
`

const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(2),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight,
  borderBottom: '1px solid rgba(0,229,255,0.08)',
}))

const LinkStyled = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  gap: '10px',
  minWidth: 0,
  flex: '1 1 auto',
  // Do NOT set overflow:hidden here — it clips the gradient text
})

const VerticalNavHeader = props => {
  const {
    hidden, navHover, settings, saveSettings,
    collapsedNavWidth, toggleNavVisibility, navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    navMenuBranding: userNavMenuBranding,
    menuUnlockedIcon: userMenuUnlockedIcon,
  } = props

  const theme = useTheme()
  const { navCollapsed } = settings
  const menuCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) return 0
      return (collapsedNavWidth - navigationBorderWidth - 34) / 8
    }
    return 4  // fixed left padding when expanded — don't compute dynamically
  }

  const MenuLockedIcon = () => userMenuLockedIcon || <Icon icon='tabler:circle-dot' />
  const MenuUnlockedIcon = () => userMenuUnlockedIcon || <Icon icon='tabler:circle' />

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: menuHeaderPaddingLeft() }}>
      {userNavMenuBranding ? (
        userNavMenuBranding(props)
      ) : (
        <LinkStyled href='/'>
          {/* BW Coin */}
          <Box
            sx={{
              width: navCollapsed && !navHover ? 34 : 36,
              height: navCollapsed && !navHover ? 34 : 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 60%, #FF2E9F 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: 900,
              color: '#050816',
              fontFamily: '"Orbitron", sans-serif',
              flexShrink: 0,
              animation: `${pulseGlow} 3s ease-in-out infinite`,
              transition: 'all 0.25s ease',
            }}
          >
             <Image src="/images/pages/pre-loader-new.png" alt="bw-logo" width="40" height="40"/>
          </Box>

          {/* Brand text — only visible when nav is expanded */}
          <Box
            sx={{
              ...menuCollapsedStyles,
              transition: 'opacity .25s ease-in-out',
              // Width constraint so it doesn't push the collapse button off screen
              maxWidth: navCollapsed && !navHover ? 0 : 160,
              overflow: 'hidden',
            }}
          >
            <Typography
              noWrap
              sx={{
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 800,
                fontSize: '0.9rem',
                letterSpacing: '0.1em',
                // Gradient text — must use background-clip on the element itself
                background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
                display: 'block',
              }}
            >
              BIGWHALE
            </Typography>
            <Typography
              noWrap
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 500,
                fontSize: '0.5rem',
                letterSpacing: '0.18em',
                color: 'rgba(0,229,255,0.5)',
                textTransform: 'uppercase',
                lineHeight: 1,
                mt: '2px',
                display: 'block',
              }}
            >
              Ecosystem
            </Typography>
          </Box>
        </LinkStyled>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{
            p: 0,
            color: 'rgba(0,229,255,0.6)',
            backgroundColor: 'transparent !important',
            '&:hover': { color: '#00E5FF' },
          }}
        >
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </IconButton>
      ) : userMenuLockedIcon === null && userMenuUnlockedIcon === null ? null : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
          sx={{
            p: 0,
            color: 'rgba(0,229,255,0.5)',
            backgroundColor: 'transparent !important',
            '&:hover': { color: '#00E5FF' },
            '& svg': {
              fontSize: '1.25rem',
              ...menuCollapsedStyles,
              transition: 'opacity .25s ease-in-out',
            },
          }}
        >
          {navCollapsed ? MenuUnlockedIcon() : MenuLockedIcon()}
        </IconButton>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
