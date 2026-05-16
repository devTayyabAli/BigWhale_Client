// ** BIGWHALE — Divider Overrides
const MuiDivider = () => {
  return {
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0,229,255,0.1)',
          '&.MuiDivider-withChildren': {
            '&::before, &::after': {
              borderColor: 'rgba(0,229,255,0.1)',
            },
          },
        },
        textAlignLeft: {
          '&::before': { width: '0%' },
          '&::after': { width: '100%' },
        },
        textAlignRight: {
          '&::before': { width: '100%' },
          '&::after': { width: '0%' },
        },
        wrapper: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'rgba(200,215,245,0.4)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          paddingLeft: '12px',
          paddingRight: '12px',
        },
      },
    },
  }
}

export default MuiDivider
