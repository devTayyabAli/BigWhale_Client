// ** Settings Slice
// Fetches whatsapp_number and whatsapp_channel_url from the backend
// so admin changes are reflected immediately in the client app.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/api/api";

// GET /setting — returns all Setting documents
export const fetchAppSettings = createAsyncThunk(
  "settings/fetchAppSettings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/setting");
      return res.data?.data ?? [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch settings"
      );
    }
  }
);

const initialState = {
  whatsappNumber:     null, // value of key "whatsapp_number"
  whatsappChannelUrl: null, // value of key "whatsapp_channel_url"
  status: "idle",           // "idle" | "loading" | "succeeded" | "failed"
  error:  null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppSettings.pending, (state) => {
        state.status = "loading";
        state.error  = null;
      })
      .addCase(fetchAppSettings.fulfilled, (state, action) => {
        state.status = "succeeded";
        const items = action.payload;
        items.forEach((item) => {
          if (item.key === "whatsapp_number")      state.whatsappNumber     = item.value;
          if (item.key === "whatsapp_channel_url") state.whatsappChannelUrl = item.value;
        });
      })
      .addCase(fetchAppSettings.rejected, (state, action) => {
        state.status = "failed";
        state.error  = action.payload;
      });
  },
});

export default settingsSlice.reducer;
