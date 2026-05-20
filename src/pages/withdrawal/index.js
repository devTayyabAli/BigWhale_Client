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
  verifyTelegram,
  verifyWhatsApp,
  clearTelegramError,
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

// ── Constants ────────────────────────────────────────────────────────
const TELEGRAM_BOT_NAME   = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "BigWhaleVerifyBot";
const TELEGRAM_GROUP_URL  = "https://t.me/+3zdUVhUPJsc1ODY8";
const WHATSAPP_CHANNEL_URL = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || "https://whatsapp.com/channel/bigwhaleofficial";

// ── useTelegramWidget hook ───────────────────────────────────────────
// `open` is required as a dependency: the Dialog renders the container div
// only after it opens, so the effect must re-run when open becomes true.
const useTelegramWidget = (containerId, onAuth, open) => {
  useEffect(() => {
    if (!open) return;                          // modal not open — container not in DOM yet
    if (typeof window === "undefined") return;

    // Small delay to let MUI Dialog finish its enter animation and mount the DOM
    const timer = setTimeout(() => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = "";

      window.onTelegramAuth = (user) => { onAuth(user); };

      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-login", TELEGRAM_BOT_NAME);
      script.setAttribute("data-size", "large");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.setAttribute("data-request-access", "write");
      script.async = true;
      container.appendChild(script);
    }, 300);

    return () => {
      clearTimeout(timer);
      delete window.onTelegramAuth;
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = "";
    };
  }, [containerId, onAuth, open]);  // re-run when modal opens/closes
};

// ── SocialStep component ─────────────────────────────────────────────
const SocialStep = ({
  stepNum, icon, iconBg, iconGlow,
  title, subtitle,
  isVerified, isLoading, errorMsg, verifiedAt,
  children,
}) => (
  <Box
    sx={{
      p: 3, mb: 2.5, borderRadius: "16px",
      background: isVerified ? "rgba(16,185,129,0.08)" : "rgba(200,215,245,0.03)",
      border: isVerified ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(200,215,245,0.1)",
      transition: "all 0.3s ease",
      position: "relative",
    }}
  >
    {/* Step badge */}
    <Box sx={{
      position: "absolute", top: 12, right: 12,
      width: 24, height: 24, borderRadius: "50%",
      background: isVerified ? "rgba(16,185,129,0.2)" : "rgba(200,215,245,0.06)",
      border: isVerified ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(200,215,245,0.12)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "0.7rem", fontWeight: 700,
      color: isVerified ? "#10B981" : "rgba(200,215,245,0.35)",
      fontFamily: '"Orbitron", sans-serif',
    }}>
      {isVerified ? <Icon icon="tabler:check" style={{ fontSize: "0.8rem" }} /> : stepNum}
    </Box>

    {/* Header */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: isVerified ? 1.5 : 2.5 }}>
      <Box sx={{
        width: 44, height: 44, borderRadius: "12px", flexShrink: 0,
        background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 12px ${iconGlow}`,
      }}>
        <Icon icon={icon} style={{ color: "#fff", fontSize: "1.4rem" }} />
      </Box>
      <Box>
        <Typography sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: "0.9rem", color: "#F8FAFC" }}>
          {title}
        </Typography>
        <Typography sx={{ color: "rgba(200,215,245,0.45)", fontSize: "0.75rem" }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>

    {isVerified ? (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: "10px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
        <Icon icon="tabler:circle-check-filled" style={{ color: "#10B981", fontSize: "1.2rem" }} />
        <Box>
          <Typography sx={{ color: "#10B981", fontWeight: 700, fontSize: "0.85rem", fontFamily: '"Space Grotesk", sans-serif' }}>
            Verified ✓
          </Typography>
          {verifiedAt && (
            <Typography sx={{ color: "rgba(16,185,129,0.6)", fontSize: "0.72rem" }}>
              {new Date(verifiedAt).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </Box>
    ) : (
      <>
        {children}
        {isLoading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 2 }}>
            <CircularProgress size={16} sx={{ color: "#00E5FF" }} />
            <Typography sx={{ color: "rgba(0,229,255,0.7)", fontSize: "0.8rem", fontFamily: '"Space Grotesk", sans-serif' }}>
              Verifying...
            </Typography>
          </Box>
        )}
        {errorMsg && (
          <Box sx={{ mt: 2, p: 1.5, borderRadius: "8px", background: "rgba(255,46,159,0.08)", border: "1px solid rgba(255,46,159,0.2)" }}>
            <Typography sx={{ color: "#FF2E9F", fontSize: "0.78rem", fontFamily: '"Space Grotesk", sans-serif', lineHeight: 1.5 }}>
              {errorMsg}
            </Typography>
          </Box>
        )}
      </>
    )}
  </Box>
);

// ── Social Gate Modal ────────────────────────────────────────────────
const SocialGateModal = ({ open, onClose, onBothVerified, userId }) => {
  const dispatch = useDispatch();

  const telegramJoined     = useSelector(s => s.socialConfirm.telegramJoined);
  const telegramVerifiedAt = useSelector(s => s.socialConfirm.telegramVerifiedAt);
  const whatsappJoined     = useSelector(s => s.socialConfirm.whatsappJoined);
  const whatsappVerifiedAt = useSelector(s => s.socialConfirm.whatsappVerifiedAt);
  const telegramStatus     = useSelector(s => s.socialConfirm.telegramStatus);
  const whatsappStatus     = useSelector(s => s.socialConfirm.whatsappStatus);
  const telegramError      = useSelector(s => s.socialConfirm.telegramError);
  const whatsappError      = useSelector(s => s.socialConfirm.whatsappError);

  const bothVerified = telegramJoined && whatsappJoined;

  // ── Telegram Widget callback ──────────────────────────────────────
  const handleTelegramAuth = useCallback(async (telegramData) => {
    if (!userId || !telegramData) return;
    dispatch(clearTelegramError());
    dispatch(verifyTelegram({ userId, telegramData }));
  }, [userId, dispatch]);

  useTelegramWidget("telegram-widget-container", handleTelegramAuth, open);

  // ── WhatsApp: user clicks "I've Joined" ───────────────────────────
  const handleWhatsAppVerify = useCallback(async () => {
    if (!userId) return;
    dispatch(clearWhatsAppError());
    dispatch(verifyWhatsApp(userId));
  }, [userId, dispatch]);

  // ── Auto-proceed when both verified ──────────────────────────────
  useEffect(() => {
    if (bothVerified && open) {
      const t = setTimeout(() => { onBothVerified(); }, 800);
      return () => clearTimeout(t);
    }
  }, [bothVerified, open, onBothVerified]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(13,18,36,0.97)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(0,229,255,0.2)",
          borderRadius: "20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(0,229,255,0.08)",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #00E5FF, #A855F7, #25D366)",
          },
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #00E5FF 0%, #A855F7 60%, #25D366 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 0 20px rgba(0,229,255,0.4)",
          }}>
            <Icon icon="tabler:shield-check" style={{ color: "#050816", fontSize: "1.8rem" }} />
          </Box>
          <Typography sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 800, fontSize: "1.15rem", letterSpacing: "0.08em",
            background: "linear-gradient(135deg, #00E5FF, #A855F7)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            mb: 1,
          }}>
            Community Verification
          </Typography>
          <Typography sx={{ color: "rgba(200,215,245,0.55)", fontSize: "0.875rem", fontFamily: '"Space Grotesk", sans-serif', lineHeight: 1.6 }}>
            Join our community to unlock withdrawal.
            Verification is instant — just click and confirm.
          </Typography>
          <Box sx={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.3), transparent)", mt: 3 }} />
        </Box>

        {/* ── Step 1: Telegram ── */}
        <SocialStep
          stepNum="1"
          icon="tabler:brand-telegram"
          iconBg="linear-gradient(135deg, #0088cc, #00aaff)"
          iconGlow="rgba(0,136,204,0.4)"
          title="Join BIGWHALE Telegram Group"
          subtitle="Click the button below — approve in Telegram app"
          isVerified={telegramJoined}
          isLoading={telegramStatus === "loading"}
          errorMsg={telegramError}
          verifiedAt={telegramVerifiedAt}
        >
          <Button
            onClick={() => window.open(TELEGRAM_GROUP_URL, "_blank")}
            startIcon={<Icon icon="tabler:external-link" style={{ fontSize: "0.85rem" }} />}
            sx={{
              background: "linear-gradient(135deg, #0088cc, #00aaff)",
              color: "#fff",
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 600, fontSize: "0.82rem",
              borderRadius: "10px", px: 2.5, py: 1, mb: 2,
              transition: "all 0.2s ease",
              "&:hover": { boxShadow: "0 0 14px rgba(0,136,204,0.5)", transform: "translateY(-1px)" },
            }}
          >
            1. Join Telegram Group
          </Button>

          <Box>
            <Typography sx={{ color: "rgba(200,215,245,0.5)", fontSize: "0.75rem", mb: 1, fontFamily: '"Space Grotesk", sans-serif' }}>
              2. Then verify your membership:
            </Typography>
            <Box id="telegram-widget-container" sx={{ minHeight: 40 }} />
          </Box>
        </SocialStep>

        {/* ── Step 2: WhatsApp Channel ── */}
        <SocialStep
          stepNum="2"
          icon="tabler:brand-whatsapp"
          iconBg="linear-gradient(135deg, #128C7E, #25D366)"
          iconGlow="rgba(37,211,102,0.4)"
          title="Join BIGWHALE WhatsApp Channel"
          subtitle="Join the channel, then click Confirm below"
          isVerified={whatsappJoined}
          isLoading={whatsappStatus === "loading"}
          errorMsg={whatsappError}
          verifiedAt={whatsappVerifiedAt}
        >
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {/* Step 2a: Open WhatsApp channel */}
            <Button
              onClick={() => window.open(WHATSAPP_CHANNEL_URL, "_blank")}
              startIcon={<Icon icon="tabler:external-link" style={{ fontSize: "0.85rem" }} />}
              sx={{
                background: "linear-gradient(135deg, #128C7E, #25D366)",
                color: "#fff",
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600, fontSize: "0.82rem",
                borderRadius: "10px", px: 2.5, py: 1,
                transition: "all 0.2s ease",
                "&:hover": { boxShadow: "0 0 14px rgba(37,211,102,0.5)", transform: "translateY(-1px)" },
              }}
            >
              1. Join WhatsApp Channel
            </Button>

            {/* Step 2b: Confirm join */}
            <Button
              onClick={handleWhatsAppVerify}
              disabled={whatsappStatus === "loading"}
              startIcon={
                whatsappStatus === "loading"
                  ? <CircularProgress size={14} sx={{ color: "#fff" }} />
                  : <Icon icon="tabler:check" style={{ fontSize: "0.85rem" }} />
              }
              sx={{
                background: "linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)",
                color: "#050816",
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700, fontSize: "0.82rem",
                borderRadius: "10px", px: 2.5, py: 1,
                transition: "all 0.2s ease",
                "&:not(.Mui-disabled):hover": { boxShadow: "0 0 16px rgba(0,229,255,0.45)", transform: "translateY(-1px)" },
                "&.Mui-disabled": { background: "rgba(0,229,255,0.15)", color: "rgba(0,229,255,0.4)" },
              }}
            >
              {whatsappStatus === "loading" ? "Verifying..." : "2. I've Joined"}
            </Button>
          </Box>
        </SocialStep>

        {/* Both verified — auto-proceed */}
        {bothVerified && (
          <Box sx={{
            p: 2.5, borderRadius: "12px",
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            display: "flex", alignItems: "center", gap: 2,
          }}>
            <CircularProgress size={18} sx={{ color: "#10B981" }} />
            <Typography sx={{ color: "#10B981", fontWeight: 600, fontSize: "0.875rem", fontFamily: '"Space Grotesk", sans-serif' }}>
              Both verified! Proceeding to withdrawal...
            </Typography>
          </Box>
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

  // Persist pending tx across MetaMask mobile page reloads
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

  // Fetch social status from DB when userId is known
  useEffect(() => {
    if (userId && fetchStatus === "idle") {
      dispatch(fetchSocialStatus(userId));
    }
  }, [userId, fetchStatus, dispatch]);

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
      clearPendingTx(); // clear on error
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
          savePendingTx('withdraw-sent'); // save before withdrawFunds call
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
    // if (!bothConfirmed) {
    //   setSocialGateOpen(true);
    //   return;
    // }
    if (chain?.id !== ENV.chainId) return switchNetwork?.(ENV.chainId);
    withdrawAmount();
  };

  const handleBothVerified = () => {
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
      {/* <SocialGateModal
        open={socialGateOpen}
        onClose={() => setSocialGateOpen(false)}
        onBothVerified={handleBothVerified}
        userId={userId}
      /> */}

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
