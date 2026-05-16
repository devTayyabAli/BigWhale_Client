// ** BIGWHALE — List Overrides
const MuiList = () => {
  return {
    MuiList: {
      styleOverrides: {
        root: { padding: '4px' },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'rgba(0,229,255,0.07)',
            '& .MuiListItemText-primary': { color: '#00E5FF' },
            '& .MuiListItemIcon-root': { color: '#00E5FF' },
          },
          '&.Mui-selected': {
            background: 'rgba(0,229,255,0.12)',
            border: '1px solid rgba(0,229,255,0.2)',
            '& .MuiListItemText-primary': { color: '#00E5FF', fontWeight: 600 },
            '& .MuiListItemIcon-root': { color: '#00E5FF' },
            '&:hover': { background: 'rgba(0,229,255,0.16)' },
          },
          '&.Mui-disabled': { opacity: 0.4 },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'rgba(0,229,255,0.6)',
          minWidth: '40px',
          transition: 'color 0.2s ease',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 500,
          fontSize: '0.875rem',
          color: 'rgba(200,215,245,0.82)',
          transition: 'color 0.2s ease',
        },
        secondary: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.78rem',
          color: 'rgba(200,215,245,0.45)',
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(0,229,255,0.5)',
          background: 'transparent',
          lineHeight: '2.5',
          paddingLeft: '12px',
        },
      },
    },
  }
}

export default MuiList
