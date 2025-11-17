import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface Language {
  code: string;
  name: string;
  flag: string;
  enabled: boolean;
}

export interface LanguageSettings {
  availableLanguages: Language[];
  defaultLanguage: string;
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
}

export interface SystemSettings {
  _id: string;
  languages: LanguageSettings;
  general: GeneralSettings;
  homePageHtmlContent?: {
    tr?: string;
    en?: string;
    de?: string;
    fr?: string;
  };
  lastUpdatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSettingsPayload {
  languages?: Partial<LanguageSettings>;
  general?: Partial<GeneralSettings>;
  homePageHtmlContent?: {
    tr?: string;
    en?: string;
    de?: string;
    fr?: string;
  };
}

// Get System Settings (Admin only)
export const getSettings = createAsyncThunk(
  "settings/getSettings",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${server}/settings`, config);
      return data.settings;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Get Enabled Languages (Public endpoint)
export const getEnabledLanguages = createAsyncThunk(
  "settings/getEnabledLanguages",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/settings/languages`);
      return data.languages;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Get Home Page HTML Content (Public endpoint)
export const getHomePageHtmlContent = createAsyncThunk(
  "settings/getHomePageHtmlContent",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/settings/homepage-content`);
      return data.homePageHtmlContent || {};
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Update System Settings (Admin only)
export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (payload: UpdateSettingsPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(`${server}/settings`, payload, config);
      return data.settings;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Toggle Language Status (Admin only)
export const toggleLanguage = createAsyncThunk(
  "settings/toggleLanguage",
  async (
    { languageCode, enabled }: { languageCode: string; enabled: boolean },
    thunkAPI
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.patch(
        `${server}/settings/language/${languageCode}`,
        { enabled },
        config
      );
      return data.settings;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Update Default Language (Admin only)
export const updateDefaultLanguage = createAsyncThunk(
  "settings/updateDefaultLanguage",
  async (languageCode: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.patch(
        `${server}/settings/default-language`,
        { languageCode },
        config
      );
      return data.settings;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

