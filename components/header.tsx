'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/actions/userActions';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state: any) => state.user);

  const handleLogin = () => {
    router.push('/giris');
  };

  const handleRegister = () => {
    router.push('/kayit-ol');
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleSearchClick = () => {
    router.push('/arama');
  };

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/kategori/${categorySlug}`);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout() as any);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfileClick = () => {
    router.push('/profil');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Üst kısım - Logo ve sağdaki ikonlar */}
      <div className="flex items-center justify-between px-4 py-3 relative">
        {/* Sol boşluk - sağdaki ikonların genişliği kadar */}
        <div className="flex items-center gap-4 invisible">
          <div className="p-2">
            <div className="w-6 h-6"></div>
          </div>
          <div className="p-2">
            <div className="w-6 h-6"></div>
          </div>
        </div>

        {/* Ortadaki logo - mutlak ortada */}
        <button 
          onClick={handleLogoClick}
          className="absolute left-1/2 transform -translate-x-1/2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/images/logo-vote.png"
            alt="Ranker Logo"
            width={150}
            height={60}
            className="h-12 w-auto"
            priority
          />
        </button>

        {/* Sağdaki ikonlar */}
        <div className="flex items-center gap-4">
          {/* Kullanıcı ikonu - sadece giriş yapmış kullanıcılar için */}
          {isAuthenticated && (
            <button 
              onClick={handleProfileClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Profil"
            >
              {user?.profile?.picture ? (
                <Image
                  src={user.profile.picture}
                  alt="Profil"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <svg 
                  className="w-6 h-6 text-gray-700" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              )}
            </button>
          )}

          {/* Arama ikonu */}
          <button 
            onClick={handleSearchClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Ara"
          >
            <svg 
              className="w-6 h-6 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </button>

          {/* Giriş Yap ve Kayıt Ol butonları - sadece giriş yapmamış kullanıcılar için */}
          {!isAuthenticated && (
            <>
              <button 
                onClick={handleLogin}
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                title="Giriş Yap"
              >
                Giriş Yap
              </button>
              <button 
                onClick={handleRegister}
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                title="Kayıt Ol"
              >
                Kayıt Ol
              </button>
            </>
          )}

          {/* Çıkış Yap butonu - sadece giriş yapmış kullanıcılar için */}
          {isAuthenticated && (
            <button 
              onClick={handleLogout}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              title="Çıkış Yap"
            >
              Çıkış Yap
            </button>
          )}
        </div>
      </div>


      {/* Alt kısım - Menü kategorileri */}
      <nav className="border-t border-gray-200">
        <div className="flex items-center justify-center px-4 py-2 overflow-x-auto">
          <div className="flex items-center gap-4">
            {/* OY VERMEK - Özel buton */}
            <button className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors whitespace-nowrap">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              OY VERMEK
            </button>

            {/* Diğer menü öğeleri */}
            {[
              { name: "İZLENMEYE DEĞER", color: "bg-pink-400", slug: "izlenmeye-deger" },
              { name: "GARİP TARİH", color: "bg-orange-600", slug: "garip-tarih" },
              { name: "MEZARLIK VARDİYASI", color: "bg-gray-600", slug: "mezarlik-vardiyasi" },
              { name: "TAM BİR İNEK", color: "bg-purple-600", slug: "tam-bir-inek" },
              { name: "OYUN", color: "bg-teal-500", slug: "oyun" },
              { name: "SENARYOSUZ", color: "bg-red-500", slug: "senaryosuz" },
              { name: "YAŞAM TARZI", color: "bg-blue-600", slug: "yasam-tarzi" },
              { name: "MÜZİK", color: "bg-gray-400", slug: "muzik" },
              { name: "SPOR", color: "bg-green-500", slug: "spor" }
            ].map((item, index) => (
              <button 
                key={index}
                onClick={() => handleCategoryClick(item.slug)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
