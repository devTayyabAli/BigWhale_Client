// ** BIGWHALE — Slider Overrides
const MuiSlider = () => {
  return {
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#00E5FF',
          height: 6,
          '&.Mui-disabled': { color: 'rgba(0,229,255,0.2)' },
        },
        rail: {
          background: 'rgba(0,229,255,0.12)',
          borderRadius: '3px',
        },
        track: {
          background: 'linear-gradient(90deg, #00E5FF, #A855F7)',
          border: 'none',
          borderRadius: '3px',
          boxShadow: '0 0 8px rgba(0,229,255,0.3)',
        },
        thumb: {
          width: 18,
          height: 18,
          background: '#00E5FF',
          border: '2px solid rgba(13,18,36,0.9)',
          boxShadow: '0 0 8px rgba(0,229,255,0.5)',
          transition: 'all 0.2s ease',
          '&:hover, &.Mui-focusVisible': {
            boxShadow: '0 0 14px rgba(0,229,255,0.7)',
          },
          '&.Mui-active': {
            width: 22,
            height: 22,
            boxShadow: '0 0 20px rgba(0,229,255,0.8)',
          },
        },
        mark: {
          background: 'rgba(0,229,255,0.3)',
          width: 4,
          height: 4,
          borderRadius: '50%',
        },
        markActive: { background: '#00E5FF' },
        markLabel: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.75rem',
          color: 'rgba(200,215,245,0.5)',
        },
        valueLabel: {
          background: 'rgba(13,18,36,0.95)',
          border: '1px solid rgba(0,229,255,0.3)',
          borderRadius: '8px',
          color: '#00E5FF',
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          fontSize: '0.78rem',
        },
        colorSecondary: {
          '& .MuiSlider-track': {
            background: 'linear-gradient(90deg, #A855F7, #FF2E9F)',
          },
          '& .MuiSlider-thumb': {
            background: '#A855F7',
            boxShadow: '0 0 8px rgba(168,85,247,0.5)',
          },
        },
      },
    },
  }
}

export default MuiSlider
