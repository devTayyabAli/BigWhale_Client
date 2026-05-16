// ** BIGWHALE — Vertical Nav Drawer
import { styled } from '@mui/material/styles'
import MuiSwipeableDrawer from '@mui/material/SwipeableDrawer'

const SwipeableDrawer = styled(MuiSwipeableDrawer)({
  overflowX: 'hidden',
  transition: 'width .25s ease-in-out',
  zIndex:1250,
  '& ul': { listStyle: 'none' },
  '& .MuiListItem-gutters': { paddingLeft: 4, paddingRight: 4 },
  '& .MuiDrawer-paper': {
    left: 'unset',
    right: 'unset',
    overflowX: 'hidden',
    transition: 'width .25s ease-in-out, box-shadow .25s ease-in-out',
    // BIGWHALE sidebar background
    background: 'rgba(6, 10, 24, 0.97)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    backgroundImage: `
      radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.04) 0%, transparent 60%),
      radial-gradient(ellipse at 50% 100%, rgba(168,85,247,0.03) 0%, transparent 60%)
    `,
  },
})

const Drawer = props => {
  // ** Props
  const {
    hidden,
    children,
    navHover,
    navWidth,
    settings,
    navVisible,
    setNavHover,
    navMenuProps,
    setNavVisible,
    collapsedNavWidth,
    navigationBorderWidth
  } = props

  // ** Vars
  const { skin, navCollapsed } = settings
  let flag = true

  // Drawer Props for Mobile & Tablet screens
  const MobileDrawerProps = {
    open: navVisible,
    onOpen: () => setNavVisible(true),
    onClose: () => setNavVisible(false),
    ModalProps: {
      keepMounted: true // Better open performance on mobile.
    }
  }

  // Drawer Props for Laptop & Desktop screens
  const DesktopDrawerProps = {
    open: true,
    onOpen: () => null,
    onClose: () => null,
    onMouseEnter: () => {
      // Declared flag to resolve first time flicker issue while trying to collapse the menu
      if (flag || navCollapsed) {
        setNavHover(true)
        flag = false
      }
    },
    onMouseLeave: () => {
      if (navCollapsed) {
        setNavHover(false)
      }
    }
  }
  let userNavMenuStyle = {}
  let userNavMenuPaperStyle = {}
  if (navMenuProps && navMenuProps.sx) {
    userNavMenuStyle = navMenuProps.sx
  }
  if (navMenuProps && navMenuProps.PaperProps && navMenuProps.PaperProps.sx) {
    userNavMenuPaperStyle = navMenuProps.PaperProps.sx
  }
  const userNavMenuProps = Object.assign({}, navMenuProps)
  delete userNavMenuProps.sx
  delete userNavMenuProps.PaperProps

  return (
    <SwipeableDrawer
      className='layout-vertical-nav'
      variant={hidden ? 'temporary' : 'permanent'}
      {...(hidden ? { ...MobileDrawerProps } : { ...DesktopDrawerProps })}
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          ...(!hidden && skin !== 'bordered' && { boxShadow: '4px 0 24px rgba(0,0,0,0.4)' }),
          width: navCollapsed && !navHover ? collapsedNavWidth : navWidth,
          borderRight: theme =>
            navigationBorderWidth === 0 ? 0 : `1px solid rgba(0,229,255,0.1)`,
          ...userNavMenuPaperStyle
        },
        ...navMenuProps?.PaperProps
      }}
      sx={{
        width: navCollapsed ? collapsedNavWidth : navWidth,
        ...userNavMenuStyle
      }}
      {...userNavMenuProps}
    >
      {children}
    </SwipeableDrawer>
  )
}

export default Drawer
