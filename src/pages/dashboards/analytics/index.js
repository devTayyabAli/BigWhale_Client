// ** BIGWHALE — Analytics Dashboard
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import { keyframes } from '@emotion/react'

import AnalyticsProject from 'src/views/dashboards/analytics/AnalyticsProject'
import RewardCard from './rewardCards'
import ReferralLinks from 'src/views/dashboards/analytics/referralLink'
import AvailableBalance from 'src/views/dashboards/analytics/AvailableBalance'
import AvailableStake from 'src/views/dashboards/analytics/AvailableStake'
import AccountDetails from 'src/views/dashboards/analytics/AccountDetails'
import DirectTeam from 'src/views/dashboards/analytics/DirectTeam'
import DownlineTeam from 'src/views/dashboards/analytics/DownlineTeam'
import CappingStatus from 'src/views/dashboards/analytics/CappingStatus'
import UserProfileHeader from 'src/views/pages/user-profile/UserProfileHeader'

import { getReferralStats } from 'src/store/apps/levelBonus/levelBonusSlice'
import { getNewsBanner } from 'src/store/apps/support/supportTicketsSlice'
import { capitalizeFirstLetter } from 'src/constants/common'
import { ENV } from 'src/configs/env'
import Icon from 'src/@core/components/icon'

const fadeInUp = keyframes`
  0%   { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
`

// ── News Banner ──────────────────────────────────────────────────────
const NewsBanner = ({ bannerURL, loading }) => (
  <Card
    sx={{
      background: 'rgba(13,18,36,0.85)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0,229,255,0.12)',
      borderRadius: '16px',
      overflow: 'hidden',
      position: 'relative',
      minHeight: bannerURL ? 'auto' : '180px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #00E5FF, #A855F7, #FF2E9F)',
      },
    }}
  >
    <CardContent sx={{ width: '100%', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {loading ? (
        <Skeleton variant='rectangular' width='100%' height={200} sx={{ borderRadius: '10px', background: 'rgba(0,229,255,0.06)' }} />
      ) : bannerURL ? (
        <img
          alt='News Banner'
          src={bannerURL}
          style={{ width: '100%', borderRadius: '10px', display: 'block' }}
        />
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Icon icon='tabler:news' style={{ color: 'rgba(0,229,255,0.3)', fontSize: '2.5rem', marginBottom: 12 }} />
          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              color: 'rgba(200,215,245,0.35)',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            No announcements at this time
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
)

// ── Section Header ───────────────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, mt: 1 }}>
    <Box
      sx={{
        width: 36, height: 36, borderRadius: '9px',
        background: 'rgba(0,229,255,0.1)',
        border: '1px solid rgba(0,229,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon icon={icon} style={{ color: '#00E5FF', fontSize: '1.1rem' }} />
    </Box>
    <Box>
      <Typography
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: '1rem',
          color: '#F8FAFC',
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ color: 'rgba(200,215,245,0.4)', fontSize: '0.75rem' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    <Box sx={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(0,229,255,0.2), transparent)', ml: 1 }} />
  </Box>
)

// ── Main Dashboard ───────────────────────────────────────────────────
const AnalyticsDashboard = () => {
  const dispatch = useDispatch()
  const { address } = useAccount()
  const currentUser = useSelector(state => state?.getCurrentUser?.user?.data)
  const { getNewsBannerValue, loading } = useSelector(state => state?.support)
  const referralStatsData = useSelector(state => state?.levelBonus?.referralStats)

  // ── Fetch guards: only fetch if data is not already loaded ────────
  // Prevents redundant API calls on every re-render / navigation
  const referralStatus = useSelector(state => state?.levelBonus?.referralStatsStatus)
  const bannerStatus = useSelector(state => state?.support?.bannerStatus)

  const bannerURL = getNewsBannerValue?.[0]?.picture?.[0]?.url

  useEffect(() => {
    // Only dispatch if not already loading or loaded
    if (referralStatus === 'idle') {
      dispatch(getReferralStats())
    }
  }, [dispatch, referralStatus])

  useEffect(() => {
    if (bannerStatus === 'idle') {
      dispatch(getNewsBanner())
    }
  }, [dispatch, bannerStatus])

  const rewards = useMemo(() => [
    {
      title: 'Account Status',
      worth: '',
      status: capitalizeFirstLetter(currentUser?.status) || 'N/A',
    },
    { title: 'Staking Bonus', worth: referralStatsData?.stakingRewardBonus || 0 },
    { title: 'Level Bonus', worth: referralStatsData?.referralLevelBonus || 0 },
    { title: 'Salary Bonus', worth: referralStatsData?.salaryBonus || 0 },
    { title: 'Instant Bonus', worth: referralStatsData?.instantRewardBonus || 0 },
    { title: 'Total Bonus', worth: referralStatsData?.totalBonus || 0 },
    { title: 'Total Withdrawal', worth: referralStatsData?.totalWithdrawal || 0 },
    { title: 'Available Balance', worth: referralStatsData?.availableBonusBalance || 0 },
  ], [referralStatsData, currentUser])

  return (
    <Box sx={{ animation: `${fadeInUp} 0.5s ease-out` }}>
      <Grid container spacing={4}>

        {/* Profile Header */}
        <Grid item xs={12}>
          <UserProfileHeader />
        </Grid>
        {/* Wallet & Token */}
        <Grid item xs={12}>
          <SectionHeader icon='tabler:wallet' title='Wallet & Tokens' subtitle='Manage your assets' />
        </Grid>
        <Grid item xs={12} md={5}>
          <AvailableBalance />
        </Grid>
        <Grid item xs={12} md={7}>
          <AvailableStake />
        </Grid>

        {/* Reward Stats */}
        <Grid item xs={12}>
          <SectionHeader icon='tabler:chart-bar' title='Portfolio Overview' subtitle='Your earnings at a glance' />
        </Grid>
        {rewards.map((reward, index) => (
          <Grid
            key={index}
            item xs={6} sm={4} md={3}
            sx={{ animation: `${fadeInUp} 0.5s ease-out ${index * 0.05}s both` }}
          >
            <RewardCard
              title={reward.title}
              worth={reward.worth}
              status={reward.status}
            />
          </Grid>
        ))}

        {/* News Banner */}
        <Grid item xs={12}>
          <SectionHeader icon='tabler:news' title='Announcements' subtitle='Latest BIGWHALE updates' />
          <NewsBanner bannerURL={bannerURL} loading={loading} />
        </Grid>

        {/* Capping Status */}
        <Grid item xs={12}>
          <SectionHeader icon='tabler:chart-donut' title='Capping Status' subtitle='Your reward cap progress' />
          <CappingStatus />
        </Grid>

        {/* Team Stats */}
        <Grid item xs={12}>
          <SectionHeader icon='tabler:users' title='Team Overview' subtitle='Your network performance' />
        </Grid>
        <Grid item xs={12} md={6} lg={5}>
          <DirectTeam />
        </Grid>
        <Grid item xs={12} md={6} lg={7}>
          <DownlineTeam />
        </Grid>




        {/* Referral Links */}
        <Grid item xs={12}>
          <SectionHeader icon='tabler:share' title='Referral Program' subtitle='Grow your network' />
          <ReferralLinks />
        </Grid>

        {/* Analytics Chart */}
        <Grid item xs={12}>
          <SectionHeader icon='tabler:chart-line' title='Analytics' subtitle='Performance metrics' />
          <AnalyticsProject />
        </Grid>

      </Grid>
    </Box>
  )
}

export default AnalyticsDashboard
