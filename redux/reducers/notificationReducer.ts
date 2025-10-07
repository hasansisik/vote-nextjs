import { createReducer } from "@reduxjs/toolkit";
import {
  getNotifications,
  getNotificationStats,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotificationError
} from "../actions/notificationActions";

interface NotificationState {
  notifications: any[];
  stats: {
    total: number;
    unread: number;
    read: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  stats: {
    total: 0,
    unread: 0,
    read: 0
  },
  pagination: null,
  loading: false,
  error: null,
  message: null
};

export const notificationReducer = createReducer(initialState, (builder) => {
  builder
    // Get Notifications
    .addCase(getNotifications.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = action.payload.notifications;
      state.pagination = action.payload.pagination;
      state.stats.unread = action.payload.unreadCount;
      state.error = null;
    })
    .addCase(getNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Get Notification Stats
    .addCase(getNotificationStats.pending, (state) => {
      // No loading state for stats
    })
    .addCase(getNotificationStats.fulfilled, (state, action) => {
      state.stats = action.payload.stats;
    })
    .addCase(getNotificationStats.rejected, (state, action) => {
      // Silent fail for stats
    })
    
    // Mark as Read
    .addCase(markAsRead.pending, (state) => {
      state.loading = true;
    })
    .addCase(markAsRead.fulfilled, (state, action) => {
      state.loading = false;
      const notification = state.notifications.find(
        n => n._id === action.payload.notificationId
      );
      if (notification) {
        notification.isRead = true;
      }
      state.stats.unread = Math.max(0, state.stats.unread - 1);
      state.stats.read += 1;
      state.message = action.payload.message;
    })
    .addCase(markAsRead.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Mark All as Read
    .addCase(markAllAsRead.pending, (state) => {
      state.loading = true;
    })
    .addCase(markAllAsRead.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.stats.read += state.stats.unread;
      state.stats.unread = 0;
      state.message = action.payload.message;
    })
    .addCase(markAllAsRead.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Delete Notification
    .addCase(deleteNotification.pending, (state) => {
      state.loading = true;
    })
    .addCase(deleteNotification.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = state.notifications.filter(
        n => n._id !== action.payload.notificationId
      );
      state.stats.total -= 1;
      // Check if the deleted notification was unread
      const deletedNotification = state.notifications.find(
        n => n._id === action.payload.notificationId
      );
      if (deletedNotification && !deletedNotification.isRead) {
        state.stats.unread = Math.max(0, state.stats.unread - 1);
      } else if (deletedNotification && deletedNotification.isRead) {
        state.stats.read = Math.max(0, state.stats.read - 1);
      }
      state.message = action.payload.message;
    })
    .addCase(deleteNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Clear Error
    .addCase(clearNotificationError.fulfilled, (state) => {
      state.error = null;
      state.message = null;
    });
});

export default notificationReducer;
