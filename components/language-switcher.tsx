'use client';

import { useTransition, useEffect } from 'react';
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

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const router = useNextRouter();
  const pathname = usePathname();
  const locale = useLocale();
  
  const { enabledLanguages, loading } = useSelector((state: any) => state.settings);

  // Load enabled languages on mount
  useEffect(() => {
    dispatch(getEnabledLanguages() as any);
  }, [dispatch]);

  // Get current language from enabled languages
  const currentLanguage = enabledLanguages.find((lang: any) => lang.code === locale) || enabledLanguages[0];

  function handleLanguageChange(newLocale: string) {
    if (newLocale === locale) return;

    startTransition(() => {
      // Remove current locale from pathname and add new locale
      const pathnameWithoutLocale = pathname.replace(/^\/(tr|en|de|fr)/, '') || '/';
      const newPath = `/${newLocale}${pathnameWithoutLocale}`;
      
      // Use router.push with refresh to properly update the page
      router.push(newPath);
      router.refresh();
    });
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
          className="gap-2 border-gray-300"
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
            className={locale === language.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

