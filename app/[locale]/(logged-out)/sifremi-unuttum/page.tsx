'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from '@/i18n/routing';
import { forgotPassword, clearError } from '@/redux/actions/userActions';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function SifremiUnuttumPage() {
  const t = useTranslations('ForgotPasswordPage');
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
      
      toast.error(t('errorTitle'), {
        description: errorMessage,
        duration: 5000,
      });
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t('emailRequired'), {
        description: t('emailRequiredDescription'),
        duration: 3000,
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('invalidEmail'), {
        description: t('invalidEmailDescription'),
        duration: 3000,
      });
      return;
    }

    try {
      const result = await dispatch(forgotPassword(email));
      
      if (forgotPassword.fulfilled.match(result)) {
        setIsEmailSent(true);
        toast.success(t('emailSent'), {
          description: t('emailSentDescription'),
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
                src="/static/logo-vote.png"
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
              {t('successSubtitle')}{' '}
              <span className="font-medium text-orange-600">{email}</span>
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
                  {t('successMessage')}
                </h3>
                <div className="mt-2 text-sm text-orange-700">
                  <p>
                    {t('successDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/giris"
              className="text-orange-600 hover:text-orange-500 font-medium text-sm"
            >
              {t('backToLogin')}
            </Link>
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
            {t('subtitle')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="mt-1 w-full bg-white"
            />
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
                  {t('submitButtonLoading')}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('submitButton')}
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
