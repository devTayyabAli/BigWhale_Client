// ** BIGWHALE — Card Overrides
const MuiCard = skin => {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(13,18,36,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: skin === 'bordered'
            ? '1px solid rgba(0,229,255,0.15)'
            : '1px solid rgba(0,229,255,0.1)',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          backgroundImage: 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(0,229,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(0,229,255,0.06)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px 24px',
          '&:last-child': { paddingBottom: '20px' },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: { padding: '20px 24px 0' },
        title: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          fontSize: '1rem',
          color: '#F8FAFC',
        },
        subheader: {
          color: 'rgba(200,215,245,0.55)',
          fontSize: '0.82rem',
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: { padding: '12px 24px 20px' },
      },
    },
  }
}

export default MuiCard
