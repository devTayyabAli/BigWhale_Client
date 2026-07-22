// ** BIGWHALE — Capping Status Card
import { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import SocketContext from 'src/context/Socket'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'

const CappingStatusCard = ({ earnAmount = 0, cappingAmount = 0, cappingFormula, cappingPlanLabel }) => {
  const earn = Number(earnAmount || 0)
  const cap = Number(cappingAmount || 0)

  let rawPct = 0
  if (cap > 0) {
    rawPct = (earn / cap) * 100
  }

  // Clamped progress percentage for progress bar (0-100)
  const pct = Math.min(Math.max(rawPct, 0), 100)

  // Format percentage display gracefully (up to 2 decimals, preventing premature 100% rounding)
  const getFormattedPct = (val, isEarned = true) => {
    if (val <= 0) return '0'
    if (val >= 100 || (isEarned && cap > 0 && earn >= cap)) return '100'
    const rounded = Number(val.toFixed(2))
    if (isEarned && rounded >= 100 && earn < cap) return '99.99'
    return rounded.toString()
  }

  const displayPct = getFormattedPct(pct, true)
  const remainingPct = Math.max(0, 100 - pct)
  const displayRemaining = getFormattedPct(remainingPct, false)

  // Color based on progress
  const getColor = () => {
    if (pct >= 90) return { main: '#FF2E9F', glow: 'rgba(255,46,159,0.4)', bg: 'rgba(255,46,159,0.08)' }
    if (pct >= 60) return { main: '#F59E0B', glow: 'rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.08)' }
    return { main: '#00E5FF', glow: 'rgba(0,229,255,0.4)', bg: 'rgba(0,229,255,0.08)' }
  }
  const color = getColor()

  // Display label: prefer server-sent label ("Investor 2X" / "Networker 3X"),
  // fall back to raw formula number if label is not yet available.
  const planDisplay = cappingPlanLabel || (cappingFormula ? `${cappingFormula}X` : null)

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
          background: `linear-gradient(90deg, transparent, ${color.main}, transparent)`,
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40, height: 40, borderRadius: '10px',
                background: color.bg,
                border: `1px solid ${color.main}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon icon='tabler:chart-donut' style={{ color: color.main, fontSize: '1.2rem' }} />
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
              Capping Status
            </Typography>
          </Box>

          {cappingFormula && (
            <Box
              sx={{
                background: color.bg,
                border: `1px solid ${color.main}44`,
                borderRadius: '20px',
                px: 2, py: 0.5,
                fontSize: '0.78rem',
                fontWeight: 700,
                color: color.main,
                fontFamily: '"Orbitron", sans-serif',
              }}
            >
              {planDisplay}
            </Box>
          )}
        </Box>

        {/* Percentage display */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
          <Typography
            sx={{
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 800,
              fontSize: '2.5rem',
              color: color.main,
              lineHeight: 1,
              textShadow: `0 0 20px ${color.glow}`,
            }}
          >
            {displayPct}%
          </Typography>
          <Typography sx={{ color: 'rgba(200,215,245,0.4)', fontSize: '0.85rem' }}>
            earned
          </Typography>
        </Box>

        {/* Progress bar */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <LinearProgress
            variant='determinate'
            value={pct}
            sx={{
              height: '10px',
              borderRadius: '5px',
              background: 'rgba(200,215,245,0.08)',
              '& .MuiLinearProgress-bar': {
                borderRadius: '5px',
                background: `linear-gradient(90deg, ${color.main}, ${pct >= 60 ? '#FF2E9F' : '#A855F7'})`,
                boxShadow: `0 0 10px ${color.glow}`,
              },
            }}
          />
          {/* Glow dot at progress end */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: `${Math.min(pct, 97)}%`,
              transform: 'translate(-50%, -50%)',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: color.main,
              boxShadow: `0 0 8px ${color.glow}, 0 0 16px ${color.glow}`,
            }}
          />
        </Box>

        {/* Stats row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box
            sx={{
              flex: 1, mr: 1, p: 2, borderRadius: '10px',
              background: 'rgba(0,229,255,0.05)',
              border: '1px solid rgba(0,229,255,0.1)',
              textAlign: 'center',
            }}
          >
            <Typography sx={{ color: '#00E5FF', fontWeight: 700, fontSize: '1rem', fontFamily: '"Orbitron", sans-serif' }}>
              {displayPct}%
            </Typography>
            <Typography sx={{ color: 'rgba(200,215,245,0.45)', fontSize: '0.72rem', mt: 0.3 }}>
              Earned (${earn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1, ml: 1, p: 2, borderRadius: '10px',
              background: 'rgba(168,85,247,0.05)',
              border: '1px solid rgba(168,85,247,0.1)',
              textAlign: 'center',
            }}
          >
            <Typography sx={{ color: '#A855F7', fontWeight: 700, fontSize: '1rem', fontFamily: '"Orbitron", sans-serif' }}>
              {displayRemaining}%
            </Typography>
            <Typography sx={{ color: 'rgba(200,215,245,0.45)', fontSize: '0.72rem', mt: 0.3 }}>
              Cap Limit (${cap.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function CappingStatusWrapper() {
  const currentUser = useSelector(state => state?.getCurrentUser?.user?.data)
  const socket = useContext(SocketContext)
  const [earnAmount, setEarnAmount] = useState(0)
  const [cappingAmount, setCappingAmount] = useState(0)
  const [cappingFormula, setCappingFormula] = useState(null)
  const [cappingPlanLabel, setCappingPlanLabel] = useState(null)

  useEffect(() => {
    if (!socket || !currentUser?._id) return

    // ── Request fresh capping data from the server ─────────────────────
    const requestCapping = () => {
      socket.emit('capping', currentUser._id)
    }

    // ── Handle the response from the server ────────────────────────────
    const handleCappingAmount = ({ cappingAmount, earnAmount, cappingFormula, cappingPlanLabel }) => {
      setCappingFormula(cappingFormula)
      setCappingPlanLabel(cappingPlanLabel || (cappingFormula ? `${cappingFormula}X` : null))
      setEarnAmount(Number(earnAmount || 0))
      setCappingAmount(Number(cappingAmount || 0))
    }

    // ── Trigger 1: component mount — initial load ──────────────────────
    requestCapping()

    // ── Trigger 2: new stake confirmed on-chain ────────────────────────
    // Small delay so the server finishes activating the stake before we query.
    const handleStakeConfirmed = () => {
      setTimeout(requestCapping, 1500)
    }

    // ── Trigger 3: server cron saved a new staking reward for this user ─
    // Server emits "cappingUpdate" to the user's room after each reward save.
    // This is the main trigger that keeps the progress bar in sync with
    // the daily reward accumulation.
    const handleCappingUpdate = () => {
      requestCapping()
    }

    // ── Trigger 4: withdrawal completed — earnAmount resets ────────────
    const handleWithdrawal = () => {
      // Brief delay so the server finishes processing the withdrawal
      setTimeout(requestCapping, 1000)
    }

    // ── Trigger 5: periodic poll every 5 minutes ──────────────────────
    // Safety net for cases where a socket event is missed (reconnect, etc.)
    const pollInterval = setInterval(requestCapping, 5 * 60 * 1000)

    socket.on('cappingAmount', handleCappingAmount)
    socket.on('Stake', handleStakeConfirmed)
    socket.on('cappingUpdate', handleCappingUpdate)
    socket.on('Withdraw', handleWithdrawal)

    return () => {
      clearInterval(pollInterval)
      socket.off('cappingAmount', handleCappingAmount)
      socket.off('Stake', handleStakeConfirmed)
      socket.off('cappingUpdate', handleCappingUpdate)
      socket.off('Withdraw', handleWithdrawal)
    }
  }, [socket, currentUser?._id])

  return <CappingStatusCard earnAmount={earnAmount} cappingAmount={cappingAmount} cappingFormula={cappingFormula} cappingPlanLabel={cappingPlanLabel} />
}
