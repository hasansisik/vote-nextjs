"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { getAllTests, deleteTest } from "@/redux/actions/testActions";
import { getActiveTestCategories } from "@/redux/actions/testCategoryActions";
import { getText } from "@/lib/multiLanguageUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Calendar,
  Trophy,
  BarChart3,
  Eye
} from "lucide-react";
import { getTestTitle, getTestDescription, getOptionTitle } from '@/lib/multiLanguageUtils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <TestDetailPageWrapper params={params} />;
}

function TestDetailPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const [testId, setTestId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setTestId(resolvedParams.id);
    });
  }, [params]);

  if (!testId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return <TestDetailPageClient testId={testId} />;
}

function TestDetailPageClient({ testId }: { testId: string }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.user);
  const { allTests, testsLoading, testsError } = useSelector((state: any) => state.test);
  const { activeCategories } = useSelector((state: any) => state.testCategory);
  const [test, setTest] = useState<any>(null);

  useEffect(() => {
    if (allTests.length === 0) {
      dispatch(getAllTests({}) as any);
    }
    dispatch(getActiveTestCategories() as any);
  }, [dispatch, allTests.length]);

  useEffect(() => {
    if (allTests.length > 0 && testId) {
      const foundTest = allTests.find((t: any) => t._id === testId);
      setTest(foundTest);
    }
  }, [allTests, testId]);

  const handleDeleteTest = async () => {
    await dispatch(deleteTest(testId) as any);
    router.push('/dashboard/votes');
  };

  const getCategoryColor = (categoryId: string) => {
    if (!categoryId) return "bg-gray-100 text-gray-800";
    const category = activeCategories?.find((cat: any) => cat._id === categoryId);
    if (category && category.color) {
      return `${category.color.replace('bg-', 'bg-').replace('-500', '-100')} ${category.color.replace('bg-', 'text-').replace('-500', '-800')}`;
    }
    return "bg-gray-100 text-gray-800";
  };

  const getCategoryName = (categoryId: string) => {
    if (!categoryId) return 'Kategori Yok';
    const category = activeCategories?.find((cat: any) => cat._id === categoryId);
    if (category && category.name) {
      // Handle multilingual name structure - return Turkish name directly
      if (typeof category.name === 'object' && category.name.tr) {
        return category.name.tr;
      }
      return category.name || categoryId;
    }
    return categoryId || 'Kategori Yok';
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  if (testsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (testsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">{testsError}</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Bulunamadı</h2>
          <p className="text-gray-600">Aradığınız test mevcut değil.</p>
        </div>
      </div>
    );
  }

  // Sort options by votes
  const sortedOptions = [...test.options].sort((a: any, b: any) => b.votes - a.votes);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/votes">Oylamalar</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detay</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* WordPress-style Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{getTestTitle(test)}</h1>
              <p className="text-xs text-gray-600">
                Oylama detayları ve sonuçları
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/votes/create?edit=${test._id}`)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit className="h-4 w-4 mr-1" />
              Düzenle
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Sil
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Testi Sil</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu testi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve test ile ilgili tüm veriler kalıcı olarak silinecektir.
                    <br /><br />
                    <strong>Emin misiniz?</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteTest}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* WordPress-style Content Layout */}
      <div className="flex gap-6 p-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Cover Image */}
          {test.coverImage && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="w-full h-80 overflow-hidden">
                <img
                  src={test.coverImage}
                  alt={getTestTitle(test)}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Test Title */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={getCategoryColor(test.categories?.[0])}>
                  {getCategoryName(test.categories?.[0])}
                </Badge>
                <Badge variant={test.isActive ? "default" : "secondary"}>
                  {test.isActive ? "Aktif" : "Pasif"}
                </Badge>
                {test.trend && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    Trend
                  </Badge>
                )}
                {test.popular && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Popüler
                  </Badge>
                )}
              </div>
              {test.endDate && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Bitiş Tarihi:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(test.endDate).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {new Date(test.endDate) < new Date() && (
                      <Badge variant="destructive" className="ml-2 text-white bg-red-600">
                        Süresi Dolmuş
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-900">{getTestTitle(test)}</h1>
              {test.description && (
                <p className="text-base text-gray-600 leading-relaxed">{getTestDescription(test)}</p>
              )}
            </div>
          </div>

          {/* Header Text */}
          {test.headerText && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Üst Metin</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {typeof test.headerText === 'object' && test.headerText.tr 
                  ? test.headerText.tr 
                  : test.headerText}
              </p>
            </div>
          )}

          {/* Footer Text */}
          {test.footerText && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Alt Metin</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {typeof test.footerText === 'object' && test.footerText.tr 
                  ? test.footerText.tr 
                  : test.footerText}
              </p>
            </div>
          )}

          {/* Options */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Seçenekler ve Sonuçlar</h2>
            </div>
            <div className="space-y-6">
              {sortedOptions.map((option: any, index: number) => (
                <div key={option._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-6">
                    {option.image && (
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-lg overflow-hidden">
                          <img
                            src={option.image}
                            alt={getOptionTitle(option)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {index === 0 && (
                          <Trophy className="h-6 w-6 text-yellow-500" />
                        )}
                        <h3 className="text-base font-semibold text-gray-900">{getOptionTitle(option)}</h3>
                        {index === 0 && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Kazanan
                          </Badge>
                        )}
                      </div>
                      
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Users className="h-3 w-3" />
                            <span className="font-medium">{option.votes} oy</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <span className="font-medium">%{test.totalVotes > 0 ? ((option.votes / test.totalVotes) * 100).toFixed(1) : '0'}</span>
                          </div>
                        </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${test.totalVotes > 0 ? (option.votes / test.totalVotes) * 100 : 0}%`
                          }}
                        ></div>
                      </div>

                      {/* Custom Fields */}
                      {option.customFields && option.customFields.length > 0 && (
                        <div className="grid gap-2 md:grid-cols-2">
                          {option.customFields.map((field: any, fieldIndex: number) => (
                            <div key={fieldIndex} className="bg-gray-50 rounded-lg p-2">
                              <span className="text-xs font-medium text-gray-700">
                                {typeof field.fieldName === 'object' && field.fieldName.tr 
                                  ? field.fieldName.tr 
                                  : field.fieldName}:
                              </span>{" "}
                              <span className="text-xs text-gray-900">
                                {typeof field.fieldValue === 'object' && field.fieldValue.tr 
                                  ? field.fieldValue.tr 
                                  : field.fieldValue}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* İstatistikler */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">İstatistikler</h3>
            <div className="space-y-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {test.totalVotes}
                </div>
                <div className="text-xs text-gray-600">
                  Toplam Oy
                </div>
              </div>
              
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {test.options.length}
                </div>
                <div className="text-xs text-gray-600">
                  Seçenek Sayısı
                </div>
              </div>

              {test.stats && (
                <>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {test.stats.averageVotesPerOption?.toFixed(1) || '0'}
                    </div>
                    <div className="text-xs text-gray-600">
                      Ortalama Oy
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {test.stats.totalComparisons || 0}
                    </div>
                    <div className="text-xs text-gray-600">
                      Toplam Karşılaştırma
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Test Bilgileri */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Test Bilgileri</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3 w-3 text-gray-500" />
                <span className="text-gray-600">Oluşturulma:</span>
                <span className="font-medium">
                  {new Date(test.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Badge variant={test.isActive ? "default" : "secondary"}>
                  {test.isActive ? "Aktif" : "Pasif"}
                </Badge>
                {test.trend && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    Trend
                  </Badge>
                )}
                {test.popular && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Popüler
                  </Badge>
                )}
              </div>
              {test.endDate && (
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600">Bitiş:</span>
                  <span className="font-medium">
                    {new Date(test.endDate).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Oluşturan */}
          {test.createdBy && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Oluşturan</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-orange-600">
                    {test.createdBy.name?.[0]}{test.createdBy.surname?.[0]}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {typeof test.createdBy.name === 'string' ? test.createdBy.name : test.createdBy.name?.tr || 'Bilinmeyen'} {typeof test.createdBy.surname === 'string' ? test.createdBy.surname : test.createdBy.surname?.tr || ''}
                  </div>
                  <div className="text-xs text-gray-600">
                    Admin
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

