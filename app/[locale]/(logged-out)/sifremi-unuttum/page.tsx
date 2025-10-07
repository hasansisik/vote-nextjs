'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { forgotPassword, clearError } from '@/redux/actions/userActions';
import { toast } from 'sonner';

export default function SifremiUnuttumPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector((state: any) => state.user);

  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      // Don't show "user not found" error on forgot password page
      const errorMessage = typeof error === 'string' ? error : error.message;
      if (errorMessage && errorMessage.toLowerCase().includes('user not found')) {
        return;
      }
      
      toast.error('Hata!', {
        description: errorMessage,
        duration: 5000,
      });
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('E-posta adresi gerekli!', {
        description: 'Lütfen e-posta adresinizi girin.',
        duration: 3000,
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Geçersiz e-posta!', {
        description: 'Lütfen geçerli bir e-posta adresi girin.',
        duration: 3000,
      });
      return;
    }

    try {
      const result = await dispatch(forgotPassword(email));
      
      if (forgotPassword.fulfilled.match(result)) {
        setIsEmailSent(true);
        toast.success('E-posta gönderildi!', {
          description: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
          duration: 5000,
        });
        
        // Redirect to reset password page after 1.5 seconds
        setTimeout(() => {
          router.push(`/sifre-sifirla?email=${encodeURIComponent(email)}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto flex items-center justify-center mb-4">
              <Image
                src="/_next/static/logo-vote.png"
                alt="Vote Logo"
                width={200}
                height={80}
                className="h-20 w-auto"
                priority
              />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              E-posta Gönderildi
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Şifre sıfırlama bağlantısı{' '}
              <span className="font-medium text-orange-600">{email}</span> adresine gönderildi.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">
                  E-postanızı kontrol edin
                </h3>
                <div className="mt-2 text-sm text-orange-700">
                  <p>
                    Spam klasörünüzü de kontrol etmeyi unutmayın. 
                    E-postanızda bulunan 4 haneli kodu kullanarak yeni şifrenizi oluşturabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push('/giris')}
              className="text-orange-600 hover:text-orange-500 font-medium text-sm"
            >
              Giriş sayfasına dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center mb-4">
            <Image
              src="/_next/static/logo-vote.png"
              alt="Vote Logo"
              width={200}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Şifremi Unuttum
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-posta adresi
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
              placeholder="E-posta adresiniz"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gönderiliyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Şifre Sıfırlama Bağlantısı Gönder
                </div>
              )}
            </button>
          </div>

          <div className="text-center">
            <a href="/giris" className="text-orange-600 hover:text-orange-500 font-medium text-sm">
              Giriş sayfasına dön
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
