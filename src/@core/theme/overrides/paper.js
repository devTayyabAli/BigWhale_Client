// ** BIGWHALE — Paper Overrides
const MuiPaper = {
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        background: 'rgba(13,18,36,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      },
      elevation0: { boxShadow: 'none' },
      elevation1: { boxShadow: '0 2px 12px rgba(0,0,0,0.4)' },
      elevation2: { boxShadow: '0 4px 20px rgba(0,0,0,0.45)' },
      elevation4: { boxShadow: '0 8px 32px rgba(0,0,0,0.5)' },
      elevation8: { boxShadow: '0 16px 48px rgba(0,0,0,0.55)' },
      elevation16: { boxShadow: '0 24px 64px rgba(0,0,0,0.6)' },
      elevation24: { boxShadow: '0 32px 80px rgba(0,0,0,0.65)' },
    },
  },
}

export default MuiPaper
