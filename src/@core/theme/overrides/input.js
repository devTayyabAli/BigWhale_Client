// ** BIGWHALE — Input Overrides
const MuiInput = () => {
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          color: 'rgba(200,215,245,0.55)',
          fontSize: '0.875rem',
          '&.Mui-focused': { color: '#00E5FF' },
          '&.Mui-error': { color: '#FF2E9F' },
          '&.Mui-disabled': { color: 'rgba(200,215,245,0.25)' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          background: 'rgba(13,18,36,0.6)',
          borderRadius: '10px',
          color: '#F8FAFC',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0,229,255,0.18)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0,229,255,0.38)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00E5FF',
            borderWidth: '1px',
            boxShadow: '0 0 0 3px rgba(0,229,255,0.1)',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FF2E9F',
          },
          '&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
            boxShadow: '0 0 0 3px rgba(255,46,159,0.1)',
          },
          '&.Mui-disabled': {
            background: 'rgba(13,18,36,0.3)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(200,215,245,0.08)',
            },
          },
        },
        input: {
          color: '#F8FAFC',
          fontSize: '0.875rem',
          '&::placeholder': { color: 'rgba(200,215,245,0.35)', opacity: 1 },
          '&.Mui-disabled': { color: 'rgba(200,215,245,0.3)', WebkitTextFillColor: 'rgba(200,215,245,0.3)' },
        },
        multiline: { padding: '12px 14px' },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          background: 'rgba(0,229,255,0.05)',
          borderRadius: '10px 10px 0 0',
          '&:hover': { background: 'rgba(0,229,255,0.08)' },
          '&.Mui-focused': { background: 'rgba(0,229,255,0.08)' },
          '&::before': { borderBottomColor: 'rgba(0,229,255,0.2)' },
          '&::after': { borderBottomColor: '#00E5FF' },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '&::before': { borderBottomColor: 'rgba(0,229,255,0.2)' },
          '&:hover:not(.Mui-disabled)::before': { borderBottomColor: 'rgba(0,229,255,0.4)' },
          '&::after': { borderBottomColor: '#00E5FF' },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.75rem',
          marginTop: '4px',
          '&.Mui-error': { color: '#FF2E9F' },
        },
      },
    },
  }
}

export default MuiInput
