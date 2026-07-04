import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  LEVEL_BONUS_ENDPOINT,
  REFERRAL_STATS_ENDPOINT,
} from "src/api/apiEndPoint";
import api from "src/api/api";

const initialState = {
  // Separate status per action — prevents one action blocking another's fetch guard
  levelBonusStatus:   "idle",
  referralStatsStatus:"idle",
  error: null,
  levelBonus: null,
  referralStats: null,
};

export const getLevelBonus = createAsyncThunk(
  "referral/level-bonus",
  async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get(LEVEL_BONUS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
export const getReferralStats = createAsyncThunk(
  "referral/stats",
  async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get(REFERRAL_STATS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const levelBonusSlice = createSlice({
  name: "levelBonus",
  initialState,
  reducers: {
    resetLevelBonusStatus: (state) => {
      state.referralStatsStatus = "idle";
      state.levelBonusStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLevelBonus.pending, (state) => {
        state.levelBonusStatus = "loading";
      })
      .addCase(getLevelBonus.fulfilled, (state, action) => {
        state.levelBonusStatus = "succeeded";
        state.levelBonus = action.payload;
      })
      .addCase(getLevelBonus.rejected, (state, action) => {
        state.levelBonusStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(getReferralStats.pending, (state) => {
        state.referralStatsStatus = "loading";
      })
      .addCase(getReferralStats.fulfilled, (state, action) => {
        state.referralStatsStatus = "succeeded";
        state.referralStats = action.payload;
      })
      .addCase(getReferralStats.rejected, (state, action) => {
        state.referralStatsStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetLevelBonusStatus } = levelBonusSlice.actions;

export default levelBonusSlice.reducer;
