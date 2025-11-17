'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from '@/i18n/routing';
import { register, clearError } from '@/redux/actions/userActions';
import { toast } from 'sonner';
import { PasswordInput } from '@/components/ui/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function KayitOlPage() {
  const t = useTranslations('RegistrationPage');
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
      toast.success(t('registerSuccess'), {
        description: t('registerSuccessDescription'),
        duration: 3000,
      });
      router.push('/');
    }
  }, [isAuthenticated, router, t]);

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
      
      toast.error(t('registerError'), {
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

    if (!minLength) return t('passwordTooShort');
    if (!hasUpperCase) return t('passwordNoUppercase');
    if (!hasLowerCase) return t('passwordNoLowercase');
    if (!hasNumbers) return t('passwordNoNumber');
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
      setPasswordError(t('passwordMismatch'));
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
        toast.success(t('registerSuccess'), {
          description: t('registerSuccessDescription'),
          duration: 5000,
        });
        // Redirect to verification page
        router.push(`/verification?email=${encodeURIComponent(formData.email)}`);
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
              src="/static/logo-vote.png"
              alt={t('logoAlt')}
              width={200}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('subtitle')}{' '}
            <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500">
              {t('loginLink')}
            </Link>
          </p>
        </div>


        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  {t('nameLabel')}
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('namePlaceholder')}
                  className="mt-1 w-full bg-white"
                />
              </div>
              <div>
                <Label htmlFor="surname" className="text-sm font-medium text-gray-700">
                  {t('surnameLabel')}
                </Label>
                <Input
                  id="surname"
                  name="surname"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder={t('surnamePlaceholder')}
                  className="mt-1 w-full bg-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                {t('emailLabel')}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={t('emailPlaceholder')}
                className="mt-2 w-full bg-white"
              />
            </div>

            <PasswordInput
              id="password"
              name="password"
              label={t('passwordLabel')}
              value={formData.password}
              onChange={handleChange}
              placeholder={t('passwordPlaceholder')}
              required
              autoComplete="new-password"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              error={passwordError}
              success={!passwordError && formData.password ? t('passwordStrong') : undefined}
              className="w-full"
            />

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label={t('confirmPasswordLabel')}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t('confirmPasswordPlaceholder')}
              required
              autoComplete="new-password"
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              className="w-full"
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
                {t('termsText')}{' '}
                <Link href="/terms" className="text-orange-600 hover:text-orange-500">
                  {t('termsLink')}
                </Link>{' '}
                {t('andText')}{' '}
                <Link href="/privacy-policy" className="text-orange-600 hover:text-orange-500">
                  {t('privacyLink')}
                </Link>
              </label>
            </div>

          </div>

          <div>
            <Button
              type="submit"
              disabled={loading || passwordError !== '' || !formData.terms}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('registerButtonLoading')}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('registerButton')}
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500">
          {t('footerText')}{' '}
          <Link href="/terms" className="text-orange-600 hover:text-orange-500 underline">
            {t('footerTermsLink')}
          </Link>{' '}
          {t('footerAndText')}{' '}
          <Link href="/privacy-policy" className="text-orange-600 hover:text-orange-500 underline">
            {t('footerPrivacyLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}
