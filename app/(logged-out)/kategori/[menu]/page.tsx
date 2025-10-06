'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getAllTests } from '@/redux/actions/userActions';
import { getActiveTestCategories } from '@/redux/actions/testCategoryActions';

interface Test {
  _id: string;
  title: string;
  description: string;
  category: string;
  options: any[];
  isActive: boolean;
}

// Kategori isimlerini header'daki isimlerle eşleştir
const categoryMapping: { [key: string]: string[] } = {
  'izlenmeye-deger': ['film', 'müzik', 'oyun', 'teknoloji'],
  'garip-tarih': ['diğer'],
  'mezarlik-vardiyasi': ['diğer'],
  'tam-bir-inek': ['teknoloji', 'oyun'],
  'oyun': ['oyun'],
  'senaryosuz': ['film', 'müzik'],
  'yasam-tarzi': ['diğer'],
  'muzik': ['müzik'],
  'spor': ['spor']
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { allTests, testsLoading } = useAppSelector((state) => state.user);
  const { activeCategories } = useAppSelector((state) => state.testCategory);
  const [tests, setTests] = useState<Test[]>([]);

  // URL'den kategori parametresini al
  const categorySlug = params.menu as string;

  // Load all tests and categories
  useEffect(() => {
    dispatch(getAllTests({ isActive: true }));
    dispatch(getActiveTestCategories());
  }, [dispatch]);

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = activeCategories?.find((cat: any) => cat._id === categoryId);
    return category ? category.name : categoryId;
  };

  useEffect(() => {
    if (categorySlug && allTests.length > 0) {
      loadTestsForCategory(categorySlug);
    }
  }, [categorySlug, allTests]);

  const loadTestsForCategory = (slug: string) => {
    // Slug'ı kategori ismine çevir
    const categoryNames = categoryMapping[slug] || [];
    
    if (categoryNames.length > 0) {
      // Bu kategorilere ait testleri filtrele
      const filteredTests = allTests.filter((test: any) => 
        categoryNames.includes(test.category)
      );
      setTests(filteredTests);
    } else {
      // Eğer eşleşme yoksa tüm testleri göster
      setTests(allTests);
    }
  };

  const getCategoryDisplayName = (slug: string): string => {
    const displayNames: { [key: string]: string } = {
      'izlenmeye-deger': 'İZLENMEYE DEĞER',
      'garip-tarih': 'GARİP TARİH',
      'mezarlik-vardiyasi': 'MEZARLIK VARDİYASI',
      'tam-bir-inek': 'TAM BİR İNEK',
      'oyun': 'OYUN',
      'senaryosuz': 'SENARYOSUZ',
      'yasam-tarzi': 'YAŞAM TARZI',
      'muzik': 'MÜZİK',
      'spor': 'SPOR'
    };
    return displayNames[slug] || slug.toUpperCase();
  };

  const getCategoryColor = (slug: string): string => {
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
    return colors[slug] || 'bg-gray-400';
  };

  const handleTestClick = (testId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Test clicked:', testId);
    try {
      router.push(`/logged-out/${testId}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (testsLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Kategori Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-4 h-4 rounded-full ${getCategoryColor(categorySlug)}`}></div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getCategoryDisplayName(categorySlug)}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {tests.length} oylama bulundu
          </p>
        </div>

        {/* Test Listesi */}
        {tests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test._id}
                onClick={(e) => handleTestClick(test._id, e)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
              >
                {/* Test Görseli */}
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={test.options[0]?.image?.startsWith('/') ? test.options[0].image : `/images/v${(tests.indexOf(test) % 8) + 1}.jpg`}
                    alt={test.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Test İçeriği */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {test.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {test.description}
                  </p>
                  
                  {/* Kategori Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 capitalize">
                      {getCategoryName(test.category)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {test.options.length} seçenek
                      </span>
                      <svg 
                        className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
