// ** BIGWHALE — Menu Overrides
const MuiMenu = () => {
  return {
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: 'rgba(13,18,36,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,229,255,0.15)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(0,229,255,0.05)',
          backgroundImage: 'none',
        },
        list: { padding: '6px' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'rgba(200,215,245,0.82)',
          borderRadius: '8px',
          margin: '1px 0',
          padding: '8px 12px',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'rgba(0,229,255,0.08)',
            color: '#00E5FF',
          },
          '&.Mui-selected': {
            background: 'rgba(0,229,255,0.12)',
            color: '#00E5FF',
            fontWeight: 600,
            '&:hover': { background: 'rgba(0,229,255,0.16)' },
          },
          '&.Mui-disabled': { color: 'rgba(200,215,245,0.3)' },
        },
      },
    },
  }
}

export default MuiMenu
