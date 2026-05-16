// ** BIGWHALE — Drawer Overrides
const MuiDrawer = skin => {
  return {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(6,10,24,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundImage: `
            radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.04) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 100%, rgba(168,85,247,0.03) 0%, transparent 60%)
          `,
          borderRight: skin === 'bordered'
            ? '1px solid rgba(0,229,255,0.15)'
            : '1px solid rgba(0,229,255,0.1)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
        },
      },
    },
  }
}

export default MuiDrawer
