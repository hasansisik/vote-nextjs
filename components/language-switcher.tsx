'use client';

import { useTransition } from 'react';
import { usePathname, useRouter as useNextRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useNextRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          className="gap-2 border-gray-300"
        >
          <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
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

