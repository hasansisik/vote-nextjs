'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getAllTests } from '@/redux/actions/testActions';
import { getActiveMenus } from '@/redux/actions/menuActions';
import { getTestTitle, getTestDescription, getCategoryName, getSlugForLocale } from '@/lib/multiLanguageUtils';
import { useLocale } from 'next-intl';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Test {
  _id: string;
  slug?: string;
  title: string;
  description: string;
  categories: string[]; // Changed from single category to categories array
  options: any[];
  totalVotes: number;
  isActive: boolean;
  coverImage?: string;
}

interface CardProps {
  test: Test;
  index: number;
  onTestClick: (test: Test, e: React.MouseEvent) => void;
  locale: 'tr' | 'en' | 'de' | 'fr';
  className?: string;
}

const Card: React.FC<CardProps> = ({ test, index, onTestClick, locale, className = "" }) => {
  const { activeMenus } = useAppSelector((state) => state.menu);
  
  const handleClick = (e: React.MouseEvent) => {
    onTestClick(test, e);
  };

  // Get category name by ID
  const getCategoryNameById = (categories: any) => {
    // Handle categories array - get first category
    if (Array.isArray(categories) && categories.length > 0) {
      const firstCategory = categories[0];
      
      // If category is already an object with multilingual data, use it directly
      if (typeof firstCategory === 'object' && firstCategory !== null && firstCategory.name) {
        return getCategoryName(firstCategory, locale);
      }
      
      // If category is a string ID, find the corresponding menu
      if (typeof firstCategory === 'string' && activeMenus && activeMenus.length > 0) {
        const menu = activeMenus.find((menu: any) => 
          menu.testCategory && menu.testCategory._id === firstCategory
        );
        if (menu && menu.testCategory) {
          return getCategoryName(menu.testCategory, locale);
        }
      }
    }
    
    // Handle single category (backward compatibility)
    if (typeof categories === 'object' && categories !== null && categories.name) {
      return getCategoryName(categories, locale);
    }
    
    if (typeof categories === 'string' && activeMenus && activeMenus.length > 0) {
      const menu = activeMenus.find((menu: any) => 
        menu.testCategory && menu.testCategory._id === categories
      );
      if (menu && menu.testCategory) {
        return getCategoryName(menu.testCategory, locale);
      }
    }
    
    // Final fallback
    return 'Kategori';
  };

  return (
    <div 
      className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={handleClick}
    >
      {/* Üst Kısım - Görsel */}
      <div className="w-full h-32 lg:h-36 relative mb-2 rounded-lg overflow-hidden">
        <Image
          src={test.coverImage || `/images/v${(index % 8) + 1}.jpg`}
          alt={test.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `/images/v${(index % 8) + 1}.jpg`;
          }}
        />
      </div>
      
      {/* Alt Kısım - İçerik */}
      <div className="px-1 py-2">
        {/* Kategori */}
        <div className="text-xs font-bold uppercase tracking-wide text-gray-600">
          {getCategoryNameById(test.categories)}
        </div>
        
        {/* Başlık */}
        <h3 className="text-sm font-bold text-gray-900 leading-tight mt-1 line-clamp-2">
          {getTestTitle(test, locale)}
        </h3>
        
        {/* Açıklama */}
        {test.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
            {getTestDescription(test, locale)}
          </p>
        )}
      </div>
    </div>
  );
};

export default function AramaPage() {
  const t = useTranslations('SearchPage');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const locale = useLocale() as 'tr' | 'en' | 'de' | 'fr';
  const { allTests, testsLoading } = useAppSelector((state) => state.test);
  const { activeMenus } = useAppSelector((state) => state.menu);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTests, setFilteredTests] = useState<Test[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  // Load all tests and menus
  useEffect(() => {
    dispatch(getAllTests({ isActive: true }));
    dispatch(getActiveMenus());
  }, [dispatch]);

  // Get category name by ID
  const getCategoryNameById = (categories: any) => {
    // Handle categories array - get first category
    if (Array.isArray(categories) && categories.length > 0) {
      const firstCategory = categories[0];
      
      // If category is already an object with multilingual data, use it directly
      if (typeof firstCategory === 'object' && firstCategory !== null && firstCategory.name) {
        return getCategoryName(firstCategory, locale);
      }
      
      // If category is a string ID, find the corresponding menu
      if (typeof firstCategory === 'string' && activeMenus && activeMenus.length > 0) {
        const menu = activeMenus.find((menu: any) => 
          menu.testCategory && menu.testCategory._id === firstCategory
        );
        if (menu && menu.testCategory) {
          return getCategoryName(menu.testCategory, locale);
        }
      }
    }
    
    // Handle single category (backward compatibility)
    if (typeof categories === 'object' && categories !== null && categories.name) {
      return getCategoryName(categories, locale);
    }
    
    if (typeof categories === 'string' && activeMenus && activeMenus.length > 0) {
      const menu = activeMenus.find((menu: any) => 
        menu.testCategory && menu.testCategory._id === categories
      );
      if (menu && menu.testCategory) {
        return getCategoryName(menu.testCategory, locale);
      }
    }
    
    // Final fallback
    return 'Kategori';
  };

  // Set initial filtered tests and pagination
  useEffect(() => {
    if (allTests.length > 0) {
      const filtered = getFilteredTests();
      setFilteredTests(filtered);
      updatePagination(filtered);
    }
  }, [allTests]);

  // Arama ve filtreleme
  useEffect(() => {
    const filtered = getFilteredTests();
    setFilteredTests(filtered);
    updatePagination(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, allTests]);

  const getFilteredTests = () => {
    let filtered = allTests;

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((test: any) => {
        // Handle categories array - check if selected category is in the array
        if (Array.isArray(test.categories)) {
          return test.categories.includes(selectedCategory);
        }
        
        // Handle single category (backward compatibility) - should not happen with new data structure
        return false;
      });
    }

    // Arama terimi filtresi
    if (searchTerm.trim()) {
      filtered = filtered.filter((test: any) => 
        getTestTitle(test, locale).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getTestDescription(test, locale).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoryNameById(test.categories).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const updatePagination = (filtered: Test[]) => {
    const total = filtered.length;
    const pages = Math.ceil(total / itemsPerPage);
    setTotalPages(pages);
    setTotalItems(total);
  };

  const getPaginatedTests = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTests.slice(startIndex, endIndex);
  };

  // Get dynamic categories from activeMenus
  const getCategories = () => {
    const categories = [
      { value: 'all', label: t('allCategories'), color: 'bg-gray-500' }
    ];
    
    if (activeMenus && activeMenus.length > 0) {
      activeMenus.forEach((menu: any) => {
        if (menu.testCategory) {
          categories.push({
            value: menu.testCategory._id,
            label: getCategoryName(menu.testCategory, locale),
            color: menu.color ? 'custom-color' : 'bg-gray-400'
          });
        }
      });
    }
    
    return categories;
  };

  const getCategoryColor = (category: any): string => {
    if (category.color === 'custom-color') {
      return 'custom-color';
    }
    return category.color || 'bg-gray-400';
  };

  const getCategoryColorStyle = (category: any): React.CSSProperties => {
    if (category.color === 'custom-color' && activeMenus) {
      const menu = activeMenus.find((menu: any) => 
        menu.testCategory && menu.testCategory.name === category.label
      );
      if (menu && menu.color) {
        return { backgroundColor: menu.color };
      }
    }
    return {};
  };

  const handleTestClick = (test: Test, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const localeSlug = getSlugForLocale(test.slug, locale);
      const targetId = localeSlug || test._id;
      router.push(`/${targetId}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <button
              onClick={() => router.push('/')}
              className="text-orange-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Arama Kutusu */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Kategori Filtreleri */}
          <div className="flex flex-wrap gap-2">
            {getCategories().map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-2 h-2 rounded-full ${getCategoryColor(category) === 'custom-color' ? '' : getCategoryColor(category)}`}
                    style={getCategoryColor(category) === 'custom-color' ? getCategoryColorStyle(category) : {}}
                  ></div>
                  {category.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sonuçlar */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {testsLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('noResults')}
            </h3>
            <p className="text-gray-600">
              {searchTerm.trim() 
                ? t('noResultsForSearch', { searchTerm })
                : t('noResultsInCategory')
              }
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600 text-lg">
                <span className="font-semibold">{totalItems}</span> {t('votesFound')}
                {searchTerm.trim() && ` ${t('forSearch', { searchTerm })}`}
                {selectedCategory !== 'all' && ` ${t('inCategory', { categoryName: getCategories().find(c => c.value === selectedCategory)?.label || selectedCategory })}`}
              </p>
            </div>

            <div className="max-w-7xl mx-auto px-2 lg:px-4 py-1">
              {/* Desktop Layout - 4x4 Grid */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-4 gap-4">
                  {getPaginatedTests().map((test: any, index: number) => (
                    <Card 
                      key={test._id} 
                      test={test}
                      index={index}
                      onTestClick={handleTestClick}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile Layout - 2x2 Grid */}
              <div className="lg:hidden">
                <div className="grid grid-cols-2 gap-2">
                  {getPaginatedTests().map((test: any, index: number) => (
                    <Card 
                      key={test._id} 
                      test={test}
                      index={index}
                      onTestClick={handleTestClick}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={handlePrevPage}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      >
                        <span className="hidden sm:block">{t('previous')}</span>
                      </PaginationPrevious>
                    </PaginationItem>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {/* Ellipsis for more pages */}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Next Button */}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={handleNextPage}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      >
                        <span className="hidden sm:block">{t('next')}</span>
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
