"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserCreatedTests, deleteTest } from "@/redux/actions/userActions";
import { getActiveTestCategories } from "@/redux/actions/testCategoryActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import CategoryManagementModal from "@/components/CategoryManagementModal";
import { 
  Trash2, 
  Edit,
  Calendar,
  Users,
  Settings,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function VotesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userCreatedTests, testsLoading, testsError, user } = useSelector((state: any) => state.user);
  const { activeCategories } = useSelector((state: any) => state.testCategory);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(getUserCreatedTests() as any);
      dispatch(getActiveTestCategories() as any);
    }
  }, [dispatch, user]);

  // Debug: Log categories and tests
  useEffect(() => {
    console.log('Active categories:', activeCategories);
    console.log('User created tests:', userCreatedTests);
  }, [activeCategories, userCreatedTests]);

  const handleDeleteTest = async (testId: string) => {
    setTestToDelete(testId);
  };

  const confirmDelete = async () => {
    if (testToDelete) {
      await dispatch(deleteTest(testToDelete) as any);
      dispatch(getUserCreatedTests() as any); // Refresh the list
      setTestToDelete(null);
    }
  };


  const getCategoryColor = (categoryId: string) => {
    const category = activeCategories.find((cat: any) => cat._id === categoryId);
    if (category) {
      return `${category.color.replace('bg-', 'bg-').replace('-500', '-100')} ${category.color.replace('bg-', 'text-').replace('-500', '-800')}`;
    }
    return "bg-gray-100 text-gray-800";
  };

  const getCategoryName = (categoryId: string) => {
    const category = activeCategories.find((cat: any) => cat._id === categoryId);
    return category ? category.name : categoryId;
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
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sidebar border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oylama
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oy Sayısı
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userCreatedTests?.map((test: any) => (
                  <tr key={test._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {test.coverImage && (
                          <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden">
                            <img
                              src={test.coverImage}
                              alt={test.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {test.title}
                          </h3>
                          {test.description && (
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {test.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getCategoryColor(test.category)}>
                        {getCategoryName(test.category)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={test.isActive ? "default" : "secondary"}>
                        {test.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="h-4 w-4 mr-1" />
                        {test.totalVotes}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(test.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/votes/create?edit=${test._id}`)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Düzenle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/votes/${test._id}`)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Görüntüle
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
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
                                onClick={() => handleDeleteTest(test._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
