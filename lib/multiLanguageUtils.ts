/**
 * Utility functions for handling multi-language data
 */

export type MultiLanguageText = {
  tr: string;
  en?: string;
  de?: string;
  fr?: string;
};

export type OptionalMultiLanguageText = {
  tr?: string;
  en?: string;
  de?: string;
  fr?: string;
};

/**
 * Get text in a specific language, falling back to Turkish if not available
 */
export function getText(text: string | MultiLanguageText | OptionalMultiLanguageText | undefined, language: 'tr' | 'en' | 'de' | 'fr' = 'tr'): string {
  if (!text) return '';
  
  if (typeof text === 'string') {
    return text;
  }
  
  if (typeof text === 'object') {
    return text[language] || text.tr || '';
  }
  
  return '';
}

/**
 * Get Turkish text (primary language)
 */
export function getTurkishText(text: string | MultiLanguageText | undefined): string {
  return getText(text, 'tr');
}

/**
 * Check if text is multi-language object
 */
export function isMultiLanguageText(text: any): text is MultiLanguageText {
  return typeof text === 'object' && text !== null && 'tr' in text;
}

/**
 * Get category name with fallback
 */
export function getCategoryName(category: any, locale: 'tr' | 'en' | 'de' | 'fr' = 'tr'): string {
  if (!category) return 'Kategori';
  
  // If category has a name property (populated object from TestCategory model)
  if (category.name) {
    if (typeof category.name === 'object') {
      const categoryName = getText(category.name, locale);
      return categoryName || getText(category.name, 'tr') || 'Kategori';
    }
    return category.name;
  }
  
  // If category is just a string, it's likely an ID - return default
  // The actual lookup should be done in the component using activeMenus
  if (typeof category === 'string') {
    return 'Kategori';
  }
  
  return 'Kategori';
}

/**
 * Get test title with fallback
 */
export function getTestTitle(test: any, locale: 'tr' | 'en' | 'de' | 'fr' = 'tr'): string {
  return getText(test?.title, locale);
}

/**
 * Get test description with fallback
 */
export function getTestDescription(test: any, locale: 'tr' | 'en' | 'de' | 'fr' = 'tr'): string {
  return getText(test?.description, locale);
}

/**
 * Get option title with fallback
 */
export function getOptionTitle(option: any, locale: 'tr' | 'en' | 'de' | 'fr' = 'tr'): string {
  return getText(option?.title, locale);
}

/**
 * Get custom field name with fallback
 */
export function getCustomFieldName(field: any, locale: 'tr' | 'en' | 'de' | 'fr' = 'tr'): string {
  return getText(field?.fieldName, locale);
}

/**
 * Get custom field value with fallback
 */
export function getCustomFieldValue(field: any, locale: 'tr' | 'en' | 'de' | 'fr' = 'tr'): string {
  return getText(field?.fieldValue, locale);
}

/**
 * Get menu name with fallback - handles both menu.name and testCategory.name
 */
export function getMenuName(menuItem: any, locale: 'tr' | 'en' | 'de' | 'fr' = 'tr', fallbackText: string = 'Kategori'): string {
  if (!menuItem) return fallbackText;
  
  // Önce menü ismini kontrol et
  if (menuItem.name && typeof menuItem.name === 'object') {
    const menuName = getText(menuItem.name, locale);
    if (menuName) return menuName;
  }
  
  // Sonra testCategory ismini kontrol et
  if (menuItem.testCategory?.name && typeof menuItem.testCategory.name === 'object') {
    const categoryName = getText(menuItem.testCategory.name, locale);
    if (categoryName) return categoryName;
  }
  
  // String olarak gelen isimleri kontrol et
  if (typeof menuItem.name === 'string' && menuItem.name.trim()) {
    return menuItem.name;
  }
  
  if (typeof menuItem.testCategory?.name === 'string' && menuItem.testCategory.name.trim()) {
    return menuItem.testCategory.name;
  }
  
  // Fallback
  return fallbackText;
}

// Get slug for current locale
export function getSlugForLocale(slug: any, locale: 'tr' | 'en' | 'de' | 'fr' = 'tr'): string {
  if (!slug) return '';
  
  // If slug is a string, return as is
  if (typeof slug === 'string') {
    return slug;
  }
  
  // If slug is an object with multilingual structure
  if (typeof slug === 'object' && slug !== null) {
    // Try to get slug for current locale first
    if (slug[locale] && slug[locale].trim() !== '') {
      return slug[locale];
    }
    
    // If current locale slug is empty or doesn't exist, try Turkish
    if (slug.tr && slug.tr.trim() !== '') {
      return slug.tr;
    }
    
    // If Turkish is also empty, try other languages in order
    const fallbackOrder = ['en', 'de', 'fr'];
    for (const fallbackLocale of fallbackOrder) {
      if (slug[fallbackLocale] && slug[fallbackLocale].trim() !== '') {
        return slug[fallbackLocale];
      }
    }
    
    // Last resort: any available non-empty slug
    const availableSlugs = Object.values(slug).filter(s => s && typeof s === 'string' && s.trim() !== '');
    if (availableSlugs.length > 0) {
      return availableSlugs[0] as string;
    }
  }
  
  return '';
}
