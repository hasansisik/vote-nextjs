'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface HomepageCard {
  id: number;
  testId?: string; // Gerçek test ID'si
  category: string;
  title: string;
  image: string;
  description?: string;
  tag: string;
}

interface FeaturedGridProps {
  title?: string;
  cards: HomepageCard[];
}

const FeaturedGrid: React.FC<FeaturedGridProps> = ({ 
  title = '', 
  cards = [] 
}) => {
  return (
    <div className="max-w-7xl mx-auto px-2 lg:px-4 py-1">
      {title && (
        <div className="flex items-center justify-center gap-2 pb-5">
          <div className="w-2 h-2 rounded-full bg-orange-600"></div>
          <h2 className="text-xl font-bold mb-1 text-gray-900">{title}</h2>
        </div>
      )}
      
      {/* Desktop Layout - 4x4 Grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => (
            <Card 
              key={card.id} 
              card={card} 
              variant="medium"
            />
          ))}
        </div>
      </div>

      {/* Mobile Layout - 2x2 Grid */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 gap-2">
          {cards.map((card) => (
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
  variant: 'medium';
  className?: string;
}

const Card: React.FC<CardProps> = ({ card, className = "" }) => {
  const router = useRouter();
  
  const handleClick = () => {
    // Gerçek test ID'sini kullan, yoksa fallback olarak card.id kullan
    const targetId = card.testId || `test_${card.id}`;
    router.push(`/${targetId}`);
  };

  return (
    <div 
      className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={handleClick}
    >
      {/* Üst Kısım - Görsel */}
      <div className="w-full h-32 lg:h-36 relative mb-2 rounded-lg overflow-hidden">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
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
        <h3 className="text-sm font-bold text-gray-900 leading-tight mt-1 line-clamp-2">
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

export default FeaturedGrid;
