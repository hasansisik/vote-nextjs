"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { getAllTests } from "@/redux/actions/userActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Edit,
  Trash2,
  RotateCcw,
  Users,
  Calendar,
  Trophy,
  BarChart3
} from "lucide-react";

export default async function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const testId = resolvedParams.id;

  return <TestDetailPageClient testId={testId} />;
}

function TestDetailPageClient({ testId }: { testId: string }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { allTests, testsLoading, testsError, user } = useSelector((state: any) => state.user);
  const [test, setTest] = useState<any>(null);

  useEffect(() => {
    if (allTests.length === 0) {
      dispatch(getAllTests());
    }
  }, [dispatch, allTests.length]);

  useEffect(() => {
    if (allTests.length > 0 && testId) {
      const foundTest = allTests.find((t: any) => t._id === testId);
      setTest(foundTest);
    }
  }, [allTests, testId]);

  const handleDeleteTest = async () => {
    if (confirm("Bu testi silmek istediğinizden emin misiniz?")) {
      // This would require implementing deleteTest action
      alert("Test silme özelliği henüz implement edilmedi");
    }
  };

  const handleResetVotes = async () => {
    if (confirm("Bu testin oylarını sıfırlamak istediğinizden emin misiniz?")) {
      // This would require implementing resetTestVotes action
      alert("Oyları sıfırlama özelliği henüz implement edilmedi");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      futbol: "bg-green-100 text-green-800",
      yemek: "bg-orange-100 text-orange-800",
      müzik: "bg-purple-100 text-purple-800",
      film: "bg-blue-100 text-blue-800",
      oyun: "bg-pink-100 text-pink-800",
      teknoloji: "bg-gray-100 text-gray-800",
      spor: "bg-red-100 text-red-800",
      diğer: "bg-yellow-100 text-yellow-800",
    };
    return colors[category as keyof typeof colors] || colors.diğer;
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
    <div className="space-y-6 px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{test.title}</h1>
          <p className="text-muted-foreground">
            Oylama detayları ve sonuçları
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/votes/${test._id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Düzenle
          </Button>
          <Button
            variant="outline"
            onClick={handleResetVotes}
            disabled={test.totalVotes === 0}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Oyları Sıfırla
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteTest}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Sil
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Test Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            {test.coverImage && (
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={test.coverImage}
                  alt={test.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getCategoryColor(test.category)}>
                  {test.category}
                </Badge>
                <Badge variant={test.isActive ? "default" : "secondary"}>
                  {test.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              <CardTitle>{test.title}</CardTitle>
              {test.description && (
                <p className="text-muted-foreground">{test.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{test.totalVotes} toplam oy</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(test.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Header and Footer Text */}
          {(test.headerText || test.footerText) && (
            <Card>
              <CardContent className="pt-6">
                {test.headerText && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Üst Metin</h3>
                    <p className="text-muted-foreground">{test.headerText}</p>
                  </div>
                )}
                {test.footerText && (
                  <div>
                    <h3 className="font-semibold mb-2">Alt Metin</h3>
                    <p className="text-muted-foreground">{test.footerText}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Seçenekler ve Sonuçlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedOptions.map((option: any, index: number) => (
                  <div key={option._id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <img
                            src={option.image}
                            alt={option.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {index === 0 && (
                            <Trophy className="h-5 w-5 text-yellow-500" />
                          )}
                          <h3 className="font-semibold">{option.title}</h3>
                          {index === 0 && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Kazanan
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{option.votes} oy</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>%{option.winRate?.toFixed(1) || '0'}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${test.totalVotes > 0 ? (option.votes / test.totalVotes) * 100 : 0}%`
                            }}
                          ></div>
                        </div>

                        {/* Custom Fields */}
                        {option.customFields && option.customFields.length > 0 && (
                          <div className="grid gap-2 md:grid-cols-2">
                            {option.customFields.map((field: any, fieldIndex: number) => (
                              <div key={fieldIndex} className="text-sm">
                                <span className="font-medium text-muted-foreground">
                                  {field.fieldName}:
                                </span>{" "}
                                <span>{field.fieldValue}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">İstatistikler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {test.totalVotes}
                </div>
                <div className="text-sm text-muted-foreground">
                  Toplam Oy
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {test.options.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Seçenek Sayısı
                </div>
              </div>

              {test.stats && (
                <>
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {test.stats.averageVotesPerOption?.toFixed(1) || '0'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Ortalama Oy
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {test.stats.totalComparisons || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Toplam Karşılaştırma
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {test.createdBy && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Oluşturan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {test.createdBy.name?.[0]}{test.createdBy.surname?.[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {test.createdBy.name} {test.createdBy.surname}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Admin
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

