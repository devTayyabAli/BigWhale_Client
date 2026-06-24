// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";

// ** React Imports
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useContext, useCallback } from "react";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";
import { useAccount } from "wagmi";

// ** Redux — Withdrawal
import {
  fundsWithdrawal,
  fundsWithdrawalAmount,
} from "src/store/apps/withdrawal/withdrawalSlice";
import { completeFundsWithdrawal } from "src/store/apps/withdrawal/completeWithdrawalSlice";
import { completeWithdraw } from "src/store/apps/transaction/completeTransactionEvents";

// ** Redux — Social Verification
import {
  fetchSocialStatus,
  confirmWhatsAppJoined,
  clearConfirmError,
  markWhatsAppVerified,
} from "src/store/apps/auth/socialConfirmSlice";

// ** Web3
import useContractWithdrawal from "src/hooks/useContractWithdrawal";
import { ethers } from "ethers";
import useGetKGCLiveTokens from "src/hooks/useGetKGCLiveTokens";
import { useSwitchNetwork } from "wagmi";
import useValidateAccount from "src/hooks/useValidateAccount";

// ** Socket
import SocketContext from "src/context/Socket";
import { toast } from "react-hot-toast";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
import { ENV } from "src/configs/env";
import { createTxLog } from "src/store/apps/transaction/transactionLogsSlice";
import useGetMinWithdrawalAmountInKgc from "src/hooks/useGetMinWithdrawalAmountInKgc";
import { usePendingTx } from "src/hooks/usePendingTx";
import Icon from "src/@core/components/icon";

// ── WhatsApp Channel Verification Modal ─────────────────────────────
//
// Flow:
//  1. User clicks "Follow WhatsApp Channel" → channel link opens in new tab
//  2. "I've Joined" button appears → user taps it to self-attest
//  3. POST /auth/verify-whatsapp marks whatsappJoined=true in DB
//  4. Modal auto-closes, withdrawal proceeds
//
// Real-time re-check: background poll (60s) + server 24h re-verify window
// ensures users who unfollow are asked to re-confirm on the next withdrawal.
// ─────────────────────────────────────────────────────────────────────
const WhatsAppVerifyModal = ({ open, onClose, onVerified, userId }) => {
  const dispatch = useDispatch();
  const socket   = useContext(SocketContext);

  const whatsappJoined     = useSelector(s => s.socialConfirm.whatsappJoined);
  const whatsappVerifiedAt = useSelector(s => s.socialConfirm.whatsappVerifiedAt);
  const confirmStatus      = useSelector(s => s.socialConfirm.confirmStatus);
  const confirmError       = useSelector(s => s.socialConfirm.confirmError);

  const [hasClickedFollow, setHasClickedFollow] = useState(false);

  const CHANNEL_URL = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL;

  // ── Reset state whenever the modal opens ─────────────────────────
  useEffect(() => {
    if (open) {
      setHasClickedFollow(false);
      // Clear any previous confirmation error so user gets a clean slate
      if (confirmStatus === "failed") dispatch(clearConfirmError());
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Socket: instant update when admin/webhook marks user verified ─
  useEffect(() => {
    if (!socket || !userId) return;
    const handleVerified = () => dispatch(markWhatsAppVerified());
    socket.on("whatsappVerified", handleVerified);
    return () => socket.off("whatsappVerified", handleVerified);
  }, [socket, userId, dispatch]);

  // ── Auto-proceed 1.2s after verified ────────────────────────────
  useEffect(() => {
    if (whatsappJoined && open) {
      const t = setTimeout(() => onVerified(), 1200);
      return () => clearTimeout(t);
    }
  }, [whatsappJoined, open, onVerified]);

  // ── Step 1: open the channel in a new tab ───────────────────────
  const handleFollowChannel = useCallback(() => {
    if (CHANNEL_URL) {
      window.open(CHANNEL_URL, "_blank", "noopener,noreferrer");
    }
    setHasClickedFollow(true);
  }, [CHANNEL_URL]);

  // ── Step 2: user confirms they joined → self-attestation ────────
  const handleConfirmJoined = useCallback(() => {
    if (userId) dispatch(confirmWhatsAppJoined(userId));
  }, [userId, dispatch]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={300}
      PaperProps={{
        sx: {
          background: "rgba(13,18,36,0.97)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(37,211,102,0.25)",
          borderRadius: "20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(37,211,102,0.08)",
          overflow: "hidden",
          "&::before": {
            content: '""', position: "absolute",
            top: 0, left: 0, right: 0, height: "2px",
            background: "linear-gradient(90deg, #128C7E, #25D366, #128C7E)",
          },
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box sx={{
            width: 68, height: 68, borderRadius: "50%",
            background: "linear-gradient(135deg, #128C7E 0%, #25D366 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
            boxShadow: "0 0 24px rgba(37,211,102,0.45)",
            animation: whatsappJoined ? "none" : "waPulse 2s ease-in-out infinite",
            "@keyframes waPulse": {
              "0%, 100%": { boxShadow: "0 0 24px rgba(37,211,102,0.45)" },
              "50%":      { boxShadow: "0 0 40px rgba(37,211,102,0.75)" },
            },
          }}>
            <Icon icon="tabler:brand-whatsapp" style={{ color: "#fff", fontSize: "2rem" }} />
          </Box>

          <Typography sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.06em",
            background: "linear-gradient(135deg, #25D366, #128C7E)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", mb: 0.75,
          }}>
            Join Our WhatsApp Channel
          </Typography>

          <Typography sx={{
            color: "rgba(200,215,245,0.5)", fontSize: "0.82rem",
            fontFamily: '"Space Grotesk", sans-serif', lineHeight: 1.6,
          }}>
            Follow our official channel to unlock withdrawals.
          </Typography>

          <Box sx={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)", mt: 2.5 }} />
        </Box>

        {/* ── Verified state ─────────────────────────────────────── */}
        {whatsappJoined ? (
          <Box sx={{
            p: 3, borderRadius: "14px",
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            animation: "fadeIn 0.4s ease",
            "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Icon icon="tabler:circle-check-filled" style={{ color: "#10B981", fontSize: "1.5rem", flexShrink: 0 }} />
              <Typography sx={{ color: "#10B981", fontWeight: 700, fontSize: "0.95rem", fontFamily: '"Space Grotesk", sans-serif' }}>
                Channel Membership Confirmed ✓
              </Typography>
            </Box>
            {whatsappVerifiedAt && (
              <Typography sx={{ color: "rgba(16,185,129,0.6)", fontSize: "0.72rem", fontFamily: '"Space Grotesk", sans-serif', mb: 1.5 }}>
                Verified on {new Date(whatsappVerifiedAt).toLocaleString()}
              </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CircularProgress size={14} sx={{ color: "#10B981" }} />
              <Typography sx={{ color: "#10B981", fontWeight: 600, fontSize: "0.82rem", fontFamily: '"Space Grotesk", sans-serif' }}>
                Proceeding to withdrawal...
              </Typography>
            </Box>
          </Box>

        ) : confirmStatus === "loading" ? (
          /* ── Confirming spinner ──────────────────────────────────── */
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 3 }}>
            <CircularProgress size={32} sx={{ color: "#25D366" }} />
            <Typography sx={{ color: "rgba(200,215,245,0.5)", fontSize: "0.82rem", fontFamily: '"Space Grotesk", sans-serif' }}>
              Confirming your membership...
            </Typography>
          </Box>

        ) : (
          /* ── Main flow: Follow → Confirm ─────────────────────────── */
          <Box>

            {/* Step indicators */}
            {[
              { num: "1", label: "Open our WhatsApp Channel and tap Follow.", done: hasClickedFollow },
              { num: "2", label: "Return here and tap \"I\u2019ve Joined\" to confirm.", done: false },
            ].map(step => (
              <Box key={step.num} sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
                <Box sx={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: step.done ? "rgba(37,211,102,0.25)" : "rgba(37,211,102,0.12)",
                  border: `1px solid ${step.done ? "rgba(37,211,102,0.6)" : "rgba(37,211,102,0.3)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 700, color: "#25D366",
                  fontFamily: '"Orbitron", sans-serif',
                  transition: "all 0.3s ease",
                }}>
                  {step.done ? "✓" : step.num}
                </Box>
                <Typography sx={{
                  color: step.done ? "rgba(37,211,102,0.8)" : "rgba(200,215,245,0.65)",
                  fontSize: "0.82rem", fontFamily: '"Space Grotesk", sans-serif', lineHeight: 1.6,
                  transition: "color 0.3s ease",
                }}>
                  {step.label}
                </Typography>
              </Box>
            ))}

            {/* ── Step 1: Follow Channel button ───────────────────── */}
            <Button
              id="wa-follow-channel-btn"
              fullWidth
              onClick={handleFollowChannel}
              startIcon={<Icon icon="tabler:brand-whatsapp" style={{ fontSize: "1.1rem" }} />}
              endIcon={<Icon icon="tabler:external-link" style={{ fontSize: "0.85rem" }} />}
              sx={{
                background: "linear-gradient(135deg, #128C7E, #25D366)",
                color: "#fff", fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700, fontSize: "0.9rem",
                borderRadius: "12px", py: 1.3, mb: 2,
                transition: "all 0.2s ease",
                "&:hover": { boxShadow: "0 0 20px rgba(37,211,102,0.5)", transform: "translateY(-1px)" },
              }}
            >
              {hasClickedFollow ? "Open Channel Again" : "Follow WhatsApp Channel"}
            </Button>

            {/* ── Step 2: I've Joined — appears after clicking Follow ─ */}
            {hasClickedFollow && (
              <Button
                id="wa-confirm-joined-btn"
                fullWidth
                onClick={handleConfirmJoined}
                startIcon={<Icon icon="tabler:circle-check" style={{ fontSize: "1.1rem" }} />}
                sx={{
                  background: "rgba(37,211,102,0.1)",
                  color: "#25D366",
                  border: "1px solid rgba(37,211,102,0.4)",
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700, fontSize: "0.9rem",
                  borderRadius: "12px", py: 1.3, mb: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(37,211,102,0.2)",
                    boxShadow: "0 0 16px rgba(37,211,102,0.3)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                I&apos;ve Joined the Channel ✓
              </Button>
            )}

            {/* ── Error message ───────────────────────────────────── */}
            {confirmError && (
              <Box sx={{
                mb: 2, p: 1.5, borderRadius: "8px",
                background: "rgba(255,46,159,0.08)",
                border: "1px solid rgba(255,46,159,0.2)",
              }}>
                <Typography sx={{ color: "#FF2E9F", fontSize: "0.78rem", fontFamily: '"Space Grotesk", sans-serif' }}>
                  {confirmError}
                </Typography>
              </Box>
            )}

            {/* ── Hint before user clicks Follow ──────────────────── */}
            {!hasClickedFollow && (
              <Box sx={{
                p: 2, borderRadius: "10px",
                background: "rgba(37,211,102,0.04)",
                border: "1px solid rgba(37,211,102,0.12)",
                display: "flex", alignItems: "flex-start", gap: 1.5,
              }}>
                <Icon
                  icon="tabler:info-circle"
                  style={{ color: "rgba(37,211,102,0.5)", fontSize: "1rem", flexShrink: 0, marginTop: 2 }}
                />
                <Typography sx={{ color: "rgba(200,215,245,0.5)", fontSize: "0.78rem", fontFamily: '"Space Grotesk", sans-serif', lineHeight: 1.55 }}>
                  Tap the button above to open the channel, then return here and confirm your membership.
                </Typography>
              </Box>
            )}

          </Box>
        )}

        {/* ── Footer ─────────────────────────────────────────────── */}
        {!whatsappJoined && (
          <Typography sx={{
            mt: 2.5, textAlign: "center",
            color: "rgba(200,215,245,0.22)", fontSize: "0.7rem",
            fontFamily: '"Space Grotesk", sans-serif', lineHeight: 1.5,
          }}>
            Following our channel is required to enable withdrawals.
            Re-confirmation may be needed periodically to verify continued membership.
          </Typography>
        )}

      </DialogContent>
    </Dialog>
  );
};

// ── Main Withdrawal Component ────────────────────────────────────────
const Withdrawal = () => {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [error, setError]   = useState(false);
  const [userId, setUserId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [socialGateOpen, setSocialGateOpen] = useState(false);
  const [contractWithdrawAmount, setContractWithdrawAmount] = useState(0);

  const dispatch    = useDispatch();
  const user        = useSelector(state => state?.getCurrentUser?.user);
  const { address } = useAccount();

  const { savePendingTx, clearPendingTx } = usePendingTx("withdrawal");

  const bothConfirmed = useSelector(s => s.socialConfirm.bothConfirmed);
  const fetchStatus   = useSelector(s => s.socialConfirm.fetchStatus);

  const { data }                          = useSelector(state => state?.withdrawal?.fundsWithdrawalAmount || {});
  const { fundsWithdrawal: withdrawResp } = useSelector(state => state.withdrawal);

  // Network fee (in KGC) returned by the server — deducted from the partial
  // (other-reward) transfer leg so the UI shows the real net amount.
  const networkFeeKgc = Number(data?.data?.networkFeeKgc || 0);

  const socket = useContext(SocketContext);
  const { accError, chain } = useValidateAccount();
  const { switchNetwork }   = useSwitchNetwork({ onSuccess() { withdrawAmount(); } });

  const {
    withdrawFunds, withdrawSentTx,
    isWithdrawUsdcTxInProgress, isWithdrawalTokensWaiting,
    isWithdrawalCompleted, isWithdrawSentError, isWithdrawalError,
    withdrawSentError, withdrawTxError,
  } = useContractWithdrawal(setLoader);

  const { tokenBlnc: totalStakedAmountInUSDC, isSuccess } = useGetUSDCTokens(data?.combinedTotalAmount);
  const { kgcTokens: withdrawalAmountInKgc }              = useGetKGCLiveTokens(withdrawalAmount);
  const { minWithdrawalAmountInUSDC, isMinWithdrawalUsdcFetched } = useGetMinWithdrawalAmountInKgc();

  // ── Fetch social status on mount ──────────────────────────────────
  useEffect(() => {
    if (userId && fetchStatus === "idle") dispatch(fetchSocialStatus(userId));
  }, [userId, fetchStatus, dispatch]);

  // ── Background poll every 60s (re-verification window check) ─────
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(() => dispatch(fetchSocialStatus(userId)), 60_000);
    return () => clearInterval(interval);
  }, [userId, dispatch]);

  useEffect(() => {
    if (isSuccess && isMinWithdrawalUsdcFetched && totalStakedAmountInUSDC > 0 && totalStakedAmountInUSDC < minWithdrawalAmountInUSDC) {
      setError(`Minimum withdrawal allowed=${minWithdrawalAmountInUSDC || 0}`);
    } else {
      setError(false);
    }
  }, [isSuccess, totalStakedAmountInUSDC, minWithdrawalAmountInUSDC]);

  useEffect(() => {
    if (isWithdrawSentError || isWithdrawalError) {
      const err = withdrawSentError || withdrawTxError;
      dispatch(createTxLog({
        walletAddress: address,
        ...(withdrawSentTx?.hash && { txHash: withdrawSentTx?.hash }),
        error: JSON.stringify(err?.message),
      }));
      toast.error(err.message, { duration: 2000 });
      setLoader(false);
      clearPendingTx();
    }
  }, [isWithdrawSentError, isWithdrawalError]);

  useEffect(() => {
    if (userId) dispatch(fundsWithdrawalAmount(userId));
  }, [userId]);

  useEffect(() => {
    if (isWithdrawalError) toast.error(withdrawTxError.message, { duration: 2000 });
  }, [isWithdrawalError]);

  useEffect(() => {
    if (isWithdrawalCompleted) {
      dispatch(completeWithdraw(withdrawSentTx?.hash));
      clearPendingTx();
    }
  }, [isWithdrawalCompleted]);

  const truncateDecimals = (number, digits) => {
    const power = Math.pow(10, digits);
    return Math.floor(number * power) / power;
  };

  const withdrawAmount = async () => {
    try {
      setLoader(true);
      const response = await dispatch(fundsWithdrawal({ userId, amount: Number(withdrawalAmountInKgc) }));
      if (response?.meta?.requestStatus === "fulfilled") {
        const withdrawalAmountFromContract = response?.payload?.data?.withdrawalAmountFromContract;
        if (withdrawalAmountFromContract) {
          const amount = withdrawalAmountFromContract > data?.stakingAmount
            ? data?.stakingAmount
            : withdrawalAmountFromContract;
          setContractWithdrawAmount(amount);
          savePendingTx("withdraw-sent");
          withdrawFunds({
            args: [Number(ethers.utils.parseEther(`${truncateDecimals(amount, 7)}`))],
            from: address,
          });
        }
        return;
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      console.error("Error while withdraw the amount!", err.message);
    }
  };

  const handleSubmit = async () => {
    if (!bothConfirmed) {
      setSocialGateOpen(true);
      return;
    }
    if (chain?.id !== ENV.chainId) return switchNetwork?.(ENV.chainId);
    withdrawAmount();
  };

  const handleVerified = () => {
    setSocialGateOpen(false);
    if (chain?.id !== ENV.chainId) { switchNetwork?.(ENV.chainId); return; }
    withdrawAmount();
  };

  useEffect(() => {
    if (withdrawSentTx?.hash) {
      const usdRate = Number(withdrawalAmount) / Number(withdrawalAmountInKgc);
      const fiatPortion = contractWithdrawAmount * usdRate;
      dispatch(completeFundsWithdrawal({
        id: withdrawResp.data._id,
        data: {
          txHash: withdrawSentTx?.hash,
          userId,
          fiatAmount: truncateDecimals(fiatPortion, 2),
          cryptoAmount: contractWithdrawAmount,
        },
      }));
    }
  }, [withdrawSentTx?.hash]);

  useEffect(() => { if (user) setUserId(user?.data?._id); }, [user]);

  useEffect(() => {
    if (socket && userId) {
      socket.emit("join", userId);
      const handleWithdrawal = () => {
        toast.success("Tokens Withdrawal Successfully done!", { duration: 2000 });
        setWithdrawalAmount("");
        setLoader(false);
        dispatch(fundsWithdrawalAmount(userId));
      };
      socket.on("Withdraw", handleWithdrawal);
      return () => { socket.off("Withdraw", handleWithdrawal); socket.emit("leave", userId); };
    }
  }, [socket, userId]);

  useEffect(() => {
    if (socket && userId) {
      const handleWithdrawAmount = () => { if (userId) dispatch(fundsWithdrawalAmount(userId)); };
      socket.on("withdrawAmount", handleWithdrawAmount);
      return () => { socket.off("withdrawAmount", handleWithdrawAmount); };
    }
  }, [socket, userId]);

  useEffect(() => {
    if (user?.data?.isWithdrawInactive === true) {
      setError(`We're experiencing a technical issue. Our team is currently working to resolve it.`);
    } else if (user?.data?.totalStakeAmount < 50) {
      setError(`withdrawal unavailable`);
    }
  }, [totalStakedAmountInUSDC, withdrawalAmount]);

  return (
    <>
      <WhatsAppVerifyModal
        open={socialGateOpen}
        onClose={() => setSocialGateOpen(false)}
        onVerified={handleVerified}
        userId={userId}
      />

      <Card sx={{ p: 8 }}>
        <Card sx={{ border: 1 }}>
          <CardHeader
            sx={{ textAlign: "center", py: 8, fontSize: 24 }}
            title={`Available Balance : $${totalStakedAmountInUSDC || 0}`}
          />
          <Divider sx={{ m: "0 !important" }} />
          <form onSubmit={e => e.preventDefault()}>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Enter Amount ($)*
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    label=""
                    placeholder="Enter Withdrawal amount ($)"
                    onChange={e => {
                      let value = e?.target?.value;
                      value = value?.replace(/^0+(?=\d)/, "");
                      value = value?.replace(/(\.[^.]*\.)+/g, ".");
                      value = value?.replace(/(\..*)\./g, "$1");
                      const parts = value?.split(".");
                      if (parts?.length > 1) value = `${parts[0]}.${parts[1]?.slice(0, 10)}`;
                      if (value == 0.0000001) return;
                      const blncError = +value > totalStakedAmountInUSDC;
                      const minWithdrawalLimitError = +value < minWithdrawalAmountInUSDC;
                      if (blncError) { return setError(`Available balance is ${totalStakedAmountInUSDC || 0}`); }
                      else { setError(false); }
                      if (user?.data?.isWithdrawInactive === true) setError(`We're experiencing a technical issue. Our team is currently working to resolve it.`);
                      if (minWithdrawalLimitError) setError(`Minimum withdrawal allowed=${minWithdrawalAmountInUSDC || 0}`);
                      if (user?.data?.totalStakeAmount < 50) setError(`Withdrawal unavailable`);
                      setWithdrawalAmount(value);
                    }}
                    value={withdrawalAmount}
                    onKeyPress={e => {
                      if (!/^\d*\.?\d*$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") e.preventDefault();
                    }}
                  />
                </Grid>
                {withdrawalAmount && !error && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 4, borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, letterSpacing: "0.05em", color: "rgba(200,215,245,0.8)" }}>
                        WITHDRAWAL BREAKDOWN
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                        <Typography variant="body2" sx={{ color: "rgba(200,215,245,0.5)" }}>User Receives (80%)</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#25D366" }}>
                          ${(Number(withdrawalAmount) * 0.8).toFixed(2)}
                        </Typography>
                      </Box>
                      {networkFeeKgc > 0 && (
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                          <Typography variant="body2" sx={{ color: "rgba(200,215,245,0.5)" }}>Network Fee (gas)</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#FF9F43" }}>
                            −{networkFeeKgc.toFixed(4)} BW
                          </Typography>
                        </Box>
                      )}
                      {networkFeeKgc > 0 && (
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                          <Typography variant="body2" sx={{ color: "rgba(200,215,245,0.8)", fontWeight: 600 }}>You Actually Receive</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#25D366" }}>
                            ${Math.max(0, Number(withdrawalAmount) * 0.8 - networkFeeKgc).toFixed(4)}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "rgba(200,215,245,0.5)" }}>Salary Rank (20%)</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#FF2E9F" }}>
                          ${(Number(withdrawalAmount) * 0.2).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {error && (
                  <Typography variant="body2" style={{ color: "#C9A84C" }} sx={{ fontWeight: 600, marginLeft: "1.5rem" }}>
                    {error}
                  </Typography>
                )}
              </Grid>
            </CardContent>
            <Divider sx={{ m: "0 !important" }} />
            <CardActions>
              <Button
                fullWidth
                type="submit"
                sx={{ mr: 2 }}
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  isWithdrawUsdcTxInProgress || isWithdrawalTokensWaiting ||
                  !withdrawalAmount || error || loader || accError ||
                  fetchStatus === "loading"
                }
              >
                {user?.data?.totalStakeAmount < 50
                  ? "Withdrawal unavailable"
                  : accError
                    ? `Please connect with ${user?.data?.walletAddress?.slice(0, 6) + "..." + user?.data?.walletAddress?.slice(-6)} wallet address`
                    : isWithdrawUsdcTxInProgress
                      ? "Approve Transaction!"
                      : isWithdrawalTokensWaiting || loader
                        ? "Transaction is in Progress, Please Wait!"
                        : fetchStatus === "loading"
                          ? "Loading..."
                          : "Submit"}
              </Button>
            </CardActions>
          </form>
        </Card>
      </Card>
    </>
  );
};

export default Withdrawal;
