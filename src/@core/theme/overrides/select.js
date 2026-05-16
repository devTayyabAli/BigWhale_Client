// ** BIGWHALE — Select Overrides
const MuiSelect = {
  MuiSelect: {
    styleOverrides: {
      select: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '0.875rem',
        color: '#F8FAFC',
        '&:focus': { background: 'transparent' },
      },
      icon: {
        color: 'rgba(0,229,255,0.6)',
        transition: 'transform 0.2s ease, color 0.2s ease',
        '.Mui-focused &': { color: '#00E5FF' },
      },
      outlined: {
        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00E5FF',
            boxShadow: '0 0 0 3px rgba(0,229,255,0.1)',
          },
        },
      },
    },
  },
}

export default MuiSelect
