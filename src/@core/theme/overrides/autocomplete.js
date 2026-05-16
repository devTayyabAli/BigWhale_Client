// ** BIGWHALE — Autocomplete Overrides
const MuiAutocomplete = skin => {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          background: 'rgba(13,18,36,0.97)',
          backdropFilter: 'blur(20px)',
          border: skin === 'bordered'
            ? '1px solid rgba(0,229,255,0.2)'
            : '1px solid rgba(0,229,255,0.15)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          backgroundImage: 'none',
        },
        listbox: {
          padding: '6px',
          '& .MuiAutocomplete-option': {
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '0.875rem',
            color: 'rgba(200,215,245,0.82)',
            borderRadius: '8px',
            margin: '1px 0',
            padding: '8px 12px',
            transition: 'all 0.2s ease',
            '&:hover, &[data-focus="true"]': {
              background: 'rgba(0,229,255,0.08)',
              color: '#00E5FF',
            },
            '&[aria-selected="true"]': {
              background: 'rgba(0,229,255,0.12)',
              color: '#00E5FF',
              fontWeight: 600,
            },
          },
        },
        noOptions: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.875rem',
          color: 'rgba(200,215,245,0.4)',
          padding: '12px 16px',
        },
        loading: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.875rem',
          color: 'rgba(0,229,255,0.6)',
          padding: '12px 16px',
        },
        clearIndicator: {
          color: 'rgba(0,229,255,0.5)',
          '&:hover': { color: '#00E5FF', background: 'rgba(0,229,255,0.08)' },
        },
        popupIndicator: {
          color: 'rgba(0,229,255,0.5)',
          '&:hover': { color: '#00E5FF', background: 'rgba(0,229,255,0.08)' },
        },
        tag: {
          background: 'rgba(0,229,255,0.12)',
          color: '#00E5FF',
          border: '1px solid rgba(0,229,255,0.25)',
          borderRadius: '6px',
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          fontSize: '0.78rem',
        },
      },
    },
  }
}

export default MuiAutocomplete
