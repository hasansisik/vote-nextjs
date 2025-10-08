'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/routing';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/actions/userActions';
import { getAllMenus } from '@/redux/actions/menuActions';
import { getNotificationStats, getNotifications } from '@/redux/actions/notificationActions';
import { useLocale, useTranslations } from 'next-intl';
import { 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Search, 
  Play,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import MobileMenu from './mobile-menu';
import { LanguageSwitcher } from './language-switcher';

export default function Header() {
  const t = useTranslations('Header');
  const router = useRouter();
  const dispatch = useDispatch();
  const locale = useLocale();
  const { isAuthenticated, user, loading } = useSelector((state: any) => state.user);
  const { allMenus, loading: menuLoading } = useSelector((state: any) => state.menu);
  const { stats: notificationStats } = useSelector((state: any) => state.notification);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  // Load all menus on component mount
  useEffect(() => {
    dispatch(getAllMenus({}) as any);
  }, [dispatch]);

  // Load notification stats when user is authenticated or on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getNotificationStats() as any);
      dispatch(getNotifications({ page: 1, limit: 50 }) as any);
    }
  }, [dispatch, isAuthenticated]);

  // Load notification stats on component mount (for page refresh scenarios)
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getNotificationStats() as any);
      dispatch(getNotifications({ page: 1, limit: 50 }) as any);
    }
  }, []);

  // Check if navigation has scroll
  useEffect(() => {
    const checkScroll = () => {
      const navElement = document.querySelector('nav');
      if (navElement) {
        setHasScroll(navElement.scrollWidth > navElement.clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

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

  const handleNotificationsClick = () => {
    router.push('/bildirimler');
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
    setIsMobileMenuOpen(false);
  };


  return (
    <header className="bg-white border-b border-gray-200">
      {/* Üst kısım - Logo ve sağdaki ikonlar */}
      <div className="flex items-center justify-between px-4 py-3 relative">
        {/* Mobil menü butonu - mobilde veya scroll olduğunda görünür */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className={`${hasScroll ? 'block' : 'md:hidden'} p-2 hover:bg-gray-100 rounded-full transition-colors`}
          title={t('menu')}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Sol boşluk - desktop için */}
        <div className="hidden md:flex items-center gap-4 invisible">
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
            src="/static/logo-vote.png"
            alt={t('logoAlt')}
            width={150}
            height={60}
            className="h-12 w-auto"
            priority
          />
        </button>

        {/* Sağdaki ikonlar - desktop için */}
        <div className="hidden md:flex items-center gap-4">
          {/* Loading state for user authentication */}
          {loading ? (
            <>
              {/* User profile skeleton */}
              <Skeleton className="w-8 h-8 rounded-full" />
              {/* Notification skeleton */}
              <Skeleton className="w-10 h-10 rounded-full" />
              {/* Search skeleton */}
              <Skeleton className="w-10 h-10 rounded-full" />
              {/* Button skeletons */}
              <Skeleton className="w-20 h-8 rounded-lg" />
              <Skeleton className="w-20 h-8 rounded-lg" />
            </>
          ) : (
            <>
              {/* Kullanıcı profili - sadece giriş yapmış kullanıcılar için */}
              {isAuthenticated && (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleProfileClick}
                    className="p-2 hover:bg-orange-50 rounded-full transition-colors"
                    title={t('profile')}
                  >
                    {(user?.profile?.picture || user?.picture) ? (
                      <Image
                        src={user.profile?.picture || user.picture}
                        alt={t('profile')}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg 
                          className="w-5 h-5 text-gray-600" 
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
                      </div>
                    )}
                  </button>
                </div>
              )}

              {/* Bildirimler ikonu */}
              <button 
                onClick={handleNotificationsClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                title={t('notifications')}
              >
                <Bell className="w-6 h-6 text-gray-700" />
                {/* Okunmamış bildirim sayısı */}
                {notificationStats?.unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {notificationStats.unread > 99 ? '99+' : notificationStats.unread}
                  </span>
                )}
              </button>

              {/* Arama ikonu */}
              <button 
                onClick={handleSearchClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title={t('search')}
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

              {/* Dil Seçici */}
              <LanguageSwitcher />

              {/* Giriş Yap ve Kayıt Ol butonları - sadece giriş yapmamış kullanıcılar için */}
              {!isAuthenticated && (
                <>
                  <button 
                    onClick={handleLogin}
                    className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    title={t('login')}
                  >
                    {t('login')}
                  </button>
                  <button 
                    onClick={handleRegister}
                    className="px-4 py-2 text-sm font-medium text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                    title={t('register')}
                  >
                    {t('register')}
                  </button>
                </>
              )}

              {/* Çıkış Yap butonu - sadece giriş yapmış kullanıcılar için */}
              {isAuthenticated && (
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                  title={t('logout')}
                >
                  {t('logout')}
                </button>
              )}
            </>
          )}
        </div>
      </div>


      {/* Alt kısım - Menü kategorileri - sadece desktop */}
      <nav className="hidden md:block border-t border-gray-200">
        <div className="flex items-center justify-center px-4 py-2 overflow-x-auto">
          <div className="flex items-center gap-4">
            {/* Menü öğeleri - API'den gelen veriler */}
            {menuLoading ? (
              <div className="flex items-center gap-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              [...(allMenus || [])].sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((item: any, index: number) => (
                <button 
                  key={index}
                  onClick={() => handleCategoryClick(item.testCategory.slug)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap"
                >
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color || '#f97316' }}
                  ></div>
                  {item.name?.[locale] || item.testCategory.name?.[locale] || item.testCategory.name || t('category')}
                </button>
              ))
            )}
          </div>
        </div>
      </nav>

      {/* Mobil Menü */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
}
