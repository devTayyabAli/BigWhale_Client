// ** BIGWHALE Typography System
// Primary: Space Grotesk (modern, crypto-native)
// Display: Orbitron (futuristic headings)
// Mono: Space Grotesk (data/numbers)

const Typography = {
  fontFamily: [
    '"Space Grotesk"',
    '"Inter"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),

  h1: {
    fontFamily: '"Orbitron", "Space Grotesk", sans-serif',
    fontWeight: 800,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  h2: {
    fontFamily: '"Orbitron", "Space Grotesk", sans-serif',
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.25,
    letterSpacing: '-0.005em',
  },
  h3: {
    fontFamily: '"Orbitron", "Space Grotesk", sans-serif',
    fontWeight: 700,
    fontSize: '1.625rem',
    lineHeight: 1.3,
    letterSpacing: '0',
  },
  h4: {
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 700,
    fontSize: '1.375rem',
    lineHeight: 1.35,
    letterSpacing: '0.005em',
  },
  h5: {
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: 1.4,
    letterSpacing: '0.005em',
  },
  h6: {
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 600,
    fontSize: '0.9375rem',
    lineHeight: 1.45,
    letterSpacing: '0.01em',
  },
  subtitle1: {
    fontWeight: 500,
    fontSize: '1rem',
    lineHeight: 1.5,
    letterSpacing: '0.01em',
  },
  subtitle2: {
    fontWeight: 500,
    fontSize: '0.875rem',
    lineHeight: 1.57,
    letterSpacing: '0.01em',
  },
  body1: {
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: 1.6,
    letterSpacing: '0.01em',
  },
  body2: {
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.6,
    letterSpacing: '0.01em',
  },
  button: {
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 600,
    fontSize: '0.9375rem',
    lineHeight: 1.71,
    letterSpacing: '0.04em',
    textTransform: 'none',
  },
  caption: {
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.5,
    letterSpacing: '0.03em',
  },
  overline: {
    fontFamily: '"Orbitron", sans-serif',
    fontWeight: 600,
    fontSize: '0.6875rem',
    lineHeight: 2.5,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
}

export default Typography
