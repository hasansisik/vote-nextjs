'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/actions/userActions';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Search
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: any) => state.user);

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
                src="/images/logo-vote.png"
                alt="Ranker Logo"
                width={120}
                height={48}
                className="h-10 w-auto"
              />
            </button>
          </div>

          {/* Kullanıcı bölümü */}
          {isAuthenticated ? (
            <div className="space-y-4">
              {/* Kullanıcı profili */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {user?.profile?.picture ? (
                  <Image
                    src={user.profile.picture}
                    alt="Profil"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
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

              {/* Profil ve Çıkış butonları */}
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
                  onClick={handleMobileLogout}
                  className="w-full text-left rounded-lg transition-colors text-red-600"
                >
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg">
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
              {[
                { name: "İZLENMEYE DEĞER", color: "bg-pink-400", slug: "izlenmeye-deger" },
                { name: "GARİP TARİH", color: "bg-orange-600", slug: "garip-tarih" },
                { name: "MEZARLIK VARDİYASI", color: "bg-gray-600", slug: "mezarlik-vardiyasi" },
                { name: "TAM BİR İNEK", color: "bg-purple-600", slug: "tam-bir-inek" },
                { name: "OYUN", color: "bg-teal-500", slug: "oyun" },
                { name: "SENARYOSUZ", color: "bg-red-500", slug: "senaryosuz" },
                { name: "YAŞAM TARZI", color: "bg-blue-600", slug: "yasam-tarzi" },
                { name: "MÜZİK", color: "bg-gray-400", slug: "muzik" },
                { name: "SPOR", color: "bg-green-500", slug: "spor" },
                { name: "TEKNOLOJİ", color: "bg-indigo-500", slug: "teknoloji" },
                { name: "EĞLENCE", color: "bg-yellow-500", slug: "eglence" },
                { name: "HABERLER", color: "bg-cyan-500", slug: "haberler" },
                { name: "BİLİM", color: "bg-emerald-500", slug: "bilim" },
                { name: "SANAT", color: "bg-rose-500", slug: "sanat" },
                { name: "YEMEK", color: "bg-amber-500", slug: "yemek" }
              ].map((item, index) => (
                <button 
                  key={index}
                  onClick={() => handleMobileCategoryClick(item.slug)}
                  className="w-full text-left rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    {item.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
