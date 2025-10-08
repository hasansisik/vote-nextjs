'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getAllTests,
  deleteTest,
  resetTestVotes,
} from '@/redux/actions/testActions';
import {
  getActiveTestCategories,
} from '@/redux/actions/testCategoryActions';
import { Plus, Edit, Trash2, RotateCcw, Eye, Loader2, BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getTestTitle, getCategoryName } from '@/lib/multiLanguageUtils';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.user);
  const { allTests, testsLoading, testsError } = useSelector((state: any) => state.test);
  const { activeCategories } = useSelector((state: any) => state.testCategory);

  useEffect(() => {
    // Her zaman getAllTests tetikle - tüm testleri getir
    dispatch(getAllTests({}) as any);
    dispatch(getActiveTestCategories() as any);
  }, [dispatch, user]);

  const handleDeleteTest = async (testId: string) => {
    if (confirm("Bu testi silmek istediğinizden emin misiniz?")) {
      await dispatch(deleteTest(testId) as any);
      // Her zaman getAllTests'i refresh et - tüm testleri getir
      dispatch(getAllTests({}) as any);
    }
  };

  const handleResetVotes = async (testId: string) => {
    if (confirm("Bu testin oylarını sıfırlamak istediğinizden emin misiniz?")) {
      await dispatch(resetTestVotes(testId) as any);
      // Her zaman getAllTests'i refresh et - tüm testleri getir
      dispatch(getAllTests({}) as any);
    }
  };

  const getCategoryColor = (categorySlug: string) => {
    const category = activeCategories.find((cat: any) => cat.slug === categorySlug);
    if (category && category.color) {
      return `${category.color.replace('bg-', 'bg-').replace('-500', '-100')} ${category.color.replace('bg-', 'text-').replace('-500', '-800')}`;
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getCategoryNameBySlug = (categorySlug: string) => {
    const category = activeCategories.find((cat: any) => cat.slug === categorySlug);
    return getCategoryName(category) || categorySlug;
  };

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/category/${categorySlug}`);
  };

  const handleViewTest = (testId: string) => {
    router.push(`/test/${testId}`);
  };

  const handleEditTest = (testId: string) => {
    router.push(`/dashboard/votes?edit=${testId}`);
  };

  // Her zaman allTests kullan - hem aktif hem pasif testleri göster
  const testsData = allTests;
  
  // Calculate statistics
  const totalTests = testsData?.length || 0;
  const totalVotes = testsData?.reduce((sum: number, test: any) => sum + (test.totalVotes || 0), 0) || 0;
  const activeTests = testsData?.filter((test: any) => test.isActive).length || 0;
  const avgVotesPerTest = totalTests > 0 ? Math.round(totalVotes / totalTests) : 0;

  if (testsLoading && testsData?.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">Oylamalarınızı yönetin ve istatistikleri görüntüleyin</p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/votes')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Yeni Oylama
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Oylama</p>
                <p className="text-2xl font-bold">{totalTests}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Oy</p>
                <p className="text-2xl font-bold">{totalVotes.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Oylama</p>
                <p className="text-2xl font-bold">{activeTests}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Oy</p>
                <p className="text-2xl font-bold">{avgVotesPerTest}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Son Oylamalar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Yükleniyor...</span>
              </div>
            </div>
          ) : testsError ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <p className="text-red-600">{testsError}</p>
                <Button 
                  variant="outline" 
                  onClick={() => dispatch(getAllTests({}) as any)}
                  className="mt-2"
                >
                  Tekrar Dene
                </Button>
              </div>
            </div>
          ) : testsData?.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz oylama yok</h3>
              <p className="text-gray-500 mb-4">İlk oylamanızı oluşturmak için aşağıdaki butona tıklayın.</p>
              <Button onClick={() => router.push('/dashboard/votes')}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Oylama Oluştur
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {testsData?.slice(0, 5).map((test: any) => (
                <div key={test._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(test.categories?.[0] || '').split(' ')[0]}`}></div>
                      <div>
                        <h3 className="font-semibold">{getTestTitle(test)}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{test.categories && test.categories.length > 0 ? getCategoryNameBySlug(test.categories[0]) : 'Kategori Yok'}</span>
                          <span>•</span>
                          <span>{test.totalVotes || 0} oy</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            test.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {test.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTest(test._id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTest(test._id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetVotes(test._id)}
                      disabled={testsLoading}
                    >
                      {testsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTest(test._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {testsData?.length > 5 && (
                <div className="text-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/dashboard/votes')}
                  >
                    Tüm Oylamaları Görüntüle
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}