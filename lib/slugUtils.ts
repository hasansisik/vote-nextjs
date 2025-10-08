/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Check if a string is a valid ObjectId format
 * @param str - The string to check
 * @returns True if the string is a valid ObjectId format
 */
export const isObjectId = (str: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(str);
};

/**
 * Check if a string is a slug format (contains only lowercase letters, numbers, and hyphens)
 * @param str - The string to check
 * @returns True if the string is a slug format
 */
export const isSlug = (str: string): boolean => {
  return /^[a-z0-9-]+$/.test(str);
};

/**
 * Get the appropriate URL parameter (slug or ID) for a test
 * @param test - The test object
 * @returns The slug if available, otherwise the ID
 */
export const getTestUrlParam = (test: any): string => {
  return test?.slug || test?._id || '';
};

/**
 * Create a test URL using slug or ID
 * @param test - The test object
 * @param locale - The locale (optional)
 * @returns The test URL
 */
export const createTestUrl = (test: any, locale?: string): string => {
  const param = getTestUrlParam(test);
  const localePrefix = locale ? `/${locale}` : '';
  return `${localePrefix}/${param}`;
};
