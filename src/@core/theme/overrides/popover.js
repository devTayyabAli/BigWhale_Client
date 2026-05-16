// ** BIGWHALE — Popover Overrides
const MuiPopover = skin => {
  return {
    MuiPopover: {
      styleOverrides: {
        paper: {
          background: 'rgba(13,18,36,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: skin === 'bordered'
            ? '1px solid rgba(0,229,255,0.2)'
            : '1px solid rgba(0,229,255,0.15)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(0,229,255,0.05)',
          backgroundImage: 'none',
        },
      },
    },
  }
}

export default MuiPopover
