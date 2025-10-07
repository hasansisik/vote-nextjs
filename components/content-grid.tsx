'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { getPopularTests } from '@/redux/actions/userActions';


interface HomepageCard {
  id: number;
  testId?: string; // Gerçek test ID'si
  category: string;
  title: string;
  image: string;
  description?: string;
  tag: string;
}

interface ContentGridProps {
  title?: string;
  cards?: HomepageCard[]; // Make optional since we fetch data internally
}

const ContentGrid: React.FC<ContentGridProps> = ({ 
  title = '', 
  cards = [] 
}) => {
  const dispatch = useDispatch();
  const { popularTests, popularTestsLoading } = useSelector((state: any) => state.user);
  const { activeCategories } = useSelector((state: any) => state.testCategory);

  // Category name helper function
  const getCategoryName = (category: any) => {
    if (typeof category === 'string') {
      // Category ID'si string olarak geliyorsa, activeCategories'den bul
      const categoryObj = activeCategories?.find((cat: any) => cat._id === category);
      return categoryObj ? categoryObj.name.toUpperCase() : 'KATEGORİ';
    }
    return category?.name?.toUpperCase() || 'KATEGORİ';
  };

  // Popular testleri yükle
  useEffect(() => {
    dispatch(getPopularTests({ limit: 8 }) as any);
  }, []);

  // Popular testleri card formatına çevir
  const popularCards = popularTests?.map((test: any, index: number) => {
    // Use local images from public/images folder as fallback
    const imageIndex = index % 8; // Cycle through v1.jpg to v8.jpg
    const localImage = `/images/v${imageIndex + 1}.jpg`;
    
    // Görsel öncelik sırası:
    // 1. Test'in coverImage'ı (eğer varsa)
    // 2. Test'in ilk option'ının görseli (eğer local path ise)
    // 3. Cloudinary veya başka bir CDN'den gelen görsel
    // 4. Local fallback görsel
    let imageUrl = localImage;
    
    // Önce coverImage'ı kontrol et
    if (test.coverImage) {
      imageUrl = test.coverImage;
    } else if (test.options && test.options.length > 0 && test.options[0].image) {
      const optionImage = test.options[0].image;
      // Eğer görsel local path ise veya cloudinary'den geliyorsa kullan
      if (optionImage.startsWith('/') || optionImage.includes('cloudinary.com')) {
        imageUrl = optionImage;
      }
    }
    
    return {
      id: index + 1,
      testId: test._id, // Gerçek test ID'si
      category: getCategoryName(test.category),
      title: test.title,
      image: imageUrl,
      description: test.description,
      tag: "popular"
    };
  }) || [];

  // Üst kısım için ilk 4 card (sol 3 + sağ 1 büyük)
  const topCards = popularCards.slice(0, 4);
  const topLeftCards = topCards.slice(0, 3);
  const topRightCard = topCards[3];
  
  // Alt kısım için sonraki 4 card
  const bottomCards = popularCards.slice(4, 8);

  // Veri yükleniyorsa loading göster
  if (popularTestsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-2 lg:px-4 py-15">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Popüler testler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 lg:px-4 py-15">
      {title && (
        <div className="flex items-center justify-center gap-2 pb-5">
          <div className="w-2 h-2 rounded-full bg-pink-400"></div>
          <h2 className="text-xl font-bold mb-1 text-gray-900">{title}</h2>
        </div>
      )}
      
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Ana Grid Container */}
        <div className="grid grid-cols-4 gap-1 h-auto pb-5">
          
          {/* Sol Taraf - Üst 3 card */}
          <div className="col-span-2 flex flex-col justify-between h-full">
            {/* Üst 3 Küçük Card - Büyük kartla aynı yükseklikte */}
            <div className="space-y-1 flex-grow">
              {topLeftCards.map((card: any) => (
                <Card 
                  key={card.id} 
                  card={card} 
                  variant="small"
                />
              ))}
            </div>
          </div>
          
          {/* Sağ Taraf - Büyük Card */}
          <div className="col-span-2 flex flex-col h-full">
            {/* Üst Büyük Card */}
            {topRightCard && (
              <Card 
                card={topRightCard} 
                variant="large"
              />
            )}
          </div>
        </div>
        
        {/* Alt Kısım - Tüm 4 Card Yan Yana */}
        <div className="grid grid-cols-4 gap-1 mt-1">
          {bottomCards.map((card: any) => (
            <Card 
              key={card.id} 
              card={card} 
              variant="medium"
            />
          ))}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobilde Büyük Grid En Üstte */}
        {topRightCard && (
          <Card 
            card={topRightCard} 
            variant="large"
            className="mb-2"
          />
        )}
        
        {/* C1, C2, C3 Alt Alta */}
        <div className="space-y-1 mb-2">
          {topLeftCards.map((card: any) => (
            <Card 
              key={card.id} 
              card={card} 
              variant="small"
              className="pb-4"
            />
          ))}
        </div>
        
        {/* C4, C5 ve C6, C7 - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-1">
          {bottomCards.map((card: any) => (
            <Card 
              key={card.id} 
              card={card} 
              variant="medium"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  card: HomepageCard;
  variant: 'small' | 'medium' | 'large';
  className?: string;
}

const Card: React.FC<CardProps> = ({ card, variant, className = "" }) => {
  const router = useRouter();
  
  const handleClick = () => {
    // Gerçek test ID'sini kullan, yoksa fallback olarak card.id kullan
    const targetId = card.testId || `test_${card.id}`;
    router.push(`/${targetId}`);
  };
  
  if (variant === 'small') {
    // Üst taraf küçük kartlar - Sol görsel (C4 boyutu), sağ yazı (C5 boyutu)
    return (
      <div 
        className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}
        onClick={handleClick}
      >
        <div className="flex h-20 lg:h-24">
          {/* Sol Taraf - C4 Alanı Kadar Görsel */}
          <div className="flex-1 h-full relative flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover"
              sizes="50vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `/images/v${(card.id % 8) + 1}.jpg`;
              }}
            />
          </div>
          
          {/* Sağ Taraf - C5 Alanı Kadar Yazı */}
          <div className="flex-1 px-1 py-2 flex flex-col justify-center">
            {/* Kategori */}
            <div className="text-xs font-bold uppercase tracking-wide text-gray-600">
              {card.category}
            </div>
            
            {/* Başlık */}
            <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mt-1">
              {card.title}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  // Alt taraf ve büyük kartlar - Üst görsel, alt yazı
  const getImageClasses = () => {
    switch (variant) {
      case 'medium':
        return 'w-full h-28 lg:h-32';
      case 'large':
        return 'w-full h-40 lg:h-44';
      default:
        return 'w-full h-28';
    }
  };

  const getTextSize = () => {
    switch (variant) {
      case 'medium':
        return 'text-sm';
      case 'large':
        return 'text-sm lg:text-base';
      default:
        return 'text-sm';
    }
  };

  return (
    <div 
      className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={handleClick}
    >
      {/* Üst Kısım - Görsel */}
          <div className={`${getImageClasses()} relative mb-1 rounded-lg overflow-hidden`}>
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `/images/v${(card.id % 8) + 1}.jpg`;
          }}
        />
      </div>
      
      {/* Alt Kısım - İçerik */}
      <div className="px-1 py-2">
        {/* Kategori */}
        <div className="text-xs font-bold uppercase tracking-wide text-gray-600">
          {card.category}
        </div>
        
        {/* Başlık */}
        <h3 className={`font-bold text-gray-900 leading-tight mt-1 ${getTextSize()}`}>
          {card.title}
        </h3>
        
        {/* Açıklama */}
        {card.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
            {card.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentGrid;
