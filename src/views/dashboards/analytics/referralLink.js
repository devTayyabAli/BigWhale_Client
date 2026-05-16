// ** BIGWHALE — Referral Links Card
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { ENV } from 'src/configs/env'
import { useSelector } from 'react-redux'
import CustomTextFieldWithButton from 'src/@core/components/mui/text-field-button'
import Icon from 'src/@core/components/icon'

const ReferralLinks = () => {
  const [referralValue, setReferralValue] = useState('')
  const user = useSelector(state => state?.getCurrentUser?.user?.data)

  useEffect(() => {
    if (user?._id) {
      setReferralValue(`${ENV?.frontendBaseUrl}/signup?referral_id=${user?.userName}`)
    }
  }, [user])

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
          background: 'linear-gradient(90deg, #FF2E9F, #A855F7, #00E5FF)',
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: '10px',
              background: 'rgba(255,46,159,0.1)',
              border: '1px solid rgba(255,46,159,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon icon='tabler:share' style={{ color: '#FF2E9F', fontSize: '1.2rem' }} />
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
              Referral Links
            </Typography>
            <Typography sx={{ color: 'rgba(200,215,245,0.45)', fontSize: '0.78rem' }}>
              Invite friends &amp; earn rewards
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,46,159,0.3), transparent)',
          mb: 3,
        }} />

        {/* Referral link */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Icon icon='tabler:link' style={{ color: '#FF2E9F', fontSize: '0.9rem' }} />
            <Typography sx={{ color: 'rgba(200,215,245,0.6)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Your Referral Link
            </Typography>
          </Box>
          <CustomTextFieldWithButton
            disabled
            fullWidth
            value={referralValue}
            placeholder='Referral Link'
          />
        </Box>

        {/* Contract address */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Icon icon='tabler:file-code' style={{ color: '#A855F7', fontSize: '0.9rem' }} />
            <Typography sx={{ color: 'rgba(200,215,245,0.6)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              BW Smart Contract
            </Typography>
          </Box>
          <CustomTextFieldWithButton
            disabled
            fullWidth
            value={ENV?.dashboardKGCAddress}
            placeholder='BW Smart Contract Address'
          />
        </Box>

        {/* Info note */}
        <Box
          sx={{
            mt: 3, p: 2, borderRadius: '10px',
            background: 'rgba(0,229,255,0.04)',
            border: '1px solid rgba(0,229,255,0.1)',
            display: 'flex', alignItems: 'flex-start', gap: 1.5,
          }}
        >
          <Icon icon='tabler:info-circle' style={{ color: '#00E5FF', fontSize: '1rem', flexShrink: 0, marginTop: 2 }} />
          <Typography sx={{ color: 'rgba(200,215,245,0.5)', fontSize: '0.78rem', lineHeight: 1.5 }}>
            Share your referral link to earn instant bonuses and leadership rewards when your team grows.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ReferralLinks
