// ** BIGWHALE — Tabs Overrides
const MuiTabs = () => {
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0,229,255,0.1)',
          minHeight: '44px',
        },
        indicator: {
          background: 'linear-gradient(90deg, #00E5FF, #A855F7)',
          height: '3px',
          borderRadius: '2px 2px 0 0',
          boxShadow: '0 0 8px rgba(0,229,255,0.5)',
        },
        scrollButtons: {
          color: 'rgba(0,229,255,0.6)',
          '&:hover': { color: '#00E5FF' },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          fontSize: '0.875rem',
          textTransform: 'none',
          letterSpacing: '0.02em',
          color: 'rgba(200,215,245,0.55)',
          minHeight: '44px',
          padding: '10px 20px',
          transition: 'color 0.2s ease',
          '&.Mui-selected': {
            color: '#00E5FF',
          },
          '&:hover': {
            color: 'rgba(0,229,255,0.8)',
          },
        },
      },
    },
  }
}

export default MuiTabs
