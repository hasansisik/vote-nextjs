import { createReducer } from "@reduxjs/toolkit";
import {
  getSettings,
  getEnabledLanguages,
  updateSettings,
  toggleLanguage,
  updateDefaultLanguage,
  SystemSettings,
  Language,
} from "../actions/settingsActions";

interface SettingsState {
  settings: SystemSettings | null;
  enabledLanguages: Language[];
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: SettingsState = {
  settings: null,
  enabledLanguages: [],
  loading: false,
  error: null,
  message: null,
};

export const settingsReducer = createReducer(initialState, (builder) => {
  builder
    // Get Settings
    .addCase(getSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.settings = action.payload;
      state.error = null;
    })
    .addCase(getSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get Enabled Languages
    .addCase(getEnabledLanguages.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getEnabledLanguages.fulfilled, (state, action) => {
      state.loading = false;
      state.enabledLanguages = action.payload;
      state.error = null;
    })
    .addCase(getEnabledLanguages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Update Settings
    .addCase(updateSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.settings = action.payload;
      state.message = "Ayarlar başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Toggle Language
    .addCase(toggleLanguage.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(toggleLanguage.fulfilled, (state, action) => {
      state.loading = false;
      state.settings = action.payload;
      state.error = null;
    })
    .addCase(toggleLanguage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Update Default Language
    .addCase(updateDefaultLanguage.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateDefaultLanguage.fulfilled, (state, action) => {
      state.loading = false;
      state.settings = action.payload;
      state.message = "Varsayılan dil güncellendi";
      state.error = null;
    })
    .addCase(updateDefaultLanguage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
});

export default settingsReducer;

