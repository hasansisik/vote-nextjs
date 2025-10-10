'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { loadUser } from '@/redux/actions/userActions';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, user } = useAppSelector((state) => state.user);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthenticated && !loading) {
      dispatch(loadUser()).finally(() => {
        setAuthChecked(true);
      });
    } else {
      // No token or already authenticated, mark as checked
      setAuthChecked(true);
    }
  }, [dispatch, isAuthenticated, loading]);

  // Show loading spinner while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
