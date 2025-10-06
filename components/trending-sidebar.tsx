'use client';

import React from 'react';
import Image from 'next/image';

interface TrendingItem {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
}

const trendingData: TrendingItem[] = [
  {
    id: 1,
    category: "FUTBOL TARİHİ",
    title: "2020'lerin En Büyük Transferi",
    description: "Futbol tarihinin en çok tartışılan transferlerinden biri...",
    image: "/images/hero1.jpg"
  },
  {
    id: 2,
    category: "MODERN FUTBOL",
    title: "Teknoloji ve Futbol",
    description: "Spor teknolojisinin oyun biçimini nasıl değiştirdiği...",
    image: "/images/hero1.jpg"
  },
  {
    id: 3,
    category: "DÜNYA KUPASI",
    title: "En Unforgettable Anlar",
    description: "Dünya kupası tarihinin en akılda kalıcı anları...",
    image: "/images/hero1.jpg"
  },
  {
    id: 4,
    category: "OYUNCU ÖZELLiKLERİ",
    title: "En Buzzing Yetenekler",
    description: "Gelecek yılın en çok konuşulacak futbolcular...",
    image: "/images/hero1.jpg"
  },
  {
    id: 5,
    category: "STRATEJI ANALİZİ",
    title: "Hazır ve İstekli",
    description: "Transfer pazarlığında gönüllü olarak yer alanlar...",
    image: "/images/hero1.jpg"
  },
  {
    id: 6,
    category: "FUTBOL KÜLTÜRÜ",
    title: "Taraftar Hikayeleri",
    description: "Futbolun en tutkulu taraftarlarının hikayesi...",
    image: "/images/hero1.jpg"
  },
  {
    id: 7,
    category: "ANTRENMAN",
    title: "Modern Antrenman Yöntemleri",
    description: "Günümüz futbolunda kullanılan yeni teknikler...",
    image: "/images/hero1.jpg"
  }
];

export default function TrendingSidebar() {
  return (
    <div className="bg-black text-white rounded-lg w-full h-full overflow-hidden">
      {/* Başlık */}
      <div className="p-6 pb-4">
        <h3 className="text-xl font-bold uppercase tracking-wide text-white">
          ŞU AN TREND
        </h3>
      </div>
      
      {/* Trend İçerikleri - Scroll'lu */}
      <div className="px-6 pb-6 h-full overflow-y-auto">
        <div className="space-y-4">
          {trendingData.map((item, index) => (
            <div key={item.id} className="flex gap-3 hover:bg-gray-800 transition-all p-3 rounded-lg cursor-pointer">
            {/* Thumbnail */}
            <div className="w-20 h-14 flex-shrink-0 relative">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover rounded"
              />
            </div>
            
            {/* İçerik */}
            <div className="flex-1 min-w-0">
              {/* Kategori */}
              <div className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                {item.category}
              </div>
              
              {/* Başlık */}
              <h4 className="text-sm font-bold text-white leading-tight mb-1">
                {item.title}
              </h4>
              
              {/* Açıklama */}
              <p className="text-xs text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
