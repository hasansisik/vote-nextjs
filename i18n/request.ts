import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { headers } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // If no locale in URL, try to get from localStorage via cookie or default to English
  if (!locale || !routing.locales.includes(locale as any)) {
    // Try to get preferred language from cookie (set by client-side)
    const headersList = await headers();
    const preferredLanguage = headersList.get('x-preferred-language');
    
    if (preferredLanguage && routing.locales.includes(preferredLanguage as any)) {
      locale = preferredLanguage;
    } else {
      // Default to English
      locale = routing.defaultLocale;
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

