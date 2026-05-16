// ** BIGWHALE — Progress Overrides
const MuiProgress = () => {
  return {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          background: 'rgba(0,229,255,0.08)',
          height: '6px',
          overflow: 'visible',
        },
        bar: {
          borderRadius: '4px',
          background: 'linear-gradient(90deg, #00E5FF, #A855F7)',
          boxShadow: '0 0 8px rgba(0,229,255,0.4)',
        },
        colorPrimary: {
          background: 'rgba(0,229,255,0.08)',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #00E5FF, #A855F7)',
          },
        },
        colorSecondary: {
          background: 'rgba(168,85,247,0.08)',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #A855F7, #FF2E9F)',
          },
        },
        colorSuccess: {
          background: 'rgba(16,185,129,0.08)',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #10B981, #059669)',
          },
        },
        colorError: {
          background: 'rgba(255,46,159,0.08)',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #FF2E9F, #CC0066)',
          },
        },
        colorWarning: {
          background: 'rgba(245,158,11,0.08)',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #F59E0B, #D97706)',
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        colorPrimary: { color: '#00E5FF' },
        colorSecondary: { color: '#A855F7' },
        colorSuccess: { color: '#10B981' },
        colorError: { color: '#FF2E9F' },
        colorWarning: { color: '#F59E0B' },
      },
    },
  }
}

export default MuiProgress
