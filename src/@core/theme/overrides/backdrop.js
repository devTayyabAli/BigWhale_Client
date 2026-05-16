// ** BIGWHALE — Backdrop Overrides
const MuiBackdrop = () => {
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(5,8,22,0.75)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          '&.MuiBackdrop-invisible': {
            backgroundColor: 'transparent',
            backdropFilter: 'none',
          },
        },
      },
    },
  }
}

export default MuiBackdrop
