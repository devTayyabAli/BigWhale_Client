// ** BIGWHALE — Token Audit Card
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import useGetKGCLiveTokens from 'src/hooks/useGetKGCLiveTokens'
import { formatNumber, toFixedDecimal } from 'src/constants/common'
import Icon from 'src/@core/components/icon'

const AuditButton = ({ label, icon, onClick, gradient, glow }) => (
  <Button
    fullWidth
    onClick={onClick}
    startIcon={<Icon icon={icon} />}
    sx={{
      mb: 2,
      py: 1.5,
      background: gradient,
      color: '#F8FAFC',
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
      fontSize: '0.875rem',
      borderRadius: '12px',
      border: 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: `0 0 20px ${glow}`,
        transform: 'translateY(-2px)',
        filter: 'brightness(1.1)',
      },
    }}
  >
    {label}
  </Button>
)

const TokenAudit = () => {
  const { kgcTokens: kgcLiveRate } = useGetKGCLiveTokens(1)

  const handleDownloadPlan = () => window.open('/assets/pdf/KGC.pdf', '_blank')

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
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            sx={{
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 800,
              fontSize: '1.3rem',
              letterSpacing: '0.08em',
              background: 'linear-gradient(135deg, #00E5FF, #A855F7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1,
            }}
          >
            BW TOKEN AUDITED
          </Typography>
          <Typography sx={{ color: 'rgba(200,215,245,0.45)', fontSize: '0.82rem', fontFamily: '"Space Grotesk", sans-serif' }}>
            Verified by CertiK Security Audit
          </Typography>
        </Box>

        {/* Live rate */}
        {kgcLiveRate && (
          <Box
            sx={{
              p: 2.5, mb: 4, borderRadius: '12px',
              background: 'rgba(0,229,255,0.05)',
              border: '1px solid rgba(0,229,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Icon icon='tabler:coin' style={{ color: '#00E5FF', fontSize: '1.3rem' }} />
              <Typography sx={{ color: 'rgba(200,215,245,0.6)', fontSize: '0.82rem', fontWeight: 500 }}>
                BW Live Rate
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#00E5FF',
              }}
            >
              {formatNumber(kgcLiveRate, toFixedDecimal) || 0} BW
            </Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <AuditButton
              label='Download Business Plan'
              icon='tabler:file-download'
              onClick={handleDownloadPlan}
              gradient='linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)'
              glow='rgba(0,229,255,0.4)'
            />
            <AuditButton
              label='View on CertiK'
              icon='tabler:shield-check'
              onClick={() => {}}
              gradient='linear-gradient(135deg, #A855F7 0%, #9333EA 100%)'
              glow='rgba(168,85,247,0.4)'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <AuditButton
              label='View on CoinMarketCap'
              icon='tabler:chart-line'
              onClick={() => {}}
              gradient='linear-gradient(135deg, #FF2E9F 0%, #CC0066 100%)'
              glow='rgba(255,46,159,0.4)'
            />
            <AuditButton
              label='Download Audit Report'
              icon='tabler:report'
              onClick={() => {}}
              gradient='linear-gradient(135deg, #10B981 0%, #059669 100%)'
              glow='rgba(16,185,129,0.4)'
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TokenAudit
