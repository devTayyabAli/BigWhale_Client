// ** BIGWHALE — Checkbox Overrides
const MuiCheckbox = () => {
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'rgba(0,229,255,0.35)',
          transition: 'all 0.2s ease',
          '&:hover': {
            color: 'rgba(0,229,255,0.6)',
            background: 'rgba(0,229,255,0.06)',
          },
          '&.Mui-checked': {
            color: '#00E5FF',
            '& .MuiSvgIcon-root': {
              filter: 'drop-shadow(0 0 4px rgba(0,229,255,0.5))',
            },
          },
          '&.MuiCheckbox-indeterminate': {
            color: '#00E5FF',
          },
          '&.Mui-disabled': {
            color: 'rgba(200,215,245,0.2)',
          },
        },
        colorSecondary: {
          '&.Mui-checked': { color: '#A855F7' },
        },
        colorError: {
          '&.Mui-checked': { color: '#FF2E9F' },
        },
        colorSuccess: {
          '&.Mui-checked': { color: '#10B981' },
        },
        colorWarning: {
          '&.Mui-checked': { color: '#F59E0B' },
        },
      },
    },
  }
}

export default MuiCheckbox
