'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { getTrendTests } from '@/redux/actions/testActions';
import { Skeleton } from './ui/skeleton';

interface SliderContent {
  _id: string;
  category: string | { _id: string; name: string };
  title: string;
  description: string;
  coverImage: string;
  totalVotes: number;
  trend?: boolean;
  popular?: boolean;
  createdBy?: { _id: string; name: string; surname: string };
  createdAt?: string;
}

export default function HeroSlider() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { trendTests, trendTestsLoading } = useSelector((state: any) => state.test);
  const { activeCategories } = useSelector((state: any) => state.testCategory);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Category name helper function
  const getCategoryName = (category: any) => {
    if (typeof category === 'string') {
      // Category ID'si string olarak geliyorsa, activeCategories'den bul
      const categoryObj = activeCategories?.find((cat: any) => cat._id === category);
      return categoryObj ? categoryObj.name.toUpperCase() : 'KATEGORİ';
    }
    return category?.name?.toUpperCase() || 'KATEGORİ';
  };

  // Sadece trend testleri yükle - kategoriler ana sayfada zaten yükleniyor
  useEffect(() => {
    dispatch(getTrendTests({ limit: 5 }) as any);
  }, []); // Empty dependency array - sadece component mount olduğunda çalışsın

  const nextSlide = () => {
    if (displayData && displayData.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % displayData.length);
    }
  };

  const prevSlide = () => {
    if (displayData && displayData.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + displayData.length) % displayData.length);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Fallback veri - eğer trend testleri yoksa
  const fallbackData = [
    {
      _id: 'fallback-1',
      category: 'SPOR',
      title: 'Dünyanın En İyi Futbolcusu',
      description: 'Tüm zamanların en büyük futbol efsanesini seç!',
      coverImage: '/images/v1.jpg',
      totalVotes: 125000
    },
    {
      _id: 'fallback-2',
      category: 'YEMEK',
      title: 'Dünyanın En Lezzetli Yemeği',
      description: 'Hangi yemek tüm dünyanın gözdesi?',
      coverImage: '/images/v2.jpg',
      totalVotes: 89500
    },
    {
      _id: 'fallback-3',
      category: 'ÜLKE',
      title: 'Dünyanın En Güzel Ülkesi',
      description: 'Doğa güzelliği ve kültürün birleştiği yer.',
      coverImage: '/images/v3.jpg',
      totalVotes: 156200
    }
  ];

  // Veri yükleniyorsa loading göster
  if (trendTestsLoading) {
    return (
      <div className="bg-black rounded-lg overflow-hidden h-full max-w-6xl mx-auto">
        {/* Desktop Layout Skeleton */}
        <div className="hidden lg:flex h-full">
          {/* Ana Slider - Sol Taraf Skeleton */}
          <div className=" flex flex-col">
            {/* Üst Kısım - Fotoğraf Skeleton */}
            <div className="relative h-3/4 p-4">
              <div className="relative w-xl h-full rounded-lg overflow-hidden">
                <Skeleton className="w-full h-full bg-gray-700" />
              </div>
            </div>

            {/* Alt Kısım - İçerik Skeleton */}  
            <div className="h-1/4 p-4 relative">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 bg-gray-700" />
                <Skeleton className="h-6 w-3/4 bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-3 w-2/3 bg-gray-700" />
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Trend Skeleton */}
          <div className=" bg-black p-4 flex flex-col">
            <Skeleton className="h-6 w-116 bg-gray-700 mb-4" />
            
            <div className="flex-1 flex flex-col">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex gap-2 p-3 rounded flex-shrink-0 mt-2">
                  <Skeleton className="w-14 h-10 bg-gray-700" />
                  <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
                    <Skeleton className="h-3 w-12 bg-gray-700" />
                    <Skeleton className="h-4 w-full bg-gray-700" />
                    <Skeleton className="h-3 w-3/4 bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout Skeleton */}
        <div className="lg:hidden flex flex-col h-full">
          {/* Ana Slider Skeleton */}
          <div className="flex-1 flex flex-col">
            {/* Üst Kısım - Fotoğraf Skeleton */}
            <div className="relative h-1/2 p-2">
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Skeleton className="w-full h-full bg-gray-700" />
              </div>
            </div>

            {/* Alt Kısım - İçerik Skeleton */}  
            <div className="h-1/2 p-2 relative">
              <div className="space-y-1">
                <Skeleton className="h-3 w-16 bg-gray-700" />
                <Skeleton className="h-5 w-3/4 bg-gray-700" />
                <Skeleton className="h-3 w-full bg-gray-700" />
                <Skeleton className="h-3 w-2/3 bg-gray-700" />
              </div>
            </div>
          </div>

          {/* Trend Section Skeleton - Mobile below */}
          <div className="bg-black border-t border-gray-800 p-2">
            <Skeleton className="h-4 w-24 bg-gray-700 mb-2" />
            
            <div className="flex gap-1 overflow-x-auto pb-1">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-1 p-2 rounded flex-shrink-0" style={{ minWidth: '120px' }}>
                  <Skeleton className="w-16 h-12 bg-gray-700" />
                  <div className="text-center space-y-1">
                    <Skeleton className="h-3 w-12 bg-gray-700" />
                    <Skeleton className="h-3 w-20 bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Veri yoksa veya boşsa fallback kullan
  const displayData: SliderContent[] = (trendTests && trendTests.length > 0) ? trendTests : fallbackData;

  return (
    <div className="bg-black rounded-lg overflow-hidden h-full">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full">
        {/* Ana Slider - Sol Taraf */}
        <div 
          className="w-2/3 flex flex-col cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => router.push(`/${displayData[currentSlide]._id}`)}
        >
          {/* Üst Kısım - Fotoğraf */}
          <div className="relative h-3/4 p-4">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={displayData[currentSlide].coverImage || '/images/v1.jpg'}
                alt={displayData[currentSlide].title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Alt Kısım - İçerik */}  
          <div className="h-1/4 p-4 relative">
            <div className="text-white space-y-2">
              {/* Kategori */}
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                {getCategoryName(displayData[currentSlide].category)}
              </div>
              
              {/* Başlık */}
              <h2 className="text-lg lg:text-xl font-bold leading-tight">
                {displayData[currentSlide].title}
              </h2>
              
              {/* Açıklama */}
              <p className="text-xs text-gray-300 leading-relaxed">
                {displayData[currentSlide].description}
              </p>
            </div>
            
            {/* Slider Dots - Siyah alanda */}
            <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
              {displayData.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-yellow-500' 
                      : 'bg-gray-400 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Trend */}
        <div className="w-1/3 bg-black p-4 flex flex-col">
          <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-white flex-shrink-0">
            ŞU AN TREND
          </h3>
          
          <div className="flex-1 flex flex-col">
            {displayData.map((item: any, index: number) => {
              return (
                <div 
                  key={item._id} 
                  className={`flex gap-2 p-3 rounded cursor-pointer transition-all flex-shrink-0 ${
                    index === currentSlide 
                      ? 'bg-gray-700/30 border-l-2 border-gray-400' 
                      : 'hover:bg-gray-800'
                  } ${
                    index === 0 ? 'mt-0' : 'mt-2'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/${item._id}`);
                  }}
                  style={{ height: 'calc(20% - 4px)' }}
                >
                {/* Thumbnail */}
                <div className="w-14 h-10 flex-shrink-0 relative">
                  <Image
                    src={item.coverImage || '/images/v1.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
                
                {/* İçerik */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  {/* Kategori */}
                  <div className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                    {getCategoryName(item.category)}
                  </div>
                  
                  {/* Başlık */}
                  <h4 className="text-xs font-bold text-white leading-tight mb-1">
                    {item.title}
                  </h4>
                  
                  {/* Açıklama */}
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Ana Slider */}
        <div 
          className="flex-1 flex flex-col cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => router.push(`/${displayData[currentSlide]._id}`)}
        >
          {/* Üst Kısım - Fotoğraf */}
          <div className="relative h-1/2 p-2">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={displayData[currentSlide].coverImage || '/images/v1.jpg'}
                alt={displayData[currentSlide].title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Alt Kısım - İçerik */}  
          <div className="h-1/2 p-2 relative">
            <div className="text-white space-y-1">
              {/* Kategori */}
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                {getCategoryName(displayData[currentSlide].category)}
              </div>
              
              {/* Başlık */}
              <h2 className="text-base font-bold leading-tight">
                {displayData[currentSlide].title}
              </h2>
              
              {/* Açıklama */}
              <p className="text-xs text-gray-300 leading-relaxed">
                {displayData[currentSlide].description}
              </p>
            </div>
            
            {/* Slider Dots */}
            <div className="absolute bottom-2 right-2 flex space-x-1 z-20">
              {displayData.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-yellow-500' 
                      : 'bg-gray-400 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trend Section - Mobile below */}
        <div className="bg-black border-t border-gray-800 p-2">
          <h3 className="text-sm font-bold uppercase tracking-wide mb-2 text-white">
            ŞU AN TREND
          </h3>
          
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {displayData.map((item: any, index: number) => (
              <div 
                key={item._id} 
                className={`flex flex-col items-center gap-1 p-2 rounded cursor-pointer transition-all flex-shrink-0 ${
                  index === currentSlide 
                    ? 'bg-gray-700/30' 
                    : 'hover:bg-gray-800'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/${item._id}`);
                }}
                style={{ minWidth: '120px' }}
              >
                {/* Thumbnail */}
                <div className="w-16 h-12 relative">
                  <Image
                    src={item.coverImage || '/images/v1.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
                
                {/* İçerik */}
                <div className="text-center">
                  {/* Kategori */}
                  <div className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                    {getCategoryName(item.category)}
                  </div>
                  
                  {/* Başlık */}
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
