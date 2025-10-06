'use client';

import React, { useState, useEffect } from 'react';

interface StatsData {
  totalVotes: string;
  totalVoters: string;
  totalRankings: string;
}

export default function StatsBanner() {
  const [statsData, setStatsData] = useState<StatsData>({
    totalVotes: "0",
    totalVoters: "0", 
    totalRankings: "0"
  });

  // Mock data - gerçek API'dan gelecek
  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setStatsData({
        totalVotes: "2.8 MİLYAR",
        totalVoters: "156.342",
        totalRankings: "1.247"
      });
    }, 500);
  }, []);

  return (
    <div className="bg-white border-t border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-center gap-6 lg:gap-12">
          
          {/* İlk İstatistik - Toplam Oy */}
          <div className="flex items-center gap-2">
            <div className="text-lg lg:text-xl font-bold text-gray-900">
              {statsData.totalVotes}
            </div>
            <div className="text-xs text-gray-700 italic uppercase tracking-wide">
              Oy
            </div>
          </div>

          {/* Ayırıcı çizgi */}
          <div className="w-px h-6 bg-gray-300"></div>

          {/* İkinci İstatistik - Toplam Oy Veren */}
          <div className="flex items-center gap-2">
            <div className="text-lg lg:text-xl font-bold text-gray-900">
              {statsData.totalVoters.toLocaleString('tr-TR')}
            </div>
            <div className="text-xs text-gray-700 italic uppercase tracking-wide">
              Oy Veren
            </div>
          </div>

          {/* Ayırıcı çizgi */}
          <div className="w-px h-6 bg-gray-300"></div>

          {/* Üçüncü İstatistik - Toplam Sıralama */}
          <div className="flex items-center gap-2">
            <div className="text-lg lg:text-xl font-bold font-bold text-gray-900">
              {statsData.totalRankings.toLocaleString('tr-TR')}
            </div>
            <div className="text-xs text-gray-700 italic uppercase tracking-wide">
              Sıralama
            </div>
          </div>

        </div>
        
        {/* Mobile Layout */}
        <div className="lg:hidden flex items-center justify-center gap-8">
          
          {/* İlk İstatistik - Toplam Oy */}
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold text-gray-900">
              {statsData.totalVotes}
            </div>
            <div className="text-xs text-gray-700 italic uppercase tracking-wide">
              Oy
            </div>
          </div>

          {/* İkinci İstatistik - Toplam Oy Veren */}
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold text-gray-900">
              {statsData.totalVoters.toLocaleString('tr-TR')}
            </div>
            <div className="text-xs text-gray-700 italic uppercase tracking-wide">
              Oy Veren
            </div>
          </div>

          {/* Üçüncü İstatistik - Toplam Sıralama */}
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold text-gray-900">
              {statsData.totalRankings.toLocaleString('tr-TR')}
            </div>
            <div className="text-xs text-gray-700 italic uppercase tracking-wide">
              Sıralama
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
