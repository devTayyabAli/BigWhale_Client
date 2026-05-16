// ** BIGWHALE — Account Details Card
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'

const InfoRow = ({ icon, label, value, color = '#00E5FF' }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      py: 1.5,
      borderBottom: '1px solid rgba(0,229,255,0.06)',
      '&:last-child': { borderBottom: 'none' },
    }}
  >
    <Box
      sx={{
        width: 32, height: 32, borderRadius: '8px', flexShrink: 0,
        background: `rgba(${color === '#00E5FF' ? '0,229,255' : color === '#A855F7' ? '168,85,247' : '255,46,159'},0.1)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Icon icon={icon} style={{ color, fontSize: '0.95rem' }} />
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ color: 'rgba(200,215,245,0.45)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', mb: 0.2 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          color: '#F8FAFC',
          fontSize: '0.875rem',
          fontWeight: 600,
          fontFamily: '"Space Grotesk", sans-serif',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value || '—'}
      </Typography>
    </Box>
  </Box>
)

const AccountDetails = () => {
  const user = useSelector(state => state?.getCurrentUser?.user?.data)

  const walletShort = user?.walletAddress
    ? user.walletAddress.slice(0, 8) + '....' + user.walletAddress.slice(-6)
    : '—'

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
          background: 'linear-gradient(90deg, #00E5FF, #A855F7)',
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 44, height: 44, borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(168,85,247,0.15))',
              border: '1px solid rgba(0,229,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon icon='tabler:user-circle' style={{ color: '#00E5FF', fontSize: '1.4rem' }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                color: '#F8FAFC',
              }}
            >
              Account Details
            </Typography>
            <Typography sx={{ color: 'rgba(200,215,245,0.4)', fontSize: '0.75rem' }}>
              BIGWHALE Ecosystem
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.25), transparent)',
          mb: 2,
        }} />

        {/* Info rows */}
        <InfoRow icon='tabler:user' label='Full Name' value={user?.name} color='#00E5FF' />
        <InfoRow icon='tabler:id' label='User ID' value={user?.userName} color='#A855F7' />
        <InfoRow icon='tabler:mail' label='Email' value={user?.email} color='#00E5FF' />
        <InfoRow icon='tabler:wallet' label='Wallet Address' value={walletShort} color='#FF2E9F' />
      </CardContent>
    </Card>
  )
}

export default AccountDetails
