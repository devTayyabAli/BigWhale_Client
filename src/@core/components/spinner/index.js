// ** BIGWHALE — Fallback Spinner
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { keyframes } from '@emotion/react'
import Image from 'next/image'

const rotateOuter = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`
const rotateInner = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
`
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0,229,255,0.4), 0 0 40px rgba(0,229,255,0.15); }
  50%       { box-shadow: 0 0 40px rgba(0,229,255,0.7), 0 0 80px rgba(0,229,255,0.25); }
`
const fadeInUp = keyframes`
  0%   { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
`
const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const FallbackSpinner = ({ sx }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#050816',
        backgroundImage: `
          radial-gradient(ellipse at 70% 20%, rgba(0,229,255,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, rgba(168,85,247,0.05) 0%, transparent 50%)
        `,
        ...sx,
      }}
    >
      {/* Outer ring */}
      <Box sx={{ position: 'relative', width: 100, height: 100, mb: 4 }}>
        {/* Outer spinning ring */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#00E5FF',
            borderRightColor: 'rgba(0,229,255,0.3)',
            animation: `${rotateOuter} 1.2s linear infinite`,
          }}
        />
        {/* Middle spinning ring */}
        <Box
          sx={{
            position: 'absolute',
            inset: 10,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#A855F7',
            borderLeftColor: 'rgba(168,85,247,0.3)',
            animation: `${rotateInner} 0.9s linear infinite`,
          }}
        />
        {/* Inner spinning ring */}
        <Box
          sx={{
            position: 'absolute',
            inset: 20,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#FF2E9F',
            borderRightColor: 'rgba(255,46,159,0.3)',
            animation: `${rotateOuter} 0.7s linear infinite`,
          }}
        />
        {/* Center BW badge */}
        <Box
          sx={{
            position: 'absolute',
            inset: 28,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 60%, #FF2E9F 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 900,
            color: '#050816',
            fontFamily: '"Orbitron", sans-serif',
            animation: `${pulseGlow} 2s ease-in-out infinite`,
          }}
        >
          <Image src="/images/pages/pre-loader-new.png" alt="bw-logo" width="100" height="100" />

        </Box>
      </Box>

      {/* Brand name */}
      <Typography
        sx={{
          fontFamily: '"Orbitron", sans-serif',
          fontWeight: 800,
          fontSize: '1.4rem',
          letterSpacing: '0.15em',
          background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 50%, #FF2E9F 100%)',
          backgroundSize: '200% 200%',
          animation: `${gradientShift} 3s ease infinite, ${fadeInUp} 0.6s ease-out`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          mb: 1,
        }}
      >
        BIGWHALE
      </Typography>

      <Typography
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.72rem',
          letterSpacing: '0.25em',
          color: 'rgba(0,229,255,0.5)',
          textTransform: 'uppercase',
          animation: `${fadeInUp} 0.6s ease-out 0.1s both`,
        }}
      >
        Loading Ecosystem...
      </Typography>

      {/* Animated dots */}
      <Box sx={{ display: 'flex', gap: 1, mt: 3, animation: `${fadeInUp} 0.6s ease-out 0.2s both` }}>
        {[0, 1, 2].map(i => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#00E5FF',
              animation: `${pulseGlow} 1.2s ease-in-out ${i * 0.2}s infinite`,
              opacity: 0.7,
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default FallbackSpinner
