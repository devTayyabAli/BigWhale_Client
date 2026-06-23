// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Badge from '@mui/material/Badge'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Box, Grid } from '@mui/material'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'

// ─── Styled close button ───────────────────────────────────────────────────────
const CustomCloseButton = styled(IconButton)(({ theme }) => ({
    top: 0,
    right: 0,
    color: 'grey.500',
    position: 'absolute',
    boxShadow: theme.shadows[2],
    transform: 'translate(10px, -10px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`,
    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    '&:hover': {
        transform: 'translate(7px, -5px)'
    }
}))

// ─── Status / Priority colour maps ────────────────────────────────────────────
const statusColors = {
    ToDo:      { bgColor: '#007bff', textColor: '#ffffff' },
    Pending:   { bgColor: '#fff9c4', textColor: '#f57f17' },
    Completed: { bgColor: '#28a745', textColor: '#ffffff' },
    Failed:    { bgColor: '#dc3545', textColor: '#ffffff' },
}

const priorityColors = {
    Low:            { bgColor: '#e0f7fa', textColor: '#00796b' },
    Medium:         { bgColor: '#fff9c4', textColor: '#f57f17' },
    Urgent:         { bgColor: '#ffe0b2', textColor: '#e65100' },
    'Critical Error':{ bgColor: '#ffccbc', textColor: '#c62828' },
}

// ─── Tiny chip helpers ─────────────────────────────────────────────────────────
const PriorityLabel = ({ priority }) => {
    const { bgColor, textColor } = priorityColors[priority] || { bgColor: '#e0e0e0', textColor: '#333' }
    return (
        <CustomChip
            color='success'
            sx={{ fontWeight: 600, borderRadius: 1, backgroundColor: bgColor, color: textColor, fontSize: 13 }}
            label={<span>{priority || 'N/A'}</span>}
        />
    )
}

const StatusLabel = ({ status }) => {
    const { bgColor, textColor } = statusColors[status] || { bgColor: '#e0e0e0', textColor: '#333' }
    return (
        <CustomChip
            skin='light'
            color='success'
            sx={{ fontWeight: 600, borderRadius: 1, backgroundColor: bgColor, color: textColor, fontSize: 13 }}
            label={<span>{status || 'N/A'}</span>}
        />
    )
}

// ─── URL helper: swap hard-coded prod host with the active API origin ──────────
const getMediaUrl = (url) => {
    if (!url) return ''
    const apiBaseUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL
    if (apiBaseUrl) {
        try {
            const origin = apiBaseUrl.startsWith('http')
                ? new URL(apiBaseUrl).origin
                : typeof window !== 'undefined'
                    ? window.location.origin
                    : ''
            if (origin) return url.replace(/https?:\/\/[^/]+/i, origin)
        } catch (e) {
            // ignore
        }
    }
    return url
}

// ─── Detail row ────────────────────────────────────────────────────────────────
const DetailRow = ({ label, value }) => (
    <Box>
        <Typography variant='caption' sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {label}
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.primary', mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {value || 'N/A'}
        </Typography>
    </Box>
)

// ─── Image slider ──────────────────────────────────────────────────────────────
const ImageSlider = ({ images, direction }) => {
    const [loaded, setLoaded] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [sliderRef, instanceRef] = useKeenSlider({
        rtl: direction === 'rtl',
        slideChanged(slider) { setCurrentSlide(slider.track.details.rel) },
        created() { setLoaded(true) },
    })

    if (!images?.length) return null
    return (
        <Box>
            <Typography variant='caption' sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1, display: 'block' }}>
                Images
            </Typography>
            <KeenSliderWrapper>
                <Box className='navigation-wrapper' sx={{ borderRadius: 2, overflow: 'hidden', background: theme => theme.palette.action.hover }}>
                    <Box
                        ref={sliderRef}
                        className='keen-slider'
                        sx={{ height: 260 }}
                    >
                        {images.map((item, index) => (
                            <Box
                                key={index}
                                className='keen-slider__slide'
                                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
                            >
                                <img
                                    src={getMediaUrl(item?.url)}
                                    alt={`Attachment ${index + 1}`}
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }}
                                />
                            </Box>
                        ))}
                    </Box>
                    {loaded && instanceRef.current && images.length > 1 && (
                        <>
                            <Icon
                                icon='tabler:chevron-left'
                                className={clsx('arrow arrow-left', { 'arrow-disabled': currentSlide === 0 })}
                                onClick={e => e.stopPropagation() || instanceRef.current?.prev()}
                            />
                            <Icon
                                icon='tabler:chevron-right'
                                className={clsx('arrow arrow-right', { 'arrow-disabled': currentSlide === images.length - 1 })}
                                onClick={e => e.stopPropagation() || instanceRef.current?.next()}
                            />
                        </>
                    )}
                </Box>
                {loaded && instanceRef.current && images.length > 1 && (
                    <Box className='swiper-dots' sx={{ mt: 2 }}>
                        {images.map((_, idx) => (
                            <Badge
                                key={idx}
                                variant='dot'
                                component='div'
                                className={clsx({ active: currentSlide === idx })}
                                onClick={() => instanceRef.current?.moveToIdx(idx)}
                            />
                        ))}
                    </Box>
                )}
            </KeenSliderWrapper>
        </Box>
    )
}

// ─── Video slider ──────────────────────────────────────────────────────────────
const VideoSlider = ({ videos, direction }) => {
    const [loaded, setLoaded] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [sliderRef, instanceRef] = useKeenSlider({
        rtl: direction === 'rtl',
        slideChanged(slider) { setCurrentSlide(slider.track.details.rel) },
        created() { setLoaded(true) },
    })

    if (!videos?.length) return null
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant='caption' sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1, display: 'block' }}>
                Videos
            </Typography>
            <KeenSliderWrapper>
                <Box className='navigation-wrapper' sx={{ borderRadius: 2, overflow: 'hidden', background: theme => theme.palette.action.hover }}>
                    <Box ref={sliderRef} className='keen-slider' sx={{ height: 240 }}>
                        {videos.map((item, index) => (
                            <Box
                                key={index}
                                className='keen-slider__slide'
                                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
                            >
                                <video
                                    controls
                                    src={getMediaUrl(item?.url)}
                                    muted
                                    loop
                                    style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }}
                                />
                            </Box>
                        ))}
                    </Box>
                    {loaded && instanceRef.current && videos.length > 1 && (
                        <>
                            <Icon
                                icon='tabler:chevron-left'
                                className={clsx('arrow arrow-left', { 'arrow-disabled': currentSlide === 0 })}
                                onClick={e => e.stopPropagation() || instanceRef.current?.prev()}
                            />
                            <Icon
                                icon='tabler:chevron-right'
                                className={clsx('arrow arrow-right', { 'arrow-disabled': currentSlide === videos.length - 1 })}
                                onClick={e => e.stopPropagation() || instanceRef.current?.next()}
                            />
                        </>
                    )}
                </Box>
                {loaded && instanceRef.current && videos.length > 1 && (
                    <Box className='swiper-dots' sx={{ mt: 2 }}>
                        {videos.map((_, idx) => (
                            <Badge
                                key={idx}
                                variant='dot'
                                component='div'
                                className={clsx({ active: currentSlide === idx })}
                                onClick={() => instanceRef.current?.moveToIdx(idx)}
                            />
                        ))}
                    </Box>
                )}
            </KeenSliderWrapper>
        </Box>
    )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function ViewTicket({ setOpen, open, direction, selectedTicket }) {
    const handleClose = () => setOpen(false)

    const images = selectedTicket?.media?.filter(item => item?.type === 'image') || []
    const videos = selectedTicket?.media?.filter(item => item?.type === 'video') || []
    const hasMedia = images.length > 0 || videos.length > 0

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth='md'
            aria-labelledby='view-ticket-dialog-title'
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
            {/* Title */}
            <DialogTitle id='view-ticket-dialog-title' sx={{ px: 6, py: 4 }}>
                <Typography variant='h6' component='span' sx={{ fontWeight: 700 }}>
                    View Ticket
                </Typography>
                <CustomCloseButton aria-label='close' onClick={handleClose}>
                    <Icon icon='tabler:x' fontSize='1.25rem' />
                </CustomCloseButton>
            </DialogTitle>

            <Divider />

            {/* Body */}
            <DialogContent sx={{ px: 6, py: 5 }}>
                <Grid container spacing={6}>

                    {/* ── Left: media ─────────────────────────────────── */}
                    {hasMedia && (
                        <Grid item xs={12} md={6}>
                            <ImageSlider images={images} direction={direction} />
                            <VideoSlider videos={videos} direction={direction} />
                        </Grid>
                    )}

                    {/* ── Right: details ──────────────────────────────── */}
                    <Grid item xs={12} md={hasMedia ? 6 : 12}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%' }}>

                            <Typography
                                variant='h6'
                                sx={{ fontWeight: 700, color: 'text.primary', pb: 2, borderBottom: 1, borderColor: 'divider' }}
                            >
                                Ticket Details
                            </Typography>

                            <DetailRow label='Username' value={selectedTicket?.userName} />
                            <DetailRow label='Subject'  value={selectedTicket?.subject} />
                            <DetailRow label='Description' value={selectedTicket?.description} />

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Typography variant='caption' sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: 70 }}>
                                    Priority
                                </Typography>
                                <PriorityLabel priority={selectedTicket?.priority} />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Typography variant='caption' sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: 70 }}>
                                    Status
                                </Typography>
                                <StatusLabel status={selectedTicket?.status} />
                            </Box>
                        </Box>
                    </Grid>

                </Grid>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 6, py: 3 }}>
                <Button variant='outlined' onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
