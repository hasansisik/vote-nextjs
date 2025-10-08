'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { verifyEmail, againEmail, clearError } from '@/redux/actions/userActions';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

function DogrulamaContent() {
  const t = useTranslations('VerificationPage');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, error, isAuthenticated, isVerified } = useSelector((state: any) => state.user);

  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const email = searchParams.get('email');

  useEffect(() => {
    if (isAuthenticated && isVerified) {
      router.push('/');
    }
  }, [isAuthenticated, isVerified, router]);

  useEffect(() => {
    if (error) {
      // Don't show "user not found" error on verification page
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setVerificationCode(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 4) {
      toast.error(t('invalidCode'), {
        description: t('invalidCodeDescription'),
        duration: 3000,
      });
      return;
    }

    if (!email) {
      toast.error(t('emailNotFound'), {
        description: t('emailNotFoundDescription'),
        duration: 3000,
      });
      return;
    }

    try {
      const result = await dispatch(verifyEmail({
        email,
        verificationCode: parseInt(verificationCode)
      }));
      
      if (verifyEmail.fulfilled.match(result)) {
        setIsSuccess(true);
        toast.success(t('verificationSuccess'), {
          description: t('verificationSuccessDescription'),
          duration: 5000,
        });
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/giris');
        }, 3000);
      }
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error(t('emailNotFound'), {
        description: t('emailNotFoundDescription'),
        duration: 3000,
      });
      return;
    }

    setIsResending(true);
    try {
      const result = await dispatch(againEmail(email));
      
      if (againEmail.fulfilled.match(result)) {
        toast.success(t('resendSuccess'), {
          description: t('resendSuccessDescription'),
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Resend error:', error);
    } finally {
      setIsResending(false);
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
          <div>
            <Label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
              {t('verificationCodeLabel')}
            </Label>
            <Input
              id="verificationCode"
              name="verificationCode"
              type="text"
              value={verificationCode}
              onChange={handleChange}
              placeholder={t('verificationCodePlaceholder')}
              className="text-center text-2xl tracking-widest mt-2 bg-white"
              maxLength={4}
              required
            />
            <p className="mt-2 text-xs text-gray-500 text-center">
              {t('verificationCodeHelp')}
            </p>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading || verificationCode.length !== 4}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('verifyButtonLoading')}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('verifyButton')}
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t('resendText')}{' '}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="font-medium text-orange-600 hover:text-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? t('resendButtonLoading') : t('resendButton')}
              </button>
            </p>
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

export default function DogrulamaPage() {
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
      <DogrulamaContent />
    </Suspense>
  );
}
