// ** BIGWHALE — ButtonGroup Overrides
const MuiButtonGroup = () => {
  return {
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          boxShadow: 'none',
          '& .MuiButtonGroup-grouped': {
            '&:not(:last-of-type)': {
              borderColor: 'rgba(0,229,255,0.2)',
            },
          },
        },
        contained: {
          '& .MuiButtonGroup-grouped': {
            '&:not(:last-of-type)': {
              borderColor: 'rgba(5,8,22,0.3)',
            },
          },
        },
        outlined: {
          '& .MuiButtonGroup-grouped': {
            borderColor: 'rgba(0,229,255,0.25)',
            '&:not(:last-of-type)': {
              borderColor: 'rgba(0,229,255,0.25)',
            },
          },
        },
      },
    },
  }
}

export default MuiButtonGroup
