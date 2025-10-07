'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/actions/userActions';
import { getAllMenus } from '@/redux/actions/menuActions';
import { getNotificationStats } from '@/redux/actions/notificationActions';
import { useLocale } from 'next-intl';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Search,
  Bell
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const locale = useLocale();
  const { isAuthenticated, user, loading } = useSelector((state: any) => state.user);
  const { allMenus, loading: menuLoading } = useSelector((state: any) => state.menu);
  const { stats: notificationStats } = useSelector((state: any) => state.notification);

  // Load all menus on component mount
  useEffect(() => {
    dispatch(getAllMenus({}) as any);
  }, [dispatch]);

  // Load notification stats when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getNotificationStats() as any);
    }
  }, [dispatch, isAuthenticated]);

  const handleLogoClick = () => {
    router.push('/');
    onClose();
  };

  const handleProfileClick = () => {
    router.push('/profil');
    onClose();
  };

  const handleMobileSearch = () => {
    router.push('/arama');
    onClose();
  };

  const handleMobileCategoryClick = (categorySlug: string) => {
    router.push(`/kategori/${categorySlug}`);
    onClose();
  };

  const handleMobileLogin = () => {
    router.push('/giris');
    onClose();
  };

  const handleMobileRegister = () => {
    router.push('/kayit-ol');
    onClose();
  };

  const handleMobileLogout = async () => {
    try {
      await dispatch(logout() as any);
      router.push('/');
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMobileNotifications = () => {
    router.push('/bildirimler');
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80">
        <div className="space-y-4">
          {/* Logo - moved to top */}
          <div className="flex justify-center pt-2">
            <button 
              onClick={handleLogoClick}
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/_next/static/logo-vote.png"
                alt="Vote Logo"
                width={120}
                height={48}
                className="h-10 w-auto"
              />
            </button>
          </div>

          {/* Kullanıcı bölümü */}
          {loading ? (
            <div className="space-y-4">
              {/* User profile skeleton */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              {/* Button skeletons */}
              <div className="space-y-2">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          ) : isAuthenticated ? (
            <div className="space-y-4">
              {/* Kullanıcı profili */}
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                {(user?.profile?.picture || user?.picture) ? (
                  <Image
                    src={user.profile?.picture || user.picture}
                    alt="Profil"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg 
                      className="w-6 h-6 text-gray-600" 
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
                <div>
                  <p className="font-medium text-gray-900">{user?.name || 'Kullanıcı'}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              {/* Profil, Bildirimler ve Çıkış butonları */}
              <div className="space-y-2">
                <button 
                  onClick={handleProfileClick}
                  className="w-full text-left rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg">
                    <User className="w-5 h-5 text-gray-600" />
                    Profil
                  </div>
                </button>
                <button 
                  onClick={handleMobileNotifications}
                  className="w-full text-left rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    Bildirimler
                    {/* Okunmamış bildirim sayısı */}
                    {notificationStats?.unread > 0 && (
                      <span className="ml-auto bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {notificationStats.unread > 99 ? '99+' : notificationStats.unread}
                      </span>
                    )}
                  </div>
                </button>
                <button 
                  onClick={handleMobileLogout}
                  className="w-full text-left rounded-lg transition-colors text-orange-500 border border-orange-500 hover:bg-orange-50"
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg">
                    <LogOut className="w-5 h-5" />
                    Çıkış Yap
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* Giriş yapmamış kullanıcılar için */
            <div className="space-y-2">
              <button 
                onClick={handleMobileLogin}
                className="w-full text-left rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg">
                  <LogIn className="w-5 h-5 text-gray-600" />
                  Giriş Yap
                </div>
              </button>
              <button 
                onClick={handleMobileRegister}
                className="w-full text-left rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg">
                  <UserPlus className="w-5 h-5 text-gray-600" />
                  Kayıt Ol
                </div>
              </button>
            </div>
          )}

          {/* Arama */}
          <div className="border-t pt-4">
            <button 
              onClick={handleMobileSearch}
              className="w-full text-left rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg">
                <Search className="w-5 h-5 text-gray-600" />
                Ara
              </div>
            </button>
          </div>

          {/* Kategoriler */}
          <div className="border-t pt-4 px-4">
            <div className="space-y-1">
              {/* Kategoriler */}
              {menuLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                </div>
              ) : (
                [...(allMenus || [])].sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((item: any, index: number) => (
                  <button 
                    key={index}
                    onClick={() => handleMobileCategoryClick(item.testCategory.slug)}
                    className="w-full text-left rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.color || '#f97316' }}
                      ></div>
                      {item.name?.[locale] || item.testCategory.name?.[locale] || item.testCategory.name || 'Kategori'}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
