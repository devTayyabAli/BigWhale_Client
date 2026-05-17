// ** BIGWHALE — Signup Page
import { useEffect, useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSettings } from 'src/@core/hooks/useSettings.js'
import { registerUser, completeSignup, resetSignupState } from 'src/store/apps/auth/signupSlice'
import { completeRegister } from 'src/store/apps/transaction/completeTransactionEvents'
import { styled, useTheme } from '@mui/material/styles'
import { CHECK_USERNAME_OR_EMAIL } from 'src/api/apiEndPoint'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import CustomTextField from 'src/@core/components/mui/text-field'
import SocketContext from 'src/context/Socket'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useContractWrite, useDisconnect, useWaitForTransaction } from 'wagmi'
import { ethers } from 'ethers'
import { CONTRACT_INFO } from 'src/contract'
import { useSwitchNetwork } from 'wagmi'
import useValidateAccount from 'src/hooks/useValidateAccount'
import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import api from 'src/api/api'
import { ENV } from 'src/configs/env'
import { GET_REFERRAL_DETAIL_ENDPOINT } from 'src/api/apiEndPoint'
import { toast } from 'react-hot-toast'
import { useContractRegister } from 'src/hooks/useContractRegister'
import useGetRegisterUSDCTokens from 'src/hooks/useGetRegisterUSDCTokens'
import { createTxLog } from 'src/store/apps/transaction/transactionLogsSlice'
import { deletePendingUser } from 'src/store/apps/auth/signupSlice'
import isMobile from 'is-mobile'
import NetworkSelector from 'src/views/components/choose-network-modal'
import { keyframes } from '@emotion/react'
import Image from 'next/image'

// ── Animations ──────────────────────────────────────────────────────
const pulseGlow = keyframes`
  0%,100% { box-shadow: 0 0 20px rgba(0,229,255,0.4); }
  50%      { box-shadow: 0 0 40px rgba(0,229,255,0.7); }
`
const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

// ── Styled ───────────────────────────────────────────────────────────
const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: { maxWidth: 480 },
  [theme.breakpoints.up('lg')]: { maxWidth: 560 },
  [theme.breakpoints.up('xl')]: { maxWidth: 640 },
}))

const LinkStyled = styled(Link)({
  textDecoration: 'none',
  color: '#00E5FF',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  '&:hover': { color: '#33EBFB', textShadow: '0 0 8px rgba(0,229,255,0.5)' },
})

const GlassCard = styled(Box)({
  background: 'rgba(13,18,36,0.88)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(0,229,255,0.15)',
  borderRadius: '24px',
  boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(0,229,255,0.06)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), rgba(168,85,247,0.5), transparent)',
  },
})

const NeonButton = styled(Button)({
  background: 'linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)',
  color: '#050816',
  fontFamily: '"Space Grotesk", sans-serif',
  fontWeight: 700,
  fontSize: '0.95rem',
  letterSpacing: '0.06em',
  borderRadius: '12px',
  padding: '12px 24px',
  border: 'none',
  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #33EBFB 0%, #00E5FF 100%)',
    boxShadow: '0 0 24px rgba(0,229,255,0.55), 0 6px 20px rgba(0,229,255,0.3)',
    transform: 'translateY(-2px)',
  },
  '&:active': { transform: 'translateY(0)' },
  '&.Mui-disabled': { background: 'rgba(0,229,255,0.15)', color: 'rgba(0,229,255,0.4)' },
})

const OutlineButton = styled(Button)({
  background: 'transparent',
  color: '#00E5FF',
  fontFamily: '"Space Grotesk", sans-serif',
  fontWeight: 600,
  fontSize: '0.9rem',
  borderRadius: '12px',
  padding: '11px 24px',
  border: '1px solid rgba(0,229,255,0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(0,229,255,0.08)',
    borderColor: '#00E5FF',
    boxShadow: '0 0 16px rgba(0,229,255,0.25)',
    transform: 'translateY(-1px)',
  },
})

// ── Validation ───────────────────────────────────────────────────────
const validationSchema = Yup.object().shape({
  referredBy: Yup.string().required('Referral ID is required').test('no-space', 'No spaces allowed', v => !v || !/\s/.test(v)),
  name: Yup.string().matches(/^[^\s].*$/, 'Cannot start with space').max(64).required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  userName: Yup.string().required('User ID is required').max(64).test('no-space', 'No spaces allowed', v => !v || !/\s/.test(v)),
  password: Yup.string().min(8).matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 'Must include uppercase, digit & special char').required('Password is required'),
  confirmPassword: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), null], 'Passwords do not match'),
  walletAddress: Yup.string(),
})

// ── Register Component ───────────────────────────────────────────────
const Register = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const { settings } = useSettings()
  const { user } = useSelector(state => state.signup)
  const socket = useContext(SocketContext)

  const { open } = useWeb3Modal()
  const { address, status: walletStatus } = useAccount()
  const { chain } = useValidateAccount()
  const { disconnect } = useDisconnect()
  const { switchNetwork } = useSwitchNetwork({ onSuccess() { signup(formik.values) } })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [referralDetails, setReferralDetails] = useState(null)
  const [loader, setLoader] = useState(null)
  const [email, setEmail] = useState('')
  const [termsChecked, setTermsChecked] = useState(false)
  const [networkPickerOpen, setNetworkPickerOpen] = useState(false)

  const fetchReferralDetails = async referralId => {
    try {
      const res = await api.get(`${GET_REFERRAL_DETAIL_ENDPOINT}/${referralId}`)
      setReferralDetails(res?.data?.data)
    } catch { setReferralDetails(null) }
  }

  const handleReferralIdChange = async e => {
    const id = e.target.value
    if (id.trim()) await fetchReferralDetails(id)
    else setReferralDetails(null)
  }

  const checkUserNameOrEmail = async (param, e) => {
    try {
      const value = e.target.value
      let url = `${CHECK_USERNAME_OR_EMAIL}/`
      if (param === 'userName' && value) {
        if (!email) { toast.error('Please enter Email Address first', { duration: 5000 }); formik.setFieldValue('userName', ''); return }
        url += `?userName=${value}&email=${email}`
      } else if (param === 'email' && value) {
        url += `?email=${value}`
        setEmail(value)
      }
      await api.get(url)
    } catch (err) {
      if (err.response?.status === 400) toast.error(err.response.data.message, { duration: 5000 })
    }
  }

  // Contract writes
  const { isError: isApprovalError, data: approveTokenTx, error: approveTokenTxError, isLoading: isApprovingTokens, isSuccess: isApprovalTxSent, write: approveTokens } = useContractWrite({ address: CONTRACT_INFO.token.address, abi: CONTRACT_INFO.token.abi, functionName: 'approve' })
  const { isSuccess: isApprovalCompleted, isError: approveWaitError, error: approveTxWaitError } = useWaitForTransaction({ hash: approveTokenTx?.hash })
  const { isError: tokenError, error: transferTokenTxError, data: tokenTx, isLoading: isTransferInprogress, isSuccess: isTokenTxSent, write: transferTokens } = useContractWrite({ address: CONTRACT_INFO.main.address, abi: CONTRACT_INFO.main.abi, functionName: 'registerUser' })
  const { isSuccess: tokenTransferedCompleted, isError: tokenWaitError, error: tokenTxWaitError } = useWaitForTransaction({ hash: tokenTx?.hash })
  const { availableUSDC, isUSDCBlncFetched } = useGetRegisterUSDCTokens(address)

  useEffect(() => {
    if (isApprovalCompleted) {
      const t = setTimeout(() => {
        transferTokens({ args: [ethers.utils.parseEther('5'), referralDetails?.walletAddress], from: address })
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [isApprovalCompleted])

  useEffect(() => {
    if (isTokenTxSent) dispatch(completeSignup({ userId: user?._id, txHash: tokenTx?.hash }))
  }, [isTokenTxSent])

  useEffect(() => { return () => { dispatch(resetSignupState()) } }, [])
  useEffect(() => { if (typeof window !== 'undefined') window?.localStorage?.removeItem('userOTPEmail') }, [])

  const handleDeletePendingUser = async () => {
    const found = localStorage.getItem('pendingUser')
    if (found) {
      const res = await dispatch(deletePendingUser(found))
      if (res?.meta?.requestStatus === 'fulfilled') { localStorage.removeItem('pendingUser'); return true }
    }
  }

  const registerUserFromBackend = async data => {
    window.localStorage.setItem('userOTPEmail', data?.email)
    const found = localStorage.getItem('pendingUser')
    let flag = false
    if (found) { const r = await handleDeletePendingUser(); if (r) { localStorage.removeItem('pendingUser'); flag = true } } else { flag = true }
    if (!flag) return toast.error('Registration failed, please try again!', { duration: 5000 })
    const res = await dispatch(registerUser({ ...data, referredBy: referralDetails ? referralDetails?._id : '' }))
    if (res?.payload?.data?._id) localStorage.setItem('pendingUser', res?.payload?.data?._id)
    if (res?.meta?.requestStatus !== 'fulfilled') { setLoader(null); return }
    approveTokens({ args: [CONTRACT_INFO.main.address, ethers.utils.parseEther('5')], from: address })
  }

  useEffect(() => { handleError() }, [isApprovalError, tokenError, approveWaitError, tokenWaitError])
  const handleError = async () => {
    if (isApprovalError || tokenError || approveWaitError || tokenWaitError) {
      const err = approveTokenTxError || transferTokenTxError || approveTxWaitError || tokenTxWaitError
      setLoader(false)
      const r = await handleDeletePendingUser()
      if (r) localStorage.removeItem('pendingUser')
      dispatch(createTxLog({ walletAddress: address, ...(tokenTx?.hash && { txHash: tokenTx?.hash }), error: JSON.stringify(err?.message) }))
      toast.error(err?.message, { duration: 5000 })
    }
  }

  useEffect(() => {
    if (tokenTransferedCompleted) { dispatch(completeRegister(tokenTx?.hash)); setLoader(false) }
  }, [tokenTransferedCompleted])

  const formik = useFormik({
    initialValues: { name: '', userName: '', role: 'user', password: '', confirmPassword: '', email: '', walletAddress: address, referredBy: '', phoneNumber: '' },
    validationSchema,
    onSubmit: async values => {
      if (chain?.id !== ENV.chainId) return switchNetwork?.(ENV.chainId)
      signup(values)
    },
  })

  const signup = values => {
    if (!address) { toast.error('Wallet Address is required!', { duration: 5000 }); return }
    if (!termsChecked) { toast.error('Please accept Terms & Privacy Policy!', { duration: 5000 }); return }
    registerUserFromBackend({ ...values, walletAddress: address })
    setLoader(true)
  }

  useEffect(() => {
    if (socket && user?._id) {
      socket?.emit('join', `${user?._id}`)
      socket?.on('Register', () => { toast.success('Registration successful!', { duration: 5000 }); router.push('/verify/account/') })
    }
    return () => { socket.emit('leave', `${user?._id}`); socket.off('Register') }
  }, [socket, user?._id])

  useEffect(() => {
    const refId = router.query.referral_id
    if (refId) { formik?.setValues({ ...formik.values, referredBy: refId }); if (refId.trim()) fetchReferralDetails(refId) }
  }, [router?.query?.referral_id])

  useEffect(() => { handleDeletePendingUser(); return () => { handleDeletePendingUser() } }, [])

  useEffect(() => {
    const excluded = ['/set-password/[token]', '/login', '/signup', '/wallet-connection-error-guest', '/wallet-connection-error']
    if (!router || excluded.includes(router.pathname)) return
    if (walletStatus === 'reconnecting' || walletStatus === 'connecting') return
    if (isMobile() && !window?.ethereum && !address) router.push('/wallet-connection-error-guest')
  }, [router.pathname, address, walletStatus])

  const Field = ({ name, label, type = 'text', placeholder, endAdornment, onBlurExtra }) => (
    <Box sx={{ mb: 2.5 }}>
      <CustomTextField
        fullWidth
        label={label}
        placeholder={placeholder}
        type={type}
        {...formik.getFieldProps(name)}
        onBlur={async e => { await formik.handleBlur(e); if (onBlurExtra && !formik.errors[name]) await onBlurExtra(e) }}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name]}
        InputProps={endAdornment ? { endAdornment } : undefined}
      />
    </Box>
  )

  return (
    <>
      <NetworkSelector open={networkPickerOpen} onClose={() => setNetworkPickerOpen(false)} />
      <Box
        className='content-right'
        sx={{
          backgroundColor: '#050816',
          minHeight: '100vh',
          backgroundImage: `
            radial-gradient(ellipse at 80% 10%, rgba(0,229,255,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 10% 80%, rgba(168,85,247,0.05) 0%, transparent 50%)
          `,
        }}
      >
        {/* Left panel */}
        {!hidden && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #050816 0%, #0D1224 40%, #0B1535 100%)',
              borderRadius: '20px',
              margin: theme => theme.spacing(8, 0, 8, 8),
            }}
          >
            {/* Grid bg */}
            <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0 }} />
            <Box sx={{ position: 'absolute', top: '10%', right: '10%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
            <Box sx={{ position: 'absolute', bottom: '15%', left: '5%', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />

            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: 6 }}>
              <Box sx={{ width: 200, height: 200, 
              borderRadius: '50%', background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 60%, #FF2E9F 100%)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: `${pulseGlow} 3s ease-in-out infinite`, fontSize: '1.8rem', fontWeight: 900, color: '#050816', fontFamily: '"Orbitron", sans-serif', boxShadow: '0 0 30px rgba(0,229,255,0.5)' }}>
                <Image src="/images/pages/pre-loader-new.png" alt="bw-logo" width="210" height="210" />

              </Box>
              <Typography sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 900, fontSize: '2.4rem', letterSpacing: '0.15em', background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 50%, #FF2E9F 100%)', backgroundSize: '200% 200%', animation: `${gradientShift} 4s ease infinite`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', mb: 1 }}>
                BIGWHALE
              </Typography>
              <Typography sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 500, fontSize: '0.82rem', letterSpacing: '0.28em', color: 'rgba(0,229,255,0.6)', textTransform: 'uppercase', mb: 4 }}>
                Join the Ecosystem
              </Typography>
              {['🐋 Stake & Earn', '⚡ Instant Rewards', '🌊 Deep Ocean DeFi', '🔮 Web3 Native'].map((f, i) => (
                <Box key={i} sx={{ display: 'inline-block', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '20px', px: 2, py: 0.5, m: 0.5, fontSize: '0.78rem', color: 'rgba(200,215,245,0.8)', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 500 }}>
                  {f}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Right form */}
        <RightWrapper>
          <Box sx={{ p: [4, 8], height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' }}>
            <GlassCard sx={{ width: '100%', maxWidth: 440, p: { xs: 3, sm: 4 } }}>
              {/* Logo */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 60%, #FF2E9F 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '0.95rem', fontWeight: 900, color: '#050816', fontFamily: '"Orbitron", sans-serif', boxShadow: '0 0 16px rgba(0,229,255,0.4)' }}>
                <Image src="/images/pages/pre-loader-new.png" alt="bw-logo" width="55" height="55" />
                  
                </Box>
                <Typography sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.1em', background: 'linear-gradient(135deg, #00E5FF, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', mb: 0.5 }}>
                  Create Account
                </Typography>
                <Typography sx={{ color: 'rgba(200,215,245,0.45)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Join BIGWHALE Ecosystem
                </Typography>
                <Box sx={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.3), transparent)', mt: 2 }} />
              </Box>

              <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
                {/* Referral ID */}
                <Box sx={{ mb: 2.5 }}>
                  <CustomTextField fullWidth label='Referral ID *' placeholder='Enter Referral ID' {...formik.getFieldProps('referredBy')} onBlur={async e => { await formik.handleBlur(e); if (!formik.errors.referredBy) await handleReferralIdChange(e) }} error={formik.touched.referredBy && Boolean(formik.errors.referredBy)} helperText={formik.touched.referredBy && formik.errors.referredBy} />
                </Box>

                {/* Referral Name (readonly) */}
                <Box sx={{ mb: 2.5 }}>
                  <CustomTextField fullWidth label='Referral Name' placeholder='Auto-filled' disabled value={referralDetails ? referralDetails?.name : ''} />
                </Box>

                {/* Full Name */}
                <Box sx={{ mb: 2.5 }}>
                  <CustomTextField fullWidth label='Full Name *' placeholder='Your full name' {...formik.getFieldProps('name')} error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} />
                </Box>

                {/* Email */}
                <Box sx={{ mb: 2.5 }}>
                  <CustomTextField fullWidth label='Email Address *' placeholder='your@email.com' {...formik.getFieldProps('email')} onBlur={e => checkUserNameOrEmail('email', e)} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
                </Box>

                {/* User ID */}
                <Box sx={{ mb: 2.5 }}>
                  <CustomTextField fullWidth label='Login User ID *' placeholder='Choose a unique ID' {...formik.getFieldProps('userName')} onBlur={async e => { await formik.handleBlur(e); if (!formik.errors.userName) await checkUserNameOrEmail('userName', e) }} error={formik.touched.userName && Boolean(formik.errors.userName)} helperText={formik.touched.userName && formik.errors.userName} />
                </Box>

                {/* Password */}
                <Box sx={{ mb: 2.5 }}>
                  <CustomTextField fullWidth label='Password *' type={showPassword ? 'text' : 'password'} placeholder='Min 8 chars, uppercase, digit, special' {...formik.getFieldProps('password')} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password}
                    InputProps={{ endAdornment: <InputAdornment position='end'><IconButton edge='end' onMouseDown={e => e.preventDefault()} onClick={() => setShowPassword(!showPassword)} sx={{ color: 'rgba(0,229,255,0.6)', '&:hover': { color: '#00E5FF' } }}><Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} /></IconButton></InputAdornment> }}
                  />
                </Box>

                {/* Confirm Password */}
                <Box sx={{ mb: 2.5 }}>
                  <CustomTextField fullWidth label='Confirm Password *' type={showConfirmPassword ? 'text' : 'password'} placeholder='Repeat your password' {...formik.getFieldProps('confirmPassword')} error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)} helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    InputProps={{ endAdornment: <InputAdornment position='end'><IconButton edge='end' onMouseDown={e => e.preventDefault()} onClick={() => setShowConfirmPassword(!showConfirmPassword)} sx={{ color: 'rgba(0,229,255,0.6)', '&:hover': { color: '#00E5FF' } }}><Icon fontSize='1.25rem' icon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} /></IconButton></InputAdornment> }}
                  />
                </Box>

                {/* Wallet */}
                {address ? (
                  <>
                    <Box sx={{ mb: 2.5 }}>
                      <CustomTextField fullWidth label='Wallet Address' disabled value={address?.slice(0, 10) + '...' + address?.slice(-10)} />
                    </Box>
                    <OutlineButton fullWidth type='button' sx={{ mb: 2.5 }} onClick={() => disconnect()}>
                      Disconnect Wallet
                    </OutlineButton>
                  </>
                ) : (
                  <OutlineButton fullWidth type='button' sx={{ mb: 2.5 }} onClick={() => { if (typeof window !== 'undefined' && isMobile() && !window?.ethereum) return setNetworkPickerOpen(true); open({ view: 'Networks' }) }}>
                    <Icon icon='tabler:wallet' style={{ marginRight: 8 }} />
                    Connect Wallet
                  </OutlineButton>
                )}

                {/* Terms */}
                <FormControlLabel
                  control={<Checkbox checked={termsChecked} onChange={e => setTermsChecked(e.target.checked)} sx={{ color: 'rgba(0,229,255,0.4)', '&.Mui-checked': { color: '#00E5FF' } }} />}
                  sx={{ mb: 2.5, '& .MuiFormControlLabel-label': { fontSize: '0.82rem' } }}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                      <Typography sx={{ color: 'rgba(200,215,245,0.55)', fontSize: '0.82rem' }}>I agree to</Typography>
                      <Typography component={LinkStyled} href='/terms-and-services' sx={{ fontSize: '0.82rem' }}>Terms &amp; Services</Typography>
                      <Typography sx={{ color: 'rgba(200,215,245,0.55)', fontSize: '0.82rem' }}>and</Typography>
                      <Typography component={LinkStyled} href='/privacy-policy' sx={{ fontSize: '0.82rem' }}>Privacy Policy</Typography>
                    </Box>
                  }
                />

                {/* Submit */}
                <NeonButton fullWidth type='submit' disabled={!formik?.isValid || !termsChecked || (Number(availableUSDC) === 0 && isUSDCBlncFetched) || !!loader} sx={{ mb: 2.5 }}>
                  {loader ? 'Registering...' : 'Create Account'}
                </NeonButton>

                {Number(availableUSDC) === 0 && isUSDCBlncFetched && (
                  <Typography sx={{ color: '#FF2E9F', fontSize: '0.8rem', textAlign: 'center', mb: 2 }}>
                    Insufficient USDT balance for registration.
                  </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography sx={{ color: 'rgba(200,215,245,0.55)', fontSize: '0.875rem' }}>Already have an account?</Typography>
                  <Typography href='/login' component={LinkStyled} sx={{ fontSize: '0.875rem' }}>Sign In</Typography>
                </Box>
              </form>
            </GlassCard>
          </Box>
        </RightWrapper>
      </Box>
    </>
  )
}

Register.getLayout = page => <BlankLayout>{page}</BlankLayout>
Register.guestGuard = true

export default Register
