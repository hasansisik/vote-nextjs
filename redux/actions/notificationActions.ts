import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface NotificationParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: string;
}

export interface Notification {
  _id: string;
  user: string;
  type: string;
  title: string;
  message: string;
  icon: string;
  color: string;
  priority: string;
  isRead: boolean;
  actionUrl: string;
  metadata?: {
    testId?: string;
    categoryId?: string;
    voteCount?: number;
    stats?: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
}

// Get User Notifications
export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async (params: NotificationParams = {}, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      
      const url = `${server}/notifications${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url, config);
      
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Get Notification Stats
export const getNotificationStats = createAsyncThunk(
  "notifications/getNotificationStats",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("No access token found");
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${server}/notifications/stats`, config);
      return response.data;
    } catch (error: any) {
      console.error('Notification stats error:', error);
      // Return default stats instead of rejecting
      return {
        success: true,
        stats: {
          total: 0,
          unread: 0,
          read: 0
        }
      };
    }
  }
);

// Mark Notification as Read
export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.patch(
        `${server}/notifications/${notificationId}/read`,
        {},
        config
      );
      
      return { notificationId, ...response.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Mark All Notifications as Read
export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.patch(
        `${server}/notifications/read-all`,
        {},
        config
      );
      
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Delete Notification
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (notificationId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.delete(
        `${server}/notifications/${notificationId}`,
        config
      );
      
      return { notificationId, ...response.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Clear Error Action
export const clearNotificationError = createAsyncThunk(
  "notifications/clearError",
  async () => {
    return null;
  }
);
