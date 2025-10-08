/**
 * Utility functions for handling multi-language data
 */

export type MultiLanguageText = {
  tr: string;
  en?: string;
  de?: string;
  fr?: string;
};

/**
 * Get text in a specific language, falling back to Turkish if not available
 */
export function getText(text: string | MultiLanguageText | undefined, language: 'tr' | 'en' | 'de' | 'fr' = 'tr'): string {
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
export function getCategoryName(category: any): string {
  if (!category) return 'Kategori Yok';
  
  // If category has a name property (populated object)
  if (category.name) {
    if (typeof category.name === 'object') {
      return category.name.tr || category.name.en || 'Kategori';
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
export function getTestTitle(test: any): string {
  return getTurkishText(test?.title);
}

/**
 * Get test description with fallback
 */
export function getTestDescription(test: any): string {
  return getTurkishText(test?.description);
}

/**
 * Get option title with fallback
 */
export function getOptionTitle(option: any): string {
  return getTurkishText(option?.title);
}

/**
 * Get custom field name with fallback
 */
export function getCustomFieldName(field: any): string {
  return getTurkishText(field?.fieldName);
}

/**
 * Get custom field value with fallback
 */
export function getCustomFieldValue(field: any): string {
  return getTurkishText(field?.fieldValue);
}
