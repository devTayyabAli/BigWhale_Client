// ** BIGWHALE — Accordion Overrides
const MuiAccordion = () => {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: 'rgba(13,18,36,0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,229,255,0.1)',
          borderRadius: '12px !important',
          marginBottom: '8px',
          boxShadow: 'none',
          '&::before': { display: 'none' },
          '&.Mui-expanded': {
            borderColor: 'rgba(0,229,255,0.2)',
            boxShadow: '0 4px 20px rgba(0,229,255,0.06)',
            margin: '0 0 8px 0',
          },
          '&.Mui-disabled': {
            background: 'rgba(13,18,36,0.4)',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          fontSize: '0.9rem',
          color: 'rgba(200,215,245,0.82)',
          borderRadius: '12px',
          minHeight: '48px',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'rgba(0,229,255,0.04)',
            color: '#00E5FF',
          },
          '&.Mui-expanded': {
            color: '#00E5FF',
            minHeight: '48px',
            borderBottom: '1px solid rgba(0,229,255,0.1)',
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            color: 'rgba(0,229,255,0.5)',
            transition: 'transform 0.25s ease, color 0.2s ease',
            '&.Mui-expanded': {
              color: '#00E5FF',
              transform: 'rotate(180deg)',
            },
          },
        },
        content: {
          margin: '12px 0',
          '&.Mui-expanded': { margin: '12px 0' },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '12px 16px 16px',
          color: 'rgba(200,215,245,0.65)',
          fontSize: '0.875rem',
          fontFamily: '"Space Grotesk", sans-serif',
          lineHeight: 1.6,
        },
      },
    },
  }
}

export default MuiAccordion
