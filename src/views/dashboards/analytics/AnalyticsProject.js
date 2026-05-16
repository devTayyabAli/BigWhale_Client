// ** BIGWHALE — Level Bonus Table
import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { DataGrid } from '@mui/x-data-grid'
import { getLevelBonus } from 'src/store/apps/levelBonus/levelBonusSlice'
import { useDispatch, useSelector } from 'react-redux'
import { kgcToUSDC } from 'src/constants/common'
import useGetUSDCTokens from 'src/hooks/useGetUSDCTokens'
import Icon from 'src/@core/components/icon'

// ── Status Cell ──────────────────────────────────────────────────────
const StatusCell = ({ unlocked }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.8,
      px: 1.5, py: 0.5,
      borderRadius: '20px',
      background: unlocked ? 'rgba(16,185,129,0.12)' : 'rgba(255,46,159,0.12)',
      border: `1px solid ${unlocked ? 'rgba(16,185,129,0.3)' : 'rgba(255,46,159,0.3)'}`,
    }}
  >
    <Icon
      icon={unlocked ? 'tabler:lock-open' : 'tabler:lock'}
      style={{ color: unlocked ? '#10B981' : '#FF2E9F', fontSize: '0.9rem' }}
    />
    <Typography
      sx={{
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 700,
        fontSize: '0.72rem',
        color: unlocked ? '#10B981' : '#FF2E9F',
        letterSpacing: '0.05em',
      }}
    >
      {unlocked ? 'Unlocked' : 'Locked'}
    </Typography>
  </Box>
)

// ── Progress Cell ────────────────────────────────────────────────────
const ProgressCell = ({ percent }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
    <LinearProgress
      variant='determinate'
      value={percent}
      sx={{
        flex: 1,
        height: '6px',
        borderRadius: '3px',
        background: 'rgba(0,229,255,0.1)',
        '& .MuiLinearProgress-bar': {
          borderRadius: '3px',
          background: 'linear-gradient(90deg, #00E5FF, #A855F7)',
          boxShadow: '0 0 6px rgba(0,229,255,0.4)',
        },
      }}
    />
    <Typography
      sx={{
        fontFamily: '"Orbitron", sans-serif',
        fontWeight: 700,
        fontSize: '0.82rem',
        color: '#00E5FF',
        minWidth: '40px',
        textAlign: 'right',
      }}
    >
      {percent}%
    </Typography>
  </Box>
)

// ── Columns ──────────────────────────────────────────────────────────
const columns = [
  {
    flex: 0.08, minWidth: 70, field: 'serialno', headerName: 'SR.',
    renderCell: ({ row }) => (
      <Typography sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#00E5FF' }}>
        {row?.id}
      </Typography>
    ),
  },
  {
    flex: 0.1, minWidth: 80, field: 'level', headerName: 'LEVEL',
    renderCell: ({ row }) => (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.5, py: 0.4, borderRadius: '8px', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)' }}>
        <Typography sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#A855F7' }}>
          {row?.level}
        </Typography>
      </Box>
    ),
  },
  {
    flex: 0.25, minWidth: 180, field: 'referral', headerName: 'REQUIRED ACTIVE REFERRALS',
    renderCell: ({ row }) => (
      <Typography sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: '0.875rem', color: 'rgba(200,215,245,0.82)' }}>
        {row?.referral}
      </Typography>
    ),
  },
  {
    flex: 0.3, minWidth: 200, field: 'percent', headerName: 'STAKING REWARD (%)',
    renderCell: ({ row }) => <ProgressCell percent={row?.percent} />,
  },
  {
    flex: 0.15, minWidth: 120, sortable: false, field: 'status', headerName: 'STATUS',
    renderCell: ({ row }) => <StatusCell unlocked={row?.status} />,
  },
]

// ── Info Row ─────────────────────────────────────────────────────────
const InfoRow = ({ label, value, icon, color = '#00E5FF' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, borderBottom: '1px solid rgba(0,229,255,0.06)', '&:last-child': { borderBottom: 'none' } }}>
    <Icon icon={icon} style={{ color, fontSize: '0.9rem', flexShrink: 0 }} />
    <Typography sx={{ color: 'rgba(200,215,245,0.5)', fontSize: '0.8rem', fontWeight: 500, minWidth: 180 }}>
      {label}
    </Typography>
    <Typography sx={{ color: '#F8FAFC', fontSize: '0.875rem', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}>
      {value || '—'}
    </Typography>
  </Box>
)

// ── Main Component ───────────────────────────────────────────────────
const AnalyticsProject = () => {
  const dispatch = useDispatch()
  const levelBonusData = useSelector(state => state?.levelBonus?.levelBonus)
  const currentUser = useSelector(state => state?.getCurrentUser?.user?.data)
  const [levelBonus, setLevelBonus] = useState(null)
  const [nextUnlockLevel, setNextUnlockLevel] = useState('')
  const [formattedData, setFormattedData] = useState([])
  const [formattedDirectBusiness, setFormattedDirectBusiness] = useState(null)
  const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1)

  useEffect(() => {
    if (levelBonusData?.incomeLevelBonus?.length > 0) {
      let nextUnlock = ''
      setFormattedData(levelBonusData.incomeLevelBonus.map((item, index) => {
        const isL2Unlocked = levelBonusData?.unLock?.isUnlock === true && item?.title === 'L2'
        const response = {
          id: index + 1,
          serialno: index + 1,
          level: item?.title,
          referral: item?.minimumRequiredReferrals,
          percent: isL2Unlocked ? item?.maximumRewardPercentage : item?.minimumRewardPercentage,
          status: isL2Unlocked ? true : item?.unlocked,
        }
        if (!nextUnlock && ((!levelBonusData?.unLock?.isUnlock && item?.title === 'L2') || (item?.title !== 'L2' && !response?.status))) {
          nextUnlock = item?.title
        }
        return response
      }))
      setNextUnlockLevel(nextUnlock)
      setLevelBonus(levelBonusData)
    }
  }, [levelBonusData])

  useEffect(() => {
    if (levelBonus?.unLock?.directBusinessIn30Days) {
      const [obtain, total] = levelBonus.unLock.directBusinessIn30Days.split('/')
      const obtainUSDC = kgcToUSDC(obtain, oneUSDC)
      const totalUSDC = kgcToUSDC(total, oneUSDC)
      setFormattedDirectBusiness(`$${obtainUSDC} / $${totalUSDC}`)
    }
  }, [levelBonus, oneUSDC])

  const levelBonusStatus = useSelector(state => state?.levelBonus?.levelBonusStatus)

  useEffect(() => {
    if (levelBonusStatus === 'idle') {
      dispatch(getLevelBonus())
    }
  }, [dispatch, levelBonusStatus])

  const showUnlockInfo = nextUnlockLevel === 'L2' && !levelBonus?.unLock?.isUnlock

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
          <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon='tabler:hierarchy' style={{ color: '#00E5FF', fontSize: '1.2rem' }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#F8FAFC' }}>
              Level Bonus Unlock Conditions
            </Typography>
            <Typography sx={{ color: 'rgba(200,215,245,0.4)', fontSize: '0.75rem' }}>
              Your referral level progress
            </Typography>
          </Box>
        </Box>

        {/* User info */}
        <Box
          sx={{
            p: 2.5, mb: 3, borderRadius: '12px',
            background: 'rgba(0,229,255,0.04)',
            border: '1px solid rgba(0,229,255,0.1)',
          }}
        >
          <InfoRow icon='tabler:id' label='User ID' value={currentUser?._id} color='#00E5FF' />
          <InfoRow icon='tabler:user' label='Username' value={currentUser?.userName} color='#A855F7' />

          {showUnlockInfo && (
            <>
              <InfoRow icon='tabler:calendar' label='Activation Date' value={levelBonus?.unLock?.activationDate ? new Date(levelBonus.unLock.activationDate).toLocaleDateString() : 'N/A'} color='#F59E0B' />
              <InfoRow icon='tabler:users' label='Direct Active Referrals' value={levelBonus?.unLock?.directActiveReferrals} color='#10B981' />
              <InfoRow icon='tabler:hierarchy' label='All Active Referrals' value={levelBonus?.unLock?.allActiveReferrals} color='#00C2FF' />
              <InfoRow icon='tabler:trending-up' label='Direct Business (30 days)' value={formattedDirectBusiness} color='#FF2E9F' />
            </>
          )}
        </Box>
      </CardContent>

      {/* DataGrid */}
      <DataGrid
        autoHeight
        rows={formattedData}
        rowHeight={58}
        columns={columns}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        rowCount={levelBonus?.incomeLevelBonus?.length || 0}
        sx={{
          border: 'none',
          borderTop: '1px solid rgba(0,229,255,0.1)',
          '& .MuiDataGrid-columnHeaders': {
            background: 'rgba(0,229,255,0.05)',
            borderBottom: '1px solid rgba(0,229,255,0.15)',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            color: '#00E5FF',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(0,229,255,0.06)',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-row:hover': {
            background: 'rgba(0,229,255,0.04)',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid rgba(0,229,255,0.1)',
            background: 'rgba(0,229,255,0.02)',
          },
        }}
      />
    </Card>
  )
}

export default AnalyticsProject
