// ** BIGWHALE — Available Balance Card
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import useGetUSDCTokens from 'src/hooks/useGetUSDCTokens'
import { ENV } from 'src/configs/env'
import Icon from 'src/@core/components/icon'

const AvailableBalance = () => {
  const theme = useTheme()
  const router = useRouter()

  const referralStatsData = useSelector(state => state?.levelBonus?.referralStats)
  const { tokenBlnc: availableBonusBalance } = useGetUSDCTokens(referralStatsData?.availableBonusBalance || 0)

  const openNewUrl = url => window.open(url, '_blank')

  const actions = [
    {
      label: 'Withdraw',
      icon: 'tabler:arrow-up-right',
      onClick: () => router.push('/withdrawal'),
      gradient: 'linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)',
      color: '#050816',
      glow: 'rgba(0,229,255,0.4)',
    },
    {
      label: 'Buy Package',
      icon: 'tabler:package',
      onClick: () => router.push('/stake'),
      gradient: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
      color: '#F8FAFC',
      glow: 'rgba(168,85,247,0.4)',
    },
    {
      label: 'BW Token',
      icon: 'tabler:coin',
      onClick: () => openNewUrl(`${ENV.etherScanUrl}/${ENV.kgcAddress}`),
      gradient: 'linear-gradient(135deg, #FF2E9F 0%, #CC0066 100%)',
      color: '#F8FAFC',
      glow: 'rgba(255,46,159,0.4)',
    },
  ]

  return (
    <Card
      sx={{
        background: 'rgba(13,18,36,0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,229,255,0.12)',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #00E5FF, #A855F7, #FF2E9F)',
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: '10px',
              background: 'rgba(0,229,255,0.1)',
              border: '1px solid rgba(0,229,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon icon='tabler:wallet' style={{ color: '#00E5FF', fontSize: '1.2rem' }} />
          </Box>
          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'rgba(200,215,245,0.7)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Available Bonus Balance
          </Typography>
        </Box>

        {/* Balance */}
        <Box sx={{ mb: 4 }}>
          {availableBonusBalance === undefined ? (
            <Skeleton
              variant='text'
              width={140}
              height={48}
              sx={{ background: 'rgba(0,229,255,0.08)', borderRadius: '8px' }}
            />
          ) : (
            <Typography
              sx={{
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 800,
                fontSize: '2.2rem',
                background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
              }}
            >
              ${availableBonusBalance}
            </Typography>
          )}
          <Typography sx={{ color: 'rgba(200,215,245,0.4)', fontSize: '0.78rem', mt: 0.5 }}>
            USDT equivalent
          </Typography>
        </Box>

        {/* Divider */}
        <Box sx={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.2), transparent)',
          mb: 3,
        }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {actions.map((action, i) => (
            <Button
              key={i}
              fullWidth
              onClick={action.onClick}
              startIcon={<Icon icon={action.icon} />}
              sx={{
                background: action.gradient,
                color: action.color,
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '0.04em',
                borderRadius: '12px',
                py: 1.5,
                border: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 0 20px ${action.glow}, 0 4px 15px ${action.glow}`,
                  transform: 'translateY(-2px)',
                  filter: 'brightness(1.1)',
                },
                '&:active': { transform: 'translateY(0)' },
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default AvailableBalance
