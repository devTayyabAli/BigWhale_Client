// ** BIGWHALE — IconButton Overrides
const MuiIconButton = {
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: 'rgba(0,229,255,0.08)',
          color: '#00E5FF',
        },
        '&.Mui-disabled': {
          color: 'rgba(200,215,245,0.2)',
        },
      },
      colorPrimary: {
        color: 'rgba(0,229,255,0.7)',
        '&:hover': {
          color: '#00E5FF',
          background: 'rgba(0,229,255,0.08)',
          boxShadow: '0 0 10px rgba(0,229,255,0.15)',
        },
      },
      colorSecondary: {
        color: 'rgba(168,85,247,0.7)',
        '&:hover': {
          color: '#A855F7',
          background: 'rgba(168,85,247,0.08)',
        },
      },
      colorError: {
        color: 'rgba(255,46,159,0.7)',
        '&:hover': {
          color: '#FF2E9F',
          background: 'rgba(255,46,159,0.08)',
        },
      },
      colorSuccess: {
        color: 'rgba(16,185,129,0.7)',
        '&:hover': {
          color: '#10B981',
          background: 'rgba(16,185,129,0.08)',
        },
      },
      colorWarning: {
        color: 'rgba(245,158,11,0.7)',
        '&:hover': {
          color: '#F59E0B',
          background: 'rgba(245,158,11,0.08)',
        },
      },
      sizeSmall: { borderRadius: '8px', padding: '6px' },
      sizeMedium: { padding: '8px' },
      sizeLarge: { borderRadius: '12px', padding: '12px' },
    },
  },
}

export default MuiIconButton
