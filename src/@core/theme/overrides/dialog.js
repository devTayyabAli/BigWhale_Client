// ** BIGWHALE — Dialog Overrides
const MuiDialog = skin => {
  return {
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(13,18,36,0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: skin === 'bordered'
            ? '1px solid rgba(0,229,255,0.2)'
            : '1px solid rgba(0,229,255,0.15)',
          borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(0,229,255,0.06)',
          backgroundImage: 'none',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), rgba(168,85,247,0.4), transparent)',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#F8FAFC',
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(0,229,255,0.1)',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '20px 24px',
          color: 'rgba(200,215,245,0.82)',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '12px 24px 20px',
          borderTop: '1px solid rgba(0,229,255,0.08)',
          gap: '8px',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(5,8,22,0.75)',
          backdropFilter: 'blur(4px)',
        },
      },
    },
  }
}

export default MuiDialog
