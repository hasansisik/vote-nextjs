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
import { getEnabledLanguages } from '@/redux/actions/settingsActions';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';

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

  const { enabledLanguages } = useSelector((state: any) => state.settings);

  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: {
      tr: '',
      en: '',
      de: '',
      fr: '',
    },
    description: {
      tr: '',
      en: '',
      de: '',
      fr: '',
    },
    htmlContent: {
      tr: '',
      en: '',
      de: '',
      fr: '',
    },
  });

  // Load categories and enabled languages on mount
  useEffect(() => {
    if (isOpen) {
      dispatch(getActiveTestCategories() as any);
      dispatch(getEnabledLanguages() as any);
    }
  }, [dispatch, isOpen]);

  // Clear form when creating new category
  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingCategory(null);
    setFormData({
      name: {
        tr: '',
        en: '',
        de: '',
        fr: '',
      },
      description: {
        tr: '',
        en: '',
        de: '',
        fr: '',
      },
      htmlContent: {
        tr: '',
        en: '',
        de: '',
        fr: '',
      },
    });
  };

  // Handle edit category
  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsCreating(true);
    setFormData({
      name: {
        tr: category.name?.tr || '',
        en: category.name?.en || '',
        de: category.name?.de || '',
        fr: category.name?.fr || '',
      },
      description: {
        tr: category.description?.tr || '',
        en: category.description?.en || '',
        de: category.description?.de || '',
        fr: category.description?.fr || '',
      },
      htmlContent: {
        tr: category.htmlContent?.tr || '',
        en: category.htmlContent?.en || '',
        de: category.htmlContent?.de || '',
        fr: category.htmlContent?.fr || '',
      },
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Turkish name is provided (required)
    if (!formData.name.tr?.trim()) {
      toast.error('Türkçe kategori adı gereklidir');
      return;
    }

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
        name: {
          tr: '',
          en: '',
          de: '',
          fr: '',
        },
        description: {
          tr: '',
          en: '',
          de: '',
          fr: '',
        },
        htmlContent: {
          tr: '',
          en: '',
          de: '',
          fr: '',
        },
      });
    } catch (error) {
      console.error('Category operation error:', error);
      toast.error('Bir hata oluştu');
    }
  };

  // Handle delete category
  const handleDelete = async (categoryId: string) => {
    try {
      const result = await dispatch(deleteTestCategory(categoryId) as any);
      if (result.type.endsWith('/fulfilled')) {
        toast.success('Kategori başarıyla silindi');
        // Refresh categories after delete
        await dispatch(getActiveTestCategories() as any);
      } else {
        toast.error(result.payload || 'Kategori silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error('Kategori silinirken bir hata oluştu');
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
            <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-gray-50">
              <h3 className="text-base font-medium mb-4">
                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {enabledLanguages && enabledLanguages.length > 0 && (
                  <Tabs defaultValue={enabledLanguages[0]?.code} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      {enabledLanguages.map((lang: any) => (
                        <TabsTrigger key={lang.code} value={lang.code} className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span className="hidden sm:inline">{lang.name}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {enabledLanguages.map((lang: any) => (
                      <TabsContent key={lang.code} value={lang.code} className="space-y-4 mt-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Kategori Adı ({lang.name}) {lang.code === 'tr' ? '*' : ''}
                          </Label>
                          <Input
                            type="text"
                            value={formData.name[lang.code as keyof typeof formData.name] || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              name: {
                                ...formData.name,
                                [lang.code]: e.target.value
                              }
                            })}
                            placeholder={`${lang.name} kategori adını girin`}
                            required={lang.code === 'tr'}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Açıklama ({lang.name})
                          </Label>
                          <Textarea
                            value={formData.description[lang.code as keyof typeof formData.description] || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              description: {
                                ...formData.description,
                                [lang.code]: e.target.value
                              }
                            })}
                            placeholder={`${lang.name} açıklama girin`}
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            HTML İçerik ({lang.name}) - Sayfanın Altında Gösterilir
                          </Label>
                          <div className="border rounded-md">
                            <RichTextEditor
                              content={formData.htmlContent[lang.code as keyof typeof formData.htmlContent] || ''}
                              onChange={(html) => setFormData({
                                ...formData,
                                htmlContent: {
                                  ...formData.htmlContent,
                                  [lang.code]: html
                                }
                              })}
                              placeholder={`${lang.name} HTML içeriği girin...`}
                            />
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}

                <div className="flex gap-2 pt-4">
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
                        name: {
                          tr: '',
                          en: '',
                          de: '',
                          fr: '',
                        },
                        description: {
                          tr: '',
                          en: '',
                          de: '',
                          fr: '',
                        },
                        htmlContent: {
                          tr: '',
                          en: '',
                          de: '',
                          fr: '',
                        },
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
                          <h4 className="text-sm font-medium text-gray-900">
                            {category.name?.tr || category.name || 'Kategori'}
                          </h4>
                          {category.description?.tr && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {category.description.tr}
                            </p>
                          )}
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
                                  onClick={() => handleDelete(category._id)}
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
