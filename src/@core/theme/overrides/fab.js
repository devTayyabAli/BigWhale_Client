// ** BIGWHALE — FAB Overrides
const FabButton = () => {
  return {
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)',
          color: '#050816',
          boxShadow: '0 4px 20px rgba(0,229,255,0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #33EBFB 0%, #00E5FF 100%)',
            boxShadow: '0 6px 28px rgba(0,229,255,0.6)',
            transform: 'translateY(-2px)',
          },
          '&:active': { transform: 'translateY(0)' },
        },
        primary: {
          background: 'linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)',
          color: '#050816',
          '&:hover': {
            background: 'linear-gradient(135deg, #33EBFB 0%, #00E5FF 100%)',
            boxShadow: '0 6px 28px rgba(0,229,255,0.6)',
          },
        },
        secondary: {
          background: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
          color: '#F8FAFC',
          boxShadow: '0 4px 20px rgba(168,85,247,0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #C084FC 0%, #A855F7 100%)',
            boxShadow: '0 6px 28px rgba(168,85,247,0.6)',
          },
        },
        extended: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'none',
          borderRadius: '12px',
          padding: '10px 24px',
        },
        sizeSmall: { width: '36px', height: '36px', minHeight: '36px' },
        sizeMedium: { width: '48px', height: '48px', minHeight: '48px' },
        sizeLarge: { width: '56px', height: '56px', minHeight: '56px' },
      },
    },
  }
}

export default FabButton
