// ** BIGWHALE — Social Verification Slice
//
// Telegram: Login Widget → backend verifies hash + getChatMember
// WhatsApp: User joins channel → clicks "I've Joined" → backend marks verified

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/api/api";
import {
  VERIFY_TELEGRAM_ENDPOINT,
  VERIFY_WHATSAPP_ENDPOINT,
  SOCIAL_STATUS_ENDPOINT,
} from "src/api/apiEndPoint";

const initialState = {
  // Persisted in DB
  telegramJoined:     false,
  telegramUsername:   null,
  telegramVerifiedAt: null,
  whatsappJoined:     false,
  whatsappVerifiedAt: null,
  bothConfirmed:      false,

  // Loading / error per action
  fetchStatus:     "idle",   // idle | loading | succeeded | failed
  telegramStatus:  "idle",   // idle | loading | succeeded | failed
  whatsappStatus:  "idle",   // idle | loading | succeeded | failed

  telegramError:   null,
  whatsappError:   null,
  fetchError:      null,
};

// ── Thunk: fetch current social status from DB ───────────────────────
export const fetchSocialStatus = createAsyncThunk(
  "socialConfirm/fetchStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${SOCIAL_STATUS_ENDPOINT}/${userId}`);
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch social status");
    }
  }
);

// ── Thunk: verify Telegram via Login Widget data ─────────────────────
export const verifyTelegram = createAsyncThunk(
  "socialConfirm/verifyTelegram",
  async ({ userId, telegramData }, { rejectWithValue }) => {
    try {
      const res = await api.post(VERIFY_TELEGRAM_ENDPOINT, { userId, telegramData });
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Telegram verification failed"
      );
    }
  }
);

// ── Thunk: verify WhatsApp channel join ──────────────────────────────
// User clicks "I've Joined" → backend marks whatsappJoined = true
export const verifyWhatsApp = createAsyncThunk(
  "socialConfirm/verifyWhatsApp",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.post(VERIFY_WHATSAPP_ENDPOINT, { userId });
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "WhatsApp verification failed"
      );
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────
const socialConfirmSlice = createSlice({
  name: "socialConfirm",
  initialState,
  reducers: {
    clearTelegramError: (state) => { state.telegramError = null; },
    clearWhatsAppError: (state) => { state.whatsappError = null; },
    resetSocialConfirm: () => initialState,
  },
  extraReducers: (builder) => {

    // ── fetchSocialStatus ──────────────────────────────────────────
    builder
      .addCase(fetchSocialStatus.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError  = null;
      })
      .addCase(fetchSocialStatus.fulfilled, (state, action) => {
        state.fetchStatus        = "succeeded";
        state.telegramJoined     = action.payload?.telegramJoined     || false;
        state.telegramUsername   = action.payload?.telegramUsername   || null;
        state.telegramVerifiedAt = action.payload?.telegramVerifiedAt || null;
        state.whatsappJoined     = action.payload?.whatsappJoined     || false;
        state.whatsappVerifiedAt = action.payload?.whatsappVerifiedAt || null;
        state.bothConfirmed      = action.payload?.bothConfirmed      || false;
      })
      .addCase(fetchSocialStatus.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError  = action.payload;
      });

    // ── verifyTelegram ─────────────────────────────────────────────
    builder
      .addCase(verifyTelegram.pending, (state) => {
        state.telegramStatus = "loading";
        state.telegramError  = null;
      })
      .addCase(verifyTelegram.fulfilled, (state, action) => {
        state.telegramStatus     = "succeeded";
        state.telegramJoined     = true;
        state.telegramUsername   = action.payload?.telegramUsername || null;
        state.telegramVerifiedAt = new Date().toISOString();
        state.bothConfirmed      = true && state.whatsappJoined;
      })
      .addCase(verifyTelegram.rejected, (state, action) => {
        state.telegramStatus = "failed";
        state.telegramError  = action.payload;
        state.telegramJoined = false;
      });

    // ── verifyWhatsApp ─────────────────────────────────────────────
    builder
      .addCase(verifyWhatsApp.pending, (state) => {
        state.whatsappStatus = "loading";
        state.whatsappError  = null;
      })
      .addCase(verifyWhatsApp.fulfilled, (state) => {
        state.whatsappStatus     = "succeeded";
        state.whatsappJoined     = true;
        state.whatsappVerifiedAt = new Date().toISOString();
        state.bothConfirmed      = state.telegramJoined && true;
      })
      .addCase(verifyWhatsApp.rejected, (state, action) => {
        state.whatsappStatus = "failed";
        state.whatsappError  = action.payload;
        state.whatsappJoined = false;
      });
  },
});

export const {
  clearTelegramError,
  clearWhatsAppError,
  resetSocialConfirm,
} = socialConfirmSlice.actions;

export default socialConfirmSlice.reducer;
