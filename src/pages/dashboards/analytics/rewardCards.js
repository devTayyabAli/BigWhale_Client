// ** BIGWHALE — Reward Stat Card
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import useGetUSDCTokens from 'src/hooks/useGetUSDCTokens'
import Icon from 'src/@core/components/icon'

// Map titles to icons and accent colors
const CARD_META = {
  'Account Status': { icon: 'tabler:user-check', color: '0,229,255', gradient: 'linear-gradient(135deg, #00E5FF, #00C2FF)' },
  'Staking Bonus': { icon: 'tabler:lock', color: '168,85,247', gradient: 'linear-gradient(135deg, #A855F7, #9333EA)' },
  'Level Bonus': { icon: 'tabler:hierarchy', color: '0,229,255', gradient: 'linear-gradient(135deg, #00E5FF, #A855F7)' },
  'Salary Bonus': { icon: 'tabler:trophy', color: '255,46,159', gradient: 'linear-gradient(135deg, #FF2E9F, #CC0066)' },
  'Instant Bonus': { icon: 'tabler:bolt', color: '245,158,11', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
  'Total Bonus': { icon: 'tabler:chart-bar', color: '16,185,129', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
  'Total Withdrawal': { icon: 'tabler:arrow-up-right', color: '0,194,255', gradient: 'linear-gradient(135deg, #00C2FF, #0891B2)' },
  'Available Balance': { icon: 'tabler:wallet', color: '0,229,255', gradient: 'linear-gradient(135deg, #00E5FF, #A855F7)' },
}

const getStatusColor = status => {
  if (!status) return '#00E5FF'
  const s = status.toLowerCase()
  if (s === 'active') return '#10B981'
  if (s === 'inactive' || s === 'pending') return '#F59E0B'
  if (s === 'banned' || s === 'blocked') return '#FF2E9F'
  return '#00E5FF'
}

const RewardCard = ({ title, status, worth, loading }) => {
  const { tokenBlnc: availableUSDC, isLoading, iserror } = useGetUSDCTokens(worth)
  const meta = CARD_META[title] || { icon: 'tabler:coin', color: '0,229,255', gradient: 'linear-gradient(135deg, #00E5FF, #A855F7)' }
  const isStatusCard = title === 'Account Status'
  const statusColor = getStatusColor(status)
  const isCardLoading = loading || isLoading

  return (
    <Card
      sx={{
        background: 'rgba(13,18,36,0.85)',
        backdropFilter: 'blur(20px)',
        border: `1px solid rgba(${meta.color},0.15)`,
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s ease',
        height: '100%',
        '&:hover': {
          borderColor: `rgba(${meta.color},0.3)`,
          boxShadow: `0 8px 32px rgba(${meta.color},0.12)`,
          transform: 'translateY(-2px)',
        },
        // Top accent bar
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: meta.gradient,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 600,
              fontSize: '0.78rem',
              color: 'rgba(200,215,245,0.55)',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </Typography>
          {/* Icon badge */}
          <Box
            sx={{
              width: 34, height: 34, borderRadius: '9px',
              background: `rgba(${meta.color},0.1)`,
              border: `1px solid rgba(${meta.color},0.2)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon icon={meta.icon} style={{ color: `rgb(${meta.color})`, fontSize: '1.1rem' }} />
          </Box>
        </Box>

        {/* Value */}
        {isStatusCard ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8, height: 8, borderRadius: '50%',
                background: statusColor,
                boxShadow: `0 0 6px ${statusColor}`,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: '1.2rem',
                color: statusColor,
              }}
            >
              {status || 'N/A'}
            </Typography>
          </Box>
        ) : isCardLoading ? (
          <Box>
            <Skeleton variant='text' width='70%' height={36} sx={{ background: `rgba(${meta.color},0.08)`, borderRadius: '6px' }} />
            <Skeleton variant='text' width='40%' height={20} sx={{ background: `rgba(${meta.color},0.05)`, borderRadius: '4px', mt: 0.5 }} />
          </Box>
        ) : iserror ? (
          <Typography sx={{ color: '#FF2E9F', fontWeight: 600, fontSize: '0.9rem' }}>
            Error loading
          </Typography>
        ) : (
          <Box>
            <Typography
              sx={{
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 800,
                fontSize: { xs: '1.3rem', md: '1.6rem' },
                background: meta.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
              }}
            >
              ${availableUSDC !== undefined && availableUSDC !== null && !isNaN(Number(availableUSDC))
                ? Number(Number(availableUSDC).toFixed(4)).toString()
                : availableUSDC ?? '0'}
            </Typography>
            <Typography sx={{ color: 'rgba(200,215,245,0.35)', fontSize: '0.7rem', mt: 0.5, fontFamily: '"Space Grotesk", sans-serif' }}>
              USDT equivalent
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default RewardCard
