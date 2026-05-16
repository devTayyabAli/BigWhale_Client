// ** BIGWHALE — Button Overrides
const MuiButton = () => {
  return {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'none',
          borderRadius: '10px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: 'linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)',
          color: '#050816',
          '&:hover': {
            background: 'linear-gradient(135deg, #33EBFB 0%, #00E5FF 100%)',
            boxShadow: '0 0 20px rgba(0,229,255,0.45), 0 4px 15px rgba(0,229,255,0.25)',
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)' },
          '&.Mui-disabled': {
            background: 'rgba(0,229,255,0.12)',
            color: 'rgba(0,229,255,0.35)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
          color: '#F8FAFC',
          '&:hover': {
            background: 'linear-gradient(135deg, #C084FC 0%, #A855F7 100%)',
            boxShadow: '0 0 20px rgba(168,85,247,0.45)',
            transform: 'translateY(-1px)',
          },
        },
        containedError: {
          background: 'linear-gradient(135deg, #FF2E9F 0%, #CC0066 100%)',
          color: '#F8FAFC',
          '&:hover': {
            boxShadow: '0 0 20px rgba(255,46,159,0.45)',
            transform: 'translateY(-1px)',
          },
        },
        containedSuccess: {
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: '#F8FAFC',
          '&:hover': {
            boxShadow: '0 0 20px rgba(16,185,129,0.45)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(0,229,255,0.35)',
          color: '#00E5FF',
          '&:hover': {
            borderColor: '#00E5FF',
            background: 'rgba(0,229,255,0.08)',
            boxShadow: '0 0 12px rgba(0,229,255,0.2)',
          },
        },
        outlinedSecondary: {
          borderColor: 'rgba(168,85,247,0.35)',
          color: '#A855F7',
          '&:hover': {
            borderColor: '#A855F7',
            background: 'rgba(168,85,247,0.08)',
          },
        },
        text: {
          color: '#00E5FF',
          '&:hover': { background: 'rgba(0,229,255,0.08)' },
        },
        sizeLarge: { padding: '12px 28px', fontSize: '1rem' },
        sizeMedium: { padding: '9px 22px' },
        sizeSmall: { padding: '6px 16px', fontSize: '0.8125rem' },
      },
    },
  }
}

export default MuiButton
