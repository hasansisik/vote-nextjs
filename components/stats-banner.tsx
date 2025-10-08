'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { getGlobalStats } from '@/redux/actions/testActions';
import { useTranslations } from 'next-intl';
import { Skeleton } from './ui/skeleton';

export default function StatsBanner() {
  const t = useTranslations('StatsBanner');
  const dispatch = useAppDispatch();
  const { globalStats, globalStatsLoading } = useSelector((state: any) => state.test);

  useEffect(() => {
    dispatch(getGlobalStats());
  }, [dispatch]);

  return (
    <div className="bg-white  py-3">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-center gap-6 lg:gap-12">
          
          {/* İlk İstatistik - Toplam Test */}
          <div className="flex items-center gap-2">
            <div className="text-lg lg:text-xl font-bold text-gray-900">
              {globalStatsLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                (globalStats?.totalTests || 0).toLocaleString('tr-TR')
              )}
            </div>
            <div className="text-xs text-gray-700 italic uppercase tracking-wide">
              {t('test')}
            </div>
          </div>

          {/* Ayırıcı çizgi */}
          <div className="w-px h-6 bg-gray-300"></div>

          {/* İkinci İstatistik - Toplam Oy */}
          <div className="flex items-center gap-2">
            <div className="text-lg lg:text-xl font-bold text-gray-900">
              {globalStatsLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                (globalStats?.totalVotes || 0).toLocaleString('tr-TR')
              )}
            </div>
            <div className="text-xs text-gray-700 italic uppercase tracking-wide">
              {t('vote')}
            </div>
          </div>

          {/* Ayırıcı çizgi */}
          <div className="w-px h-6 bg-gray-300"></div>

          {/* Üçüncü İstatistik - Toplam Kullanıcı */}
          <div className="flex items-center gap-2">
            <div className="text-lg lg:text-xl font-bold font-bold text-gray-900">
              {globalStatsLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                (globalStats?.totalUsers || 0).toLocaleString('tr-TR')
              )}
            </div>
            <div className="text-xs text-gray-700 italic uppercase tracking-wide">
              {t('user')}
            </div>
          </div>

        </div>
        
        {/* Mobile Layout */}
        <div className="lg:hidden flex items-center justify-center gap-8">
          
          {/* İlk İstatistik - Toplam Test */}
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold text-gray-900">
              {globalStatsLoading ? (
                <Skeleton className="h-4 w-12" />
              ) : (
                (globalStats?.totalTests || 0).toLocaleString('tr-TR')
              )}
            </div>
            <div className="text-xs text-gray-700 italic uppercase tracking-wide">
              {t('test')}
            </div>
          </div>

          {/* İkinci İstatistik - Toplam Oy */}
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold text-gray-900">
              {globalStatsLoading ? (
                <Skeleton className="h-4 w-12" />
              ) : (
                (globalStats?.totalVotes || 0).toLocaleString('tr-TR')
              )}
            </div>
            <div className="text-xs text-gray-700 italic uppercase tracking-wide">
              {t('vote')}
            </div>
          </div>

          {/* Üçüncü İstatistik - Toplam Kullanıcı */}
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold text-gray-900">
              {globalStatsLoading ? (
                <Skeleton className="h-4 w-12" />
              ) : (
                (globalStats?.totalUsers || 0).toLocaleString('tr-TR')
              )}
            </div>
            <div className="text-xs text-gray-700 italic uppercase tracking-wide">
              {t('user')}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
