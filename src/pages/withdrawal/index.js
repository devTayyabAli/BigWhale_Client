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
  verifyTelegram,
  getTwitterAuthUrl,
  setTwitterVerified,
  setTwitterError,
  clearTelegramError,
  clearTwitterError,
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
import Icon from "src/@core/components/icon";

// ** Next
import { useRouter } from "next/router";

// ── Telegram Login Widget loader ─────────────────────────────────────
// Injects the official Telegram Login Widget script once
const TELEGRAM_BOT_NAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "BigWhaleVerifyBot";
const TELEGRAM_GROUP_URL = "https://t.me/bigwhaleofficial";
const TWITTER_FOLLOW_URL = "https://x.com/bigwhaleofficial";

// ── useTelegramWidget hook ───────────────────────────────────────────
// Loads the Telegram Login Widget script and calls onAuth when user approves
const useTelegramWidget = (containerId, onAuth) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Remove any previous widget
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    // Register the global callback Telegram will call
    window.onTelegramAuth = (user) => { onAuth(user); };

    // Create the script element
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", TELEGRAM_BOT_NAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;

    container.appendChild(script);

    return () => {
      delete window.onTelegramAuth;
      if (container) container.innerHTML = "";
    };
  }, [containerId, onAuth]);
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
  const router   = useRouter();

  const telegramJoined    = useSelector(s => s.socialConfirm.telegramJoined);
  const telegramVerifiedAt= useSelector(s => s.socialConfirm.telegramVerifiedAt);
  const twitterFollowed   = useSelector(s => s.socialConfirm.twitterFollowed);
  const twitterVerifiedAt = useSelector(s => s.socialConfirm.twitterVerifiedAt);
  const telegramStatus    = useSelector(s => s.socialConfirm.telegramStatus);
  const twitterStatus     = useSelector(s => s.socialConfirm.twitterStatus);
  const telegramError     = useSelector(s => s.socialConfirm.telegramError);
  const twitterError      = useSelector(s => s.socialConfirm.twitterError);

  const bothVerified = telegramJoined && twitterFollowed;
  const twitterPopupRef = useRef(null);

  // ── Telegram Widget callback ──────────────────────────────────────
  const handleTelegramAuth = useCallback(async (telegramData) => {
    if (!userId || !telegramData) return;
    dispatch(clearTelegramError());
    await dispatch(verifyTelegram({ userId, telegramData }));
  }, [userId, dispatch]);

  // Load Telegram widget into the container div
  useTelegramWidget("telegram-widget-container", handleTelegramAuth);

  // ── Twitter OAuth popup ───────────────────────────────────────────
  const handleTwitterConnect = async () => {
    if (!userId) return;
    dispatch(clearTwitterError());

    // Get the OAuth URL from backend
    const result = await dispatch(getTwitterAuthUrl(userId));
    if (!getTwitterAuthUrl.fulfilled.match(result)) return;

    const authUrl = result.payload;

    // Open OAuth popup (600×700)
    const w = 600, h = 700;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top  = window.screenY + (window.outerHeight - h) / 2;
    twitterPopupRef.current = window.open(
      authUrl,
      "twitter_oauth",
      `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`
    );

    // Poll until popup closes
    const pollTimer = setInterval(() => {
      if (twitterPopupRef.current?.closed) {
        clearInterval(pollTimer);
        // Re-fetch status from DB to see if callback saved the result
        if (userId) dispatch(fetchSocialStatus(userId));
      }
    }, 500);
  };

  // ── Handle twitter_status query param from OAuth callback redirect ─
  useEffect(() => {
    if (!open) return;
    const { twitter_status, msg } = router.query;
    if (twitter_status === "verified") {
      dispatch(setTwitterVerified({}));
      // Clean URL
      router.replace("/withdrawal", undefined, { shallow: true });
    } else if (twitter_status === "not_following") {
      dispatch(setTwitterError(decodeURIComponent(msg || "You are not following BIGWHALE on X. Please follow and try again.")));
      router.replace("/withdrawal", undefined, { shallow: true });
    } else if (twitter_status === "error") {
      dispatch(setTwitterError(decodeURIComponent(msg || "Twitter verification failed. Please try again.")));
      router.replace("/withdrawal", undefined, { shallow: true });
    }
  }, [router.query, open]);

  // ── Auto-proceed when both verified ──────────────────────────────
  useEffect(() => {
    if (bothVerified && open) {
      const t = setTimeout(() => { onBothVerified(); }, 800);
      return () => clearTimeout(t);
    }
  }, [bothVerified, open]);

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
            background: "linear-gradient(90deg, #00E5FF, #A855F7, #FF2E9F)",
          },
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #00E5FF 0%, #A855F7 60%, #FF2E9F 100%)",
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
            Verification is instant — just click and approve.
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
          {/* Step 1a: Join the group */}
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

          {/* Step 1b: Telegram Login Widget — renders the official button */}
          <Box>
            <Typography sx={{ color: "rgba(200,215,245,0.5)", fontSize: "0.75rem", mb: 1, fontFamily: '"Space Grotesk", sans-serif' }}>
              2. Then verify your membership:
            </Typography>
            {/* The Telegram widget script injects a button here */}
            <Box id="telegram-widget-container" sx={{ minHeight: 40 }} />
          </Box>
        </SocialStep>

        {/* ── Step 2: Twitter/X ── */}
        <SocialStep
          stepNum="2"
          icon="tabler:brand-x"
          iconBg="linear-gradient(135deg, #1a1a1a, #444)"
          iconGlow="rgba(255,255,255,0.1)"
          title="Follow BIGWHALE on X (Twitter)"
          subtitle="Click the button below — approve in X app"
          isVerified={twitterFollowed}
          isLoading={twitterStatus === "loading"}
          errorMsg={twitterError}
          verifiedAt={twitterVerifiedAt}
        >
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {/* Step 2a: Follow the account */}
            <Button
              onClick={() => window.open(TWITTER_FOLLOW_URL, "_blank")}
              startIcon={<Icon icon="tabler:external-link" style={{ fontSize: "0.85rem" }} />}
              sx={{
                background: "linear-gradient(135deg, #1a1a1a, #444)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600, fontSize: "0.82rem",
                borderRadius: "10px", px: 2.5, py: 1,
                transition: "all 0.2s ease",
                "&:hover": { boxShadow: "0 0 12px rgba(255,255,255,0.15)", transform: "translateY(-1px)" },
              }}
            >
              1. Follow on X
            </Button>

            {/* Step 2b: Verify via OAuth */}
            <Button
              onClick={handleTwitterConnect}
              disabled={twitterStatus === "loading"}
              startIcon={
                twitterStatus === "loading"
                  ? <CircularProgress size={14} sx={{ color: "#fff" }} />
                  : <Icon icon="tabler:brand-x" style={{ fontSize: "0.85rem" }} />
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
              {twitterStatus === "loading" ? "Verifying..." : "2. Verify Follow"}
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

  // Social verification state
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

  // ── Fetch social status from DB when userId is known ─────────────
  useEffect(() => {
    if (userId && fetchStatus === "idle") {
      dispatch(fetchSocialStatus(userId));
    }
  }, [userId, fetchStatus, dispatch]);

  // ── Handle twitter_status query param when page loads ────────────
  // (Twitter OAuth callback redirects back to /withdrawal?twitter_status=...)
  useEffect(() => {
    const { twitter_status, msg } = router.query;
    if (!twitter_status) return;

    if (twitter_status === "verified") {
      dispatch(setTwitterVerified({}));
      // Re-fetch from DB to get the saved username
      if (userId) dispatch(fetchSocialStatus(userId));
      router.replace("/withdrawal", undefined, { shallow: true });
    } else if (twitter_status === "not_following") {
      dispatch(setTwitterError(decodeURIComponent(msg || "You are not following BIGWHALE on X. Please follow and try again.")));
      router.replace("/withdrawal", undefined, { shallow: true });
    } else if (twitter_status === "error" || twitter_status === "cancelled") {
      dispatch(setTwitterError(decodeURIComponent(msg || "Twitter verification failed. Please try again.")));
      router.replace("/withdrawal", undefined, { shallow: true });
    }
  }, [router.query, userId]);

  // ── Original useEffects — UNCHANGED ──────────────────────────────
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
    }
  }, [isWithdrawSentError, isWithdrawalError]);

  useEffect(() => {
    if (userId) dispatch(fundsWithdrawalAmount(userId));
  }, [userId]);

  useEffect(() => {
    if (isWithdrawalError) toast.error(withdrawTxError.message, { duration: 2000 });
  }, [isWithdrawalError]);

  useEffect(() => {
    if (isWithdrawalCompleted) dispatch(completeWithdraw(withdrawSentTx?.hash));
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

  // ── handleSubmit: check social gate first ─────────────────────────
  const handleSubmit = async () => {
    if (!bothConfirmed) {
      setSocialGateOpen(true);
      return;
    }
    if (chain?.id !== ENV.chainId) return switchNetwork?.(ENV.chainId);
    withdrawAmount();
  };

  // ── Called when both social verifications pass ────────────────────
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
      {/* Social Gate Modal */}
      <SocialGateModal
        open={socialGateOpen}
        onClose={() => setSocialGateOpen(false)}
        onBothVerified={handleBothVerified}
        userId={userId}
      />

      {/* Original withdrawal UI — UNCHANGED */}
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
