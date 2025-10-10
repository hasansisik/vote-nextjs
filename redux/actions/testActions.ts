import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

// Test Interfaces
export interface CreateTestPayload {
  title: {
    tr: string;
    en?: string;
    de?: string;
    fr?: string;
  };
  description?: {
    tr?: string;
    en?: string;
    de?: string;
    fr?: string;
  };
  coverImage?: string;
  headerText?: {
    tr?: string;
    en?: string;
    de?: string;
    fr?: string;
  };
  footerText?: {
    tr?: string;
    en?: string;
    de?: string;
    fr?: string;
  };
  categories: string[];
  trend?: boolean;
  popular?: boolean;
  endDate?: string;
  options: Array<{
    title: {
      tr: string;
      en?: string;
      de?: string;
      fr?: string;
    };
    image: string;
    customFields?: Array<{
      fieldName: {
        tr: string;
        en?: string;
        de?: string;
        fr?: string;
      };
      fieldValue: {
        tr: string;
        en?: string;
        de?: string;
        fr?: string;
      };
    }>;
  }>;
}

export interface UpdateTestPayload {
  title?: {
    tr?: string;
    en?: string;
    de?: string;
    fr?: string;
  };
  description?: {
    tr?: string;
    en?: string;
    de?: string;
    fr?: string;
  };
  coverImage?: string;
  headerText?: {
    tr?: string;
    en?: string;
    de?: string;
    fr?: string;
  };
  footerText?: {
    tr?: string;
    en?: string;
    de?: string;
    fr?: string;
  };
  categories?: string[];
  isActive?: boolean;
  trend?: boolean;
  popular?: boolean;
  endDate?: string;
  options?: Array<{
    title: {
      tr?: string;
      en?: string;
      de?: string;
      fr?: string;
    };
    image: string;
    customFields?: Array<{
      fieldName: {
        tr?: string;
        en?: string;
        de?: string;
        fr?: string;
      };
      fieldValue: {
        tr?: string;
        en?: string;
        de?: string;
        fr?: string;
      };
    }>;
  }>;
}

export interface VoteTestPayload {
  testId: string;
  optionId: string;
}

export interface VoteSessionPayload {
  testId: string;
  sessionId: string;
  optionId: string;
}

export interface StartVoteSessionPayload {
  testId: string;
}

// Test Actions
export const createTest = createAsyncThunk(
  "test/createTest",
  async (formData: CreateTestPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/tests`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Create test error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("İstenen kaynak bulunamadı.");
        } else if (status === 400) {
          return thunkAPI.rejectWithValue(message);
        } else {
          return thunkAPI.rejectWithValue(`Sunucu hatası (${status}): ${message}`);
        }
      } else if (error.request) {
        return thunkAPI.rejectWithValue("Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        return thunkAPI.rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
      }
    }
  }
);

export const getAllTests = createAsyncThunk(
  "test/getAllTests",
  async (params: any = {}, thunkAPI) => {
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      ) as Record<string, string>;
      const queryString = new URLSearchParams(filteredParams).toString();
      const url = `${server}/tests${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getSingleTest = createAsyncThunk(
  "test/getSingleTest",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${server}/tests/${id}`, config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getSingleTestBySlug = createAsyncThunk(
  "test/getSingleTestBySlug",
  async ({ slug, locale = 'tr' }: { slug: string; locale?: string }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          locale
        }
      };
      const response = await axios.get(`${server}/tests/slug/${slug}`, config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const updateTest = createAsyncThunk(
  "test/updateTest",
  async ({ id, formData }: { id: string; formData: UpdateTestPayload }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${server}/tests/${id}`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Update test error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("Test bulunamadı.");
        } else if (status === 400) {
          return thunkAPI.rejectWithValue(message);
        } else {
          return thunkAPI.rejectWithValue(`Sunucu hatası (${status}): ${message}`);
        }
      } else if (error.request) {
        return thunkAPI.rejectWithValue("Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        return thunkAPI.rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
      }
    }
  }
);

export const deleteTest = createAsyncThunk(
  "test/deleteTest",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${server}/tests/${id}`,
        config
      );
      return { id, message: response.data.message };
    } catch (error: any) {
      console.error("Delete test error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("Test bulunamadı.");
        } else if (status === 400) {
          return thunkAPI.rejectWithValue(message);
        } else {
          return thunkAPI.rejectWithValue(`Sunucu hatası (${status}): ${message}`);
        }
      } else if (error.request) {
        return thunkAPI.rejectWithValue("Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        return thunkAPI.rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
      }
    }
  }
);

export const resetTestVotes = createAsyncThunk(
  "test/resetTestVotes",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/tests/${id}/reset`,
        {},
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getTrendTests = createAsyncThunk(
  "test/getTrendTests",
  async (params: any = {}, thunkAPI) => {
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      ) as Record<string, string>;
      const queryString = new URLSearchParams(filteredParams).toString();
      const url = `${server}/tests/trend${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getPopularTests = createAsyncThunk(
  "test/getPopularTests",
  async (params: any = {}, thunkAPI) => {
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      ) as Record<string, string>;
      const queryString = new URLSearchParams(filteredParams).toString();
      const url = `${server}/tests/popular${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getTestsByCategorySlug = createAsyncThunk(
  "test/getTestsByCategorySlug",
  async (params: { slug: string; limit?: number; page?: number }, thunkAPI) => {
    try {
      const { slug, limit = 20, page = 1 } = params;
      const queryString = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString()
      }).toString();
      const url = `${server}/tests/category-slug/${slug}?${queryString}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getUserVotedTests = createAsyncThunk(
  "test/getUserVotedTests",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${server}/tests/user/voted`, config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Vote Session Actions
export const startVoteSession = createAsyncThunk(
  "test/startVoteSession",
  async (payload: StartVoteSessionPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };
      const response = await axios.post(
        `${server}/vote-sessions/${payload.testId}/start`,
        {},
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getVoteSession = createAsyncThunk(
  "test/getVoteSession",
  async ({ testId, sessionId }: { testId: string; sessionId: string }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };
      const response = await axios.get(
        `${server}/vote-sessions/${testId}/session/${sessionId}`,
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const voteOnOption = createAsyncThunk(
  "test/voteOnOption",
  async (payload: VoteSessionPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };
      const response = await axios.post(
        `${server}/vote-sessions/${payload.testId}/session/${payload.sessionId}/vote`,
        { optionId: payload.optionId },
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const voteOnTest = createAsyncThunk(
  "test/voteOnTest",
  async (payload: VoteTestPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };
      
      const response = await axios.post(
        `${server}/tests/${payload.testId}/vote`,
        { optionId: payload.optionId },
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const voteOnTestBySlug = createAsyncThunk(
  "test/voteOnTestBySlug",
  async (payload: { slug: string; optionId: string; locale?: string }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        params: {
          locale: payload.locale || 'tr'
        }
      };
      
      const response = await axios.post(
        `${server}/tests/slug/${payload.slug}/vote`,
        { optionId: payload.optionId },
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getTestResults = createAsyncThunk(
  "test/getTestResults",
  async (testId: string, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/tests/${testId}/results`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getTestResultsBySlug = createAsyncThunk(
  "test/getTestResultsBySlug",
  async ({ slug, locale = 'tr' }: { slug: string; locale?: string }, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/tests/slug/${slug}/results`, {
        params: { locale }
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getTestResultsWithStats = createAsyncThunk(
  "test/getTestResultsWithStats",
  async (testId: string, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/vote-sessions/${testId}/results`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getUserVoteSessions = createAsyncThunk(
  "test/getUserVoteSessions",
  async (testId: string | undefined, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const url = testId 
        ? `${server}/vote-sessions/user/sessions/${testId}`
        : `${server}/vote-sessions/user/sessions`;
      const response = await axios.get(url, config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const deleteVoteSession = createAsyncThunk(
  "test/deleteVoteSession",
  async ({ testId, sessionId }: { testId: string; sessionId: string }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };
      const response = await axios.delete(
        `${server}/vote-sessions/${testId}/session/${sessionId}`,
        config
      );
      return { testId, sessionId, message: response.data.message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get Global Stats Action
export const getGlobalStats = createAsyncThunk(
  "test/getGlobalStats",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/tests/stats`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Clear Error Action
export const clearTestError = createAsyncThunk(
  "test/clearTestError",
  async () => {
    return null;
  }
);

