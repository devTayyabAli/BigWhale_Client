// ** BIGWHALE — Table Overrides
const MuiTable = () => {
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          background: 'rgba(13,18,36,0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,229,255,0.1)',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: { borderCollapse: 'separate', borderSpacing: 0 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            background: 'rgba(0,229,255,0.05)',
            color: '#00E5FF',
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(0,229,255,0.15)',
            padding: '14px 16px',
            whiteSpace: 'nowrap',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            transition: 'background 0.2s ease',
            '&:hover': { background: 'rgba(0,229,255,0.04)' },
            '&:last-child td': { borderBottom: 'none' },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': {
            background: 'rgba(0,229,255,0.04)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          borderBottom: '1px solid rgba(0,229,255,0.07)',
          color: 'rgba(200,215,245,0.82)',
          fontSize: '0.875rem',
          padding: '12px 16px',
        },
        head: {
          fontWeight: 600,
          color: '#00E5FF',
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: 'rgba(200,215,245,0.65)',
          fontFamily: '"Space Grotesk", sans-serif',
          borderTop: '1px solid rgba(0,229,255,0.08)',
        },
        select: { color: '#00E5FF' },
        selectIcon: { color: 'rgba(0,229,255,0.6)' },
        actions: {
          '& .MuiIconButton-root': {
            color: 'rgba(0,229,255,0.6)',
            '&:hover': { color: '#00E5FF', background: 'rgba(0,229,255,0.08)' },
            '&.Mui-disabled': { color: 'rgba(200,215,245,0.2)' },
          },
        },
      },
    },
  }
}

export default MuiTable
