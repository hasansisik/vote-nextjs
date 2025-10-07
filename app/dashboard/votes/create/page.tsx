"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hook";
import { useRouter, useSearchParams } from "next/navigation";
import { createTest, updateTest, getSingleTest } from "@/redux/actions/testActions";
import { getActiveTestCategories, createTestCategory } from "@/redux/actions/testCategoryActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Trash2, 
  Upload,
  ArrowLeft,
  Save
} from "lucide-react";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import CategoryManagementModal from "@/components/CategoryManagementModal";
import ImageCropper from "@/components/ImageCropper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Option {
  title: string;
  image: string;
  customFields: Array<{
    fieldName: string;
    fieldValue: string;
  }>;
}

export default function CreateTestPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSelector((state: any) => state.user);
  const { singleTest, testsLoading, testsError } = useSelector((state: any) => state.test);
  const { activeCategories, loading: categoriesLoading } = useSelector((state: any) => state.testCategory);
  
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    headerText: "",
    footerText: "",
    category: "",
    trend: false,
    popular: false,
  });

  const [options, setOptions] = useState<Option[]>([
    { title: "", image: "", customFields: [] },
    { title: "", image: "", customFields: [] },
  ]);

  const [uploading, setUploading] = useState<number | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // Image cropping states
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageUrl, setCropperImageUrl] = useState("");
  const [croppingFor, setCroppingFor] = useState<"cover" | number>("cover");

  // Load categories on component mount
  useEffect(() => {
    dispatch(getActiveTestCategories());
  }, [dispatch]);

  // Load single test data when in edit mode
  useEffect(() => {
    if (isEditMode && editId && !singleTest) {
      dispatch(getSingleTest(editId));
    }
  }, [isEditMode, editId, singleTest, dispatch]);

  // Debug: Log categories when they change
  useEffect(() => {
    console.log('Active categories:', activeCategories);
    console.log('Categories loading:', categoriesLoading);
  }, [activeCategories, categoriesLoading]);

  // Show error messages
  useEffect(() => {
    if (testsError) {
      toast.error(testsError, {
        duration: 5000,
        description: "Lütfen formu kontrol edip tekrar deneyin."
      });
    }
  }, [testsError]);

  // Load test data for edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      // If singleTest is loaded and matches the editId, populate the form
      if (singleTest && singleTest._id === editId) {
        setFormData({
          title: singleTest.title || "",
          description: singleTest.description || "",
          coverImage: singleTest.coverImage || "",
          headerText: singleTest.headerText || "",
          footerText: singleTest.footerText || "",
          category: singleTest.category || "",
          trend: singleTest.trend || false,
          popular: singleTest.popular || false,
        });
        
        if (singleTest.options && singleTest.options.length > 0) {
          setOptions(singleTest.options.map((option: any) => ({
            title: option.title || "",
            image: option.image || "",
            customFields: option.customFields || []
          })));
        }
      }
    }
  }, [isEditMode, editId, singleTest]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, field: string, value: string) => {
    setOptions(prev => 
      prev.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    );
  };

  const handleImageUpload = (index: number, file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setCropperImageUrl(imageUrl);
    setCroppingFor(index);
    setCropperOpen(true);
  };

  const handleCoverImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setCropperImageUrl(imageUrl);
    setCroppingFor("cover");
    setCropperOpen(true);
  };

  const handleCroppedImage = async (croppedImageUrl: string) => {
    try {
      if (croppingFor === "cover") {
        setUploadingCover(true);
        // Convert blob URL to file
        const response = await fetch(croppedImageUrl);
        const blob = await response.blob();
        const file = new File([blob], "cropped-cover.jpg", { type: "image/jpeg" });
        
        const uploadedUrl = await uploadImageToCloudinary(file);
        handleInputChange("coverImage", uploadedUrl);
        toast.success("Başarılı", {
          description: "Kapak görseli başarıyla yüklendi.",
          duration: 2000
        });
        setUploadingCover(false);
      } else {
        setUploading(croppingFor);
        // Convert blob URL to file
        const response = await fetch(croppedImageUrl);
        const blob = await response.blob();
        const file = new File([blob], `cropped-option-${croppingFor}.jpg`, { type: "image/jpeg" });
        
        const uploadedUrl = await uploadImageToCloudinary(file);
        handleOptionChange(croppingFor, "image", uploadedUrl);
        toast.success("Başarılı", {
          description: "Görsel başarıyla yüklendi.",
          duration: 2000
        });
        setUploading(null);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Yükleme Hatası", {
        description: "Görsel yüklenirken bir hata oluştu. Lütfen tekrar deneyin.",
        duration: 4000
      });
      setUploadingCover(false);
      setUploading(null);
    }
  };

  const addOption = () => {
    setOptions(prev => [...prev, { title: "", image: "", customFields: [] }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addCustomField = (optionIndex: number) => {
    setOptions(prev =>
      prev.map((option, i) =>
        i === optionIndex
          ? {
              ...option,
              customFields: [...option.customFields, { fieldName: "", fieldValue: "" }],
            }
          : option
      )
    );
  };

  const removeCustomField = (optionIndex: number, fieldIndex: number) => {
    setOptions(prev =>
      prev.map((option, i) =>
        i === optionIndex
          ? {
              ...option,
              customFields: option.customFields.filter((_, fi) => fi !== fieldIndex),
            }
          : option
      )
    );
  };

  const handleCustomFieldChange = (
    optionIndex: number,
    fieldIndex: number,
    field: string,
    value: string
  ) => {
    setOptions(prev =>
      prev.map((option, i) =>
        i === optionIndex
          ? {
              ...option,
              customFields: option.customFields.map((cf, fi) =>
                fi === fieldIndex ? { ...cf, [field]: value } : cf
              ),
            }
          : option
      )
    );
  };

  const handleCategorySelect = (category: any) => {
    handleInputChange("category", category._id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.category) {
      toast.error("Eksik Bilgi", {
        description: "Başlık ve kategori alanları zorunludur.",
        duration: 4000
      });
      return;
    }

    const validOptions = options.filter(option => option.title && option.image);
    if (validOptions.length < 2) {
      toast.error("Yetersiz Seçenek", {
        description: "En az 2 geçerli seçenek (başlık ve görsel ile) gereklidir.",
        duration: 4000
      });
      return;
    }

    // Check for empty option titles or images
    const emptyOptions = options.filter(option => !option.title || !option.image);
    if (emptyOptions.length > 0) {
      toast.error("Eksik Seçenek Bilgileri", {
        description: "Tüm seçenekler için başlık ve görsel gereklidir.",
        duration: 4000
      });
      return;
    }

    // Clean up customFields - remove empty fields
    const cleanedOptions = validOptions.map(option => ({
      ...option,
      customFields: option.customFields?.filter(field => 
        field.fieldName.trim() !== '' && field.fieldValue.trim() !== ''
      ) || []
    }));

    try {
      if (isEditMode && editId) {
        // Update existing test
        const result = await dispatch(updateTest({
          id: editId,
          formData: {
            ...formData,
            options: cleanedOptions,
          }
        }));
        
        if (updateTest.fulfilled.match(result)) {
          toast.success("Başarılı", {
            description: "Oylama başarıyla güncellendi.",
            duration: 3000
          });
          router.push("/dashboard/votes");
        }
      } else {
        // Create new test
        const result = await dispatch(createTest({
          ...formData,
          options: cleanedOptions,
        }));
        
        if (createTest.fulfilled.match(result)) {
          toast.success("Başarılı", {
            description: "Oylama başarıyla oluşturuldu.",
            duration: 3000
          });
          router.push("/dashboard/votes");
        }
      }
    } catch (error) {
      console.error(isEditMode ? "Update test error:" : "Create test error:", error);
      toast.error("Hata Oluştu", {
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
        duration: 5000
      });
    }
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

  // Show loading state when fetching single test data in edit mode
  if (isEditMode && testsLoading && !singleTest) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Test verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* WordPress-style Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {isEditMode ? 'Oylamayı Düzenle' : 'Yeni Oylama Oluştur'}
              </h1>
              <p className="text-sm text-gray-600">
                {isEditMode ? 'Oylama detaylarını düzenleyin' : 'Yeni bir oylama testi oluşturun'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Category Management */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Kategori Yönet
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              İptal
            </Button>
            <Button
              type="submit"
              form="create-vote-form"
              disabled={testsLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {testsLoading ? (isEditMode ? "Güncelleniyor..." : "Oluşturuluyor...") : (isEditMode ? "Güncelle" : "Yayınla")}
            </Button>
          </div>
        </div>
      </div>

      {/* WordPress-style Content Layout */}
      <div className="flex gap-6 p-6">
        {/* Main Content Area */}
        <div className="flex-1 max-w-4xl">
          <form id="create-vote-form" onSubmit={handleSubmit} className="space-y-6">
            {/* WordPress-style Title Input */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Oylama başlığı girin..."
                required
                className="text-2xl font-semibold px-2 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 border border-gray-200"
              />
            </div>

            {/* WordPress-style Content Editor */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Açıklama
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Oylama hakkında açıklama yazın..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImage" className="text-sm font-medium text-gray-700">
                    Kapak Görseli
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="coverImage" className="cursor-pointer">
                        <span className="text-sm font-medium text-orange-600 hover:text-orange-500">
                          Görsel yüklemek için tıklayın
                        </span>
                        <input
                          id="coverImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCoverImageUpload(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (Max 10MB)</p>
                    </div>
                    {uploadingCover && (
                      <div className="text-sm text-orange-600 mt-2">
                        Yükleniyor...
                      </div>
                    )}
                  </div>
                  {formData.coverImage && (
                    <div className="mt-4">
                      <img
                        src={formData.coverImage}
                        alt="Kapak görseli"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Header Text */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Üst Metin
                  </Label>
                  <Input
                    value={formData.headerText}
                    onChange={(e) => handleInputChange("headerText", e.target.value)}
                    placeholder="Oylama üst kısmında görünecek metin..."
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            {/* WordPress-style Options Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Oylama Seçenekleri</h3>
                <Button
                  type="button"
                  onClick={addOption}
                  variant="outline"
                  size="sm"
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Seçenek Ekle
                </Button>
              </div>

              <div className="space-y-6">
                {options.map((option, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Seçenek {index + 1}</h4>
                      {options.length > 2 && (
                        <Button
                          type="button"
                          onClick={() => removeOption(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Seçenek Başlığı *
                        </Label>
                        <Input
                          value={option.title}
                          onChange={(e) => handleOptionChange(index, "title", e.target.value)}
                          placeholder="Seçenek başlığı girin..."
                          className="bg-white"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Seçenek Görseli *
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="mt-2">
                            <label className="cursor-pointer">
                              <span className="text-sm font-medium text-orange-600 hover:text-orange-500">
                                Görsel yükle
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(index, file);
                                }}
                                className="hidden"
                              />
                            </label>
                            {uploading === index && (
                              <div className="text-sm text-orange-600 mt-1">
                                Yükleniyor...
                              </div>
                            )}
                          </div>
                        </div>
                        {option.image && (
                          <div className="mt-3">
                            <img
                              src={option.image}
                              alt={`Seçenek ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">
                          Özel Alanlar
                        </Label>
                        <Button
                          type="button"
                          onClick={() => addCustomField(index)}
                          variant="outline"
                          size="sm"
                          className="text-orange-600 border-orange-600 hover:bg-orange-50"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Alan Ekle
                        </Button>
                      </div>
                      
                      {option.customFields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="flex items-center gap-3">
                          <Input
                            placeholder="Alan adı"
                            value={field.fieldName}
                            onChange={(e) =>
                              handleCustomFieldChange(index, fieldIndex, "fieldName", e.target.value)
                            }
                            className="bg-white"
                          />
                          <Input
                            placeholder="Alan değeri"
                            value={field.fieldValue}
                            onChange={(e) =>
                              handleCustomFieldChange(index, fieldIndex, "fieldValue", e.target.value)
                            }
                            className="bg-white"
                          />
                          <Button
                            type="button"
                            onClick={() => removeCustomField(index, fieldIndex)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Text */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Alt Metin
                </Label>
                <Textarea
                  value={formData.footerText}
                  onChange={(e) => handleInputChange("footerText", e.target.value)}
                  placeholder="Oylama alt kısmında görünecek metin..."
                  rows={4}
                  className="bg-white"
                />
              </div>
            </div>

          </form>
        </div>

        {/* WordPress-style Sidebar */}
        <div className="w-80 space-y-6">
          {/* Publish Box */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Yayınla</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Kategori *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={categoriesLoading ? "Kategoriler yükleniyor..." : "Kategori seçin"} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCategories?.map((category: any) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trend Switch */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Trend
                  </Label>
                  <p className="text-xs text-gray-500">
                    Bu testi trend listesinde göster
                  </p>
                </div>
                <Switch
                  checked={formData.trend}
                  onCheckedChange={(checked: boolean) => handleInputChange("trend", checked)}
                />
              </div>

              {/* Popular Switch */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Popüler
                  </Label>
                  <p className="text-xs text-gray-500">
                    Bu testi popüler listesinde göster
                  </p>
                </div>
                <Switch
                  checked={formData.popular}
                  onCheckedChange={(checked: boolean) => handleInputChange("popular", checked)}
                />
              </div>
            </div>
          </div>


          {/* Help Box */}
          <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">İpuçları</h3>
            <ul className="text-sm text-orange-800 space-y-2">
              <li>• En az 2 seçenek eklemelisiniz</li>
              <li>• Her seçenek için görsel yüklemek zorunludur</li>
              <li>• Başlık ve kategori alanları zorunludur</li>
              <li>• Özel alanlar isteğe bağlıdır</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Category Management Modal */}
      <CategoryManagementModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategorySelect={handleCategorySelect}
        selectMode={false}
      />

      {/* Image Cropper Modal */}
      <ImageCropper
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        onCrop={handleCroppedImage}
        imageUrl={cropperImageUrl}
        aspectRatio={1} // Square aspect ratio
      />
    </div>
  );
}
