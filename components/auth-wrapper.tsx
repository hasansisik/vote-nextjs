'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '@/redux/actions/userActions';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { loading, isAuthenticated, user } = useSelector((state: any) => state.user);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthenticated && !loading) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated, loading]);

  return <>{children}</>;
}
