// ** BIGWHALE — DataGrid Overrides
const DataGrid = () => {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: '1px solid rgba(0,229,255,0.1)',
          borderRadius: '12px',
          background: 'rgba(13,18,36,0.7)',
          backdropFilter: 'blur(10px)',
          color: 'rgba(200,215,245,0.85)',
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
        }),
        toolbarContainer: ({ theme }) => ({
          paddingRight: `${theme.spacing(4)} !important`,
          paddingLeft: `${theme.spacing(3)} !important`,
          borderBottom: '1px solid rgba(0,229,255,0.08)',
          background: 'rgba(0,229,255,0.03)',
          '& .MuiButton-root': {
            color: '#00E5FF',
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 600,
            fontSize: '0.8rem',
          },
        }),
        columnHeaders: () => ({
          background: 'rgba(0,229,255,0.05)',
          borderBottom: '1px solid rgba(0,229,255,0.15)',
        }),
        columnHeader: ({ theme }) => ({
          '&:not(.MuiDataGrid-columnHeaderCheckbox)': {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            '&:first-of-type': { paddingLeft: theme.spacing(4) },
          },
          '&:last-of-type': { paddingRight: theme.spacing(4) },
        }),
        columnHeaderCheckbox: {
          maxWidth: '58px !important',
          minWidth: '58px !important',
        },
        columnHeaderTitleContainer: { padding: 0 },
        columnHeaderTitle: () => ({
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontSize: '0.72rem',
          color: '#00E5FF',
        }),
        columnSeparator: () => ({
          color: 'rgba(0,229,255,0.15)',
        }),
        row: {
          transition: 'background 0.2s ease',
          '&:hover': { background: 'rgba(0,229,255,0.04)' },
          '&.Mui-selected': {
            background: 'rgba(0,229,255,0.08)',
            '&:hover': { background: 'rgba(0,229,255,0.1)' },
          },
          '&:last-child .MuiDataGrid-cell': { borderBottom: 0 },
        },
        cell: ({ theme }) => ({
          borderColor: 'rgba(0,229,255,0.07)',
          color: 'rgba(200,215,245,0.82)',
          fontSize: '0.875rem',
          fontFamily: '"Space Grotesk", sans-serif',
          '&:not(.MuiDataGrid-cellCheckbox)': {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            '&:first-of-type': { paddingLeft: theme.spacing(4) },
          },
          '&:last-of-type': { paddingRight: theme.spacing(4) },
        }),
        cellCheckbox: {
          maxWidth: '58px !important',
          minWidth: '58px !important',
        },
        editInputCell: () => ({
          padding: 0,
          color: '#F8FAFC',
          '& .MuiInputBase-input': { padding: 0 },
        }),
        footerContainer: () => ({
          borderTop: '1px solid rgba(0,229,255,0.1)',
          background: 'rgba(0,229,255,0.02)',
          '& .MuiTablePagination-toolbar': {
            paddingLeft: '16px !important',
            paddingRight: '16px !important',
          },
          '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel': {
            color: 'rgba(200,215,245,0.6)',
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '0.82rem',
          },
          '& .MuiSelect-select': { color: '#00E5FF' },
          '& .MuiIconButton-root': {
            color: 'rgba(0,229,255,0.6)',
            '&:hover': { color: '#00E5FF', background: 'rgba(0,229,255,0.08)' },
            '&.Mui-disabled': { color: 'rgba(200,215,245,0.2)' },
          },
        }),
        selectedRowCount: ({ theme }) => ({
          margin: 0,
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          color: '#00E5FF',
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.82rem',
        }),
        checkboxInput: {
          color: 'rgba(0,229,255,0.4)',
          '&.Mui-checked': { color: '#00E5FF' },
        },
        overlay: {
          background: 'rgba(5,8,22,0.6)',
          backdropFilter: 'blur(4px)',
        },
        noRowsOverlay: {
          '& .MuiDataGrid-overlay': {
            color: 'rgba(200,215,245,0.4)',
            fontFamily: '"Space Grotesk", sans-serif',
          },
        },
      },
    },
  }
}

export default DataGrid
