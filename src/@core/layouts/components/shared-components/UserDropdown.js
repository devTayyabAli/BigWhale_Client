// ** BIGWHALE — User Dropdown
import { useState, Fragment } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import { useSelector } from 'react-redux'

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: '#10B981',
  boxShadow: `0 0 0 2px rgba(13,18,36,0.95), 0 0 6px rgba(16,185,129,0.6)`,
}))

const MenuItemStyled = styled(MenuItem)({
  borderRadius: '8px',
  margin: '2px 6px',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(0,229,255,0.08)',
    '& .MuiBox-root, & .MuiBox-root svg': { color: '#00E5FF' },
  },
})

const UserDropdown = ({ settings }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()
  const { logout } = useAuth()
  const { direction } = settings
  const currentUser = useSelector(state => state?.getCurrentUser?.user?.data)

  const handleDropdownOpen = e => setAnchorEl(e.currentTarget)
  const handleDropdownClose = url => {
    if (url) router.push(url)
    setAnchorEl(null)
  }
  const handleLogout = () => { logout(); handleDropdownClose() }

  const menuItemSx = {
    px: 3,
    py: 1.5,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(200,215,245,0.8)',
    textDecoration: 'none',
    fontFamily: '"Space Grotesk", sans-serif',
    fontSize: '0.875rem',
    fontWeight: 500,
    '& svg': { mr: 2, fontSize: '1.2rem', color: 'rgba(0,229,255,0.6)' },
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 1.5, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          src={currentUser?.profilePicture}
          alt={currentUser?.name}
          onClick={handleDropdownOpen}
          sx={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(168,85,247,0.2))',
            border: '2px solid rgba(0,229,255,0.3)',
            color: '#00E5FF',
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '0.85rem',
            transition: 'all 0.2s ease',
            '&:hover': {
              border: '2px solid rgba(0,229,255,0.6)',
              boxShadow: '0 0 12px rgba(0,229,255,0.3)',
            },
          }}
        >
          {!currentUser?.profilePicture && currentUser?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
      </Badge>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{
          '& .MuiMenu-paper': {
            width: 240,
            mt: 1.5,
            background: 'rgba(13,18,36,0.97)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,229,255,0.15)',
            borderRadius: '16px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 30px rgba(0,229,255,0.06)',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.4), transparent)',
            },
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        {/* User info header */}
        <Box sx={{ py: 2, px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar
                src={currentUser?.profilePicture}
                sx={{
                  width: 40, height: 40,
                  background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(168,85,247,0.2))',
                  border: '2px solid rgba(0,229,255,0.25)',
                  color: '#00E5FF',
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                }}
              >
                {!currentUser?.profilePicture && currentUser?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Badge>
            <Box>
              <Typography sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#F8FAFC', lineHeight: 1.2 }}>
                {currentUser?.name}
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: 'rgba(0,229,255,0.6)', textTransform: 'capitalize', fontWeight: 500 }}>
                {currentUser?.role || 'Member'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(0,229,255,0.1)', mx: 2 }} />

        <Box sx={{ py: 1 }}>
          <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/account-details')}>
            <Box sx={menuItemSx}>
              <Icon icon='tabler:user-circle' />
              Account Details
            </Box>
          </MenuItemStyled>

          <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/account-settings/account')}>
            <Box sx={menuItemSx}>
              <Icon icon='tabler:settings' />
              Settings
            </Box>
          </MenuItemStyled>
        </Box>

        <Divider sx={{ borderColor: 'rgba(0,229,255,0.1)', mx: 2 }} />

        <Box sx={{ py: 1 }}>
          <MenuItemStyled sx={{ p: 0 }} onClick={handleLogout}>
            <Box sx={{ ...menuItemSx, color: '#FF2E9F', '& svg': { ...menuItemSx['& svg'], color: '#FF2E9F' } }}>
              <Icon icon='tabler:logout' />
              Sign Out
            </Box>
          </MenuItemStyled>
        </Box>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
