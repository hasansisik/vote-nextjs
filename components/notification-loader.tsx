'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getNotificationStats, getNotifications } from '@/redux/actions/notificationActions';

export default function NotificationLoader() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);

  // Load notification stats when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getNotificationStats() as any);
      dispatch(getNotifications({ page: 1, limit: 50 }) as any);
    }
  }, [dispatch, isAuthenticated]);

  // This component doesn't render anything, it just loads notifications
  return null;
}
