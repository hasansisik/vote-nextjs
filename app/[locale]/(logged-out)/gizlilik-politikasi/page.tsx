import React from 'react';

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Gizlilik Politikası</h1>
          
          <div className="prose prose-gray max-w-none">
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-6">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ranker olarak, kişisel verilerinizin korunması bizim için büyük önem taşımaktadır. 
                Bu gizlilik politikası, web sitemizi kullanırken kişisel bilgilerinizin nasıl toplandığını, 
                kullanıldığını ve korunduğunu açıklamaktadır.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Toplanan Bilgiler</h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p><strong>Kişisel Bilgiler:</strong></p>
                <ul className="ml-6 space-y-2">
                  <li>• Ad ve soyad</li>
                  <li>• E-posta adresi</li>
                  <li>• Kullanıcı adı</li>
                  <li>• Şifre (şifrelenmiş olarak)</li>
                </ul>
                
                <p className="mt-4"><strong>Teknik Bilgiler:</strong></p>
                <ul className="ml-6 space-y-2">
                  <li>• IP adresi</li>
                  <li>• Tarayıcı türü ve versiyonu</li>
                  <li>• İşletim sistemi</li>
                  <li>• Site kullanım verileri</li>
                  <li>• Çerezler (cookies)</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Bilgilerin Kullanımı</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Topladığımız bilgileri aşağıdaki amaçlarla kullanırız:
              </p>
              <ul className="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Hizmetlerimizi sağlamak ve geliştirmek</li>
                <li>• Kullanıcı hesaplarını yönetmek</li>
                <li>• Müşteri desteği sağlamak</li>
                <li>• Güvenlik ve dolandırıcılık önleme</li>
                <li>• Yasal yükümlülüklerimizi yerine getirmek</li>
                <li>• İstatistiksel analizler yapmak</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Bilgi Paylaşımı</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Kişisel bilgilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmayız:
              </p>
              <ul className="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Açık rızanız ile</li>
                <li>• Yasal zorunluluk durumunda</li>
                <li>• Hizmet sağlayıcılarımızla (gizlilik sözleşmesi ile)</li>
                <li>• İş transferi durumunda</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Veri Güvenliği</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Kişisel verilerinizi korumak için aşağıdaki güvenlik önlemlerini alırız:
              </p>
              <ul className="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• SSL şifreleme kullanımı</li>
                <li>• Güvenli sunucu altyapısı</li>
                <li>• Düzenli güvenlik güncellemeleri</li>
                <li>• Erişim kontrolü ve yetkilendirme</li>
                <li>• Veri yedekleme ve kurtarma planları</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Çerezler (Cookies)</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Web sitemizde kullanıcı deneyimini iyileştirmek için çerezler kullanırız. 
                Çerezler, tarayıcınızda saklanan küçük metin dosyalarıdır. Çerezleri 
                tarayıcı ayarlarınızdan yönetebilirsiniz.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Kullanıcı Hakları</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                KVKK kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>• İşlenen verileriniz hakkında bilgi talep etme</li>
                <li>• Verilerinizin işlenme amacını öğrenme</li>
                <li>• Yurt içi/yurt dışı aktarılan üçüncü kişileri bilme</li>
                <li>• Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
                <li>• Belirli şartlar altında verilerin silinmesini isteme</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. İletişim</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Gizlilik politikamız hakkında sorularınız varsa veya kişisel verilerinizle 
                ilgili talepleriniz bulunuyorsa, 
                <a href="/bize-ulasin" className="text-red-500 hover:text-red-600 ml-1">bizimle iletişime geçebilirsiniz</a>.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Önemli Not</h3>
              <p className="text-yellow-700">
                Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler 
                olduğunda kullanıcılarımızı bilgilendiririz. Güncel politikayı düzenli 
                olarak kontrol etmenizi öneririz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
