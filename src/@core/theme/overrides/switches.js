// ** BIGWHALE — Switch Overrides
const MuiSwitches = () => {
  return {
    MuiSwitch: {
      styleOverrides: {
        root: { padding: '7px' },
        track: {
          borderRadius: '10px',
          background: 'rgba(200,215,245,0.15)',
          opacity: '1 !important',
        },
        thumb: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        },
        switchBase: {
          '&.Mui-checked': {
            color: '#00E5FF',
            '& + .MuiSwitch-track': {
              background: 'rgba(0,229,255,0.35)',
              opacity: '1 !important',
            },
            '& .MuiSwitch-thumb': {
              background: '#00E5FF',
              boxShadow: '0 0 8px rgba(0,229,255,0.5)',
            },
          },
          '&.Mui-checked.Mui-disabled': {
            color: 'rgba(0,229,255,0.4)',
            '& + .MuiSwitch-track': {
              background: 'rgba(0,229,255,0.15)',
            },
          },
          '&.Mui-disabled': {
            color: 'rgba(200,215,245,0.2)',
            '& + .MuiSwitch-track': {
              background: 'rgba(200,215,245,0.08)',
            },
          },
        },
        colorSecondary: {
          '&.Mui-checked': {
            color: '#A855F7',
            '& + .MuiSwitch-track': {
              background: 'rgba(168,85,247,0.35)',
            },
            '& .MuiSwitch-thumb': {
              background: '#A855F7',
              boxShadow: '0 0 8px rgba(168,85,247,0.5)',
            },
          },
        },
      },
    },
  }
}

export default MuiSwitches
