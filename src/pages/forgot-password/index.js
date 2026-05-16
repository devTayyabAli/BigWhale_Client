// ** BIGWHALE — Forgot Password Page
import Link from 'next/link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import { keyframes } from '@emotion/react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useDispatch } from 'react-redux'
import { forgetPasswordUser } from 'src/store/apps/auth/forgetPasswordSlice'
import { toast } from 'react-hot-toast'
import * as yup from 'yup'
import { useFormik } from 'formik'

const pulseGlow = keyframes`
  0%,100% { box-shadow: 0 0 20px rgba(0,229,255,0.4); }
  50%      { box-shadow: 0 0 40px rgba(0,229,255,0.7); }
`
const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
})

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: { maxWidth: 480 },
  [theme.breakpoints.up('lg')]: { maxWidth: 560 },
}))

const LinkStyled = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: '#00E5FF',
  fontFamily: '"Space Grotesk", sans-serif',
  fontWeight: 600,
  fontSize: '0.9rem',
  gap: '4px',
  transition: 'all 0.2s ease',
  '&:hover': { color: '#33EBFB', textShadow: '0 0 8px rgba(0,229,255,0.5)' },
})

const GlassCard = styled(Box)({
  background: 'rgba(13,18,36,0.88)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(0,229,255,0.15)',
  borderRadius: '24px',
  boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(0,229,255,0.06)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), rgba(168,85,247,0.4), transparent)',
  },
})

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: async values => {
      try {
        const response = await dispatch(forgetPasswordUser({ email: values.email }))
        if (response?.meta?.requestStatus === 'fulfilled') {
          const { message, status } = response.payload
          if (status === 200) {
            toast.success(message, { duration: 5000 })
            localStorage?.setItem('set-password', values?.email)
          }
        } else {
          toast.error('User does not exist!', { duration: 5000 })
        }
      } catch (error) {
        console.error('Forgot password error:', error)
      }
    },
  })

  return (
    <Box
      className='content-right'
      sx={{
        backgroundColor: '#050816',
        minHeight: '100vh',
        backgroundImage: `
          radial-gradient(ellipse at 80% 10%, rgba(0,229,255,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 10% 80%, rgba(168,85,247,0.05) 0%, transparent 50%)
        `,
      }}
    >
      {/* Left hero panel */}
      {!hidden && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #050816 0%, #0D1224 40%, #0B1535 100%)',
            borderRadius: '20px',
            margin: theme => theme.spacing(8, 0, 8, 8),
          }}
        >
          {/* Grid bg */}
          <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0 }} />
          <Box sx={{ position: 'absolute', top: '15%', right: '10%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
          <Box sx={{ position: 'absolute', bottom: '20%', left: '5%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />

          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: 6 }}>
            {/* Lock icon */}
            <Box
              sx={{
                width: 100, height: 100, borderRadius: '50%',
                background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 60%, #FF2E9F 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                animation: `${pulseGlow} 3s ease-in-out infinite`,
                boxShadow: '0 0 30px rgba(0,229,255,0.5)',
              }}
            >
              <Icon icon='tabler:lock-open' style={{ color: '#050816', fontSize: '2.5rem' }} />
            </Box>

            <Typography sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 900, fontSize: '2.2rem', letterSpacing: '0.12em', background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 50%, #FF2E9F 100%)', backgroundSize: '200% 200%', animation: `${gradientShift} 4s ease infinite`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', mb: 1 }}>
              BIGWHALE
            </Typography>
            <Typography sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 500, fontSize: '0.82rem', letterSpacing: '0.25em', color: 'rgba(0,229,255,0.6)', textTransform: 'uppercase', mb: 4 }}>
              Password Recovery
            </Typography>
            <Typography sx={{ color: 'rgba(200,215,245,0.5)', fontSize: '0.9rem', lineHeight: 1.7, fontFamily: '"Space Grotesk", sans-serif', maxWidth: 320, mx: 'auto' }}>
              Enter your registered email address and we'll send you a secure reset link.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Right form */}
      <RightWrapper>
        <Box sx={{ p: [6, 10], height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GlassCard sx={{ width: '100%', maxWidth: 420, p: { xs: 4, sm: 5 } }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 60%, #FF2E9F 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 0 20px rgba(0,229,255,0.4)',
                  animation: `${pulseGlow} 3s ease-in-out infinite`,
                }}
              >
                <Icon icon='tabler:lock-open' style={{ color: '#050816', fontSize: '1.6rem' }} />
              </Box>

              <Typography sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.08em', background: 'linear-gradient(135deg, #00E5FF, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', mb: 0.5 }}>
                Forgot Password?
              </Typography>
              <Typography sx={{ color: 'rgba(200,215,245,0.5)', fontSize: '0.82rem', fontFamily: '"Space Grotesk", sans-serif', lineHeight: 1.5 }}>
                Enter your email to receive reset instructions
              </Typography>
              <Box sx={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.3), transparent)', mt: 2 }} />
            </Box>

            <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <CustomTextField
                  fullWidth
                  label='Email Address'
                  placeholder='your@email.com'
                  {...formik.getFieldProps('email')}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Box>

              <Button
                fullWidth
                type='submit'
                sx={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)',
                  color: '#050816',
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.06em',
                  borderRadius: '12px',
                  py: 1.5,
                  mb: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #33EBFB 0%, #00E5FF 100%)',
                    boxShadow: '0 0 24px rgba(0,229,255,0.55)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Send Reset Link
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <LinkStyled href='/login'>
                  <Icon fontSize='1.1rem' icon='tabler:chevron-left' />
                  Back to Sign In
                </LinkStyled>
              </Box>
            </form>
          </GlassCard>
        </Box>
      </RightWrapper>
    </Box>
  )
}

ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true

export default ForgotPassword
