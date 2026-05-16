// ** BIGWHALE — React Hot Toast Styles
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useSettings } from 'src/@core/hooks/useSettings'

const ReactHotToast = styled(Box)(({ theme }) => {
  const { settings } = useSettings()
  const { layout, navHidden } = settings

  return {
    '& > div': {
      left: `${theme.spacing(6)} !important`,
      right: `${theme.spacing(6)} !important`,
      bottom: `${theme.spacing(6)} !important`,
      top: layout === 'horizontal' && !navHidden ? '139px !important' : '75px !important',
      zIndex: useMediaQuery(theme.breakpoints.down('lg'))
        ? `${theme.zIndex.drawer - 1} !important`
        : `${theme.zIndex.drawer + 1} !important`,
    },
    '& .react-hot-toast': {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.02em',
      fontSize: '0.875rem',
      color: '#F8FAFC',
      background: 'rgba(13, 18, 36, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 229, 255, 0.2)',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 229, 255, 0.08)',
      padding: '12px 16px',
      '&>:first-of-type:not([role])>:first-of-type': {
        width: 14,
        height: 14,
      },
    },
  }
})

export default ReactHotToast
