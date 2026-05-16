// ** BIGWHALE — Alert Overrides
const MuiAlerts = () => {
  return {
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          padding: '10px 16px',
        },
        standardInfo: {
          background: 'rgba(0,194,255,0.08)',
          border: '1px solid rgba(0,194,255,0.22)',
          color: '#00C2FF',
          '& .MuiAlert-icon': { color: '#00C2FF' },
        },
        standardSuccess: {
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.22)',
          color: '#10B981',
          '& .MuiAlert-icon': { color: '#10B981' },
        },
        standardWarning: {
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.22)',
          color: '#F59E0B',
          '& .MuiAlert-icon': { color: '#F59E0B' },
        },
        standardError: {
          background: 'rgba(255,46,159,0.08)',
          border: '1px solid rgba(255,46,159,0.22)',
          color: '#FF2E9F',
          '& .MuiAlert-icon': { color: '#FF2E9F' },
        },
        filledInfo: {
          background: 'linear-gradient(135deg, rgba(0,194,255,0.8), rgba(0,229,255,0.7))',
          color: '#050816',
        },
        filledSuccess: {
          background: 'linear-gradient(135deg, rgba(16,185,129,0.8), rgba(5,150,105,0.7))',
          color: '#050816',
        },
        filledWarning: {
          background: 'linear-gradient(135deg, rgba(245,158,11,0.8), rgba(217,119,6,0.7))',
          color: '#050816',
        },
        filledError: {
          background: 'linear-gradient(135deg, rgba(255,46,159,0.8), rgba(204,0,102,0.7))',
          color: '#F8FAFC',
        },
        outlinedInfo: {
          borderColor: 'rgba(0,194,255,0.4)',
          color: '#00C2FF',
          '& .MuiAlert-icon': { color: '#00C2FF' },
        },
        outlinedSuccess: {
          borderColor: 'rgba(16,185,129,0.4)',
          color: '#10B981',
          '& .MuiAlert-icon': { color: '#10B981' },
        },
        outlinedWarning: {
          borderColor: 'rgba(245,158,11,0.4)',
          color: '#F59E0B',
          '& .MuiAlert-icon': { color: '#F59E0B' },
        },
        outlinedError: {
          borderColor: 'rgba(255,46,159,0.4)',
          color: '#FF2E9F',
          '& .MuiAlert-icon': { color: '#FF2E9F' },
        },
        icon: { opacity: 1 },
        message: { lineHeight: 1.5 },
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: '0.9rem',
          marginBottom: '4px',
        },
      },
    },
  }
}

export default MuiAlerts
