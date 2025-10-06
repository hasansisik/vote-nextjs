'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getAllTests } from '@/redux/actions/userActions';
import { getActiveTestCategories } from '@/redux/actions/testCategoryActions';

interface Test {
  _id: string;
  title: string;
  description: string;
  category: string;
  options: any[];
  totalVotes: number;
  isActive: boolean;
}

export default function AramaPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { allTests, testsLoading } = useAppSelector((state) => state.user);
  const { activeCategories } = useAppSelector((state) => state.testCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTests, setFilteredTests] = useState<Test[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  // Set initial filtered tests
  useEffect(() => {
    if (allTests.length > 0) {
      setFilteredTests(allTests);
    }
  }, [allTests]);

  // Arama ve filtreleme
  useEffect(() => {
    let filtered = allTests;

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((test: any) => test.category === selectedCategory);
    }

    // Arama terimi filtresi
    if (searchTerm.trim()) {
      filtered = filtered.filter((test: any) => 
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTests(filtered);
  }, [searchTerm, selectedCategory, allTests]);

  const categories = [
    { value: 'all', label: 'Tümü', color: 'bg-gray-500' },
    { value: 'spor', label: 'Spor', color: 'bg-green-500' },
    { value: 'film', label: 'Film', color: 'bg-blue-500' },
    { value: 'yemek', label: 'Yemek', color: 'bg-orange-500' },
    { value: 'müzik', label: 'Müzik', color: 'bg-purple-500' },
    { value: 'teknoloji', label: 'Teknoloji', color: 'bg-indigo-500' },
  ];

  const handleTestClick = (testId: string) => {
    router.push(`/logged-out/${testId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Test Ara</h1>
            <button
              onClick={() => router.push('/logged-out')}
              className="text-gray-600 hover:text-gray-900"
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
              placeholder="Test ara... (başlık, açıklama, kategori)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Kategori Filtreleri */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                  {category.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sonuçlar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredTests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sonuç bulunamadı</h3>
            <p className="text-gray-600">
              {searchTerm.trim() 
                ? `"${searchTerm}" için sonuç bulunamadı. Farklı anahtar kelimeler deneyin.`
                : 'Bu kategoride henüz test bulunmuyor.'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                <span className="font-semibold">{filteredTests.length}</span> test bulundu
                {searchTerm.trim() && ` "${searchTerm}" için`}
                {selectedCategory !== 'all' && ` ${categories.find(c => c.value === selectedCategory)?.label} kategorisinde`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <button
                  key={test._id}
                  onClick={() => handleTestClick(test._id)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
                >
                  {/* Test Resmi */}
                  <div className="relative h-48">
                    <Image
                      src={test.options[0]?.image?.startsWith('/') ? test.options[0].image : `/images/v${(filteredTests.indexOf(test) % 8) + 1}.jpg`}
                      alt={test.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Kategori Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1 rounded-full text-xs font-medium text-white bg-gray-500">
                        {getCategoryName(test.category).toUpperCase()}
                      </div>
                    </div>

                    {/* Oy Sayısı */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                      {test.totalVotes.toLocaleString()} oy
                    </div>
                  </div>

                  {/* Test Bilgileri */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {test.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {test.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{test.options.length} seçenek</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Oy Ver
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
