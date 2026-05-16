// ** BIGWHALE — 404 Page
import Link from 'next/link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { keyframes } from '@emotion/react'

const float = keyframes`
  0%,100% { transform: translateY(0px) rotate(-2deg); }
  50%      { transform: translateY(-16px) rotate(2deg); }
`
const pulseGlow = keyframes`
  0%,100% { text-shadow: 0 0 20px rgba(0,229,255,0.4); }
  50%      { text-shadow: 0 0 40px rgba(0,229,255,0.8), 0 0 80px rgba(0,229,255,0.3); }
`
const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const Error404 = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050816',
        backgroundImage: `
          radial-gradient(ellipse at 70% 20%, rgba(0,229,255,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, rgba(168,85,247,0.05) 0%, transparent 50%)
        `,
        position: 'relative',
        overflow: 'hidden',
        p: 4,
      }}
    >
      {/* Grid background */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        zIndex: 0,
      }} />

      <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 600 }}>
        {/* 404 number */}
        <Typography
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 900,
            fontSize: { xs: '6rem', md: '10rem' },
            lineHeight: 1,
            background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 50%, #FF2E9F 100%)',
            backgroundSize: '200% 200%',
            animation: `${gradientShift} 4s ease infinite, ${pulseGlow} 3s ease-in-out infinite`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2,
          }}
        >
          404
        </Typography>

        {/* Whale emoji floating */}
        <Box
          sx={{
            fontSize: '4rem',
            mb: 3,
            display: 'inline-block',
            animation: `${float} 4s ease-in-out infinite`,
          }}
        >
          🐋
        </Box>

        <Typography
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 700,
            fontSize: { xs: '1.2rem', md: '1.6rem' },
            color: '#F8FAFC',
            mb: 2,
            letterSpacing: '0.05em',
          }}
        >
          Lost in the Deep Ocean
        </Typography>

        <Typography
          sx={{
            color: 'rgba(200,215,245,0.55)',
            fontSize: '1rem',
            mb: 5,
            lineHeight: 1.7,
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          The page you're looking for has drifted into the cosmic depths.
          <br />
          Let's navigate you back to safety.
        </Typography>

        {/* Glowing divider */}
        <Box sx={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.4), rgba(168,85,247,0.4), transparent)',
          mb: 5,
          mx: 'auto',
          maxWidth: 300,
        }} />

        <Button
          href='/'
          component={Link}
          sx={{
            background: 'linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)',
            color: '#050816',
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.06em',
            borderRadius: '12px',
            px: 5,
            py: 1.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #33EBFB 0%, #00E5FF 100%)',
              boxShadow: '0 0 24px rgba(0,229,255,0.55), 0 6px 20px rgba(0,229,255,0.3)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Return to Dashboard
        </Button>

        {/* Decorative orbs */}
        <Box sx={{ position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }} />
        <Box sx={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }} />
      </Box>
    </Box>
  )
}

Error404.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Error404
