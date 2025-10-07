'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useLocale } from 'next-intl';
import { getAllMenus } from '@/redux/actions/menuActions';

export default function Footer() {
  const router = useRouter();
  const dispatch = useDispatch();
  const locale = useLocale();
  const { allMenus, loading: menuLoading } = useSelector((state: any) => state.menu);

  // Load all menus on component mount
  useEffect(() => {
    dispatch(getAllMenus({}) as any);
  }, [dispatch]);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/kategori/${categorySlug}`);
  };

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
            {menuLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                Yükleniyor...
              </div>
            ) : (
              <ul className="space-y-2">
                {[...(allMenus || [])].sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).slice(0, 5).map((item: any, index: number) => (
                  <li key={index}>
                    <button 
                      onClick={() => handleCategoryClick(item.testCategory.slug)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.color || '#f97316' }}
                      ></div>
{item.testCategory.name?.[locale] || item.testCategory.name?.tr || item.testCategory.name || 'Kategori'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Kategoriler - 5'ten fazla varsa sağ tarafa */}
          {allMenus && allMenus.length > 5 && (
            <div>
              <ul className="space-y-2 mt-8">
                {[...(allMenus || [])].sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).slice(5).map((item: any, index: number) => (
                  <li key={index}>
                    <button 
                      onClick={() => handleCategoryClick(item.testCategory.slug)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.color || '#f97316' }}
                      ></div>
{item.testCategory.name?.[locale] || item.testCategory.name?.tr || item.testCategory.name || 'Kategori'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-gray-500 text-center">
              © 2025 VOTE. Tüm hakları saklıdır.
            </p>
            
            {/* Birimajans Badge */}
            <a 
              href="https://birimajans.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-black text-xs font-medium rounded-full hover:bg-yellow-500 transition-colors"
            >
              <span className="w-4 h-4 bg-black text-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">B</span>
              Birimajans
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
