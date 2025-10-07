'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { register, clearError } from '@/redux/actions/userActions';
import { toast } from 'sonner';
import { PasswordInput } from '@/components/ui/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function KayitOlPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector((state: any) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Kayıt başarılı!', {
        description: 'Hesabınız başarıyla oluşturuldu.',
        duration: 3000,
      });
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      // Don't show user-related errors on registration page since user doesn't exist yet
      const errorMessage = typeof error === 'string' ? error : error.message;
      const lowerErrorMessage = errorMessage?.toLowerCase() || '';
      
      // Filter out user-related errors that don't make sense on registration page
      if (lowerErrorMessage.includes('user not found') || 
          lowerErrorMessage.includes('kullanıcı bulunamadı') ||
          lowerErrorMessage.includes('user does not exist') ||
          lowerErrorMessage.includes('kullanıcı mevcut değil')) {
        return;
      }
      
      toast.error('Kayıt hatası!', {
        description: errorMessage,
        duration: 5000,
      });
    }
  }, [error]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!minLength) return 'Şifre en az 8 karakter olmalıdır';
    if (!hasUpperCase) return 'Şifre en az bir büyük harf içermelidir';
    if (!hasLowerCase) return 'Şifre en az bir küçük harf içermelidir';
    if (!hasNumbers) return 'Şifre en az bir rakam içermelidir';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }

    // Validate password in real-time
    if (name === 'password') {
      const passwordErrorMsg = validatePassword(value);
      setPasswordError(passwordErrorMsg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.surname || !formData.email || !formData.password) {
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Şifreler eşleşmiyor');
      return;
    }

    // Validate password strength
    const passwordErrorMsg = validatePassword(formData.password);
    if (passwordErrorMsg) {
      setPasswordError(passwordErrorMsg);
      return;
    }

    // Validate terms acceptance
    if (!formData.terms) {
      return;
    }

    const registrationData = {
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      password: formData.password,
    };

    try {
      const result = await dispatch(register(registrationData));
      
      if (register.fulfilled.match(result)) {
        toast.success('Kayıt başarılı!', {
          description: 'E-posta adresinizi doğrulamak için gönderilen bağlantıya tıklayın.',
          duration: 5000,
        });
        // Redirect to verification page
        router.push(`/dogrulama?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
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
            Hesap oluşturun
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <a href="/giris" className="font-medium text-orange-600 hover:text-orange-500">
              Giriş yapın
            </a>
          </p>
        </div>


        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Ad
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Adınız"
                />
              </div>
              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                  Soyad
                </label>
                <input
                  id="surname"
                  name="surname"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.surname}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Soyadınız"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">E-posta adresi</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-2 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="E-posta adresiniz"
              />
            </div>

            <PasswordInput
              id="password"
              name="password"
              label="Şifre"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifreniz"
              required
              autoComplete="new-password"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              error={passwordError}
              success={!passwordError && formData.password ? "Şifre güçlü" : undefined}
            />

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Şifre tekrar"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Şifrenizi tekrar girin"
              required
              autoComplete="new-password"
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
            />


            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                <a href="/kullanim-sartlari" className="text-orange-600 hover:text-orange-500">Kullanım Şartları</a> ve{' '}
                <a href="/gizlilik-politikasi" className="text-orange-600 hover:text-orange-500">Gizlilik Politikası</a>'nı kabul ediyorum
              </label>
            </div>

          </div>

          <div>
            <button
              type="submit"
              disabled={loading || passwordError !== '' || !formData.terms}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kayıt yapılıyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Kayıt Ol
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500">
          Kayıt olarak{' '}
          <a href="/kullanim-sartlari" className="text-orange-600 hover:text-orange-500 underline">
            Kullanım Şartları
          </a>{' '}
          ve{' '}
          <a href="/gizlilik-politikasi" className="text-orange-600 hover:text-orange-500 underline">
            Gizlilik Politikası
          </a>{' '}
          'nı kabul etmiş olursunuz.
        </div>
      </div>
    </div>
  );
}
