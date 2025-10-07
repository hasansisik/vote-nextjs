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
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    testCategoryId: '',
    color: '',
    order: 0,
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

  const handleCreate = () => {
    setFormData({
      testCategoryId: '',
      color: '',
      order: 0, // Order will be calculated on submit
    });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleEdit = (menu: any) => {
    setFormData({
      testCategoryId: menu.testCategory?._id || '',
      color: menu.color || '',
      order: menu.order || 0,
    });
    setEditingId(menu._id);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      testCategoryId: '',
      color: '',
      order: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.testCategoryId) {
      toast.error('Test kategorisi seçiniz');
      return;
    }

    if (!formData.color) {
      toast.error('Renk seçiniz');
      return;
    }

    try {
      if (editingId) {
        const updateData: any = {};
        if (formData.testCategoryId) updateData.testCategoryId = formData.testCategoryId;
        if (formData.color) updateData.color = formData.color;
        
        await dispatch(updateMenu({ id: editingId, formData: updateData }) as any);
        setEditingId(null);
      } else {
        const submitData = {
          testCategoryId: formData.testCategoryId,
          color: formData.color,
          order: allMenus.length + 1
        };
        await dispatch(createMenu(submitData) as any);
        setIsCreating(false);
      }
      
      setFormData({
        testCategoryId: '',
        color: '',
        order: 0,
      });
      
      await dispatch(getAllMenus({}) as any);
    } catch (error) {
      console.error('Menu operation error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteMenu(id) as any);
      await dispatch(getAllMenus({}) as any);
    } catch (error) {
      toast.error('Menü silinirken hata oluştu');
    }
  };

  const handleDragStart = (e: React.DragEvent, menuId: string) => {
    setDraggedItem(menuId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetMenuId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetMenuId) {
      setDraggedItem(null);
      return;
    }

    const draggedMenu = allMenus.find((menu: any) => menu._id === draggedItem);
    const targetMenu = allMenus.find((menu: any) => menu._id === targetMenuId);
    
    if (!draggedMenu || !targetMenu) {
      setDraggedItem(null);
      return;
    }

    // Create new order array
    const newMenus = allMenus.map((menu: any) => {
      if (menu._id === draggedItem) {
        return { ...menu, order: targetMenu.order };
      } else if (menu._id === targetMenuId) {
        return { ...menu, order: draggedMenu.order };
      }
      return menu;
    });

    // Update order in backend
    try {
      const orderData = newMenus.map((menu: any) => ({
        id: menu._id,
        order: menu.order
      }));
      
      await dispatch(updateMenuOrder({ menus: orderData }) as any);
      await dispatch(getAllMenus({}) as any);
    } catch (error) {
      toast.error('Sıralama güncellenirken hata oluştu');
    }

    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const clearAllMenusHandler = async () => {
    try {
      await dispatch(clearAllMenus() as any);
      await dispatch(getAllMenus({}) as any);
    } catch (error) {
      toast.error('Tüm menüler silinirken hata oluştu');
    }
  };

  // Get available categories (not already in menus)
  const availableCategories = activeCategories?.filter((category: any) => 
    !allMenus.some((menu: any) => menu.testCategory?._id === category._id)
  ) || [];

  // Sort menus by order
  const sortedMenus = [...allMenus].sort((a: any, b: any) => a.order - b.order);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menü Yönetimi</h1>
          <p className="text-gray-600 mt-3">Test kategorilerini menüye ekleyin ve sıralayın</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreate} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Menü
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={loading}>
                <Trash2 className="w-4 h-4 mr-2" />
                Tümünü Temizle
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tüm Menüleri Sil</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem tüm menüleri kalıcı olarak silecektir. Bu işlem geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={clearAllMenusHandler}>
                  Tümünü Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {editingId ? 'Menü Düzenle' : 'Yeni Menü Ekle'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="testCategoryId" className="text-sm font-medium">Test Kategorisi *</Label>
                  <Select
                    value={formData.testCategoryId}
                    onValueChange={(value) => setFormData({ ...formData, testCategoryId: value })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category: any) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="text-sm font-medium">Renk *</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Renk seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: color.value }}
                            ></div>
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading} size="sm">
                  {loading ? (
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-3 h-3 mr-2" />
                  )}
                  {editingId ? 'Güncelle' : 'Oluştur'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} size="sm">
                  <X className="w-3 h-3 mr-2" />
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Menus List */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : sortedMenus.length === 0 ? (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-gray-500">Henüz menü eklenmemiş.</p>
            </CardContent>
          </Card>
        ) : (
          sortedMenus.map((menu: any, index: number) => (
            <Card
              key={menu._id}
              draggable
              onDragStart={(e) => handleDragStart(e, menu._id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, menu._id)}
              onDragEnd={handleDragEnd}
              className={`cursor-move transition-all duration-200 ${
                draggedItem === menu._id ? 'opacity-50 scale-95' : 'hover:shadow-md'
              }`}
            >
              <CardContent className="px-3 ">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: menu.color }}
                      ></div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">
                          {menu.testCategory?.name || 'Bilinmeyen Kategori'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Sıra: {menu.order || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(menu)}
                      className="h-7 w-7 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 h-7 w-7 p-0">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Menüyü Sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu menüyü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
              </CardContent>
            </Card>
          ))
        )}
      </div>

    </div>
  );
}