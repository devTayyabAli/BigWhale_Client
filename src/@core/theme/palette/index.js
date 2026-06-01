// ** BIGWHALE Color System
// Deep Space Black: #050816
// Ocean Blue: #00C2FF
// Electric Cyan: #00E5FF
// Neon Purple: #A855F7
// Cosmic Pink: #FF2E9F
// Whale Blue: #1E3A8A
// Metallic Silver: #C0C7D1
// White Glow: #F8FAFC

const DefaultPalette = (mode, skin) => {
  // ** BIGWHALE Brand Colors
  const whiteColor = '#F8FAFC'
  const deepSpaceBlack = '#050816'
  const oceanBlue = '#00C2FF'
  const electricCyan = '#00E5FF'
  const neonPurple = '#A855F7'
  const cosmicPink = '#FF2E9F'
  const whaleBlueDark = '#1E3A8A'
  const metallicSilver = '#C0C7D1'

  // Always dark mode for BIGWHALE
  // NOTE: stored as hex so MUI's alpha()/darken()/lighten() utilities never
  // receive a bare "R, G, B" string, which MUI does not support as a color.
  const darkColor = '#C8D7F5'       // rgb(200, 215, 245)
  const lightColor = '#2F2B3D'      // rgb(47, 43, 61)
  const darkPaperBgColor = '#0D1224'
  const mainColor = darkColor

  const defaultBgColor = () => {
    if (skin === 'bordered' && mode === 'light') {
      return '#0B1020'
    } else if (skin === 'bordered' && mode === 'dark') {
      return darkPaperBgColor
    } else if (mode === 'light') {
      return '#0B1020'
    } else return deepSpaceBlack
  }

  return {
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      lightPaperBg: '#0D1224',
      darkPaperBg: darkPaperBgColor,
      bodyBg: mode === 'light' ? '#0B1020' : deepSpaceBlack,
      trackBg: mode === 'light' ? '#1A2040' : '#1A2040',
      avatarBg: mode === 'light' ? '#1E2A4A' : '#1E2A4A',
      tableHeaderBg: mode === 'light' ? '#0F1830' : '#0F1830',
      // BIGWHALE brand tokens
      oceanBlue,
      electricCyan,
      neonPurple,
      cosmicPink,
      whaleBlueDark,
      metallicSilver,
      deepSpaceBlack,
      // Glassmorphism helpers
      glassLight: 'rgba(0, 229, 255, 0.05)',
      glassBorder: 'rgba(0, 229, 255, 0.15)',
      glowCyan: `0 0 20px rgba(0, 229, 255, 0.3)`,
      glowPurple: `0 0 20px rgba(168, 85, 247, 0.3)`,
      glowPink: `0 0 20px rgba(255, 46, 159, 0.3)`,
    },
    mode: 'dark',
    common: {
      black: deepSpaceBlack,
      white: whiteColor
    },
    primary: {
      light: '#33EBFB',
      main: electricCyan,
      dark: '#00B8CC',
      contrastText: deepSpaceBlack
    },
    secondary: {
      light: '#C084FC',
      main: neonPurple,
      dark: '#9333EA',
      contrastText: whiteColor
    },
    error: {
      light: '#FF6BB5',
      main: cosmicPink,
      dark: '#CC0066',
      contrastText: whiteColor
    },
    warning: {
      light: '#FCD34D',
      main: '#F59E0B',
      dark: '#D97706',
      contrastText: deepSpaceBlack
    },
    info: {
      light: '#67E8F9',
      main: oceanBlue,
      dark: '#0891B2',
      contrastText: deepSpaceBlack
    },
    success: {
      light: '#6EE7B7',
      main: '#10B981',
      dark: '#059669',
      contrastText: deepSpaceBlack
    },
    grey: {
      50: '#F8FAFC',
      100: '#E2E8F0',
      200: '#CBD5E1',
      300: '#94A3B8',
      400: '#64748B',
      500: '#475569',
      600: '#334155',
      700: '#1E293B',
      800: '#0F172A',
      900: '#050816',
      A100: '#1E2A4A',
      A200: '#162040',
      A400: '#0D1830',
      A700: '#050816'
    },
    text: {
      primary: `rgba(200, 215, 245, 0.92)`,
      secondary: `rgba(200, 215, 245, 0.68)`,
      disabled: `rgba(200, 215, 245, 0.38)`
    },
    divider: `rgba(0, 229, 255, 0.12)`,
    background: {
      paper: darkPaperBgColor,
      default: defaultBgColor()
    },
    action: {
      active: `rgba(200, 215, 245, 0.54)`,
      hover: `rgba(0, 229, 255, 0.06)`,
      selected: `rgba(0, 229, 255, 0.1)`,
      selectedOpacity: 0.1,
      disabled: `rgba(200, 215, 245, 0.26)`,
      disabledBackground: `rgba(200, 215, 245, 0.08)`,
      focus: `rgba(0, 229, 255, 0.12)`
    }
  }
}

export default DefaultPalette
