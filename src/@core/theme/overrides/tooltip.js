// ** BIGWHALE — Tooltip Overrides
const MuiTooltip = () => {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.78rem',
          fontWeight: 500,
          background: 'rgba(13,18,36,0.97)',
          border: '1px solid rgba(0,229,255,0.2)',
          color: '#F8FAFC',
          borderRadius: '8px',
          padding: '6px 12px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        },
        arrow: {
          color: 'rgba(13,18,36,0.97)',
          '&::before': {
            border: '1px solid rgba(0,229,255,0.2)',
          },
        },
      },
    },
  }
}

export default MuiTooltip
