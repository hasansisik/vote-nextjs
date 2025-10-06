"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { createTest } from "@/redux/actions/userActions";
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

interface Option {
  title: string;
  image: string;
  customFields: Array<{
    fieldName: string;
    fieldValue: string;
  }>;
}

export default function CreateTestPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, testsLoading } = useSelector((state: any) => state.user);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    headerText: "",
    footerText: "",
    category: "",
  });

  const [options, setOptions] = useState<Option[]>([
    { title: "", image: "", customFields: [] },
    { title: "", image: "", customFields: [] },
  ]);

  const [uploading, setUploading] = useState<number | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const categories = [
    { value: "futbol", label: "Futbol" },
    { value: "yemek", label: "Yemek" },
    { value: "müzik", label: "Müzik" },
    { value: "film", label: "Film" },
    { value: "oyun", label: "Oyun" },
    { value: "teknoloji", label: "Teknoloji" },
    { value: "spor", label: "Spor" },
    { value: "diğer", label: "Diğer" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, field: string, value: string) => {
    setOptions(prev => 
      prev.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    );
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploading(index);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      handleOptionChange(index, "image", imageUrl);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Görsel yükleme hatası: " + error);
    } finally {
      setUploading(null);
    }
  };

  const handleCoverImageUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      handleInputChange("coverImage", imageUrl);
    } catch (error) {
      console.error("Cover image upload error:", error);
      alert("Kapak görseli yükleme hatası: " + error);
    } finally {
      setUploadingCover(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.category) {
      alert("Başlık ve kategori gereklidir");
      return;
    }

    const validOptions = options.filter(option => option.title && option.image);
    if (validOptions.length < 2) {
      alert("En az 2 geçerli seçenek gereklidir");
      return;
    }

    try {
      await dispatch(createTest({
        ...formData,
        options: validOptions,
      }));
      router.push("/dashboard/votes");
    } catch (error) {
      console.error("Create test error:", error);
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

  return (
    <div className="space-y-6 px-6">
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
          <h1 className="text-3xl font-bold">Yeni Oylama Oluştur</h1>
          <p className="text-muted-foreground">
            Yeni bir oylama testi oluşturun
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Genel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Başlık *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Oylama başlığı"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Kategori seçin</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Oylama açıklaması"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Kapak Görseli</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCoverImageUpload(file);
                  }}
                  className="flex-1"
                />
                {uploadingCover && (
                  <div className="text-sm text-muted-foreground">
                    Yükleniyor...
                  </div>
                )}
              </div>
              {formData.coverImage && (
                <div className="mt-2">
                  <img
                    src={formData.coverImage}
                    alt="Kapak görseli"
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="headerText">Üst Metin</Label>
                <Input
                  id="headerText"
                  value={formData.headerText}
                  onChange={(e) => handleInputChange("headerText", e.target.value)}
                  placeholder="Üst kısımda görünecek metin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerText">Alt Metin</Label>
                <Input
                  id="footerText"
                  value={formData.footerText}
                  onChange={(e) => handleInputChange("footerText", e.target.value)}
                  placeholder="Alt kısımda görünecek metin"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Seçenekler</CardTitle>
              <Button
                type="button"
                onClick={addOption}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Seçenek Ekle
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {options.map((option, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Seçenek {index + 1}</h4>
                  {options.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => removeOption(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Seçenek Başlığı *</Label>
                    <Input
                      value={option.title}
                      onChange={(e) => handleOptionChange(index, "title", e.target.value)}
                      placeholder="Seçenek başlığı"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Seçenek Görseli *</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(index, file);
                        }}
                        className="flex-1"
                      />
                      {uploading === index && (
                        <div className="text-sm text-muted-foreground">
                          Yükleniyor...
                        </div>
                      )}
                    </div>
                    {option.image && (
                      <div className="mt-2">
                        <img
                          src={option.image}
                          alt={`Seçenek ${index + 1}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Özel Alanlar</Label>
                    <Button
                      type="button"
                      onClick={() => addCustomField(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Alan Ekle
                    </Button>
                  </div>
                  
                  {option.customFields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="flex items-center gap-2">
                      <Input
                        placeholder="Alan adı"
                        value={field.fieldName}
                        onChange={(e) =>
                          handleCustomFieldChange(index, fieldIndex, "fieldName", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Alan değeri"
                        value={field.fieldValue}
                        onChange={(e) =>
                          handleCustomFieldChange(index, fieldIndex, "fieldValue", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        onClick={() => removeCustomField(index, fieldIndex)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            İptal
          </Button>
          <Button
            type="submit"
            disabled={testsLoading}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            {testsLoading ? "Oluşturuluyor..." : "Oylama Oluştur"}
          </Button>
        </div>
      </form>
    </div>
  );
}
