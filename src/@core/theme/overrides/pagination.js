// ** BIGWHALE — Pagination Overrides
const MuiPagination = () => {
  return {
    MuiPagination: {
      defaultProps: { shape: 'rounded' },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          fontSize: '0.82rem',
          color: 'rgba(200,215,245,0.6)',
          borderRadius: '8px',
          border: '1px solid transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'rgba(0,229,255,0.08)',
            color: '#00E5FF',
            borderColor: 'rgba(0,229,255,0.2)',
          },
          '&.Mui-selected': {
            background: 'rgba(0,229,255,0.15)',
            color: '#00E5FF',
            borderColor: 'rgba(0,229,255,0.35)',
            fontWeight: 700,
            '&:hover': { background: 'rgba(0,229,255,0.2)' },
          },
          '&.Mui-disabled': { color: 'rgba(200,215,245,0.2)' },
        },
        previousNext: {
          color: 'rgba(0,229,255,0.6)',
          '&:hover': { color: '#00E5FF' },
        },
        ellipsis: { color: 'rgba(200,215,245,0.4)' },
      },
    },
  }
}

export default MuiPagination
