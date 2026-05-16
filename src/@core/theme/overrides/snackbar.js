// ** BIGWHALE — Snackbar Overrides
const MuiSnackbar = skin => {
  return {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#F8FAFC',
          background: 'rgba(13,18,36,0.97)',
          backdropFilter: 'blur(20px)',
          border: skin === 'bordered'
            ? '1px solid rgba(0,229,255,0.25)'
            : '1px solid rgba(0,229,255,0.18)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        },
        action: {
          '& .MuiIconButton-root': {
            color: 'rgba(0,229,255,0.7)',
            '&:hover': { color: '#00E5FF' },
          },
        },
      },
    },
  }
}

export default MuiSnackbar
