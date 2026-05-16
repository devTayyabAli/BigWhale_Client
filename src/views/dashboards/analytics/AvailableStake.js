// ** BIGWHALE — Token Balance Card
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import Divider from '@mui/material/Divider'
import { useAccount } from 'wagmi'
import { useSelector } from 'react-redux'
import { useContractRegister } from 'src/hooks/useContractRegister'
import { ENV } from 'src/configs/env'
import { formatNumber, toFixedDecimal } from 'src/constants/common'
import Icon from 'src/@core/components/icon'

const StatRow = ({ label, value, icon, color = '#00E5FF', loading }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 2.5,
      borderRadius: '12px',
      background: `rgba(${color === '#00E5FF' ? '0,229,255' : '168,85,247'},0.05)`,
      border: `1px solid rgba(${color === '#00E5FF' ? '0,229,255' : '168,85,247'},0.12)`,
      mb: 2,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        sx={{
          width: 36, height: 36, borderRadius: '8px',
          background: `rgba(${color === '#00E5FF' ? '0,229,255' : '168,85,247'},0.1)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon icon={icon} style={{ color, fontSize: '1.1rem' }} />
      </Box>
      <Typography sx={{ color: 'rgba(200,215,245,0.65)', fontSize: '0.82rem', fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
    {loading ? (
      <Skeleton variant='text' width={80} sx={{ background: 'rgba(0,229,255,0.08)' }} />
    ) : (
      <Typography
        sx={{
          fontFamily: '"Orbitron", sans-serif',
          fontWeight: 700,
          fontSize: '1.1rem',
          color,
        }}
      >
        {value}
      </Typography>
    )}
  </Box>
)

const AvailableStake = () => {
  const { address } = useAccount()
  const user = useSelector(state => state?.getCurrentUser?.user?.data)
  const { tokenBlnc: availableKGC } = useContractRegister(address)

  const openNewUrl = url => window.open(url, '_blank')

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
          background: 'linear-gradient(90deg, #A855F7, #00E5FF, #FF2E9F)',
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
            <Icon icon='tabler:chart-bar' style={{ color: '#A855F7', fontSize: '1.2rem' }} />
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
            Token Overview
          </Typography>
        </Box>

        {/* Stats */}
        <StatRow
          label='Total Stake (BW)'
          value={user?.totalStakeAmount ?? 0}
          icon='tabler:lock'
          color='#00E5FF'
          loading={user?.totalStakeAmount === undefined}
        />
        <StatRow
          label='BW Token Balance'
          value={availableKGC !== undefined ? formatNumber(availableKGC, toFixedDecimal) : 0}
          icon='tabler:coin'
          color='#A855F7'
          loading={availableKGC === undefined}
        />

        {/* Divider */}
        <Box sx={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.2), transparent)',
          my: 3,
        }} />

        {/* BSC Scan Button */}
        <Button
          fullWidth
          onClick={() => openNewUrl(ENV.bscScanUrl)}
          startIcon={<Icon icon='tabler:external-link' />}
          sx={{
            background: 'linear-gradient(135deg, rgba(0,229,255,0.1) 0%, rgba(168,85,247,0.1) 100%)',
            color: '#00E5FF',
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
            borderRadius: '12px',
            py: 1.5,
            border: '1px solid rgba(0,229,255,0.25)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(0,229,255,0.18) 0%, rgba(168,85,247,0.18) 100%)',
              borderColor: '#00E5FF',
              boxShadow: '0 0 16px rgba(0,229,255,0.25)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          View on BSC Scan
        </Button>
      </CardContent>
    </Card>
  )
}

export default AvailableStake
