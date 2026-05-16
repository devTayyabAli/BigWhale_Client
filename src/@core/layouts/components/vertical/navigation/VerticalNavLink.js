// ** BIGWHALE — Vertical Nav Link
import Link from 'next/link'
import { useRouter } from 'next/router'
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import themeConfig from 'src/configs/themeConfig'
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'
import { handleURLQueries } from 'src/@core/layouts/utils'

// ── BIGWHALE styled nav link ─────────────────────────────────────────
const MenuNavLink = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  borderRadius: '10px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'rgba(0, 229, 255, 0.07)',
    '& .MuiTypography-root': { color: '#00E5FF !important' },
    '& svg': { color: '#00E5FF !important' },
  },
  '&.active': {
    '&, &:hover': {
      background: 'linear-gradient(135deg, rgba(0,229,255,0.15) 0%, rgba(168,85,247,0.1) 100%)',
      border: '1px solid rgba(0,229,255,0.25)',
      boxShadow: '0 0 16px rgba(0,229,255,0.12), inset 0 0 16px rgba(0,229,255,0.04)',
      '&.Mui-focusVisible': {
        background: 'linear-gradient(135deg, rgba(0,229,255,0.2) 0%, rgba(168,85,247,0.15) 100%)',
      },
    },
    '& .MuiTypography-root': {
      color: '#00E5FF !important',
      fontWeight: '600 !important',
    },
    '& svg': {
      color: '#00E5FF !important',
    },
    // Active left accent bar
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '20%',
      height: '60%',
      width: '3px',
      borderRadius: '0 3px 3px 0',
      background: 'linear-gradient(180deg, #00E5FF, #A855F7)',
      boxShadow: '0 0 8px rgba(0,229,255,0.6)',
    },
  },
  position: 'relative',
  overflow: 'hidden',
}))

const MenuItemTextMetaWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' }),
}))

const VerticalNavLink = ({
  item, parent, navHover, settings, navVisible,
  isSubToSub, collapsedNavWidth, toggleNavVisibility, navigationBorderWidth,
}) => {
  const router = useRouter()
  const { navCollapsed } = settings
  const icon = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon

  const isNavLinkActive = () =>
    router.pathname === item.path || handleURLQueries(router, item.path)

  return (
    <CanViewNavLink navLink={item}>
      <ListItem
        disablePadding
        className='nav-link'
        disabled={item.disabled || false}
        sx={{ mt: 0.5, px: '0 !important' }}
      >
        <MenuNavLink
          component={Link}
          {...(item.disabled && { tabIndex: -1 })}
          className={isNavLinkActive() ? 'active' : ''}
          href={item.path === undefined ? '/' : `${item.path}`}
          {...(item.openInNewTab ? { target: '_blank' } : null)}
          onClick={e => {
            if (item.path === undefined) { e.preventDefault(); e.stopPropagation() }
            if (navVisible) toggleNavVisibility()
          }}
          sx={{
            py: 1.75,
            ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
            px: navCollapsed && !navHover
              ? (collapsedNavWidth - navigationBorderWidth - 22 - 28) / 8
              : 3.5,
            '& .MuiTypography-root, & svg': {
              color: 'rgba(200,215,245,0.65)',
              transition: 'color 0.2s ease',
            },
          }}
        >
          <ListItemIcon
            sx={{
              transition: 'margin .25s ease-in-out',
              ...(navCollapsed && !navHover ? { mr: 0 } : { mr: 2 }),
              ...(parent ? { ml: 1.5, mr: 3.5 } : {}),
              '& svg': {
                fontSize: '0.625rem',
                ...(!parent ? { fontSize: '1.25rem' } : {}),
                ...(parent && item.icon ? { fontSize: '0.875rem' } : {}),
              },
            }}
          >
            <UserIcon icon={icon} />
          </ListItemIcon>

          <MenuItemTextMetaWrapper
            sx={{
              ...(isSubToSub ? { ml: 2 } : {}),
              ...(navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }),
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
              {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && { noWrap: true })}
            >
              <Translations text={item.title} />
            </Typography>
            {item.badgeContent ? (
              <Chip
                size='small'
                label={item.badgeContent}
                color={item.badgeColor || 'primary'}
                sx={{
                  height: 20,
                  minWidth: 20,
                  background: 'rgba(0,229,255,0.15)',
                  color: '#00E5FF',
                  border: '1px solid rgba(0,229,255,0.3)',
                  '& .MuiChip-label': { px: 1, textTransform: 'capitalize', fontSize: '0.7rem' },
                }}
              />
            ) : null}
          </MenuItemTextMetaWrapper>
        </MenuNavLink>
      </ListItem>
    </CanViewNavLink>
  )
}

export default VerticalNavLink
