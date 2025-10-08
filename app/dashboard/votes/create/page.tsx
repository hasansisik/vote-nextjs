"use client";

import { useState, useEffect, Suspense } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getCategoryName } from '@/lib/multiLanguageUtils';

// Utility function to generate slug
const generateSlug = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

interface Option {
  title: {
    tr: string;
    en?: string;
    de?: string;
    fr?: string;
  };
  image: string;
  customFields: Array<{
    fieldName: {
      tr: string;
      en?: string;
      de?: string;
      fr?: string;
    };
    fieldValue: {
      tr: string;
      en?: string;
      de?: string;
      fr?: string;
    };
  }>;
}

function CreateTestPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSelector((state: any) => state.user);
  const { singleTest, testsLoading, testsError } = useSelector((state: any) => state.test);
  const { activeCategories, loading: categoriesLoading } = useSelector((state: any) => state.testCategory);
  
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const [formData, setFormData] = useState({
    title: {
      tr: "",
      en: "",
      de: "",
      fr: "",
    },
    description: {
      tr: "",
      en: "",
      de: "",
      fr: "",
    },
    coverImage: "",
    headerText: {
      tr: "",
      en: "",
      de: "",
      fr: "",
    },
    footerText: {
      tr: "",
      en: "",
      de: "",
      fr: "",
    },
    categories: [] as string[],
    trend: false,
    popular: false,
    endDate: "",
    slug: "", // Slug alanı eklendi
    isActive: true, // Aktif/Pasif durumu
  });

  const [options, setOptions] = useState<Option[]>([
    { 
      title: { tr: "", en: "", de: "", fr: "" }, 
      image: "", 
      customFields: [] 
    },
    { 
      title: { tr: "", en: "", de: "", fr: "" }, 
      image: "", 
      customFields: [] 
    },
  ]);

  const [uploading, setUploading] = useState<number | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // Image cropping states
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageUrl, setCropperImageUrl] = useState("");
  const [croppingFor, setCroppingFor] = useState<"cover" | number>("cover");
  
  // Language tabs state
  const [activeLanguage, setActiveLanguage] = useState<"tr" | "en" | "de" | "fr">("tr");
  const availableLanguages = [
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

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
          title: singleTest.title || { tr: "", en: "", de: "", fr: "" },
          description: singleTest.description || { tr: "", en: "", de: "", fr: "" },
          coverImage: singleTest.coverImage || "",
          headerText: singleTest.headerText || { tr: "", en: "", de: "", fr: "" },
          footerText: singleTest.footerText || { tr: "", en: "", de: "", fr: "" },
          categories: singleTest.categories || [],
          trend: singleTest.trend || false,
          popular: singleTest.popular || false,
          endDate: singleTest.endDate ? new Date(singleTest.endDate).toISOString().slice(0, 16) : "",
          slug: singleTest.slug || "", // Slug'ı yükle
          isActive: singleTest.isActive !== undefined ? singleTest.isActive : true, // Aktif durumu
        });
        
        if (singleTest.options && singleTest.options.length > 0) {
          setOptions(singleTest.options.map((option: any) => ({
            title: option.title || { tr: "", en: "", de: "", fr: "" },
            image: option.image || "",
            customFields: option.customFields?.map((field: any) => ({
              fieldName: field.fieldName || { tr: "", en: "", de: "", fr: "" },
              fieldValue: field.fieldValue || { tr: "", en: "", de: "", fr: "" },
            })) || []
          })));
        }
      }
    }
  }, [isEditMode, editId, singleTest]);

  // Auto-generate slug when Turkish title changes
  useEffect(() => {
    if (formData.title.tr && (!formData.slug || isEditMode)) {
      const newSlug = generateSlug(formData.title.tr);
      if (newSlug !== formData.slug) {
        setFormData(prev => ({ ...prev, slug: newSlug }));
      }
    }
  }, [formData.title.tr, formData.slug, isEditMode]);

  const handleInputChange = (field: string, value: string | boolean, language?: "tr" | "en" | "de" | "fr") => {
    if (language && typeof value === 'string') {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...(prev[field as keyof typeof prev] as any),
          [language]: value
        }
      }));
    } else {
      setFormData(prev => {
        // Eğer isActive true yapılıyorsa ve endDate geçmişse, endDate'i temizle
        if (field === 'isActive' && value === true && prev.endDate) {
          const endDate = new Date(prev.endDate);
          const now = new Date();
          if (endDate < now) {
            return { ...prev, [field]: value, endDate: "" };
          }
        }
        return { ...prev, [field]: value };
      });
    }
  };

  const handleOptionChange = (index: number, field: string, value: string, language?: "tr" | "en" | "de" | "fr") => {
    setOptions(prev => 
      prev.map((option, i) => {
        if (i === index) {
          if (language && field === 'title') {
            return { 
              ...option, 
              [field]: { 
                ...(option[field as keyof Option] as any), 
                [language]: value 
              } 
            };
          } else if (field === 'image') {
            return { ...option, [field]: value };
          }
        }
        return option;
      })
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
    setOptions(prev => [...prev, { 
      title: { tr: "", en: "", de: "", fr: "" }, 
      image: "", 
      customFields: [] 
    }]);
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
              customFields: [...option.customFields, { 
                fieldName: { tr: "", en: "", de: "", fr: "" }, 
                fieldValue: { tr: "", en: "", de: "", fr: "" } 
              }],
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
    value: string,
    language?: "tr" | "en" | "de" | "fr"
  ) => {
    setOptions(prev =>
      prev.map((option, i) =>
        i === optionIndex
          ? {
              ...option,
              customFields: option.customFields.map((cf, fi) =>
                fi === fieldIndex 
                  ? { 
                      ...cf, 
                      [field]: language 
                        ? { ...cf[field as keyof typeof cf], [language]: value }
                        : value 
                    } 
                  : cf
              ),
            }
          : option
      )
    );
  };

  const handleCategorySelect = (category: any) => {
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, category._id]
    }));
  };

  const handleCategoryRemove = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(id => id !== categoryId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.tr || formData.categories.length === 0) {
      toast.error("Eksik Bilgi", {
        description: "Türkçe başlık ve en az bir kategori alanları zorunludur.",
        duration: 4000
      });
      return;
    }

    const validOptions = options.filter(option => option.title.tr && option.image);
    if (validOptions.length < 2) {
      toast.error("Yetersiz Seçenek", {
        description: "En az 2 geçerli seçenek (Türkçe başlık ve görsel ile) gereklidir.",
        duration: 4000
      });
      return;
    }

    // Check for empty option titles or images
    const emptyOptions = options.filter(option => !option.title.tr || !option.image);
    if (emptyOptions.length > 0) {
      toast.error("Eksik Seçenek Bilgileri", {
        description: "Tüm seçenekler için Türkçe başlık ve görsel gereklidir.",
        duration: 4000
      });
      return;
    }

    // Clean up customFields - remove empty fields
    const cleanedOptions = validOptions.map(option => ({
      ...option,
      customFields: option.customFields?.filter(field => 
        field.fieldName.tr.trim() !== '' && field.fieldValue.tr.trim() !== ''
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
            {/* Language Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Dil Seçenekleri</h3>
                <p className="text-sm text-gray-500">Farklı dillerde içerik oluşturun</p>
              </div>
              <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as "tr" | "en" | "de" | "fr")}>
                <TabsList className="grid w-full grid-cols-4">
                  {availableLanguages.map((lang) => (
                    <TabsTrigger key={lang.code} value={lang.code} className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span className="hidden sm:inline">{lang.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* WordPress-style Title Input */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Input
                id="title"
                value={formData.title[activeLanguage] || ""}
                onChange={(e) => handleInputChange("title", e.target.value, activeLanguage)}
                placeholder={`Oylama başlığı girin (${availableLanguages.find(l => l.code === activeLanguage)?.name})...`}
                required={activeLanguage === "tr"}
                className="text-2xl font-semibold px-2 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 border border-gray-200"
              />
            </div>

            {/* WordPress-style Content Editor */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Açıklama ({availableLanguages.find(l => l.code === activeLanguage)?.name})
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description[activeLanguage] || ""}
                    onChange={(e) => handleInputChange("description", e.target.value, activeLanguage)}
                    placeholder={`Oylama hakkında açıklama yazın (${availableLanguages.find(l => l.code === activeLanguage)?.name})...`}
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
                    Üst Metin ({availableLanguages.find(l => l.code === activeLanguage)?.name})
                  </Label>
                  <Input
                    value={formData.headerText[activeLanguage] || ""}
                    onChange={(e) => handleInputChange("headerText", e.target.value, activeLanguage)}
                    placeholder={`Oylama üst kısmında görünecek metin (${availableLanguages.find(l => l.code === activeLanguage)?.name})...`}
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
                          Seçenek Başlığı ({availableLanguages.find(l => l.code === activeLanguage)?.name}) *
                        </Label>
                        <Input
                          value={option.title[activeLanguage] || ""}
                          onChange={(e) => handleOptionChange(index, "title", e.target.value, activeLanguage)}
                          placeholder={`Seçenek başlığı girin (${availableLanguages.find(l => l.code === activeLanguage)?.name})...`}
                          className="bg-white"
                          required={activeLanguage === "tr"}
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
                        <div key={fieldIndex} className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Input
                              placeholder={`Alan adı (${availableLanguages.find(l => l.code === activeLanguage)?.name})`}
                              value={field.fieldName[activeLanguage] || ""}
                              onChange={(e) =>
                                handleCustomFieldChange(index, fieldIndex, "fieldName", e.target.value, activeLanguage)
                              }
                              className="bg-white"
                              required={activeLanguage === "tr"}
                            />
                            <Input
                              placeholder={`Alan değeri (${availableLanguages.find(l => l.code === activeLanguage)?.name})`}
                              value={field.fieldValue[activeLanguage] || ""}
                              onChange={(e) =>
                                handleCustomFieldChange(index, fieldIndex, "fieldValue", e.target.value, activeLanguage)
                              }
                              className="bg-white"
                              required={activeLanguage === "tr"}
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
                  Alt Metin ({availableLanguages.find(l => l.code === activeLanguage)?.name})
                </Label>
                <Textarea
                  value={formData.footerText[activeLanguage] || ""}
                  onChange={(e) => handleInputChange("footerText", e.target.value, activeLanguage)}
                  placeholder={`Oylama alt kısmında görünecek metin (${availableLanguages.find(l => l.code === activeLanguage)?.name})...`}
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
                <Label htmlFor="categories" className="text-sm font-medium text-gray-700">
                  Kategoriler *
                </Label>
                
                {/* Selected Categories Display */}
                {formData.categories.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Seçili kategoriler:</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.categories.map((categoryId) => {
                        const category = activeCategories?.find((cat: any) => cat._id === categoryId);
                        return category ? (
                          <div
                            key={categoryId}
                            className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs"
                          >
                            <span>{getCategoryName(category)}</span>
                            <button
                              type="button"
                              onClick={() => handleCategoryRemove(categoryId)}
                              className="text-orange-600 hover:text-orange-800"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Category Selection */}
                <Select
                  value=""
                  onValueChange={(value) => {
                    const category = activeCategories?.find((cat: any) => cat._id === value);
                    if (category && !formData.categories.includes(value)) {
                      handleCategorySelect(category);
                    }
                  }}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={categoriesLoading ? "Kategoriler yükleniyor..." : "Kategori ekle"} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCategories?.filter((category: any) => !formData.categories.includes(category._id)).map((category: any) => (
                      <SelectItem key={category._id} value={category._id}>
                        {getCategoryName(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.categories.length === 0 && (
                  <p className="text-xs text-red-500">En az bir kategori seçmelisiniz</p>
                )}
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

              {/* Active Switch */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Aktif
                  </Label>
                  <p className="text-xs text-gray-500">
                    Testin aktif/pasif durumu
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked: boolean) => handleInputChange("isActive", checked)}
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
                  URL Slug
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="url-slug"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  URL'de görünecek kısım (otomatik oluşturulur)
                </p>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                  Bitiş Tarihi (Opsiyonel)
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Bu tarihte test otomatik olarak pasif hale gelir</p>
                  {formData.endDate && new Date(formData.endDate) < new Date() && (
                    <p className="text-orange-600 font-medium">
                      ⚠️ Bitiş tarihi geçmiş. Test aktif edilirse bu tarih temizlenecek.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>


          {/* Help Box */}
          <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">İpuçları</h3>
            <ul className="text-sm text-orange-800 space-y-2">
              <li>• En az 2 seçenek eklemelisiniz</li>
              <li>• Her seçenek için görsel yüklemek zorunludur</li>
              <li>• Türkçe başlık ve en az bir kategori zorunludur</li>
              <li>• Birden fazla kategori seçebilirsiniz</li>
              <li>• Diğer diller isteğe bağlıdır</li>
              <li>• Özel alanlar isteğe bağlıdır</li>
              <li>• Bitiş tarihi belirlenirse test otomatik pasif olur</li>
              <li>• Geçmiş bitiş tarihi olan test aktif edilirse tarih temizlenir</li>
              <li>• Aktif/Pasif durumu ile testi yayından kaldırabilirsiniz</li>
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
        aspectRatio={croppingFor === "cover" ? 16/9 : 1} // Horizontal for cover, square for options
      />
    </div>
  );
}

export default function CreateTestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateTestPageContent />
    </Suspense>
  );
}
