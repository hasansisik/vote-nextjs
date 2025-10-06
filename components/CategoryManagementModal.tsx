'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getActiveTestCategories, 
  createTestCategory, 
  updateTestCategory, 
  deleteTestCategory,
  clearTestCategoryError 
} from '@/redux/actions/testCategoryActions';
import { 
  X, 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect?: (category: any) => void;
  selectMode?: boolean;
}

// Color options removed - now handled in Menu management

export default function CategoryManagementModal({ 
  isOpen, 
  onClose, 
  onCategorySelect,
  selectMode = false 
}: CategoryManagementModalProps) {
  const dispatch = useDispatch();
  const { 
    activeCategories, 
    allCategories, 
    loading, 
    error, 
    message 
  } = useSelector((state: any) => state.testCategory);

  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
  });

  // Load categories on mount
  useEffect(() => {
    if (isOpen) {
      dispatch(getActiveTestCategories() as any);
    }
  }, [dispatch, isOpen]);

  // Clear form when creating new category
  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingCategory(null);
    setFormData({
      name: '',
    });
  };

  // Handle edit category
  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsCreating(true);
    setFormData({
      name: category.name,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Kategori adı gereklidir');
      return;
    }

    console.log('Creating category with data:', formData);

    try {
      let result;
      if (editingCategory) {
        result = await dispatch(updateTestCategory({ 
          id: editingCategory._id, 
          formData 
        }) as any);
        if (result.type.endsWith('/fulfilled')) {
          toast.success('Kategori başarıyla güncellendi');
        } else {
          toast.error(result.payload || 'Kategori güncellenirken bir hata oluştu');
          return;
        }
      } else {
        result = await dispatch(createTestCategory(formData) as any);
        if (result.type.endsWith('/fulfilled')) {
          toast.success('Kategori başarıyla oluşturuldu');
        } else {
          toast.error(result.payload || 'Kategori oluşturulurken bir hata oluştu');
          return;
        }
      }
      
      // Refresh categories after create/update
      await dispatch(getActiveTestCategories() as any);
      
      setIsCreating(false);
      setEditingCategory(null);
      setFormData({
        name: '',
      });
    } catch (error) {
      console.error('Category operation error:', error);
      toast.error('Bir hata oluştu');
    }
  };

  // Handle delete category
  const handleDelete = async (categoryId: string) => {
    setCategoryToDelete(categoryId);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        const result = await dispatch(deleteTestCategory(categoryToDelete) as any);
        if (result.type.endsWith('/fulfilled')) {
          toast.success('Kategori başarıyla silindi');
          // Refresh categories after delete
          await dispatch(getActiveTestCategories() as any);
        } else {
          toast.error(result.payload || 'Kategori silinirken bir hata oluştu');
        }
        setCategoryToDelete(null);
      } catch (error) {
        console.error('Delete category error:', error);
        toast.error('Kategori silinirken bir hata oluştu');
      }
    }
  };


  // Handle category selection
  const handleCategorySelect = (category: any) => {
    if (onCategorySelect) {
      onCategorySelect(category);
      onClose();
    }
  };

  // Clear error message
  const clearError = () => {
    dispatch(clearTestCategoryError() as any);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {selectMode ? 'Kategori Seç' : 'Kategori Yönetimi'}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Kategorileri yönetin, yeni kategori ekleyin veya mevcut kategorileri düzenleyin.
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Error Message */}



          {/* Create/Edit Form */}
          {isCreating && (
            <div className="mb-6 p-4  rounded-lg">
              <h3 className="text-base font-medium mb-4">
                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Kategori Adı *
                  </Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Kategori adını girin"
                    required
                    className="mt-1"
                  />
                </div>

                {/* Color selection removed - now handled in Menu management */}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingCategory ? 'Güncelle' : 'Oluştur'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingCategory(null);
                      setFormData({
                        name: '',
                      });
                    }}
                  >
                    İptal
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Kategoriler</h3>
              {!selectMode && (
                <Button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Yeni Kategori
                </Button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeCategories.map((category: any) => (
                  <div
                    key={category._id}
                    className={`p-3 border rounded-lg hover:shadow-sm transition-shadow ${
                      selectMode ? 'cursor-pointer hover:bg-gray-50' : ''
                    }`}
                    onClick={selectMode ? () => handleCategorySelect(category) : undefined}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                        </div>
                      </div>
                      
                      {!selectMode && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(category);
                            }}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-blue-500"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve kategori kalıcı olarak silinecektir.
                                  <br /><br />
                                  <strong>Emin misiniz?</strong>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    handleDelete(category._id);
                                    confirmDelete();
                                  }}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeCategories.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500 text-sm">
                Henüz kategori eklenmemiş.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
