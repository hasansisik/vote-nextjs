'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getTestsByCategorySlug } from '@/redux/actions/testActions';
import { getActiveMenus } from '@/redux/actions/menuActions';
import { getTestTitle, getTestDescription, getCategoryName, getText } from '@/lib/multiLanguageUtils';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface CardProps {
  test: any;
  index: number;
  onTestClick: (testId: string, e: React.MouseEvent) => void;
  getCategoryNameById: (category: any) => string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ test, index, onTestClick, getCategoryNameById, className = "" }) => {
  const handleClick = (e: React.MouseEvent) => {
    onTestClick(test._id, e);
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
          alt={getTestTitle(test)}
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
          {getTestTitle(test)}
        </h3>
        
        {/* Açıklama */}
        {test.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
            {getTestDescription(test)}
          </p>
        )}
      </div>
    </div>
  );
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { categoryTests, categoryInfo, categoryTestsLoading, categoryPagination } = useAppSelector((state) => state.test);
  const { activeMenus } = useAppSelector((state) => state.menu);
  const { activeCategories } = useAppSelector((state) => state.testCategory);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  // Category name helper function
  const getCategoryNameById = (categories: any) => {
    // Handle categories array - get first category
    if (Array.isArray(categories) && categories.length > 0) {
      const firstCategory = categories[0];
      if (typeof firstCategory === 'string') {
        // Category ID'si string olarak geliyorsa, activeCategories'den bul
        const categoryObj = activeCategories?.find((cat: any) => cat._id === firstCategory);
        return categoryObj ? getCategoryName(categoryObj).toUpperCase() : 'KATEGORİ';
      }
      return getCategoryName(firstCategory).toUpperCase() || 'KATEGORİ';
    }
    
    // Handle single category (backward compatibility)
    if (typeof categories === 'string') {
      const categoryObj = activeCategories?.find((cat: any) => cat._id === categories);
      return categoryObj ? getCategoryName(categoryObj).toUpperCase() : 'KATEGORİ';
    }
    
    return getCategoryName(categories).toUpperCase() || 'KATEGORİ';
  };

  // URL'den kategori parametresini al
  const categorySlug = params.menu as string;

  // Load menus and category tests
  useEffect(() => {
    dispatch(getActiveMenus());
  }, [dispatch]);

  useEffect(() => {
    if (categorySlug) {
      setCurrentPage(1); // Reset to first page when category changes
      dispatch(getTestsByCategorySlug({ slug: categorySlug, limit: itemsPerPage, page: 1 }));
    }
  }, [dispatch, categorySlug, itemsPerPage]);

  // Update pagination info when data changes
  useEffect(() => {
    if (categoryPagination) {
      setTotalPages(categoryPagination.totalPages || 1);
      setTotalItems(categoryPagination.totalItems || 0);
    }
  }, [categoryPagination]);

  const getCategoryDisplayName = (): string => {
    if (categoryInfo?.name) {
      const categoryName = getText(categoryInfo.name, 'tr');
      return categoryName ? categoryName.toUpperCase() : categorySlug?.toUpperCase() || 'KATEGORİ';
    }
    return categorySlug?.toUpperCase() || 'KATEGORİ';
  };

  const getCategoryColor = (): string => {
    // Önce menü verilerinden rengi bul
    if (activeMenus && activeMenus.length > 0 && categoryInfo) {
      const categoryName = getText(categoryInfo.name, 'tr');
      const menu = activeMenus.find((menu: any) => 
        menu.testCategory && menu.testCategory.name && 
        getText(menu.testCategory.name, 'tr').toLowerCase() === categoryName.toLowerCase()
      );
      if (menu && menu.color) {
        return 'custom-color';
      }
    }
    
    // Fallback renkler
    const colors: { [key: string]: string } = {
      'izlenmeye-deger': 'bg-pink-400',
      'garip-tarih': 'bg-orange-600',
      'mezarlik-vardiyasi': 'bg-gray-600',
      'tam-bir-inek': 'bg-purple-600',
      'oyun': 'bg-teal-500',
      'senaryosuz': 'bg-red-500',
      'yasam-tarzi': 'bg-blue-600',
      'muzik': 'bg-gray-400',
      'spor': 'bg-green-500'
    };
    return colors[categorySlug] || 'bg-gray-400';
  };

  const getCategoryColorStyle = (): React.CSSProperties => {
    // Önce menü verilerinden rengi bul
    if (activeMenus && activeMenus.length > 0 && categoryInfo) {
      const categoryName = getText(categoryInfo.name, 'tr');
      const menu = activeMenus.find((menu: any) => 
        menu.testCategory && menu.testCategory.name && 
        getText(menu.testCategory.name, 'tr').toLowerCase() === categoryName.toLowerCase()
      );
      if (menu && menu.color) {
        return { backgroundColor: menu.color };
      }
    }
    return {};
  };

  const handleTestClick = (testId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Find the test to get its slug
      const test = categoryTests?.find((t: any) => t._id === testId);
      const targetId = test?.slug || testId;
      router.push(`/${targetId}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatch(getTestsByCategorySlug({ slug: categorySlug, limit: itemsPerPage, page }));
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

  if (categoryTestsLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Kategori Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className={`w-4 h-4 rounded-full ${getCategoryColor() === 'custom-color' ? '' : getCategoryColor()}`}
              style={getCategoryColor() === 'custom-color' ? getCategoryColorStyle() : {}}
            ></div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getCategoryDisplayName()}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {categoryTests?.length || 0} oylama bulundu
          </p>
        </div>

        {/* Test Listesi */}
        {categoryTests && categoryTests.length > 0 ? (
          <>
            <div className="max-w-7xl mx-auto px-2 lg:px-4 py-1">
              {/* Desktop Layout - 4x4 Grid */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-4 gap-4">
                  {categoryTests.map((test: any, index: number) => (
                    <Card 
                      key={test._id} 
                      test={test}
                      index={index}
                      onTestClick={handleTestClick}
                      getCategoryNameById={getCategoryNameById}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile Layout - 2x2 Grid */}
              <div className="lg:hidden">
                <div className="grid grid-cols-2 gap-2">
                  {categoryTests.map((test: any, index: number) => (
                    <Card 
                      key={test._id} 
                      test={test}
                      index={index}
                      onTestClick={handleTestClick}
                      getCategoryNameById={getCategoryNameById}
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
                        <span className="hidden sm:block">Önceki</span>
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
                        <span className="hidden sm:block">Sonraki</span>
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

           
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Henüz oylama yok
            </h3>
            <p className="text-gray-600">
              Bu kategoride henüz hiç oylama bulunmuyor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}