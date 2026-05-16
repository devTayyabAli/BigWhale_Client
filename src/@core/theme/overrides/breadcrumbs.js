// ** BIGWHALE — Breadcrumbs Overrides
const MuiBreadcrumb = () => {
  return {
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.82rem',
        },
        li: {
          '& a': {
            color: 'rgba(0,229,255,0.7)',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s ease',
            '&:hover': { color: '#00E5FF' },
          },
          '& .MuiTypography-root': {
            color: 'rgba(200,215,245,0.45)',
            fontSize: '0.82rem',
          },
        },
        separator: {
          color: 'rgba(0,229,255,0.3)',
          fontSize: '0.9rem',
        },
        ol: { flexWrap: 'wrap' },
      },
    },
  }
}

export default MuiBreadcrumb
