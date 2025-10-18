import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['tr', 'en', 'de', 'fr'],

  // Used when no locale matches - always English as default
  defaultLocale: 'en',

  // The prefix for the default locale - as-needed means English won't have prefix
  localePrefix: 'as-needed',

  // Detect locale from localStorage on client side
  localeDetection: false
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

