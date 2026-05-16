/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           BIGWHALE — Design Token System                     ║
 * ║   Futuristic · Crypto-Native · Deep Ocean · Web3             ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ── Primary Brand Colors ─────────────────────────────────────────────
export const BW_COLORS = {
  // Core palette
  deepSpaceBlack:  '#050816',
  oceanBlue:       '#00C2FF',
  electricCyan:    '#00E5FF',
  neonPurple:      '#A855F7',
  cosmicPink:      '#FF2E9F',
  whaleBlue:       '#1E3A8A',
  metallicSilver:  '#C0C7D1',
  whiteGlow:       '#F8FAFC',

  // Dark backgrounds
  bgPrimary:       '#050816',
  bgSecondary:     '#0D1224',
  bgTertiary:      '#0B1535',
  bgCard:          'rgba(13,18,36,0.85)',
  bgCardHover:     'rgba(13,18,36,0.92)',

  // Semantic
  success:         '#10B981',
  warning:         '#F59E0B',
  error:           '#FF2E9F',
  info:            '#00C2FF',

  // Text
  textPrimary:     '#F8FAFC',
  textSecondary:   'rgba(200,215,245,0.68)',
  textDisabled:    'rgba(200,215,245,0.38)',
  textMuted:       'rgba(200,215,245,0.45)',
}

// ── Gradients ────────────────────────────────────────────────────────
export const BW_GRADIENTS = {
  primary:         'linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)',
  secondary:       'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
  cosmic:          'linear-gradient(135deg, #00E5FF 0%, #A855F7 50%, #FF2E9F 100%)',
  ocean:           'linear-gradient(135deg, #1E3A8A 0%, #00C2FF 100%)',
  neon:            'linear-gradient(135deg, #00E5FF 0%, #A855F7 100%)',
  fire:            'linear-gradient(135deg, #FF2E9F 0%, #A855F7 100%)',
  success:         'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  warning:         'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  error:           'linear-gradient(135deg, #FF2E9F 0%, #CC0066 100%)',
  bgAnimated:      'linear-gradient(-45deg, #050816, #0D1224, #0B1535, #050816)',
  topBar:          'linear-gradient(90deg, #00E5FF, #A855F7, #FF2E9F)',
}

// ── Glassmorphism ────────────────────────────────────────────────────
export const BW_GLASS = {
  card: {
    background:         'rgba(13,18,36,0.85)',
    backdropFilter:     'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border:             '1px solid rgba(0,229,255,0.12)',
    borderRadius:       '16px',
  },
  cardHover: {
    borderColor:        'rgba(0,229,255,0.25)',
    boxShadow:          '0 8px 32px rgba(0,229,255,0.1)',
  },
  modal: {
    background:         'rgba(13,18,36,0.97)',
    backdropFilter:     'blur(24px)',
    border:             '1px solid rgba(0,229,255,0.15)',
    borderRadius:       '20px',
  },
  sidebar: {
    background:         'rgba(6,10,24,0.97)',
    backdropFilter:     'blur(20px)',
    borderRight:        '1px solid rgba(0,229,255,0.1)',
  },
}

// ── Glow Effects ─────────────────────────────────────────────────────
export const BW_GLOW = {
  cyan:    '0 0 15px rgba(0,229,255,0.4), 0 0 30px rgba(0,229,255,0.15)',
  purple:  '0 0 15px rgba(168,85,247,0.4), 0 0 30px rgba(168,85,247,0.15)',
  pink:    '0 0 15px rgba(255,46,159,0.4), 0 0 30px rgba(255,46,159,0.15)',
  green:   '0 0 15px rgba(16,185,129,0.4), 0 0 30px rgba(16,185,129,0.15)',
  cyanSm:  '0 0 8px rgba(0,229,255,0.4)',
  purpleSm:'0 0 8px rgba(168,85,247,0.4)',
  pinkSm:  '0 0 8px rgba(255,46,159,0.4)',
}

// ── Typography ───────────────────────────────────────────────────────
export const BW_FONTS = {
  display:  '"Orbitron", "Space Grotesk", sans-serif',
  body:     '"Space Grotesk", "Inter", sans-serif',
  mono:     '"Space Grotesk", "Fira Code", monospace',
}

// ── Border Radius ────────────────────────────────────────────────────
export const BW_RADIUS = {
  xs:   '6px',
  sm:   '8px',
  md:   '12px',
  lg:   '16px',
  xl:   '20px',
  xxl:  '24px',
  full: '9999px',
}

// ── Animations ───────────────────────────────────────────────────────
export const BW_TRANSITIONS = {
  fast:    'all 0.15s ease',
  normal:  'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  slow:    'all 0.4s ease',
  spring:  'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
}

// ── Z-Index ──────────────────────────────────────────────────────────
export const BW_Z = {
  base:    0,
  card:    1,
  dropdown: 100,
  sticky:  200,
  overlay: 300,
  modal:   400,
  toast:   500,
  tooltip: 600,
}

export default {
  colors:      BW_COLORS,
  gradients:   BW_GRADIENTS,
  glass:       BW_GLASS,
  glow:        BW_GLOW,
  fonts:       BW_FONTS,
  radius:      BW_RADIUS,
  transitions: BW_TRANSITIONS,
  zIndex:      BW_Z,
}
