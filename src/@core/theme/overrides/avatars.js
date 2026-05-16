// ** BIGWHALE — Avatar Overrides
const MuiAvatar = () => {
  return {
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(168,85,247,0.2))',
          border: '2px solid rgba(0,229,255,0.2)',
          color: '#00E5FF',
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: '0.9rem',
          transition: 'all 0.2s ease',
        },
        colorDefault: {
          background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(168,85,247,0.15))',
          color: '#00E5FF',
        },
        rounded: { borderRadius: '12px' },
        square: { borderRadius: '8px' },
      },
    },
    MuiAvatarGroup: {
      styleOverrides: {
        avatar: {
          border: '2px solid rgba(13,18,36,0.9)',
          background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(168,85,247,0.2))',
          color: '#00E5FF',
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: '0.78rem',
        },
      },
    },
  }
}

export default MuiAvatar
