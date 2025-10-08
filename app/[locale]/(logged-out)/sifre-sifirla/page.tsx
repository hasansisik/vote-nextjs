'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { resetPassword, clearError } from '@/redux/actions/userActions';
import { toast } from 'sonner';
import { PasswordInput } from '@/components/ui/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

function SifreSifirlaContent() {
  const t = useTranslations('ResetPasswordPage');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, error, isAuthenticated } = useSelector((state: any) => state.user);

  const [formData, setFormData] = useState({
    passwordToken: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const email = searchParams.get('email');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      // Don't show "user not found" error on reset password page
      const errorMessage = typeof error === 'string' ? error : error.message;
      if (errorMessage && errorMessage.toLowerCase().includes('user not found')) {
        return;
      }
      
      toast.error(t('errorTitle'), {
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
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate password in real-time
    if (name === 'password') {
      const passwordErrorMsg = validatePassword(value);
      setPasswordError(passwordErrorMsg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.passwordToken || !formData.password || !formData.confirmPassword) {
      toast.error(t('fillAllFields'), {
        description: t('fillAllFieldsDescription'),
        duration: 3000,
      });
      return;
    }

    // Validate password token (should be 4 digits)
    if (!/^\d{4}$/.test(formData.passwordToken)) {
      toast.error(t('invalidCode'), {
        description: t('invalidCodeDescription'),
        duration: 3000,
      });
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError(t('passwordMismatch'));
      toast.error(t('passwordMismatch'), {
        description: t('passwordMismatchDescription'),
        duration: 3000,
      });
      return;
    }

    // Validate password strength
    const passwordErrorMsg = validatePassword(formData.password);
    if (passwordErrorMsg) {
      setPasswordError(passwordErrorMsg);
      toast.error(t('passwordMismatch'), {
        description: passwordErrorMsg,
        duration: 5000,
      });
      return;
    }

    if (!email) {
      toast.error(t('invalidLink'), {
        description: t('invalidLinkDescription'),
        duration: 5000,
      });
      return;
    }

    try {
      const result = await dispatch(resetPassword({
        email,
        passwordToken: formData.passwordToken,
        newPassword: formData.password
      }));
      
      if (resetPassword.fulfilled.match(result)) {
        setIsSuccess(true);
        toast.success(t('resetSuccess'), {
          description: t('resetSuccessDescription'),
          duration: 5000,
        });
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/giris');
        }, 3000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto flex items-center justify-center mb-4">
              <Image
                src="/_next/static/logo-vote.png"
                alt={t('logoAlt')}
                width={200}
                height={80}
                className="h-20 w-auto"
                priority
              />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {t('successTitle')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {t('successSubtitle')}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  {t('successMessage')}
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    {t('successDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={() => router.push('/giris')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {t('loginButton')}
            </Button>
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
            {email && (
              <>
                {t('subtitle')} <span className="font-medium text-orange-600">{email}</span>
              </>
            )}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="passwordToken" className="text-sm font-medium text-gray-700">
                {t('verificationCodeLabel')}
              </Label>
              <Input
                id="passwordToken"
                name="passwordToken"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={formData.passwordToken}
                onChange={handleChange}
                className="mt-1 w-full bg-white text-center text-lg tracking-widest"
                placeholder={t('verificationCodePlaceholder')}
                required
                autoComplete="one-time-code"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('verificationCodeHelp')}
              </p>
            </div>

            <PasswordInput
              id="password"
              name="password"
              label={t('newPasswordLabel')}
              value={formData.password}
              onChange={handleChange}
              placeholder={t('newPasswordPlaceholder')}
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
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading || passwordError !== '' || !formData.passwordToken || !formData.password || !formData.confirmPassword}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('resetButtonLoading')}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  {t('resetButton')}
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <Link href="/giris" className="text-orange-600 hover:text-orange-500 font-medium text-sm">
              {t('backToLogin')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SifreSifirlaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SifreSifirlaContent />
    </Suspense>
  );
}
