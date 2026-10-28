// ** BIGWHALE — 2X Fast-Track & Lifetime Salary Card
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'

const bodyText = {
  fontFamily: '"Space Grotesk", sans-serif',
}

const FastTrack2XCard = () => {
  const currentUser = useSelector(state => state?.getCurrentUser?.user?.data)
  const referralStats = useSelector(state => state?.levelBonus?.referralStats?.data)

  const is2XUnlocked = Boolean(currentUser?.is2XDailyUnlocked)
  // Directs that have actually STAKED (what unlocks 2X / ranks). Falls back to
  // active directs for older API responses.
  const stakedDirectCount = Number(
    referralStats?.fastTrackDirectCount ?? referralStats?.activeDirectReferrals ?? 0
  )
  // Every joined direct shows immediately (1, 2, 3...) even before they stake.
  const directCount = Math.max(
    stakedDirectCount,
    Number(referralStats?.directReferral || 0),
    Number(referralStats?.joinedDirectCount || 0)
  )
  const unusedDirects = Number(currentUser?.unusedDirectCount || 0)
  const currentRank = currentUser?.userRankId || null

  // Progress towards 5 directs to unlock 2X
  const unlockTarget = 5
  const unlockProgress = Math.min(100, Math.round((directCount / unlockTarget) * 100))

  // Rank Info Helper
  const getRankInfo = (rankId) => {
    switch (rankId) {
      case 7: return { title: 'Rank 7: BigWhale Legend', pct: '20%', next: null }
      case 6: return { title: 'Rank 6: Crown Leader', pct: '15%', next: '78,125' }
      case 5: return { title: 'Rank 5: Diamond Leader', pct: '11.5%', next: '15,625' }
      case 4: return { title: 'Rank 4: Platinum Leader', pct: '8.5%', next: '3,125' }
      case 3: return { title: 'Rank 3: Gold Leader', pct: '6%', next: '625' }
      case 2: return { title: 'Rank 2: Silver Leader', pct: '4%', next: '125' }
      case 1: return { title: 'Rank 1: Bronze Leader', pct: '2%', next: '25' }
      default: return { title: 'No Rank Yet', pct: '0%', next: '5' }
    }
  }

  const rankInfo = getRankInfo(currentRank)

  // Rolling 24h window since the last CONFIRMED withdrawal (matches server rule)
  const windowRemainingMs = (() => {
    if (!currentUser?.lastWithdrawalAt) return 0
    const elapsed = Date.now() - new Date(currentUser.lastWithdrawalAt).getTime()
    return Math.max(0, 24 * 60 * 60 * 1000 - elapsed)
  })()
  const isWithdrawalUsedToday = windowRemainingMs > 0
  const windowRemainingLabel = `${Math.floor(windowRemainingMs / 3600000)}h ${Math.ceil((windowRemainingMs % 3600000) / 60000)}m`

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(13,18,36,0.95), rgba(22,30,58,0.9))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,229,255,0.25)',
        boxShadow: '0 8px 32px 0 rgba(0, 229, 255, 0.12)',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #00E5FF, #A855F7, #10B981)',
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: '1 1 260px' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'rgba(0,229,255,0.12)',
                border: '1px solid rgba(0,229,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon icon='tabler:bolt' style={{ color: '#00E5FF', fontSize: '1.5rem' }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: '#FFFFFF',
                  letterSpacing: '0.04em',
                  lineHeight: 1.3,
                }}
              >
                2X FAST-TRACK VIRAL ENGINE
              </Typography>
              <Typography
                sx={{
                  ...bodyText,
                  color: 'rgba(200,215,245,0.72)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  lineHeight: 1.45,
                  mt: 0.4,
                }}
              >
                5 BW stake pays 10 BW once, 24h later. Salary comes from the 20% withdrawal fee.
              </Typography>
            </Box>
          </Box>

          {/* Status Badge */}
          <Chip
            icon={<Icon icon={is2XUnlocked ? 'tabler:check' : 'tabler:lock'} style={{ fontSize: '1rem', color: is2XUnlocked ? '#10B981' : '#FF9F43' }} />}
            label={is2XUnlocked ? '2X UNLOCKED' : '2X LOCKED'}
            sx={{
              fontWeight: 700,
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '0.8rem',
              background: is2XUnlocked ? 'rgba(16,185,129,0.15)' : 'rgba(255,159,67,0.15)',
              border: `1px solid ${is2XUnlocked ? 'rgba(16,185,129,0.4)' : 'rgba(255,159,67,0.4)'}`,
              color: is2XUnlocked ? '#10B981' : '#FF9F43',
              py: 0.5,
            }}
          />
        </Box>

        {/* 3 Metric Cards Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Box 1: 2X Unlock Progress */}
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 3,
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ ...bodyText, color: 'rgba(200,215,245,0.6)', fontSize: '0.75rem', fontWeight: 600 }}>
                  5 DIRECTS QUALIFICATION
                </Typography>
                <Icon icon='tabler:users' style={{ color: '#00E5FF', fontSize: '1.1rem' }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: is2XUnlocked ? '#10B981' : '#00E5FF',
                  mb: 1,
                }}
              >
                {directCount} / {unlockTarget} Directs
              </Typography>
              <LinearProgress
                variant='determinate'
                value={unlockProgress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  '& .MuiLinearProgress-bar': {
                    background: is2XUnlocked
                      ? 'linear-gradient(90deg, #10B981, #00E5FF)'
                      : 'linear-gradient(90deg, #FF9F43, #A855F7)',
                  },
                  mb: 1,
                }}
              />
              <Typography sx={{ ...bodyText, color: 'rgba(200,215,245,0.45)', fontSize: '0.7rem' }}>
                {is2XUnlocked
                  ? 'Qualified. Each 5 BW stake pays 10 BW after 24h'
                  : `${Math.max(0, unlockTarget - stakedDirectCount)} more staked directs to unlock 2X (${stakedDirectCount} staked so far)`}
              </Typography>
            </Box>
          </Grid>

          {/* Box 2: Withdrawal Readiness */}
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 3,
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ ...bodyText, color: 'rgba(200,215,245,0.6)', fontSize: '0.75rem', fontWeight: 600 }}>
                  UNUSED DIRECTS FOR WITHDRAWAL
                </Typography>
                <Icon icon='tabler:credit-card' style={{ color: '#A855F7', fontSize: '1.1rem' }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: unusedDirects > 0 ? '#10B981' : '#FF9F43',
                  mb: 1,
                }}
              >
                {unusedDirects} Available
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Icon
                  icon={unusedDirects > 0 ? 'tabler:circle-check' : 'tabler:alert-triangle'}
                  style={{ color: unusedDirects > 0 ? '#10B981' : '#FF9F43', fontSize: '0.9rem' }}
                />
                <Typography sx={{ ...bodyText, color: unusedDirects > 0 ? '#10B981' : '#FF9F43', fontSize: '0.72rem', fontWeight: 600 }}>
                  {unusedDirects > 0 ? '10 BW Withdrawal Ready' : '1 Joining Needed per 10 BW'}
                </Typography>
              </Box>
              <Typography sx={{ ...bodyText, color: 'rgba(200,215,245,0.45)', fontSize: '0.7rem' }}>
                Quota: {isWithdrawalUsedToday ? `Used — next in ${windowRemainingLabel}` : '1 × 10 BW available (per 24h)'}
              </Typography>
            </Box>
          </Grid>

          {/* Box 3: Lifetime Salary Rank */}
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 3,
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ ...bodyText, color: 'rgba(200,215,245,0.6)', fontSize: '0.75rem', fontWeight: 600 }}>
                  LIFETIME SALARY RANK
                </Typography>
                <Icon icon='tabler:crown' style={{ color: '#FFD700', fontSize: '1.1rem' }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#FFD700',
                  mb: 0.5,
                }}
              >
                {rankInfo.title}
              </Typography>
              <Typography sx={{ ...bodyText, color: '#00E5FF', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
                Pool share: {rankInfo.pct} of the withdrawal fee
              </Typography>
              <Typography sx={{ ...bodyText, color: 'rgba(200,215,245,0.45)', fontSize: '0.7rem' }}>
                {rankInfo.next
                  ? `Next Tier Target: ${rankInfo.next} Total Direct Members`
                  : '🏆 Maximum Rank Achieved!'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Button
            component={Link}
            href='/stake'
            variant='outlined'
            startIcon={<Icon icon='tabler:coin' />}
            sx={{
              borderColor: 'rgba(0,229,255,0.4)',
              color: '#00E5FF',
              ...bodyText,
              fontWeight: 700,
              borderRadius: '10px',
              px: 3,
              '&:hover': {
                borderColor: '#00E5FF',
                background: 'rgba(0,229,255,0.08)',
              },
            }}
          >
            Stake 5 BW Now
          </Button>

          <Button
            component={Link}
            href='/withdrawal'
            variant='outlined'
            startIcon={<Icon icon='tabler:crown' />}
            sx={{
              borderColor: 'rgba(255,215,0,0.55)',
              color: '#FFD700',
              ...bodyText,
              fontWeight: 700,
              borderRadius: '10px',
              px: 3,
              '&:hover': {
                borderColor: '#FFD700',
                background: 'rgba(255,215,0,0.08)',
              },
            }}
          >
            Withdraw Salary
          </Button>

          <Button
            component={Link}
            href='/withdrawal'
            variant='contained'
            startIcon={<Icon icon='tabler:wallet' />}
            disabled={unusedDirects < 1 || isWithdrawalUsedToday}
            sx={{
              background: 'linear-gradient(135deg, #00E5FF, #7367F0)',
              ...bodyText,
              color: '#FFFFFF',
              fontWeight: 700,
              borderRadius: '10px',
              px: 3,
              boxShadow: '0 4px 14px 0 rgba(0, 229, 255, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00C4DB, #5F52E6)',
              },
            }}
          >
            {isWithdrawalUsedToday
              ? `Next in ${windowRemainingLabel}`
              : unusedDirects < 1
              ? 'Join 1 Direct to Withdraw'
              : 'Withdraw 10 BW'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default FastTrack2XCard
