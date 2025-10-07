"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllTests, deleteTest, getSingleTest } from "@/redux/actions/testActions";
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
import { toast } from "sonner";
import { getTestTitle, getTestDescription, getCategoryName } from '@/lib/multiLanguageUtils';

export default function VotesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.user);
  const { allTests, testsLoading, testsError, singleTest } = useSelector((state: any) => state.test);
  const { activeCategories } = useSelector((state: any) => state.testCategory);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(getAllTests({}) as any);
      dispatch(getActiveTestCategories() as any);
    }
  }, [dispatch, user]);

  // Debug: Log categories and tests
  useEffect(() => {
    console.log('Active categories:', activeCategories);
    console.log('All tests:', allTests);
    if (allTests?.length > 0) {
      console.log('First test category:', allTests[0]?.category);
      console.log('Category match:', activeCategories?.find((cat: any) => cat._id === allTests[0]?.category));
    }
  }, [activeCategories, allTests]);

  const handleDeleteTest = async (testId: string) => {
    setTestToDelete(testId);
  };

  const confirmDelete = async () => {
    if (testToDelete) {
      console.log('Deleting test with ID:', testToDelete);
      setIsDeleting(true);
      try {
        const result = await dispatch(deleteTest(testToDelete) as any);
        console.log('Delete result:', result);
        if (result.type.endsWith('/fulfilled')) {
          console.log('Test deleted successfully');
          toast.success('Test başarıyla silindi');
          // Test başarıyla silindi, listeyi yenile
          await dispatch(getAllTests({}) as any);
          setTestToDelete(null);
        } else {
          console.error('Delete test failed:', result.payload);
          toast.error('Test silinirken bir hata oluştu: ' + result.payload);
        }
      } catch (error) {
        console.error('Delete test error:', error);
        toast.error('Test silinirken bir hata oluştu');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditTest = async (testId: string) => {
    try {
      console.log('Editing test with ID:', testId);
      const result = await dispatch(getSingleTest(testId) as any);
      if (result.type.endsWith('/fulfilled')) {
        console.log('Test data loaded successfully, navigating to edit page');
        router.push(`/dashboard/votes/create?edit=${testId}`);
      } else {
        console.error('Test verileri yüklenemedi:', result.payload);
        toast.error('Test verileri yüklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Test verileri yüklenirken hata:', error);
      toast.error('Test verileri yüklenirken bir hata oluştu');
    }
  };


  const getCategoryColor = (categoryId: string) => {
    return "bg-gray-100 text-gray-800";
  };

  const getCategoryNameById = (categoryId: string) => {
    if (!categoryId) return 'Kategori Yok';
    const category = activeCategories?.find((cat: any) => cat._id === categoryId);
    if (!category) return 'Bilinmeyen Kategori';
    
    return getCategoryName(category);
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
              onClick={() => dispatch(getAllTests({}) as any)}
              className="mt-2"
            >
              Tekrar Dene
            </Button>
          </div>
        </div>
      ) : allTests?.length === 0 ? (
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
          <table className="w-full table-fixed">
            <thead className="bg-sidebar border-b border-gray-200">
              <tr>
                <th className="w-2/5 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oylama
                </th>
                <th className="w-1/8 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="w-1/8 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="w-1/8 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oy Sayısı
                </th>
                <th className="w-1/8 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="w-1/8 px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allTests?.map((test: any) => (
                <tr key={test._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      {test.coverImage && (
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg overflow-hidden">
                          <img
                            src={test.coverImage}
                            alt={getTestTitle(test)}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {getTestTitle(test)}
                        </h3>
                        {test.description && (
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {getTestDescription(test)}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge className={`${getCategoryColor(test.category)} text-xs`}>
                      {activeCategories?.length > 0 ? getCategoryNameById(test.category) : 'Yükleniyor...'}
                    </Badge>
                  </td>
                  <td className="px-1 py-2">
                    <div className="flex items-center gap-0.5 flex-wrap">
                      <Badge variant={test.isActive ? "default" : "secondary"} className="text-[9px] px-1 py-0.5 whitespace-nowrap">
                        {test.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                      {test.trend && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0.5 text-orange-600 border-orange-600 whitespace-nowrap">
                          Trend
                        </Badge>
                      )}
                      {test.popular && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0.5 text-blue-600 border-blue-600 whitespace-nowrap">
                          Popüler
                        </Badge>
                      )}
                      {test.endDate && new Date(test.endDate) < new Date() && (
                        <Badge variant="destructive" className="text-[9px] px-1 py-0.5 whitespace-nowrap text-white bg-red-600">
                          Süresi Dolmuş
                        </Badge>
                      )}
                    </div>
                    {test.endDate && (
                      <div className="text-[8px] text-gray-500 mt-1">
                        Bitiş: {new Date(test.endDate).toLocaleDateString('tr-TR')}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="h-4 w-4 mr-1" />
                      {test.totalVotes}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(test.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTest(test._id)}
                          className="text-blue-600 hover:text-blue-700 p-2"
                          title="Testi Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/votes/${test._id}`)}
                        className="text-green-600 hover:text-green-700 p-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTest(test._id)}
                              className="text-red-600 hover:text-red-700 p-2"
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
                              <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {isDeleting ? 'Siliniyor...' : 'Sil'}
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
      )}

      {/* Category Management Modal */}
      <CategoryManagementModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
}
