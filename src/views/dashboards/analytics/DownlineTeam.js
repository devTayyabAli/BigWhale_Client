// ** BIGWHALE — Downline Team Card
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { kgcToUSDC } from 'src/constants/common'
import useGetUSDCTokens from 'src/hooks/useGetUSDCTokens'
import Icon from 'src/@core/components/icon'

const StatBox = ({ icon, label, value, color, loading }) => (
  <Box
    sx={{
      flex: 1,
      p: 2,
      borderRadius: '12px',
      background: `rgba(${color},0.06)`,
      border: `1px solid rgba(${color},0.15)`,
      textAlign: 'center',
      transition: 'all 0.3s ease',
      '&:hover': { background: `rgba(${color},0.1)`, borderColor: `rgba(${color},0.3)` },
    }}
  >
    <Icon icon={icon} style={{ color: `rgb(${color})`, fontSize: '1.3rem', marginBottom: 4 }} />
    {loading ? (
      <Skeleton variant='text' width={40} sx={{ mx: 'auto', background: `rgba(${color},0.1)` }} />
    ) : (
      <Typography sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 700, fontSize: '1.1rem', color: `rgb(${color})`, lineHeight: 1.2 }}>
        {value ?? 'N/A'}
      </Typography>
    )}
    <Typography sx={{ color: 'rgba(200,215,245,0.45)', fontSize: '0.7rem', mt: 0.3, fontWeight: 500 }}>
      {label}
    </Typography>
  </Box>
)

const DownlineTeam = () => {
  const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1)
  const [referralStats, setReferralStats] = useState(null)
  const referralStatsData = useSelector(state => state?.levelBonus?.referralStats)

  useEffect(() => {
    if (referralStatsData) setReferralStats(referralStatsData)
  }, [referralStatsData])

  const business = referralStats?.directDownlineBussiness && oneUSDC
    ? `$${kgcToUSDC(referralStats.directDownlineBussiness, oneUSDC)}`
    : '$0'

  return (
    <Card
      sx={{
        background: 'rgba(13,18,36,0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(168,85,247,0.12)',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #A855F7, #FF2E9F)',
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: '10px',
              background: 'rgba(168,85,247,0.1)',
              border: '1px solid rgba(168,85,247,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon icon='tabler:network' style={{ color: '#A855F7', fontSize: '1.2rem' }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#F8FAFC' }}>
              Downline Team
            </Typography>
            <Typography sx={{ color: 'rgba(200,215,245,0.4)', fontSize: '0.75rem' }}>
              Full network depth
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.2), transparent)', mb: 3 }} />

        {/* Stats grid */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
          <StatBox icon='tabler:hierarchy' label='Total' value={referralStats?.downlineReferral} color='168,85,247' loading={!referralStats} />
          <StatBox icon='tabler:user-check' label='Active' value={referralStats?.activeDownlineReferrals} color='16,185,129' loading={!referralStats} />
          <StatBox icon='tabler:user-x' label='Inactive' value={referralStats?.pendingDownlineReferrals} color='245,158,11' loading={!referralStats} />
        </Box>

        {/* Business row */}
        <Box
          sx={{
            p: 2.5, borderRadius: '12px',
            background: 'rgba(255,46,159,0.06)',
            border: '1px solid rgba(255,46,159,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Icon icon='tabler:trending-up' style={{ color: '#FF2E9F', fontSize: '1.1rem' }} />
            <Typography sx={{ color: 'rgba(200,215,245,0.6)', fontSize: '0.82rem', fontWeight: 500 }}>
              Total Business
            </Typography>
          </Box>
          {!referralStats ? (
            <Skeleton variant='text' width={70} sx={{ background: 'rgba(255,46,159,0.1)' }} />
          ) : (
            <Typography sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#FF2E9F' }}>
              {business}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default DownlineTeam
