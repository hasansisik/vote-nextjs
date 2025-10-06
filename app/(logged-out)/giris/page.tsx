'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { login, clearError } from '@/redux/actions/userActions';
import { toast } from 'sonner';
import { PasswordInput } from '@/components/ui/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector((state: any) => state.user);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Giriş başarılı!', {
        description: 'Hesabınıza başarıyla giriş yaptınız.',
        duration: 3000,
      });
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      // Don't show "user not found" error on login page
      const errorMessage = typeof error === 'string' ? error : error.message;
      if (errorMessage && errorMessage.toLowerCase().includes('user not found')) {
        return;
      }
      
      toast.error('Giriş hatası!', {
        description: errorMessage,
        duration: 5000,
      });
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      const result = await dispatch(login(formData));
      
      // Check if login was successful
      if (login.fulfilled.match(result)) {
        router.push('/');
      } else if (login.rejected.match(result)) {
        // Handle specific error cases
        const errorPayload = result.payload as any;
        
        if (errorPayload?.requiresVerification) {
          toast.info('E-posta doğrulaması gerekli', {
            description: 'Hesabınızı aktifleştirmek için e-posta adresinizi doğrulayın.',
            duration: 5000,
          });
          // Redirect to verification page
          router.push(`/dogrulama?email=${encodeURIComponent(formData.email)}`);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center mb-4">
            <Image
              src="/images/logo-vote.png"
              alt="Vote Logo"
              width={200}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hesabınıza giriş yapın
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hesabınız yok mu?{' '}
            <a href="/kayit-ol" className="font-medium text-orange-600 hover:text-orange-500">
              Kayıt olun
            </a>
          </p>
        </div>

        {/* Error Message */}
        {error && (() => {
          const errorMessage = typeof error === 'string' ? error : error.message;
          // Don't show "user not found" error on login page
          if (errorMessage && errorMessage.toLowerCase().includes('user not found')) {
            return null;
          }
          return (
            <div className="bg-orange-50 border border-orange-200 text-orange-600 px-4 py-3 rounded-md text-sm">
              {errorMessage}
            </div>
          );
        })()}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-address" className="text-sm font-medium text-gray-700">
                E-posta adresi
              </Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="E-posta adresinizi girin"
                className="w-full bg-white"
              />
            </div>
            <PasswordInput
              id="password"
              name="password"
              label="Şifre"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifrenizi girin"
              required
              autoComplete="current-password"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              className="w-full"
            />
          </div>

          <div className="flex justify-end">
            <div className="text-sm">
              <a href="/sifremi-unuttum" className="font-medium text-orange-600 hover:text-orange-500">
                Şifrenizi mi unuttunuz?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Giriş Yap
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
