'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  createMenu,
  getAllMenus,
  updateMenu,
  deleteMenu,
  toggleMenuStatus,
  updateMenuOrder,
  clearAllMenus,
} from '@/redux/actions/menuActions';
import {
  getActiveTestCategories,
} from '@/redux/actions/testCategoryActions';
import { Plus, Edit, Trash2, GripVertical, Loader2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const colorOptions = [
  { name: 'Kırmızı', value: '#ef4444' },
  { name: 'Pembe', value: '#ec4899' },
  { name: 'Mor', value: '#a855f7' },
  { name: 'İndigo', value: '#6366f1' },
  { name: 'Mavi', value: '#3b82f6' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Yeşil', value: '#22c55e' },
  { name: 'Sarı', value: '#eab308' },
  { name: 'Turuncu', value: '#f97316' },
  { name: 'Gri', value: '#6b7280' },
  { name: 'Siyah', value: '#111827' },
];

export default function MenusPage() {
  const dispatch = useDispatch();
  const { allMenus, loading, error, message } = useSelector((state: any) => state.menu);
  const { activeCategories } = useSelector((state: any) => state.testCategory);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    testCategoryId: '',
    color: '#f97316',
  });

  useEffect(() => {
    dispatch(getAllMenus({}) as any);
    dispatch(getActiveTestCategories() as any);
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

  // Debug: Log categories and menus
  useEffect(() => {
    console.log('Active categories:', activeCategories);
    console.log('All menus:', allMenus);
  }, [activeCategories, allMenus]);

  const handleCreate = () => {
    if (!formData.testCategoryId) {
      toast.error('Lütfen bir test kategorisi seçin');
      return;
    }
    if (!formData.color) {
      toast.error('Lütfen bir renk seçin');
      return;
    }

    console.log('Creating menu with data:', formData);
    dispatch(createMenu(formData) as any);
    setIsCreating(false);
    setFormData({ testCategoryId: '', color: '#f97316' });
  };

  const handleEdit = (menu: any) => {
    setEditingId(menu._id);
    setFormData({
      testCategoryId: menu.testCategory._id,
      color: menu.color || '#f97316',
    });
  };

  const handleUpdate = (id: string) => {
    if (!formData.testCategoryId) {
      toast.error('Lütfen bir test kategorisi seçin');
      return;
    }
    if (!formData.color) {
      toast.error('Lütfen bir renk seçin');
      return;
    }

    dispatch(updateMenu({ id, formData }) as any);
    setEditingId(null);
    setFormData({ testCategoryId: '', color: '#f97316' });
  };

  const handleDelete = (id: string) => {
    dispatch(deleteMenu(id) as any);
  };

  const handleToggleStatus = (id: string) => {
    dispatch(toggleMenuStatus(id) as any);
  };

  const handleClearAllMenus = () => {
    dispatch(clearAllMenus() as any).then(() => {
      // Refresh the menus list after clearing
      dispatch(getAllMenus({}) as any);
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;

    const newMenus = [...allMenus];
    const draggedMenu = newMenus[dragIndex];
    newMenus.splice(dragIndex, 1);
    newMenus.splice(dropIndex, 0, draggedMenu);

    // Update order numbers
    const updatedMenus = newMenus.map((menu, index) => ({
      id: menu._id,
      order: index + 1,
    }));

    dispatch(updateMenuOrder({ menus: updatedMenus }) as any);
  };

  const getAvailableTestCategories = () => {
    if (!activeCategories || !Array.isArray(activeCategories)) {
      return [];
    }
    const usedCategoryIds = allMenus.map((menu: any) => menu.testCategory._id);
    return activeCategories.filter((category: any) => !usedCategoryIds.includes(category._id));
  };

  if (loading && allMenus.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Menüler yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menü Yönetimi</h1>
          <p className="text-muted-foreground">
            Menüleri oluşturun, düzenleyin ve sıralayın
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Yeni Menü
          </Button>
          
          {allMenus.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Tümünü Temizle
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tüm Menüleri Sil</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu işlem tüm menüleri kalıcı olarak silecektir. Bu işlem geri alınamaz.
                    <br /><br />
                    <strong>Emin misiniz?</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllMenus}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Tümünü Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Create Form */}
      {isCreating && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Menü Oluştur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testCategoryId" className="text-sm font-medium text-gray-700">
                Test Kategorisi
              </Label>
              <Select
                value={formData.testCategoryId}
                onValueChange={(value) => setFormData({ ...formData, testCategoryId: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTestCategories().map((category: any) => (
                    <SelectItem key={category._id} value={category._id}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">
                Renk
              </Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-8 h-8 rounded-full ${
                      formData.color === color.value 
                        ? 'ring-2 ring-gray-400 ring-offset-2' 
                        : 'hover:opacity-80'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Oluştur
            </Button>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              <X className="h-4 w-4" />
              İptal
            </Button>
          </div>
        </div>
      )}

      {/* Menus List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {allMenus.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Henüz menü bulunmuyor</p>
            <p className="text-gray-400 text-sm mt-2">İlk menünüzü oluşturmak için yukarıdaki butona tıklayın</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {allMenus.map((menu: any, index: number) => (
              <div
                key={menu._id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="p-4 hover:bg-gray-50 transition-colors cursor-move"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: menu.color || '#f97316' }}
                      ></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{menu.testCategory.name}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => handleToggleStatus(menu._id)}
                        disabled={loading}
                        size="sm"
                        variant={menu.isActive ? "default" : "outline"}
                        className={menu.isActive ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-600 hover:text-gray-800"}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (menu.isActive ? 'Pasif Et' : 'Aktif Et')}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(menu)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Edit className="h-4 w-4" />
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
                            <AlertDialogTitle>Menüyü Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu menüyü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve menü kalıcı olarak silinecektir.
                              <br /><br />
                              <strong>Emin misiniz?</strong>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(menu._id)}
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

                {/* Edit Form */}
                {editingId === menu._id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Menüyü Düzenle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`edit-testCategoryId-${menu._id}`} className="text-sm font-medium text-gray-700">
                          Test Kategorisi
                        </Label>
                        <Select
                          value={formData.testCategoryId}
                          onValueChange={(value) => setFormData({ ...formData, testCategoryId: value })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {activeCategories?.map((category: any) => (
                              <SelectItem key={category._id} value={category._id}>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                  <span>{category.name}</span>
                                </div>
                              </SelectItem>
                            )) || []}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Renk
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, color: color.value })}
                              className={`w-6 h-6 rounded-full ${
                                formData.color === color.value 
                                  ? 'ring-2 ring-gray-400 ring-offset-1' 
                                  : 'hover:opacity-80'
                              }`}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleUpdate(menu._id)}
                        disabled={loading}
                        size="sm"
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Güncelle
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                        İptal
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
