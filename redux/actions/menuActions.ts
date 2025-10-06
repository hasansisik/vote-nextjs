import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

// Menu Action Types
export interface CreateMenuPayload {
  testCategoryId: string;
  color: string;
  order?: number;
}

export interface UpdateMenuPayload {
  testCategoryId?: string;
  color?: string;
  order?: number;
}

export interface UpdateMenuOrderPayload {
  menus: Array<{
    id: string;
    order: number;
  }>;
}

// Get All Menus (Public - no authentication required)
export const getAllMenus = createAsyncThunk(
  "menu/getAllMenus",
  async (params: Record<string, string> = {}, thunkAPI) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${server}/menus${queryString ? `?${queryString}` : ''}`;
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

// Get Active Menus (Public - no authentication required)
export const getActiveMenus = createAsyncThunk(
  "menu/getActiveMenus",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/menus/active`);
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

// Get Single Menu
export const getMenu = createAsyncThunk(
  "menu/getMenu",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${server}/menus/${id}`, config);
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

// Create Menu
export const createMenu = createAsyncThunk(
  "menu/createMenu",
  async (formData: CreateMenuPayload, thunkAPI) => {
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
        `${server}/menus`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Create menu error:", error);
      
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

// Update Menu
export const updateMenu = createAsyncThunk(
  "menu/updateMenu",
  async ({ id, formData }: { id: string; formData: UpdateMenuPayload }, thunkAPI) => {
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
        `${server}/menus/${id}`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Update menu error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("Menü bulunamadı.");
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

// Delete Menu
export const deleteMenu = createAsyncThunk(
  "menu/deleteMenu",
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
        `${server}/menus/${id}`,
        config
      );
      return { id, message: response.data.message };
    } catch (error: any) {
      console.error("Delete menu error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("Menü bulunamadı.");
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


// Update Menu Order
export const updateMenuOrder = createAsyncThunk(
  "menu/updateMenuOrder",
  async (formData: UpdateMenuOrderPayload, thunkAPI) => {
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
        `${server}/menus/update-order`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Update menu order error:", error);
      
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

// Clear All Menus (for development)
export const clearAllMenus = createAsyncThunk(
  "menu/clearAllMenus",
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
      const response = await axios.delete(
        `${server}/menus/clear-all`,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Clear all menus error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
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

// Clear Menu Error Action
export const clearMenuError = createAsyncThunk(
  "menu/clearMenuError",
  async () => {
    return null;
  }
);
