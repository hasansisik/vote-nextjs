'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getTestsByCategorySlug } from '@/redux/actions/userActions';
import { getActiveMenus } from '@/redux/actions/menuActions';

interface CardProps {
  test: any;
  index: number;
  onTestClick: (testId: string, e: React.MouseEvent) => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({ test, index, onTestClick, className = "" }) => {
  const handleClick = (e: React.MouseEvent) => {
    onTestClick(test._id, e);
  };

  return (
    <div 
      className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={handleClick}
    >
      {/* Üst Kısım - Görsel */}
      <div className="w-full h-32 lg:h-36 relative mb-2 rounded-lg overflow-hidden">
        <Image
          src={test.coverImage || `/images/v${(index % 8) + 1}.jpg`}
          alt={test.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `/images/v${(index % 8) + 1}.jpg`;
          }}
        />
      </div>
      
      {/* Alt Kısım - İçerik */}
      <div className="px-1 py-2">
        {/* Kategori */}
        <div className="text-xs font-bold uppercase tracking-wide text-gray-600">
          {test.category}
        </div>
        
        {/* Başlık */}
        <h3 className="text-sm font-bold text-gray-900 leading-tight mt-1 line-clamp-2">
          {test.title}
        </h3>
        
        {/* Açıklama */}
        {test.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
            {test.description}
          </p>
        )}
      </div>
    </div>
  );
};


export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { categoryTests, categoryInfo, categoryTestsLoading } = useAppSelector((state) => state.user);
  const { activeMenus } = useAppSelector((state) => state.menu);

  // URL'den kategori parametresini al
  const categorySlug = params.menu as string;

  // Load menus and category tests
  useEffect(() => {
    dispatch(getActiveMenus());
  }, [dispatch]);

  useEffect(() => {
    if (categorySlug) {
      dispatch(getTestsByCategorySlug({ slug: categorySlug, limit: 20 }));
    }
  }, [dispatch, categorySlug]);

  const getCategoryDisplayName = (): string => {
    return categoryInfo?.name?.toUpperCase() || categorySlug?.toUpperCase() || 'KATEGORİ';
  };

  const getCategoryColor = (): string => {
    // Önce menü verilerinden rengi bul
    if (activeMenus && activeMenus.length > 0 && categoryInfo) {
      const menu = activeMenus.find((menu: any) => 
        menu.testCategory && menu.testCategory.name && 
        menu.testCategory.name.toLowerCase() === categoryInfo.name.toLowerCase()
      );
      if (menu && menu.color) {
        return 'custom-color';
      }
    }
    
    // Fallback renkler
    const colors: { [key: string]: string } = {
      'izlenmeye-deger': 'bg-pink-400',
      'garip-tarih': 'bg-orange-600',
      'mezarlik-vardiyasi': 'bg-gray-600',
      'tam-bir-inek': 'bg-purple-600',
      'oyun': 'bg-teal-500',
      'senaryosuz': 'bg-red-500',
      'yasam-tarzi': 'bg-blue-600',
      'muzik': 'bg-gray-400',
      'spor': 'bg-green-500'
    };
    return colors[categorySlug] || 'bg-gray-400';
  };

  const getCategoryColorStyle = (): React.CSSProperties => {
    // Önce menü verilerinden rengi bul
    if (activeMenus && activeMenus.length > 0 && categoryInfo) {
      const menu = activeMenus.find((menu: any) => 
        menu.testCategory && menu.testCategory.name && 
        menu.testCategory.name.toLowerCase() === categoryInfo.name.toLowerCase()
      );
      if (menu && menu.color) {
        return { backgroundColor: menu.color };
      }
    }
    return {};
  };

  const handleTestClick = (testId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      router.push(`/${testId}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (categoryTestsLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Kategori Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className={`w-4 h-4 rounded-full ${getCategoryColor() === 'custom-color' ? '' : getCategoryColor()}`}
              style={getCategoryColor() === 'custom-color' ? getCategoryColorStyle() : {}}
            ></div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getCategoryDisplayName()}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {categoryTests?.length || 0} oylama bulundu
          </p>
        </div>

        {/* Test Listesi */}
        {categoryTests && categoryTests.length > 0 ? (
          <div className="max-w-7xl mx-auto px-2 lg:px-4 py-1">
            {/* Desktop Layout - 4x4 Grid */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-4 gap-4">
                {categoryTests.map((test: any, index: number) => (
                  <Card 
                    key={test._id} 
                    test={test}
                    index={index}
                    onTestClick={handleTestClick}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Layout - 2x2 Grid */}
            <div className="lg:hidden">
              <div className="grid grid-cols-2 gap-2">
                {categoryTests.map((test: any, index: number) => (
                  <Card 
                    key={test._id} 
                    test={test}
                    index={index}
                    onTestClick={handleTestClick}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Henüz oylama yok
            </h3>
            <p className="text-gray-600">
              Bu kategoride henüz hiç oylama bulunmuyor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
