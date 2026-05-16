// ** BIGWHALE — MUI Theme Overrides
// Futuristic · Crypto-Native · Deep Ocean

const UserThemeOptions = () => {
  return {
    palette: {
      mode: 'dark',
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      // ── MuiCssBaseline ──────────────────────────────────────────
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#050816',
            backgroundImage: `
              radial-gradient(ellipse at 80% 10%, rgba(0,229,255,0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 10% 80%, rgba(168,85,247,0.05) 0%, transparent 50%)
            `,
            backgroundAttachment: 'fixed',
          },
        },
      },

      // ── MuiCard ─────────────────────────────────────────────────
      MuiCard: {
        styleOverrides: {
          root: {
            background: 'rgba(13, 18, 36, 0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 229, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
            '&:hover': {
              borderColor: 'rgba(0, 229, 255, 0.22)',
              boxShadow: '0 8px 32px rgba(0, 229, 255, 0.1)',
            },
          },
        },
      },

      // ── MuiCardContent ──────────────────────────────────────────
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '24px',
            '&:last-child': { paddingBottom: '24px' },
          },
        },
      },

      // ── MuiCardHeader ───────────────────────────────────────────
      MuiCardHeader: {
        styleOverrides: {
          root: {
            padding: '20px 24px 0',
          },
          title: {
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 600,
            fontSize: '1.05rem',
            color: '#F8FAFC',
          },
          subheader: {
            color: 'rgba(200, 215, 245, 0.6)',
            fontSize: '0.85rem',
          },
        },
      },

      // ── MuiButton ───────────────────────────────────────────────
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'none',
            borderRadius: '10px',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          contained: {
            background: 'linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)',
            color: '#050816',
            '&:hover': {
              background: 'linear-gradient(135deg, #33EBFB 0%, #00E5FF 100%)',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.45), 0 4px 15px rgba(0, 229, 255, 0.25)',
              transform: 'translateY(-1px)',
            },
            '&:active': { transform: 'translateY(0)' },
            '&.Mui-disabled': {
              background: 'rgba(0, 229, 255, 0.15)',
              color: 'rgba(0, 229, 255, 0.4)',
            },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
            color: '#F8FAFC',
            '&:hover': {
              background: 'linear-gradient(135deg, #C084FC 0%, #A855F7 100%)',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.45)',
              transform: 'translateY(-1px)',
            },
          },
          outlined: {
            borderColor: 'rgba(0, 229, 255, 0.35)',
            color: '#00E5FF',
            '&:hover': {
              borderColor: '#00E5FF',
              background: 'rgba(0, 229, 255, 0.08)',
              boxShadow: '0 0 12px rgba(0, 229, 255, 0.2)',
            },
          },
          outlinedSecondary: {
            borderColor: 'rgba(168, 85, 247, 0.35)',
            color: '#A855F7',
            '&:hover': {
              borderColor: '#A855F7',
              background: 'rgba(168, 85, 247, 0.08)',
            },
          },
          text: {
            color: '#00E5FF',
            '&:hover': {
              background: 'rgba(0, 229, 255, 0.08)',
            },
          },
          sizeLarge: { padding: '12px 28px', fontSize: '1rem' },
          sizeMedium: { padding: '9px 22px' },
          sizeSmall: { padding: '6px 16px', fontSize: '0.8125rem' },
        },
      },

      // ── MuiIconButton ───────────────────────────────────────────
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(0, 229, 255, 0.08)',
              color: '#00E5FF',
            },
          },
        },
      },

      // ── MuiTextField / MuiOutlinedInput ─────────────────────────
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            background: 'rgba(13, 18, 36, 0.6)',
            borderRadius: '10px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 229, 255, 0.2)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 229, 255, 0.4)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00E5FF',
              boxShadow: '0 0 0 3px rgba(0, 229, 255, 0.12)',
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF2E9F',
            },
          },
          input: {
            color: '#F8FAFC',
            '&::placeholder': { color: 'rgba(200, 215, 245, 0.4)' },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: 'rgba(200, 215, 245, 0.6)',
            '&.Mui-focused': { color: '#00E5FF' },
            '&.Mui-error': { color: '#FF2E9F' },
          },
        },
      },

      // ── MuiSelect ───────────────────────────────────────────────
      MuiSelect: {
        styleOverrides: {
          icon: { color: 'rgba(0, 229, 255, 0.6)' },
        },
      },

      // ── MuiMenu / MuiMenuItem ────────────────────────────────────
      MuiMenu: {
        styleOverrides: {
          paper: {
            background: 'rgba(13, 18, 36, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 229, 255, 0.15)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: 'rgba(200, 215, 245, 0.85)',
            borderRadius: '8px',
            margin: '2px 6px',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(0, 229, 255, 0.08)',
              color: '#00E5FF',
            },
            '&.Mui-selected': {
              background: 'rgba(0, 229, 255, 0.12)',
              color: '#00E5FF',
              '&:hover': { background: 'rgba(0, 229, 255, 0.16)' },
            },
          },
        },
      },

      // ── MuiDialog ───────────────────────────────────────────────
      MuiDialog: {
        styleOverrides: {
          paper: {
            background: 'rgba(13, 18, 36, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(0, 229, 255, 0.15)',
            borderRadius: '20px',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 229, 255, 0.08)',
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            color: '#F8FAFC',
            borderBottom: '1px solid rgba(0, 229, 255, 0.1)',
            paddingBottom: '16px',
          },
        },
      },

      // ── MuiDrawer / Sidebar ──────────────────────────────────────
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: 'rgba(8, 12, 28, 0.97)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(0, 229, 255, 0.1)',
          },
        },
      },

      // ── MuiAppBar ───────────────────────────────────────────────
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'rgba(5, 8, 22, 0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 229, 255, 0.1)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
          },
        },
      },

      // ── MuiChip ─────────────────────────────────────────────────
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 600,
            borderRadius: '8px',
            transition: 'all 0.2s ease',
          },
          colorPrimary: {
            background: 'rgba(0, 229, 255, 0.12)',
            color: '#00E5FF',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            '&:hover': { background: 'rgba(0, 229, 255, 0.2)' },
          },
          colorSecondary: {
            background: 'rgba(168, 85, 247, 0.12)',
            color: '#A855F7',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          },
          colorSuccess: {
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10B981',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          },
          colorError: {
            background: 'rgba(255, 46, 159, 0.12)',
            color: '#FF2E9F',
            border: '1px solid rgba(255, 46, 159, 0.3)',
          },
          colorWarning: {
            background: 'rgba(245, 158, 11, 0.12)',
            color: '#F59E0B',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          },
        },
      },

      // ── MuiAlert ────────────────────────────────────────────────
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          },
          standardInfo: {
            background: 'rgba(0, 194, 255, 0.1)',
            border: '1px solid rgba(0, 194, 255, 0.25)',
            color: '#00C2FF',
          },
          standardSuccess: {
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#10B981',
          },
          standardWarning: {
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            color: '#F59E0B',
          },
          standardError: {
            background: 'rgba(255, 46, 159, 0.1)',
            border: '1px solid rgba(255, 46, 159, 0.25)',
            color: '#FF2E9F',
          },
        },
      },

      // ── MuiTooltip ──────────────────────────────────────────────
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            background: 'rgba(13, 18, 36, 0.95)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            color: '#F8FAFC',
            fontSize: '0.8rem',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
          },
          arrow: { color: 'rgba(13, 18, 36, 0.95)' },
        },
      },

      // ── MuiLinearProgress ───────────────────────────────────────
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
            background: 'rgba(0, 229, 255, 0.1)',
            height: '6px',
          },
          bar: {
            borderRadius: '4px',
            background: 'linear-gradient(90deg, #00E5FF, #A855F7)',
          },
        },
      },

      // ── MuiCircularProgress ─────────────────────────────────────
      MuiCircularProgress: {
        styleOverrides: {
          colorPrimary: { color: '#00E5FF' },
          colorSecondary: { color: '#A855F7' },
        },
      },

      // ── MuiSwitch ───────────────────────────────────────────────
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            '&.Mui-checked': {
              color: '#00E5FF',
              '& + .MuiSwitch-track': {
                background: 'rgba(0, 229, 255, 0.4)',
                opacity: 1,
              },
            },
          },
          track: {
            background: 'rgba(200, 215, 245, 0.2)',
            opacity: 1,
          },
        },
      },

      // ── MuiCheckbox ─────────────────────────────────────────────
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: 'rgba(0, 229, 255, 0.4)',
            '&.Mui-checked': { color: '#00E5FF' },
          },
        },
      },

      // ── MuiRadio ────────────────────────────────────────────────
      MuiRadio: {
        styleOverrides: {
          root: {
            color: 'rgba(0, 229, 255, 0.4)',
            '&.Mui-checked': { color: '#00E5FF' },
          },
        },
      },

      // ── MuiSlider ───────────────────────────────────────────────
      MuiSlider: {
        styleOverrides: {
          root: { color: '#00E5FF' },
          track: { background: 'linear-gradient(90deg, #00E5FF, #A855F7)' },
          thumb: {
            background: '#00E5FF',
            boxShadow: '0 0 8px rgba(0, 229, 255, 0.6)',
            '&:hover': { boxShadow: '0 0 14px rgba(0, 229, 255, 0.8)' },
          },
          rail: { background: 'rgba(0, 229, 255, 0.15)' },
        },
      },

      // ── MuiTable ────────────────────────────────────────────────
      MuiTableContainer: {
        styleOverrides: {
          root: {
            background: 'rgba(13, 18, 36, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 229, 255, 0.1)',
            borderRadius: '12px',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              background: 'rgba(0, 229, 255, 0.05)',
              color: '#00E5FF',
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 600,
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background 0.2s ease',
            '&:hover': { background: 'rgba(0, 229, 255, 0.04)' },
            '&:last-child td': { borderBottom: 'none' },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid rgba(0, 229, 255, 0.07)',
            color: 'rgba(200, 215, 245, 0.85)',
            fontSize: '0.875rem',
          },
        },
      },

      // ── MuiPagination ───────────────────────────────────────────
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            color: 'rgba(200, 215, 245, 0.7)',
            borderRadius: '8px',
            '&.Mui-selected': {
              background: 'rgba(0, 229, 255, 0.15)',
              color: '#00E5FF',
              border: '1px solid rgba(0, 229, 255, 0.3)',
            },
            '&:hover': { background: 'rgba(0, 229, 255, 0.08)' },
          },
        },
      },

      // ── MuiTabs ─────────────────────────────────────────────────
      MuiTab: {
        styleOverrides: {
          root: {
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 600,
            textTransform: 'none',
            color: 'rgba(200, 215, 245, 0.6)',
            '&.Mui-selected': { color: '#00E5FF' },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            background: 'linear-gradient(90deg, #00E5FF, #A855F7)',
            height: '3px',
            borderRadius: '2px',
          },
        },
      },

      // ── MuiAccordion ────────────────────────────────────────────
      MuiAccordion: {
        styleOverrides: {
          root: {
            background: 'rgba(13, 18, 36, 0.7)',
            border: '1px solid rgba(0, 229, 255, 0.1)',
            borderRadius: '12px !important',
            marginBottom: '8px',
            '&:before': { display: 'none' },
            '&.Mui-expanded': {
              borderColor: 'rgba(0, 229, 255, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 229, 255, 0.08)',
            },
          },
        },
      },

      // ── MuiDivider ──────────────────────────────────────────────
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: 'rgba(0, 229, 255, 0.1)' },
        },
      },

      // ── MuiAvatar ───────────────────────────────────────────────
      MuiAvatar: {
        styleOverrides: {
          root: {
            background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(168,85,247,0.2))',
            border: '2px solid rgba(0, 229, 255, 0.2)',
            color: '#00E5FF',
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
          },
        },
      },

      // ── MuiBadge ────────────────────────────────────────────────
      MuiBadge: {
        styleOverrides: {
          colorPrimary: {
            background: 'linear-gradient(135deg, #00E5FF, #00C2FF)',
            color: '#050816',
          },
          colorSecondary: {
            background: 'linear-gradient(135deg, #A855F7, #9333EA)',
          },
          colorError: {
            background: 'linear-gradient(135deg, #FF2E9F, #CC0066)',
          },
        },
      },

      // ── MuiSnackbar / MuiSnackbarContent ────────────────────────
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            background: 'rgba(13, 18, 36, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '12px',
            color: '#F8FAFC',
          },
        },
      },

      // ── MuiPaper ────────────────────────────────────────────────
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            background: 'rgba(13, 18, 36, 0.85)',
            backdropFilter: 'blur(16px)',
          },
          elevation1: {
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
          },
          elevation2: {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)',
          },
          elevation4: {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          },
          elevation8: {
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.55)',
          },
        },
      },

      // ── MuiListItemButton ────────────────────────────────────────
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(0, 229, 255, 0.07)',
            },
            '&.Mui-selected': {
              background: 'rgba(0, 229, 255, 0.12)',
              '&:hover': { background: 'rgba(0, 229, 255, 0.16)' },
            },
          },
        },
      },

      // ── MuiListItemIcon ──────────────────────────────────────────
      MuiListItemIcon: {
        styleOverrides: {
          root: { color: 'rgba(0, 229, 255, 0.7)', minWidth: '40px' },
        },
      },

      // ── MuiFormHelperText ────────────────────────────────────────
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            fontSize: '0.78rem',
            '&.Mui-error': { color: '#FF2E9F' },
          },
        },
      },

      // ── MuiSkeleton ─────────────────────────────────────────────
      MuiSkeleton: {
        styleOverrides: {
          root: {
            background: 'rgba(0, 229, 255, 0.06)',
            '&::after': {
              background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.08), transparent)',
            },
          },
        },
      },
    },

    // ── Shadows ─────────────────────────────────────────────────────
    shadows: [
      'none',
      '0px 2px 8px rgba(0, 0, 0, 0.4)',
      '0px 4px 12px rgba(0, 0, 0, 0.45)',
      '0px 6px 16px rgba(0, 0, 0, 0.5)',
      '0px 8px 20px rgba(0, 0, 0, 0.5)',
      '0px 10px 24px rgba(0, 0, 0, 0.55)',
      '0px 12px 28px rgba(0, 0, 0, 0.55)',
      '0px 14px 32px rgba(0, 0, 0, 0.6)',
      '0px 16px 36px rgba(0, 0, 0, 0.6)',
      '0px 18px 40px rgba(0, 0, 0, 0.6)',
      '0px 20px 44px rgba(0, 0, 0, 0.65)',
      '0px 22px 48px rgba(0, 0, 0, 0.65)',
      '0px 24px 52px rgba(0, 0, 0, 0.65)',
      '0px 26px 56px rgba(0, 0, 0, 0.7)',
      '0px 28px 60px rgba(0, 0, 0, 0.7)',
      '0px 30px 64px rgba(0, 0, 0, 0.7)',
      '0px 32px 68px rgba(0, 0, 0, 0.7)',
      '0px 34px 72px rgba(0, 0, 0, 0.75)',
      '0px 36px 76px rgba(0, 0, 0, 0.75)',
      '0px 38px 80px rgba(0, 0, 0, 0.75)',
      '0px 40px 84px rgba(0, 0, 0, 0.8)',
      '0px 42px 88px rgba(0, 0, 0, 0.8)',
      '0px 44px 92px rgba(0, 0, 0, 0.8)',
      '0px 46px 96px rgba(0, 0, 0, 0.8)',
      '0px 48px 100px rgba(0, 0, 0, 0.85)',
    ],

    // ── Z-index ──────────────────────────────────────────────────────
    zIndex: {
      appBar: 1200,
      drawer: 1100,
    },
  }
}

export default UserThemeOptions
