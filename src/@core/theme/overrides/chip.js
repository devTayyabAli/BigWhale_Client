// ** BIGWHALE — Chip Overrides
const MuiChip = () => {
  return {
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          fontSize: '0.78rem',
          borderRadius: '8px',
          height: '26px',
          transition: 'all 0.2s ease',
        },
        colorPrimary: {
          background: 'rgba(0,229,255,0.12)',
          color: '#00E5FF',
          border: '1px solid rgba(0,229,255,0.28)',
          '&:hover': { background: 'rgba(0,229,255,0.2)' },
        },
        colorSecondary: {
          background: 'rgba(168,85,247,0.12)',
          color: '#A855F7',
          border: '1px solid rgba(168,85,247,0.28)',
          '&:hover': { background: 'rgba(168,85,247,0.2)' },
        },
        colorSuccess: {
          background: 'rgba(16,185,129,0.12)',
          color: '#10B981',
          border: '1px solid rgba(16,185,129,0.28)',
        },
        colorError: {
          background: 'rgba(255,46,159,0.12)',
          color: '#FF2E9F',
          border: '1px solid rgba(255,46,159,0.28)',
        },
        colorWarning: {
          background: 'rgba(245,158,11,0.12)',
          color: '#F59E0B',
          border: '1px solid rgba(245,158,11,0.28)',
        },
        colorInfo: {
          background: 'rgba(0,194,255,0.12)',
          color: '#00C2FF',
          border: '1px solid rgba(0,194,255,0.28)',
        },
        outlined: {
          borderColor: 'rgba(0,229,255,0.3)',
          color: '#00E5FF',
          '&:hover': { background: 'rgba(0,229,255,0.08)' },
        },
        deleteIcon: {
          color: 'rgba(0,229,255,0.5)',
          '&:hover': { color: '#00E5FF' },
        },
        label: { paddingLeft: '10px', paddingRight: '10px' },
      },
    },
  }
}

export default MuiChip
