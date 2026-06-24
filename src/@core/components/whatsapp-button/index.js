// ** MUI Imports
import Zoom from '@mui/material/Zoom'
import { styled } from '@mui/material/styles'
import useScrollTrigger from '@mui/material/useScrollTrigger'

// ** Redux
import { useSelector } from 'react-redux'

// ** Fallback from env (used only when DB value is not yet loaded)
import { ENV } from 'src/configs/env'

const ScrollToTopStyled = styled('div')(({ theme }) => ({
  zIndex: "2000",
  position: 'fixed',
  left: theme.spacing(10),
  bottom: theme.spacing(3),
  backgroundColor: "#25D366",
  padding: "10px",
  borderRadius: "20px",
  color: "#fff",
  display: 'flex',
  alignItems: "center",
  gap: "10px",
  fontSize: "18px",
  fontWeight: "700",
  cursor: "pointer"
}));


const WhatsAppButton = props => {
  // ** Props
  const { children, className } = props

  // ** Read live value from Redux (set by admin via bw-admin panel)
  // Fall back to NEXT_PUBLIC_WHATSAPP_NO env var if not yet loaded from DB
  const whatsappNumber = useSelector((state) => state?.settings?.whatsappNumber)
  const number = whatsappNumber || ENV.whatsappUrl

  // ** init trigger
  const trigger = useScrollTrigger({
    threshold: 400,
    disableHysteresis: true
  })

  const handleWhatsAppClick = () => {
    if (!number) return
    const url = `https://wa.me/${number}`
    window.open(url, '_blank')
  }

  // Don't render the button if no number is configured at all
  if (!number) return null

  return (
    <ScrollToTopStyled className={className} onClick={handleWhatsAppClick} role='presentation'>
      {children}
    </ScrollToTopStyled>
  )
}

export default WhatsAppButton
