// ** BIGWHALE — 500 Error Page
import Link from 'next/link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { keyframes } from '@emotion/react'

const pulseGlow = keyframes`
  0%,100% { text-shadow: 0 0 20px rgba(255,46,159,0.4); }
  50%      { text-shadow: 0 0 40px rgba(255,46,159,0.8), 0 0 80px rgba(255,46,159,0.3); }
`
const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`
const float = keyframes`
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-12px); }
`

const Error500 = () => {
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
          radial-gradient(ellipse at 70% 20%, rgba(255,46,159,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, rgba(168,85,247,0.05) 0%, transparent 50%)
        `,
        position: 'relative',
        overflow: 'hidden',
        p: 4,
      }}
    >
      {/* Grid bg */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,46,159,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,46,159,0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        zIndex: 0,
      }} />

      <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 600 }}>
        {/* 500 number */}
        <Typography
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 900,
            fontSize: { xs: '6rem', md: '10rem' },
            lineHeight: 1,
            background: 'linear-gradient(135deg, #FF2E9F 0%, #A855F7 50%, #00E5FF 100%)',
            backgroundSize: '200% 200%',
            animation: `${gradientShift} 4s ease infinite, ${pulseGlow} 3s ease-in-out infinite`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2,
          }}
        >
          500
        </Typography>

        {/* Floating icon */}
        <Box sx={{ fontSize: '3.5rem', mb: 3, display: 'inline-block', animation: `${float} 4s ease-in-out infinite` }}>
          ⚡
        </Box>

        <Typography
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 700,
            fontSize: { xs: '1.1rem', md: '1.5rem' },
            color: '#F8FAFC',
            mb: 2,
            letterSpacing: '0.05em',
          }}
        >
          Internal Server Error
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
          Something went wrong in the deep ocean.
          <br />
          Our whale engineers are on it. Please try again shortly.
        </Typography>

        <Box sx={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,46,159,0.4), rgba(168,85,247,0.4), transparent)',
          mb: 5, mx: 'auto', maxWidth: 300,
        }} />

        <Button
          href='/'
          component={Link}
          sx={{
            background: 'linear-gradient(135deg, #FF2E9F 0%, #A855F7 100%)',
            color: '#F8FAFC',
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.06em',
            borderRadius: '12px',
            px: 5, py: 1.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 0 24px rgba(255,46,159,0.55)',
              transform: 'translateY(-2px)',
              filter: 'brightness(1.1)',
            },
          }}
        >
          Return to Dashboard
        </Button>
      </Box>
    </Box>
  )
}

Error500.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Error500
