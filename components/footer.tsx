'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/kategori/${categorySlug}`);
  };

  // Header'daki kategori maddeleri
  const categories = [
    { name: "İZLENMEYE DEĞER", color: "bg-pink-400", slug: "izlenmeye-deger" },
    { name: "GARİP TARİH", color: "bg-orange-600", slug: "garip-tarih" },
    { name: "MEZARLIK VARDİYASI", color: "bg-gray-600", slug: "mezarlik-vardiyasi" },
    { name: "TAM BİR İNEK", color: "bg-purple-600", slug: "tam-bir-inek" },
    { name: "OYUN", color: "bg-teal-500", slug: "oyun" },
    { name: "SENARYOSUZ", color: "bg-red-500", slug: "senaryosuz" },
    { name: "YAŞAM TARZI", color: "bg-blue-600", slug: "yasam-tarzi" },
    { name: "MÜZİK", color: "bg-gray-400", slug: "muzik" },
    { name: "SPOR", color: "bg-green-500", slug: "spor" }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div>
            <button 
              onClick={handleLogoClick}
              className="mb-4 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/logo-vote.png"
                alt="Vote Logo"
                width={120}
                height={48}
                className="h-12 w-auto"
              />
            </button>
            <p className="text-sm text-gray-600">
              Spor, film, müzik, teknoloji ve daha birçok konuda oylama yapın. 
              Fikirlerinizi paylaşın ve toplulukla birlikte en iyileri belirleyin.
            </p>
          </div>

          {/* Kategoriler - İlk 5 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Kategoriler</h4>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((category, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleCategoryClick(category.slug)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategoriler - Son 4 */}
          <div>
            <ul className="space-y-2 mt-8">
              {categories.slice(5, 9).map((category, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleCategoryClick(category.slug)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">İletişim</h4>
            <ul className="space-y-2">
              <li><a href="/hakkimizda" className="text-sm text-gray-600 hover:text-gray-900">Hakkımızda</a></li>
              <li><a href="/gizlilik-politikasi" className="text-sm text-gray-600 hover:text-gray-900">Gizlilik Politikası</a></li>
              <li><a href="/kullanim-sartlari" className="text-sm text-gray-600 hover:text-gray-900">Kullanım Şartları</a></li>
      
            </ul>
          </div>
        </div>

        {/* Alt kısım */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-xs text-gray-500 text-center">
            © 2025 VOTE. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
