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
import LinearProgress from "@mui/material/LinearProgress";

// ** React Imports
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useContext, useCallback, useRef } from "react";

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
  generateWhatsAppCode,
  checkWhatsAppCode,
  markWhatsAppVerified,
  clearWhatsAppError,
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

// ** Next
import { useRouter } from "next/router";

// ── How often to poll for verification while modal is open ───────────
const POLL_INTERVAL_MS = 3000; // 3 seconds — fast enough to feel real-time

// ── WhatsApp Verification Modal ──────────────────────────────────────
const WhatsAppVerifyModal = ({ open, onClose, onVerified, userId }) => {
  const dispatch = useDispatch();
  const socket   = useContext(SocketContext);

  const whatsappJoined     = useSelector(s => s.socialConfirm.whatsappJoined);
  const whatsappVerifiedAt = useSelector(s => s.socialConfirm.whatsappVerifiedAt);
  const whatsappLink       = useSelector(s => s.socialConfirm.whatsappLink);
  const whatsappCodeExpiry = useSelector(s => s.socialConfirm.whatsappCodeExpiry);
  const codeStatus         = useSelector(s => s.socialConfirm.codeStatus);
  const whatsappError      = useSelector(s => s.socialConfirm.whatsappError);

  // ── Code expiry countdown ─────────────────────────────────────────
  const [secondsLeft, setSecondsLeft] = useState(null);
  useEffect(() => {
    if (!whatsappCodeExpiry) { setSecondsLeft(null); return; }
    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(whatsappCodeExpiry) - Date.now()) / 1000));
      setSecondsLeft(diff);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [whatsappCodeExpiry]);

  // ── Generate code when modal opens ───────────────────────────────
  useEffect(() => {
    if (open && userId && codeStatus === "idle" && !whatsappJoined) {
      dispatch(generateWhatsAppCode(userId));
    }
  }, [open, userId, codeStatus, whatsappJoined, dispatch]);

  // ── Regenerate when code expires ─────────────────────────────────
  useEffect(() => {
    if (secondsLeft === 0 && !whatsappJoined && open) {
      dispatch(generateWhatsAppCode(userId));
    }
  }, [secondsLeft, whatsappJoined, open, userId, dispatch]);

  // ── Poll every 3s while modal is open ────────────────────────────
  // Calls backend which reads Meta API messages to find the code
  const pollRef = useRef(null);
  useEffect(() => {
    if (!open || !userId || whatsappJoined) return;
    // Start polling only after the user has a link (i.e. has sent the message)
    if (!whatsappLink) return;
    pollRef.current = setInterval(() => {
      dispatch(checkWhatsAppCode(userId));
    }, POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [open, userId, whatsappJoined, whatsappLink, dispatch]);

  // ── Socket: instant update when webhook fires ─────────────────────
  useEffect(() => {
    if (!socket || !userId) return;
    const handleVerified = () => {
      dispatch(markWhatsAppVerified());
    };
    socket.on("whatsappVerified", handleVerified);
    return () => socket.off("whatsappVerified", handleVerified);
  }, [socket, userId, dispatch]);

  // ── Auto-proceed when verified ────────────────────────────────────
  useEffect(() => {
    if (whatsappJoined && open) {
      const t = setTimeout(() => { onVerified(); }, 1200);
      return () => clearTimeout(t);
    }
  }, [whatsappJoined, open, onVerified]);

  const handleOpenWhatsApp = useCallback(() => {
    if (whatsappLink) window.open(whatsappLink, "_blank");
  }, [whatsappLink]);

  const handleRefreshCode = useCallback(() => {
    if (!userId) return;
    dispatch(clearWhatsAppError());
    dispatch(generateWhatsAppCode(userId));
  }, [userId, dispatch]);

  // Progress bar value for expiry (0–100)
  const progressValue = whatsappCodeExpiry && secondsLeft !== null
    ? (secondsLeft / 600) * 100   // 600s = 10 min total
    : 100;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(13,18,36,0.97)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(37,211,102,0.25)",
          borderRadius: "20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(37,211,102,0.08)",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #128C7E, #25D366, #128C7E)",
          },
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>

        {/* ── Header ── */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box sx={{
            width: 68, height: 68, borderRadius: "50%",
            background: "linear-gradient(135deg, #128C7E 0%, #25D366 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
            boxShadow: "0 0 24px rgba(37,211,102,0.45)",
          }}>
            <Icon icon="tabler:brand-whatsapp" style={{ color: "#fff", fontSize: "2rem" }} />
          </Box>

          <Typography sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.06em",
            background: "linear-gradient(135deg, #25D366, #128C7E)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            mb: 0.75,
          }}>
            WhatsApp Verification
          </Typography>

          <Typography sx={{
            color: "rgba(200,215,245,0.5)", fontSize: "0.82rem",
            fontFamily: '"Space Grotesk", sans-serif', lineHeight: 1.6,
          }}>
            Send a quick message to verify your WhatsApp.
            No button to click — it confirms automatically.
          </Typography>

          <Box sx={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)", mt: 2.5 }} />
        </Box>

        {/* ── Verified state ── */}
        {whatsappJoined ? (
          <Box sx={{
            p: 3, borderRadius: "14px",
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <Icon icon="tabler:circle-check-filled" style={{ color: "#10B981", fontSize: "1.5rem", flexShrink: 0 }} />
              <Typography sx={{ color: "#10B981", fontWeight: 700, fontSize: "0.95rem", fontFamily: '"Space Grotesk", sans-serif' }}>
                WhatsApp Verified ✓
              </Typography>
            </Box>
            {whatsappVerifiedAt && (
              <Typography sx={{ color: "rgba(16,185,129,0.6)", fontSize: "0.72rem", fontFamily: '"Space Grotesk", sans-serif' }}>
                Verified on {new Date(whatsappVerifiedAt).toLocaleString()}
              </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 2 }}>
              <CircularProgress size={16} sx={{ color: "#10B981" }} />
              <Typography sx={{ color: "#10B981", fontWeight: 600, fontSize: "0.82rem", fontFamily: '"Space Grotesk", sans-serif' }}>
                Proceeding to withdrawal...
              </Typography>
            </Box>
          </Box>

        ) : codeStatus === "loading" ? (
          /* ── Generating code ── */
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 3 }}>
            <CircularProgress size={32} sx={{ color: "#25D366" }} />
            <Typography sx={{ color: "rgba(200,215,245,0.5)", fontSize: "0.82rem", fontFamily: '"Space Grotesk", sans-serif' }}>
              Generating your verification code...
            </Typography>
          </Box>

        ) : whatsappLink ? (
          /* ── Code ready — show instructions ── */
          <Box>
            {/* Steps */}
            <Box sx={{ mb: 2.5 }}>
              {[
                { num: "1", text: "Tap the button below — WhatsApp will open with your code pre-filled." },
                { num: "2", text: "Just hit Send. That's it — verification is automatic." },
              ].map(step => (
                <Box key={step.num} sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
                  <Box sx={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(37,211,102,0.15)",
                    border: "1px solid rgba(37,211,102,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", fontWeight: 700, color: "#25D366",
                    fontFamily: '"Orbitron", sans-serif',
                  }}>
                    {step.num}
                  </Box>
                  <Typography sx={{ color: "rgba(200,215,245,0.65)", fontSize: "0.82rem", fontFamily: '"Space Grotesk", sans-serif', lineHeight: 1.6 }}>
                    {step.text}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Open WhatsApp button */}
            <Button
              fullWidth
              onClick={handleOpenWhatsApp}
              startIcon={<Icon icon="tabler:brand-whatsapp" style={{ fontSize: "1.1rem" }} />}
              sx={{
                background: "linear-gradient(135deg, #128C7E, #25D366)",
                color: "#fff",
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700, fontSize: "0.9rem",
                borderRadius: "12px", py: 1.3, mb: 2,
                transition: "all 0.2s ease",
                "&:hover": { boxShadow: "0 0 20px rgba(37,211,102,0.5)", transform: "translateY(-1px)" },
              }}
            >
              Send Verification Code
            </Button>

            {/* Waiting indicator */}
            <Box sx={{
              p: 2, borderRadius: "10px",
              background: "rgba(37,211,102,0.04)",
              border: "1px solid rgba(37,211,102,0.12)",
              display: "flex", alignItems: "center", gap: 1.5,
              mb: 2,
            }}>
              <CircularProgress size={14} sx={{ color: "#25D366", flexShrink: 0 }} />
              <Typography sx={{ color: "rgba(200,215,245,0.5)", fontSize: "0.78rem", fontFamily: '"Space Grotesk", sans-serif' }}>
                Waiting for your message... verifies automatically
              </Typography>
            </Box>

            {/* Expiry countdown */}
            {secondsLeft !== null && (
              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography sx={{ color: "rgba(200,215,245,0.35)", fontSize: "0.7rem", fontFamily: '"Space Grotesk", sans-serif' }}>
                    Code expires in
                  </Typography>
                  <Typography sx={{
                    fontSize: "0.7rem", fontFamily: '"Orbitron", sans-serif', fontWeight: 700,
                    color: secondsLeft < 60 ? "#FF2E9F" : "rgba(37,211,102,0.7)",
                  }}>
                    {secondsLeft < 60
                      ? `${secondsLeft}s`
                      : `${Math.floor(secondsLeft / 60)}m ${secondsLeft % 60}s`}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  sx={{
                    height: 3, borderRadius: 2,
                    backgroundColor: "rgba(200,215,245,0.08)",
                    "& .MuiLinearProgress-bar": {
                      background: secondsLeft < 60
                        ? "linear-gradient(90deg, #FF2E9F, #FF6B6B)"
                        : "linear-gradient(90deg, #128C7E, #25D366)",
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            )}

            {/* Refresh code */}
            <Box sx={{ textAlign: "center" }}>
              <Typography
                onClick={handleRefreshCode}
                sx={{
                  color: "rgba(37,211,102,0.5)", fontSize: "0.75rem",
                  fontFamily: '"Space Grotesk", sans-serif',
                  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 0.5,
                  "&:hover": { color: "#25D366" },
                  transition: "color 0.2s",
                }}
              >
                <Icon icon="tabler:refresh" style={{ fontSize: "0.8rem" }} />
                Get a new code
              </Typography>
            </Box>
          </Box>

        ) : (
          /* ── Error / no link yet ── */
          <Box sx={{ textAlign: "center", py: 2 }}>
            {whatsappError && (
              <Box sx={{ mb: 2, p: 1.5, borderRadius: "8px", background: "rgba(255,46,159,0.08)", border: "1px solid rgba(255,46,159,0.2)" }}>
                <Typography sx={{ color: "#FF2E9F", fontSize: "0.78rem", fontFamily: '"Space Grotesk", sans-serif' }}>
                  {whatsappError}
                </Typography>
              </Box>
            )}
            <Button
              onClick={handleRefreshCode}
              startIcon={<Icon icon="tabler:refresh" style={{ fontSize: "0.9rem" }} />}
              sx={{
                background: "linear-gradient(135deg, #128C7E, #25D366)",
                color: "#fff", fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600, fontSize: "0.85rem",
                borderRadius: "10px", px: 3, py: 1,
              }}
            >
              Try Again
            </Button>
          </Box>
        )}

        {/* Footer note */}
        {!whatsappJoined && (
          <Typography sx={{
            mt: 2.5, textAlign: "center",
            color: "rgba(200,215,245,0.25)", fontSize: "0.7rem",
            fontFamily: '"Space Grotesk", sans-serif', lineHeight: 1.5,
          }}>
            Verification is required once. Re-verification may be needed periodically
            to confirm you remain connected to our community.
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

  const dispatch    = useDispatch();
  const router      = useRouter();
  const user        = useSelector(state => state?.getCurrentUser?.user);
  const { address } = useAccount();

  const { savePendingTx, clearPendingTx } = usePendingTx('withdrawal');

  const bothConfirmed = useSelector(s => s.socialConfirm.bothConfirmed);
  const fetchStatus   = useSelector(s => s.socialConfirm.fetchStatus);

  const { data } = useSelector(state => state?.withdrawal?.fundsWithdrawalAmount || {});
  const { fundsWithdrawal: withdrawResp } = useSelector(state => state.withdrawal);

  const socket = useContext(SocketContext);
  const { accError, chain } = useValidateAccount();
  const { switchNetwork } = useSwitchNetwork({ onSuccess() { withdrawAmount(); } });

  const {
    withdrawFunds, withdrawSentTx,
    isWithdrawUsdcTxInProgress, isWithdrawalTokensWaiting,
    isWithdrawalCompleted, isWithdrawSentError, isWithdrawalError,
    withdrawSentError, withdrawTxError,
  } = useContractWithdrawal(setLoader);

  const { tokenBlnc: totalStakedAmountInUSDC, isSuccess } = useGetUSDCTokens(data?.combinedTotalAmount);
  const { kgcTokens: withdrawalAmountInKgc } = useGetKGCLiveTokens(withdrawalAmount);
  const { minWithdrawalAmountInKgc, minWithdrawalAmountInUSDC, isMinWithdrawalUsdcFetched } = useGetMinWithdrawalAmountInKgc();

  // ── Fetch social status on mount ──────────────────────────────────
  useEffect(() => {
    if (userId && fetchStatus === "idle") {
      dispatch(fetchSocialStatus(userId));
    }
  }, [userId, fetchStatus, dispatch]);

  // ── Background poll every 60s (re-verification window check) ─────
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(() => {
      dispatch(fetchSocialStatus(userId));
    }, 60_000);
    return () => clearInterval(interval);
  }, [userId, dispatch]);

  useEffect(() => {
    if (isSuccess && isMinWithdrawalUsdcFetched && totalStakedAmountInUSDC > 0 && (totalStakedAmountInUSDC < minWithdrawalAmountInUSDC)) {
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
          savePendingTx('withdraw-sent');
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
    // ── Social gate ───────────────────────────────────────────────
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
      dispatch(completeFundsWithdrawal({
        id: withdrawResp.data._id,
        data: {
          txHash: withdrawSentTx?.hash,
          userId,
          fiatAmount: withdrawalAmount,
          cryptoAmount: Number(withdrawalAmountInKgc),
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
      return () => { socket.off("withdrawAmount", handleWithdrawAmount); socket.emit("withdrawAmount", userId); };
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
                      const minWithDarwalLimitError = +value < minWithdrawalAmountInUSDC;
                      if (blncError) { return setError(`Available balance is ${totalStakedAmountInUSDC || 0}`); }
                      else { setError(false); }
                      if (user?.data?.isWithdrawInactive === true) setError(`We're experiencing a technical issue. Our team is currently working to resolve it.`);
                      if (minWithDarwalLimitError) setError(`Minimum withdrawal allowed=${minWithdrawalAmountInUSDC || 0}`);
                      if (user?.data?.totalStakeAmount < 50) setError(`Withdrawal unavailable`);
                      setWithdrawalAmount(value);
                    }}
                    value={withdrawalAmount}
                    onKeyPress={e => {
                      if (!/^\d*\.?\d*$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") e.preventDefault();
                    }}
                  />
                </Grid>
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
