// ** BIGWHALE — Timeline Overrides
const MuiTimeline = () => {
  return {
    MuiTimeline: {
      styleOverrides: {
        root: { margin: 0, padding: 0 },
      },
    },
    MuiTimelineItem: {
      styleOverrides: {
        root: {
          '&::before': { display: 'none' },
        },
      },
    },
    MuiTimelineSeparator: {
      styleOverrides: {
        root: {},
      },
    },
    MuiTimelineDot: {
      styleOverrides: {
        root: {
          margin: 0,
          boxShadow: 'none',
          border: 'none',
          padding: '6px',
        },
        filled: {
          background: 'linear-gradient(135deg, #00E5FF, #A855F7)',
          boxShadow: '0 0 8px rgba(0,229,255,0.4)',
        },
        outlined: {
          borderColor: 'rgba(0,229,255,0.4)',
          background: 'transparent',
        },
        filledPrimary: {
          background: 'linear-gradient(135deg, #00E5FF, #00C2FF)',
          boxShadow: '0 0 8px rgba(0,229,255,0.4)',
        },
        filledSecondary: {
          background: 'linear-gradient(135deg, #A855F7, #9333EA)',
          boxShadow: '0 0 8px rgba(168,85,247,0.4)',
        },
        filledError: {
          background: 'linear-gradient(135deg, #FF2E9F, #CC0066)',
          boxShadow: '0 0 8px rgba(255,46,159,0.4)',
        },
        filledSuccess: {
          background: 'linear-gradient(135deg, #10B981, #059669)',
          boxShadow: '0 0 8px rgba(16,185,129,0.4)',
        },
        filledWarning: {
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          boxShadow: '0 0 8px rgba(245,158,11,0.4)',
        },
        filledInfo: {
          background: 'linear-gradient(135deg, #00C2FF, #0891B2)',
          boxShadow: '0 0 8px rgba(0,194,255,0.4)',
        },
      },
    },
    MuiTimelineConnector: {
      styleOverrides: {
        root: {
          width: '2px',
          background: 'rgba(0,229,255,0.15)',
          backgroundImage: 'linear-gradient(180deg, rgba(0,229,255,0.3), rgba(168,85,247,0.2))',
        },
      },
    },
    MuiTimelineContent: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.875rem',
          color: 'rgba(200,215,245,0.82)',
          paddingTop: '4px',
          paddingBottom: '16px',
        },
      },
    },
    MuiTimelineOppositeContent: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.78rem',
          color: 'rgba(200,215,245,0.45)',
          paddingTop: '6px',
        },
      },
    },
  }
}

export default MuiTimeline
