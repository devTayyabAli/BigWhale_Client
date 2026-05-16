// ** BIGWHALE — Social OAuth Verification Slice
//
// Telegram: Login Widget → backend verifies hash + getChatMember
// Twitter:  OAuth 2.0 PKCE popup → backend callback → checkFollowing
//
// User just clicks a button — no username input needed.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/api/api";
import {
  VERIFY_TELEGRAM_ENDPOINT,
  TWITTER_AUTH_URL_ENDPOINT,
  SOCIAL_STATUS_ENDPOINT,
} from "src/api/apiEndPoint";

const initialState = {
  // Persisted in DB
  telegramJoined:     false,
  telegramUsername:   null,
  telegramVerifiedAt: null,
  twitterFollowed:    false,
  twitterUsername:    null,
  twitterVerifiedAt:  null,
  bothConfirmed:      false,

  // Loading / error per action
  fetchStatus:    "idle",   // idle | loading | succeeded | failed
  telegramStatus: "idle",   // idle | loading | succeeded | failed
  twitterStatus:  "idle",   // idle | loading | succeeded | failed

  telegramError:  null,
  twitterError:   null,
  fetchError:     null,
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
// Called after the Telegram Login Widget sends auth data to our frontend
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

// ── Thunk: get Twitter OAuth URL and open popup ──────────────────────
// Returns the auth URL; the actual verification happens via backend callback
export const getTwitterAuthUrl = createAsyncThunk(
  "socialConfirm/getTwitterAuthUrl",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${TWITTER_AUTH_URL_ENDPOINT}?userId=${userId}`);
      return res.data?.data?.authUrl;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to get Twitter auth URL"
      );
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────
const socialConfirmSlice = createSlice({
  name: "socialConfirm",
  initialState,
  reducers: {
    // Called after Twitter OAuth callback redirects back with ?twitter_status=verified
    setTwitterVerified: (state, action) => {
      state.twitterFollowed = true;
      state.twitterUsername = action.payload?.username || null;
      state.twitterVerifiedAt = new Date().toISOString();
      state.twitterStatus = "succeeded";
      state.twitterError  = null;
      state.bothConfirmed = state.telegramJoined && true;
    },
    setTwitterError: (state, action) => {
      state.twitterStatus = "failed";
      state.twitterError  = action.payload;
    },
    clearTelegramError: (state) => { state.telegramError = null; },
    clearTwitterError:  (state) => { state.twitterError  = null; },
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
        state.fetchStatus       = "succeeded";
        state.telegramJoined    = action.payload?.telegramJoined    || false;
        state.telegramUsername  = action.payload?.telegramUsername  || null;
        state.telegramVerifiedAt= action.payload?.telegramVerifiedAt|| null;
        state.twitterFollowed   = action.payload?.twitterFollowed   || false;
        state.twitterUsername   = action.payload?.twitterUsername   || null;
        state.twitterVerifiedAt = action.payload?.twitterVerifiedAt || null;
        state.bothConfirmed     = action.payload?.bothConfirmed     || false;
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
        state.telegramStatus    = "succeeded";
        state.telegramJoined    = true;
        state.telegramUsername  = action.payload?.telegramUsername || null;
        state.telegramVerifiedAt= new Date().toISOString();
        state.bothConfirmed     = true && state.twitterFollowed;
      })
      .addCase(verifyTelegram.rejected, (state, action) => {
        state.telegramStatus = "failed";
        state.telegramError  = action.payload;
        state.telegramJoined = false;
      });

    // ── getTwitterAuthUrl ──────────────────────────────────────────
    builder
      .addCase(getTwitterAuthUrl.pending, (state) => {
        state.twitterStatus = "loading";
        state.twitterError  = null;
      })
      .addCase(getTwitterAuthUrl.fulfilled, (state) => {
        // URL fetched — popup will open; status stays loading until callback
        // twitterStatus stays "loading" until setTwitterVerified or setTwitterError is called
      })
      .addCase(getTwitterAuthUrl.rejected, (state, action) => {
        state.twitterStatus = "failed";
        state.twitterError  = action.payload;
      });
  },
});

export const {
  setTwitterVerified,
  setTwitterError,
  clearTelegramError,
  clearTwitterError,
  resetSocialConfirm,
} = socialConfirmSlice.actions;

export default socialConfirmSlice.reducer;
