// ** BIGWHALE — Mode Toggler
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

const ModeToggler = ({ settings, saveSettings }) => {
  const handleModeToggle = () => {
    saveSettings({ ...settings, mode: settings.mode === 'light' ? 'dark' : 'light' })
  }

  return (
    <IconButton
      aria-haspopup='true'
      onClick={handleModeToggle}
      sx={{
        color: 'rgba(0,229,255,0.7)',
        transition: 'all 0.2s ease',
        '&:hover': {
          color: '#00E5FF',
          background: 'rgba(0,229,255,0.08)',
          boxShadow: '0 0 12px rgba(0,229,255,0.2)',
        },
      }}
    >
      <Icon
        fontSize='1.4rem'
        icon={settings.mode === 'dark' ? 'tabler:sun' : 'tabler:moon-stars'}
      />
    </IconButton>
  )
}

export default ModeToggler
