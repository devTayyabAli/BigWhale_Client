// ** BIGWHALE — User Profile Header
import { useState, useEffect, useContext } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import axios from 'axios'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { kycIno } from 'src/store/apps/kyc/getKYCInfoSlice'
import { capitalizeEachWord, findHighestRankTillSeven, kycStatus, ReconnectKycStatus, renderStars } from 'src/constants/common'
import { ENV } from 'src/configs/env'
import SocketContext from 'src/context/Socket'
import { keyframes } from '@emotion/react'

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`

const UserProfileHeader = ({ onRefresh, isRefreshing }) => {
  const router = useRouter()
  const [data, setData] = useState(null)
  const currentUser = useSelector(state => state?.getCurrentUser?.user?.data)
  const dispatch = useDispatch()
  const socket = useContext(SocketContext)
  const { kycInfo } = useSelector(state => state.kyc)
  const [referralStats, setReferralStats] = useState(null)
  const referralStatsData = useSelector(state => state?.levelBonus?.referralStats)
  const referralStatsStatus = useSelector(state => state?.levelBonus?.referralStatsStatus)
  const isStatsLoading = referralStatsStatus === 'loading'

  useEffect(() => {
    if (referralStatsData) setReferralStats(referralStatsData)
  }, [referralStatsData])

  useEffect(() => {
    axios.get('/pages/profile-header').then(res => setData(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (data !== null && currentUser?._id && (!currentUser?.kycStatus || ReconnectKycStatus.includes(currentUser?.kycStatus) || currentUser?.kycStatus === 'pending')) {
      loadBlockpassWidget()
    }
  }, [data, currentUser])

  const loadBlockpassWidget = () => {
    const blockpass = new window.BlockpassKYCConnect(ENV.kycClientId, { refId: currentUser?._id, email: currentUser?.email })
    blockpass.startKYCConnect()
    blockpass.on('KYCConnectSuccess', () => {})
  }

  useEffect(() => {
    if (currentUser && currentUser.kycStatus !== 'pending') dispatch(kycIno(currentUser?._id))
  }, [currentUser])

  useEffect(() => {
    if (socket && currentUser?._id) {
      socket?.emit('join', currentUser?._id)
      socket?.on('kycUpdated', () => { dispatch(kycIno(currentUser?._id)) })
      return () => { socket.emit('leave', currentUser?._id) }
    }
  }, [socket, currentUser?._id])

  const statusColor = () => {
    const s = currentUser?.status?.toLowerCase()
    if (s === 'active') return { color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' }
    if (s === 'inactive') return { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' }
    return { color: '#00E5FF', bg: 'rgba(0,229,255,0.12)', border: 'rgba(0,229,255,0.3)' }
  }
  const sc = statusColor()

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
      {/* Background glow overlay */}
      <Box
        sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,229,255,0.03) 0%, transparent 50%, rgba(168,85,247,0.03) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Refresh button in card header */}
      {onRefresh && (
        <Box
          component='button'
          onClick={onRefresh}
          disabled={isRefreshing}
          title='Refresh dashboard data'
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'rgba(13,18,36,0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,229,255,0.3)',
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            transition: 'all 0.3s ease',
            '&:hover:not(:disabled)': {
              background: 'rgba(0,229,255,0.15)',
              borderColor: '#00E5FF',
              boxShadow: '0 0 16px rgba(0,229,255,0.3)',
            },
            '&:disabled': {
              opacity: 0.6,
            },
          }}
        >
          {isRefreshing ? (
            <Skeleton variant='circular' width={16} height={16} sx={{ background: '#00E5FF' }} />
          ) : (
            <Icon icon='tabler:refresh' style={{ color: '#00E5FF', fontSize: '1.05rem' }} />
          )}
        </Box>
      )}

      <CardContent sx={{ p: { xs: 3, sm: 4 }, pr: onRefresh ? { xs: 7, sm: 8 } : { xs: 3, sm: 4 }, position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 3, md: 3 },
          }}
        >
          {/* Left: Avatar & Basic User Info */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 2.5,
              flex: 1,
              width: { xs: '100%', md: 'auto' },
            }}
          >
            {/* Avatar */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Avatar
                src={currentUser?.profilePicture}
                alt={currentUser?.name}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '18px',
                  border: '2px solid rgba(0,229,255,0.35)',
                  background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(168,85,247,0.2))',
                  color: '#00E5FF',
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 800,
                  fontSize: '1.6rem',
                  boxShadow: '0 0 20px rgba(0,229,255,0.15)',
                }}
              >
                {!currentUser?.profilePicture && currentUser?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              {/* Status Indicator Dot */}
              <Box
                sx={{
                  position: 'absolute', bottom: 2, right: 2,
                  width: 14, height: 14, borderRadius: '50%',
                  background: '#10B981',
                  border: '2px solid rgba(13,18,36,0.95)',
                  boxShadow: '0 0 8px rgba(16,185,129,0.7)',
                }}
              />
            </Box>

            {/* Info details */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', sm: 'flex-start' },
                gap: 1.5,
                flex: 1,
              }}
            >
              {/* Row 1: Name + Status chip + Stars */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <Typography
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    color: '#F8FAFC',
                    letterSpacing: '0.01em',
                  }}
                >
                  {capitalizeEachWord(currentUser?.name) || 'BIGWHALE User'}
                </Typography>

                {/* Status chip */}
                <Box
                  sx={{
                    background: sc.bg,
                    border: `1px solid ${sc.border}`,
                    borderRadius: '20px',
                    px: 1.5, py: 0.3,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: sc.color,
                    fontFamily: '"Space Grotesk", sans-serif',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {currentUser?.status || 'Active'}
                </Box>

                {isStatsLoading ? (
                  <Skeleton variant='rectangular' width={60} height={16} sx={{ borderRadius: '4px', background: 'rgba(200,215,245,0.1)' }} />
                ) : (
                  referralStats?.userRank > 0 && (
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      {renderStars(referralStats?.userRank || 0, 7)}
                    </Typography>
                  )
                )}
              </Box>

              {/* Row 2: Team Stats (Structured Info Chips) */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                }}
              >
                {[
                  { label: 'Direct Team', value: referralStats?.directReferral ?? 0, icon: 'tabler:users', color: '#00E5FF' },
                  { label: 'Downline', value: referralStats?.downlineReferral ?? 0, icon: 'tabler:hierarchy', color: '#A855F7' },
                  { label: 'User ID', value: currentUser?.userName || '—', icon: 'tabler:id', color: '#FF2E9F' },
                ].map((stat, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.5,
                      py: 0.6,
                      borderRadius: '10px',
                      background: 'rgba(200,215,245,0.04)',
                      border: '1px solid rgba(200,215,245,0.08)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <Icon icon={stat.icon} style={{ color: stat.color, fontSize: '0.9rem' }} />
                    <Typography sx={{ color: 'rgba(200,215,245,0.55)', fontSize: '0.78rem', fontWeight: 500, fontFamily: '"Space Grotesk", sans-serif' }}>
                      {stat.label}:
                    </Typography>
                    {isStatsLoading && stat.label !== 'User ID' ? (
                      <Skeleton variant='text' width={18} sx={{ background: 'rgba(200,215,245,0.1)' }} />
                    ) : (
                      <Typography sx={{ color: stat.color, fontSize: '0.82rem', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif' }}>
                        {stat.value}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right: Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', md: 'flex-end' },
              width: { xs: '100%', md: 'auto' },
              mt: { xs: 1, md: 0 },
            }}
          >
            <Button
              variant='outlined'
              startIcon={<Icon icon='tabler:edit' fontSize='1rem' />}
              onClick={() => router.push('/pages/account-settings/account/')}
              sx={{
                borderColor: 'rgba(0,229,255,0.35)',
                color: '#00E5FF',
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                fontSize: '0.82rem',
                borderRadius: '10px',
                py: 1,
                px: 2.2,
                whiteSpace: 'nowrap',
                '&:hover': {
                  borderColor: '#00E5FF',
                  background: 'rgba(0,229,255,0.08)',
                  boxShadow: '0 0 12px rgba(0,229,255,0.2)',
                },
              }}
            >
              Edit Profile
            </Button>
            <Button
              variant='outlined'
              id='blockpass-kyc-connect'
              startIcon={<Icon icon='tabler:shield-check' fontSize='1rem' />}
              disabled={!currentUser?._id}
              onClick={() => {
                if (kycInfo?.status && !ReconnectKycStatus.includes(currentUser?.kycStatus)) {
                  router.push('/kyc-details')
                }
              }}
              sx={{
                borderColor: 'rgba(168,85,247,0.35)',
                color: '#A855F7',
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                fontSize: '0.82rem',
                borderRadius: '10px',
                py: 1,
                px: 2.2,
                whiteSpace: 'nowrap',
                '&:hover': {
                  borderColor: '#A855F7',
                  background: 'rgba(168,85,247,0.08)',
                  boxShadow: '0 0 12px rgba(168,85,247,0.2)',
                },
                '&.Mui-disabled': {
                  borderColor: 'rgba(168,85,247,0.15)',
                  color: 'rgba(168,85,247,0.35)',
                },
              }}
            >
              {ReconnectKycStatus.includes(currentUser?.kycStatus)
                ? 'Re-Connect KYC'
                : kycInfo?.status
                ? 'KYC: ' + kycStatus[kycInfo?.status]
                : 'Connect KYC'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserProfileHeader
