'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getActiveTestCategories, 
  createTestCategory, 
  updateTestCategory, 
  deleteTestCategory,
  toggleTestCategoryStatus,
  clearTestCategoryError 
} from '@/redux/actions/testCategoryActions';
import { 
  X, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  Loader2
} from 'lucide-react';

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect?: (category: any) => void;
  selectMode?: boolean;
}

const colorOptions = [
  { name: 'Pembe', value: 'bg-pink-500', hex: '#ec4899' },
  { name: 'Turuncu', value: 'bg-orange-500', hex: '#f97316' },
  { name: 'Kırmızı', value: 'bg-red-500', hex: '#ef4444' },
  { name: 'Mavi', value: 'bg-blue-500', hex: '#3b82f6' },
  { name: 'Yeşil', value: 'bg-green-500', hex: '#22c55e' },
  { name: 'Mor', value: 'bg-purple-500', hex: '#a855f7' },
  { name: 'Teal', value: 'bg-teal-500', hex: '#14b8a6' },
  { name: 'Gri', value: 'bg-gray-500', hex: '#6b7280' },
  { name: 'Sarı', value: 'bg-yellow-500', hex: '#eab308' },
  { name: 'İndigo', value: 'bg-indigo-500', hex: '#6366f1' },
];

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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'bg-blue-500',
    icon: '',
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
      description: '',
      color: 'bg-blue-500',
      icon: '',
    });
  };

  // Handle edit category
  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsCreating(true);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color,
      icon: category.icon || '',
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Kategori adı gereklidir');
      return;
    }

    try {
      if (editingCategory) {
        await dispatch(updateTestCategory({ 
          id: editingCategory._id, 
          formData 
        }) as any);
      } else {
        await dispatch(createTestCategory(formData) as any);
      }
      
      setIsCreating(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        color: 'bg-blue-500',
        icon: '',
      });
    } catch (error) {
      console.error('Category operation error:', error);
    }
  };

  // Handle delete category
  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await dispatch(deleteTestCategory(categoryId) as any);
      } catch (error) {
        console.error('Delete category error:', error);
      }
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (categoryId: string) => {
    try {
      await dispatch(toggleTestCategoryStatus(categoryId) as any);
    } catch (error) {
      console.error('Toggle category status error:', error);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {selectMode ? 'Kategori Seç' : 'Kategori Yönetimi'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
              <button onClick={clearError} className="ml-2 text-red-500 hover:text-red-700">
                ×
              </button>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}

          {/* Create/Edit Form */}
          {isCreating && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">
                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kategori adını girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kategori açıklaması (opsiyonel)"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Renk *
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`w-12 h-12 rounded-lg ${color.value} ${
                          formData.color === color.value 
                            ? 'ring-2 ring-gray-400 ring-offset-2' 
                            : 'hover:opacity-80'
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İkon (opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="İkon adı (örn: music, game, food)"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingCategory ? 'Güncelle' : 'Oluştur'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingCategory(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Kategoriler</h3>
              {!selectMode && (
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  <Plus className="w-4 h-4" />
                  Yeni Kategori
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeCategories.map((category: any) => (
                  <div
                    key={category._id}
                    className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                      selectMode ? 'cursor-pointer hover:bg-gray-50' : ''
                    }`}
                    onClick={selectMode ? () => handleCategorySelect(category) : undefined}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">{category.name}</h4>
                          {category.description && (
                            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                          )}
                        </div>
                      </div>
                      
                      {!selectMode && (
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(category);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-500"
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(category._id);
                            }}
                            className="p-1 text-gray-400 hover:text-yellow-500"
                            title={category.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                          >
                            {category.isActive ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(category._id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeCategories.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                Henüz kategori eklenmemiş.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
