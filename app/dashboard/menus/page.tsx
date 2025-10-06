'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  createMenu,
  getAllMenus,
  updateMenu,
  deleteMenu,
  toggleMenuStatus,
  updateMenuOrder,
} from '@/redux/actions/menuActions';
import {
  getAllTestCategories,
} from '@/redux/actions/testCategoryActions';
import { Plus, Edit, Trash2, GripVertical, Loader2, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MenusPage() {
  const dispatch = useDispatch();
  const { allMenus, loading, error, message } = useSelector((state: any) => state.menu);
  const { allTestCategories } = useSelector((state: any) => state.testCategory);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    testCategoryId: '',
    order: 0,
  });

  useEffect(() => {
    dispatch(getAllMenus({}) as any);
    dispatch(getAllTestCategories({}) as any);
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
    if (!formData.testCategoryId) {
      toast.error('Lütfen bir test kategorisi seçin');
      return;
    }

    dispatch(createMenu(formData) as any);
    setIsCreating(false);
    setFormData({ testCategoryId: '', order: 0 });
  };

  const handleEdit = (menu: any) => {
    setEditingId(menu._id);
    setFormData({
      testCategoryId: menu.testCategory._id,
      order: menu.order,
    });
  };

  const handleUpdate = (id: string) => {
    if (!formData.testCategoryId) {
      toast.error('Lütfen bir test kategorisi seçin');
      return;
    }

    dispatch(updateMenu({ id, formData }) as any);
    setEditingId(null);
    setFormData({ testCategoryId: '', order: 0 });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu menüyü silmek istediğinizden emin misiniz?')) {
      dispatch(deleteMenu(id) as any);
    }
  };

  const handleToggleStatus = (id: string) => {
    dispatch(toggleMenuStatus(id) as any);
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
    const usedCategoryIds = allMenus.map((menu: any) => menu.testCategory._id);
    return allTestCategories.filter((category: any) => !usedCategoryIds.includes(category._id));
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Menü Yönetimi</h1>
          <p className="text-gray-600 mt-2">Menüleri oluşturun, düzenleyin ve sıralayın</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Yeni Menü
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Yeni Menü Oluştur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testCategoryId">Test Kategorisi</Label>
                <select
                  id="testCategoryId"
                  value={formData.testCategoryId}
                  onChange={(e) => setFormData({ ...formData, testCategoryId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Kategori seçin</option>
                  {getAvailableTestCategories().map((category: any) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="order">Sıra</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="Sıra numarası"
                />
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
          </CardContent>
        </Card>
      )}

      {/* Menus List */}
      <div className="space-y-4">
        {allMenus.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Henüz menü bulunmuyor</p>
            </CardContent>
          </Card>
        ) : (
          allMenus.map((menu: any, index: number) => (
            <Card
              key={menu._id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="cursor-move hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${menu.testCategory.color}`}></div>
                      <div>
                        <h3 className="font-semibold">{menu.testCategory.name}</h3>
                        <p className="text-sm text-gray-500">Sıra: {menu.order}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      menu.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {menu.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(menu._id)}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Durum'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(menu)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(menu._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                {editingId === menu._id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`edit-testCategoryId-${menu._id}`}>Test Kategorisi</Label>
                        <select
                          id={`edit-testCategoryId-${menu._id}`}
                          value={formData.testCategoryId}
                          onChange={(e) => setFormData({ ...formData, testCategoryId: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Kategori seçin</option>
                          {allTestCategories.map((category: any) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor={`edit-order-${menu._id}`}>Sıra</Label>
                        <Input
                          id={`edit-order-${menu._id}`}
                          type="number"
                          value={formData.order}
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                          placeholder="Sıra numarası"
                        />
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
