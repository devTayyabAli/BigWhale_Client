// ** BIGWHALE — ToggleButton Overrides
const MuiToggleButton = {
  MuiToggleButton: {
    styleOverrides: {
      root: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 600,
        fontSize: '0.82rem',
        textTransform: 'none',
        letterSpacing: '0.02em',
        color: 'rgba(200,215,245,0.6)',
        borderColor: 'rgba(0,229,255,0.15)',
        borderRadius: '8px',
        padding: '6px 16px',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: 'rgba(0,229,255,0.08)',
          color: '#00E5FF',
          borderColor: 'rgba(0,229,255,0.3)',
        },
        '&.Mui-selected': {
          background: 'rgba(0,229,255,0.15)',
          color: '#00E5FF',
          borderColor: 'rgba(0,229,255,0.35)',
          fontWeight: 700,
          '&:hover': {
            background: 'rgba(0,229,255,0.2)',
          },
        },
        '&.Mui-disabled': {
          color: 'rgba(200,215,245,0.2)',
          borderColor: 'rgba(200,215,245,0.08)',
        },
      },
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: {
        background: 'rgba(13,18,36,0.6)',
        border: '1px solid rgba(0,229,255,0.12)',
        borderRadius: '10px',
        padding: '3px',
        gap: '2px',
      },
      grouped: {
        border: 'none',
        borderRadius: '8px !important',
        '&:not(:first-of-type)': { marginLeft: '2px', borderLeft: 'none' },
      },
    },
  },
}

export default MuiToggleButton
