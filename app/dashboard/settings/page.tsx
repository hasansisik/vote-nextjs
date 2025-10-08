'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hook';
import { useSelector } from 'react-redux';
import {
  getSettings,
  toggleLanguage,
} from '@/redux/actions/settingsActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save, Globe, Check, X } from 'lucide-react';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { settings, loading, error } = useSelector((state: any) => state.settings);
  const { user } = useSelector((state: any) => state.user);

  useEffect(() => {
    dispatch(getSettings() as any);
  }, [dispatch]);

  const handleToggleLanguage = async (languageCode: string, currentEnabled: boolean) => {
    try {
      const result = await dispatch(
        toggleLanguage({ languageCode, enabled: !currentEnabled }) as any
      );

      if (toggleLanguage.fulfilled.match(result)) {
        toast.success('Başarılı', {
          description: `${languageCode.toUpperCase()} dili ${!currentEnabled ? 'aktif' : 'pasif'} edildi.`,
        });
      } else {
        toast.error('Hata', {
          description: result.payload as string || 'Bir hata oluştu.',
        });
      }
    } catch (error) {
      toast.error('Hata', {
        description: 'Bir hata oluştu.',
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

  if (loading && !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Ayarlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Hata</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* WordPress-style Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Sistem Ayarları
              </h1>
              <p className="text-sm text-gray-600">
                Sistem genelindeki dil ayarlarını yönetin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              İptal
            </Button>
            <Button
              type="button"
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
          </div>
        </div>
      </div>

      {/* WordPress-style Content Layout */}
      <div className="flex gap-6 p-6">
        {/* Main Content Area */}
        <div className="flex-1 max-w-4xl">
          <div className="space-y-6">
            {/* Language Settings Card */}
            <div className="bg-white rounded-lg ">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Dil Ayarları</h3>
              </div>
              
              <div className="space-y-6">

                {/* Language Toggle List */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Mevcut Diller
                  </Label>
                  <div className="space-y-4">
                    {settings.languages.availableLanguages.map((lang: any) => (
                      <div
                        key={lang.code}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{lang.flag}</span>
                          <div>
                            <p className="font-medium text-gray-900">{lang.name}</p>
                            <p className="text-sm text-gray-500">
                              Kod: {lang.code.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={lang.enabled}
                              onCheckedChange={() => handleToggleLanguage(lang.code, lang.enabled)}
                              disabled={
                                lang.enabled &&
                                settings.languages.availableLanguages.filter(
                                  (l: any) => l.enabled
                                ).length === 1
                              }
                            />
                            <Label className="text-sm font-normal">
                              {lang.enabled ? (
                                <span className="text-green-600 flex items-center gap-1">
                                  <Check className="h-4 w-4" />
                                  Aktif
                                </span>
                              ) : (
                                <span className="text-gray-500 flex items-center gap-1">
                                  <X className="h-4 w-4" />
                                  Pasif
                                </span>
                              )}
                            </Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    * En az bir dil aktif olmalıdır
                    <br />* Kullanıcılar dil seçimlerini localStorage'da saklayabilir
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WordPress-style Sidebar */}
        <div className="w-80 space-y-6">
          {/* Help Box */}
          <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">İpuçları</h3>
            <ul className="text-sm text-orange-800 space-y-2">
              <li>• En az bir dil aktif olmalıdır</li>
              <li>• Pasif edilen diller kullanıcılar tarafından seçilemez</li>
              <li>• Dil değişiklikleri anında etkili olur</li>
              <li>• Kullanıcılar dil seçimlerini localStorage'da saklar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

