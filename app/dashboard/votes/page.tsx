"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserCreatedTests, deleteTest, resetTestVotes } from "@/redux/actions/userActions";
import { getActiveTestCategories } from "@/redux/actions/testCategoryActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CategoryManagementModal from "@/components/CategoryManagementModal";
import { 
  Trash2, 
  RotateCcw, 
  Edit,
  Calendar,
  Users,
  Trophy,
  Settings
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function VotesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userCreatedTests, testsLoading, testsError, user } = useSelector((state: any) => state.user);
  const { activeCategories } = useSelector((state: any) => state.testCategory);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(getUserCreatedTests() as any);
      dispatch(getActiveTestCategories() as any);
    }
  }, [dispatch, user]);

  const handleDeleteTest = async (testId: string) => {
    if (confirm("Bu testi silmek istediğinizden emin misiniz?")) {
      await dispatch(deleteTest(testId) as any);
      dispatch(getUserCreatedTests() as any); // Refresh the list
    }
  };

  const handleResetVotes = async (testId: string) => {
    if (confirm("Bu testin oylarını sıfırlamak istediğinizden emin misiniz?")) {
      await dispatch(resetTestVotes(testId) as any);
      dispatch(getUserCreatedTests() as any); // Refresh the list
    }
  };

  const getCategoryColor = (categorySlug: string) => {
    const category = activeCategories.find((cat: any) => cat.slug === categorySlug);
    if (category) {
      return `${category.color.replace('bg-', 'bg-').replace('-500', '-100')} ${category.color.replace('bg-', 'text-').replace('-500', '-800')}`;
    }
    return "bg-gray-100 text-gray-800";
  };

  const getCategoryName = (categorySlug: string) => {
    const category = activeCategories.find((cat: any) => cat.slug === categorySlug);
    return category ? category.name : categorySlug;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Oylamalar</h1>
          <p className="text-muted-foreground">
            Tüm oylamalarınızı görüntüleyin
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Kategori Yönetimi
          </Button>
          <Button onClick={() => router.push('/dashboard/votes/create')}>
            Yeni Oylama Oluştur
          </Button>
        </div>
      </div>

      {testsLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      ) : testsError ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <p className="text-red-600">{testsError}</p>
            <Button 
              variant="outline" 
              onClick={() => dispatch(getUserCreatedTests() as any)}
              className="mt-2"
            >
              Tekrar Dene
            </Button>
          </div>
        </div>
      ) : userCreatedTests?.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Henüz oylama bulunmuyor</h3>
            <p className="text-muted-foreground mb-4">
              İlk oylamanızı oluşturmak için butona tıklayın
            </p>
            <Button onClick={() => router.push('/dashboard/votes/create')}>
              Yeni Oylama Oluştur
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userCreatedTests?.map((test: any) => (
            <Card key={test._id} className="hover:shadow-lg transition-shadow overflow-hidden">
              {test.coverImage && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={test.coverImage}
                    alt={test.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {test.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(test.category)}>
                        {getCategoryName(test.category)}
                      </Badge>
                      <Badge variant={test.isActive ? "default" : "secondary"}>
                        {test.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {test.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {test.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{test.totalVotes} oy</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(test.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/votes/${test._id}/edit`)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Düzenle
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResetVotes(test._id)}
                    disabled={test.totalVotes === 0}
                    title="Oyları Sıfırla"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTest(test._id)}
                    className="text-red-600 hover:text-red-700"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Category Management Modal */}
      <CategoryManagementModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
}
