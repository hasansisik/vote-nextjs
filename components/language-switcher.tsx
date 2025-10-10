'use client';

import { useTransition, useEffect, useRef } from 'react';
import { usePathname, useRouter as useNextRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { getEnabledLanguages } from '@/redux/actions/settingsActions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
  onLanguageChange?: (locale: string) => void;
}

export function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const router = useNextRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const hasCheckedSavedLanguage = useRef(false);
  
  const { enabledLanguages, loading } = useSelector((state: any) => state.settings);

  // Load enabled languages on mount
  useEffect(() => {
    dispatch(getEnabledLanguages() as any);
  }, [dispatch]);

  // Helper function to get saved language preference
  const getSavedLanguage = () => {
    // First check localStorage
    const savedFromStorage = localStorage.getItem('preferred-language');
    if (savedFromStorage) return savedFromStorage;
    
    // Then check cookie
    const cookies = document.cookie.split(';');
    const languageCookie = cookies.find(cookie => 
      cookie.trim().startsWith('preferred-language=')
    );
    if (languageCookie) {
      return languageCookie.split('=')[1];
    }
    
    return null;
  };

  // Check localStorage for saved language preference on mount
  useEffect(() => {
    if (hasCheckedSavedLanguage.current) return;
    
    const savedLanguage = getSavedLanguage();
    if (savedLanguage && savedLanguage !== locale) {
      // If there's a saved language different from current, navigate to it
      const pathnameWithoutLocale = pathname.replace(/^\/(tr|en|de|fr)/, '') || '/';
      const newPath = `/${savedLanguage}${pathnameWithoutLocale}`;
      
      if (newPath !== pathname) {
        hasCheckedSavedLanguage.current = true;
        startTransition(() => {
          router.push(newPath);
          router.refresh();
        });
      }
    }
    hasCheckedSavedLanguage.current = true;
  }, [locale, pathname, router]);

  // Get current language from enabled languages
  const currentLanguage = enabledLanguages.find((lang: any) => lang.code === locale) || enabledLanguages[0];

  function handleLanguageChange(newLocale: string) {
    if (newLocale === locale) return;

    // Save to localStorage
    localStorage.setItem('preferred-language', newLocale);
    
    // Also save to cookie for server-side access
    document.cookie = `preferred-language=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Use custom handler if provided, otherwise use default behavior
    if (onLanguageChange) {
      onLanguageChange(newLocale);
    } else {
      startTransition(() => {
        // Remove current locale from pathname and add new locale
        const pathnameWithoutLocale = pathname.replace(/^\/(tr|en|de|fr)/, '') || '/';
        const newPath = `/${newLocale}${pathnameWithoutLocale}`;
        
        // Use router.push with refresh to properly update the page
        router.push(newPath);
        router.refresh();
      });
    }
  }

  // Don't render if no languages loaded yet
  if (!enabledLanguages || enabledLanguages.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending || loading}
          className="gap-2 border-gray-300 cursor-pointer"
        >
          <span className="hidden sm:inline">{currentLanguage?.flag} {currentLanguage?.name}</span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {enabledLanguages.map((language: any) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`${locale === language.code ? 'bg-accent' : ''} cursor-pointer`}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

