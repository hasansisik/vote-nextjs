'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SliderContent {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  votes: string;
}

const sliderData: SliderContent[] = [
  {
    id: 1,
    category: "SPOR",
    title: "Dünyanın En İyi Futbolcusu",
    description: "Tüm zamanların en büyük futbol efsanesini seç!",
    image: "/images/v1.jpg",
    votes: "125,000"
  },
  {
    id: 2,
    category: "YEMEK",
    title: "Dünyanın En Lezzetli Yemeği",
    description: "Hangi yemek tüm dünyanın gözdesi?",
    image: "/images/v2.jpg",
    votes: "89,500"
  },
  {
    id: 3,
    category: "ÜLKE",
    title: "Dünyanın En Güzel Ülkesi",
    description: "Doğa güzelliği ve kültürün birleştiği yer.",
    image: "/images/v3.jpg",
    votes: "156,200"
  },
  {
    id: 4,
    category: "ŞEHİR",
    title: "Türkiye'nin En Güzel Şehri",
    description: "Anadolu'nun en şirin şehrini belirle!",
    image: "/images/v4.jpg",
    votes: "78,900"
  },
  {
    id: 5,
    category: "FİLM",
    title: "Tüm Zamanların En İyi Filmi",
    description: "Sinemanın en büyük başyapıtı hangisi?",
    image: "/images/v5.jpg",
    votes: "203,800"
  }
];

export default function HeroSlider() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden h-full">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full">
        {/* Ana Slider - Sol Taraf */}
        <div 
          className="w-2/3 flex flex-col cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => router.push(`/test_${currentSlide + 1}`)}
        >
          {/* Üst Kısım - Fotoğraf */}
          <div className="relative h-3/4 p-4">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={sliderData[currentSlide].image}
                alt={sliderData[currentSlide].title}
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
                {sliderData[currentSlide].category}
              </div>
              
              {/* Başlık */}
              <h2 className="text-lg lg:text-xl font-bold leading-tight">
                {sliderData[currentSlide].title}
              </h2>
              
              {/* Açıklama */}
              <p className="text-xs text-gray-300 leading-relaxed">
                {sliderData[currentSlide].description}
              </p>
            </div>
            
            {/* Slider Dots - Siyah alanda */}
            <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
              {sliderData.map((_, index) => (
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
          
          <div className="flex-1 flex flex-col justify-between">
            {sliderData.map((item, index) => (
              <div 
                key={item.id} 
                className={`flex gap-2 p-3 rounded cursor-pointer transition-all flex-shrink-0 ${
                  index === currentSlide 
                    ? 'bg-gray-700/30 border-l-2 border-gray-400' 
                    : 'hover:bg-gray-800'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/test_${index + 1}`);
                }}
                style={{ height: 'calc(20% - 4px)' }}
              >
                {/* Thumbnail */}
                <div className="w-14 h-10 flex-shrink-0 relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
                
                {/* İçerik */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  {/* Kategori */}
                  <div className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                    {item.category}
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
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Ana Slider */}
        <div 
          className="flex-1 flex flex-col cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => router.push(`/test_${currentSlide + 1}`)}
        >
          {/* Üst Kısım - Fotoğraf */}
          <div className="relative h-1/2 p-2">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={sliderData[currentSlide].image}
                alt={sliderData[currentSlide].title}
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
                {sliderData[currentSlide].category}
              </div>
              
              {/* Başlık */}
              <h2 className="text-base font-bold leading-tight">
                {sliderData[currentSlide].title}
              </h2>
              
              {/* Açıklama */}
              <p className="text-xs text-gray-300 leading-relaxed">
                {sliderData[currentSlide].description}
              </p>
            </div>
            
            {/* Slider Dots */}
            <div className="absolute bottom-2 right-2 flex space-x-1 z-20">
              {sliderData.map((_, index) => (
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
            {sliderData.map((item, index) => (
              <div 
                key={item.id} 
                className={`flex flex-col items-center gap-1 p-2 rounded cursor-pointer transition-all flex-shrink-0 ${
                  index === currentSlide 
                    ? 'bg-gray-700/30' 
                    : 'hover:bg-gray-800'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/test_${index + 1}`);
                }}
                style={{ minWidth: '120px' }}
              >
                {/* Thumbnail */}
                <div className="w-16 h-12 relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
                
                {/* İçerik */}
                <div className="text-center">
                  {/* Kategori */}
                  <div className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                    {item.category}
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
