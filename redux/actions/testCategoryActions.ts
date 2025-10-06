import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

// Test Category Action Types
export interface CreateTestCategoryPayload {
  name: string;
  description?: string;
  icon?: string;
  order?: number;
}

export interface UpdateTestCategoryPayload {
  name?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateTestCategoryOrderPayload {
  categories: Array<{
    id: string;
    order: number;
  }>;
}

// Get All Test Categories (Public - no authentication required)
export const getAllTestCategories = createAsyncThunk(
  "testCategory/getAllTestCategories",
  async (params: Record<string, string> = {}, thunkAPI) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${server}/test-categories${queryString ? `?${queryString}` : ''}`;
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

// Get Active Test Categories (Public - no authentication required)
export const getActiveTestCategories = createAsyncThunk(
  "testCategory/getActiveTestCategories",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/test-categories/active`);
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

// Get Single Test Category
export const getTestCategory = createAsyncThunk(
  "testCategory/getTestCategory",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${server}/test-categories/${id}`, config);
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

// Create Test Category
export const createTestCategory = createAsyncThunk(
  "testCategory/createTestCategory",
  async (formData: CreateTestCategoryPayload, thunkAPI) => {
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
        `${server}/test-categories`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Create test category error:", error);
      
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

// Update Test Category
export const updateTestCategory = createAsyncThunk(
  "testCategory/updateTestCategory",
  async ({ id, formData }: { id: string; formData: UpdateTestCategoryPayload }, thunkAPI) => {
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
      const response = await axios.put(
        `${server}/test-categories/${id}`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Update test category error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("Test kategorisi bulunamadı.");
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

// Delete Test Category
export const deleteTestCategory = createAsyncThunk(
  "testCategory/deleteTestCategory",
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
        `${server}/test-categories/${id}`,
        config
      );
      return { id, message: response.data.message };
    } catch (error: any) {
      console.error("Delete test category error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("Test kategorisi bulunamadı.");
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

// Toggle Test Category Status
export const toggleTestCategoryStatus = createAsyncThunk(
  "testCategory/toggleTestCategoryStatus",
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
      const response = await axios.patch(
        `${server}/test-categories/${id}/toggle-status`,
        {},
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Toggle test category status error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("Test kategorisi bulunamadı.");
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

// Update Test Category Order
export const updateTestCategoryOrder = createAsyncThunk(
  "testCategory/updateTestCategoryOrder",
  async (formData: UpdateTestCategoryOrderPayload, thunkAPI) => {
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
        `${server}/test-categories/update-order`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Update test category order error:", error);
      
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

// Clear Test Category Error Action
export const clearTestCategoryError = createAsyncThunk(
  "testCategory/clearTestCategoryError",
  async () => {
    return null;
  }
);
