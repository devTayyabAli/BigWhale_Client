// ** BIGWHALE — Social Verification Slice
//
// Real verification flow (no "I've Joined" button):
//  1. generateWhatsAppCode(userId)  → backend creates a unique code, returns wa.me link
//  2. User opens the link → WhatsApp opens with "VERIFY-XXXXXX" pre-filled
//  3. User sends the message to the business number
//  4. Backend webhook receives it, matches the code, marks whatsappJoined = true
//  5. Frontend polls fetchSocialStatus every 3s until verified (or socket event fires)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/api/api";
import {
  WHATSAPP_CODE_ENDPOINT,
  WHATSAPP_CHECK_ENDPOINT,
  WHATSAPP_SIMULATE_ENDPOINT,
  SOCIAL_STATUS_ENDPOINT,
  VERIFY_WHATSAPP_ENDPOINT,
} from "src/api/apiEndPoint";

const initialState = {
  // Persisted in DB
  whatsappJoined:     false,
  whatsappVerifiedAt: null,
  bothConfirmed:      false,

  // Deep-link + code returned by generateWhatsAppCode (kept for legacy/dev)
  whatsappLink:       null,
  whatsappCode:       null,
  whatsappCodeExpiry: null,

  // Channel self-attestation — confirmWhatsAppJoined
  confirmStatus: "idle",   // "idle" | "loading" | "succeeded" | "failed"
  confirmError:  null,

  // Loading / error
  fetchStatus:    "idle",
  codeStatus:     "idle",

  whatsappError: null,
  fetchError:    null,
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

// ── Thunk: generate a WhatsApp verification code ─────────────────────
// Returns a wa.me deep-link. User sends the code → backend polls Meta API.
export const generateWhatsAppCode = createAsyncThunk(
  "socialConfirm/generateWhatsAppCode",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.post(WHATSAPP_CODE_ENDPOINT, { userId });
      return res.data?.data; // { link, expiresAt }
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to generate WhatsApp code"
      );
    }
  }
);

// ── Thunk: poll backend to check if code was received ────────────────
// Called every 3s after user sends the message. Backend reads DB.
// Timestamp param busts browser cache — prevents 304 Not Modified responses.
export const checkWhatsAppCode = createAsyncThunk(
  "socialConfirm/checkWhatsAppCode",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${WHATSAPP_CHECK_ENDPOINT}/${userId}`, {
        params: { _t: Date.now() }, // cache-buster
        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
      });
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Check failed"
      );
    }
  }
);

// ── Thunk: DEV ONLY — simulate receiving the WhatsApp message ─────────
// Calls /auth/whatsapp-simulate so you can test without ngrok/Meta webhook.
export const simulateVerify = createAsyncThunk(
  "socialConfirm/simulateVerify",
  async (code, { rejectWithValue }) => {
    try {
      const res = await api.post(WHATSAPP_SIMULATE_ENDPOINT, { code });
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Simulation failed"
      );
    }
  }
);

// ── Thunk: confirm WhatsApp channel follow (self-attestation) ──────────
// User clicks "Follow Channel" → opens channel URL → clicks "I've Joined"
// → this thunk calls POST /auth/verify-whatsapp → sets whatsappJoined = true
export const confirmWhatsAppJoined = createAsyncThunk(
  "socialConfirm/confirmJoined",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.post(VERIFY_WHATSAPP_ENDPOINT, { userId });
      return res.data?.data; // { whatsappJoined: true }
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to confirm channel membership"
      );
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────
const socialConfirmSlice = createSlice({
  name: "socialConfirm",
  initialState,
  reducers: {
    clearWhatsAppError: (state) => { state.whatsappError = null; },
    clearConfirmError:  (state) => { state.confirmError = null; state.confirmStatus = "idle"; },
    resetSocialConfirm: () => initialState,
    // Called by socket event "whatsappVerified"
    markWhatsAppVerified: (state) => {
      state.whatsappJoined     = true;
      state.whatsappVerifiedAt = new Date().toISOString();
      state.bothConfirmed      = true;
      state.confirmStatus      = "succeeded";
      state.whatsappLink       = null;
      state.whatsappCode       = null;
      state.whatsappCodeExpiry = null;
    },
    resetWhatsAppVerification: (state) => {
      state.whatsappJoined     = false;
      state.whatsappVerifiedAt = null;
      state.bothConfirmed      = false;
      state.confirmStatus      = "idle";
      state.confirmError       = null;
      state.whatsappLink       = null;
      state.whatsappCode       = null;
      state.whatsappCodeExpiry = null;
      state.codeStatus         = "idle";
      state.whatsappError      = null;
    },
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
        state.whatsappJoined     = action.payload?.whatsappJoined     || false;
        state.whatsappVerifiedAt = action.payload?.whatsappVerifiedAt || null;
        state.bothConfirmed      = action.payload?.bothConfirmed      || false;
        // If server reset the join status, clear the link too
        if (!action.payload?.whatsappJoined) {
          state.whatsappLink       = null;
          state.whatsappCodeExpiry = null;
          state.codeStatus         = "idle";
        }
      })
      .addCase(fetchSocialStatus.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError  = action.payload;
      });

    // ── generateWhatsAppCode ───────────────────────────────────────
    builder
      .addCase(generateWhatsAppCode.pending, (state) => {
        state.codeStatus    = "loading";
        state.whatsappError = null;
        state.whatsappCode  = null;
      })
      .addCase(generateWhatsAppCode.fulfilled, (state, action) => {
        state.codeStatus         = "succeeded";
        state.whatsappLink       = action.payload?.link      || null;
        state.whatsappCode       = action.payload?.code      || null;
        state.whatsappCodeExpiry = action.payload?.expiresAt || null;
      })
      .addCase(generateWhatsAppCode.rejected, (state, action) => {
        state.codeStatus    = "failed";
        state.whatsappError = action.payload;
      });

    // ── checkWhatsAppCode (polling) ────────────────────────────────
    builder
      .addCase(checkWhatsAppCode.fulfilled, (state, action) => {
        if (action.payload?.whatsappJoined) {
          state.whatsappJoined     = true;
          state.whatsappVerifiedAt = new Date().toISOString();
          state.bothConfirmed      = true;
          state.whatsappLink       = null;
          state.whatsappCode       = null;
          state.whatsappCodeExpiry = null;
        }
      });

    // ── simulateVerify (dev only) ──────────────────────────────────
    builder
      .addCase(simulateVerify.fulfilled, (state, action) => {
        if (action.payload?.whatsappJoined) {
          state.whatsappJoined     = true;
          state.whatsappVerifiedAt = new Date().toISOString();
          state.bothConfirmed      = true;
          state.confirmStatus      = "succeeded";
          state.whatsappLink       = null;
          state.whatsappCode       = null;
          state.whatsappCodeExpiry = null;
        }
      })
      .addCase(simulateVerify.rejected, (state, action) => {
        state.whatsappError = action.payload;
      });

    // ── confirmWhatsAppJoined (channel self-attestation) ───────────
    builder
      .addCase(confirmWhatsAppJoined.pending, (state) => {
        state.confirmStatus = "loading";
        state.confirmError  = null;
      })
      .addCase(confirmWhatsAppJoined.fulfilled, (state) => {
        state.confirmStatus      = "succeeded";
        state.whatsappJoined     = true;
        state.whatsappVerifiedAt = new Date().toISOString();
        state.bothConfirmed      = true;
      })
      .addCase(confirmWhatsAppJoined.rejected, (state, action) => {
        state.confirmStatus = "failed";
        state.confirmError  = action.payload;
      });
  },
});

export const {
  clearWhatsAppError,
  clearConfirmError,
  resetSocialConfirm,
  markWhatsAppVerified,
  resetWhatsAppVerification,
} = socialConfirmSlice.actions;

export { confirmWhatsAppJoined };

export default socialConfirmSlice.reducer;
