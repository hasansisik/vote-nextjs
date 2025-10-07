'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { loadUser } from '@/redux/actions/userActions';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, user } = useAppSelector((state) => state.user);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthenticated && !loading) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated, loading]);

  return <>{children}</>;
}
