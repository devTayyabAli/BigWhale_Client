// ** BIGWHALE — Link Overrides
const MuiLink = {
  MuiLink: {
    defaultProps: { underline: 'none' },
    styleOverrides: {
      root: {
        color: '#00E5FF',
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          color: '#33EBFB',
          textShadow: '0 0 8px rgba(0,229,255,0.4)',
        },
        '&.Mui-focusVisible': {
          outline: '2px solid rgba(0,229,255,0.5)',
          outlineOffset: '2px',
          borderRadius: '4px',
        },
      },
    },
  },
}

export default MuiLink
