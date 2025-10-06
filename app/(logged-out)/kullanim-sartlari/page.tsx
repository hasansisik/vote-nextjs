import React from 'react';

export default function KullanimSartlariPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Kullanım Şartları</h1>
          
          <div className="prose prose-gray max-w-none">
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-6">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bu kullanım şartları, Ranker web sitesini ve hizmetlerini kullanırken 
                uymanız gereken kuralları ve koşulları belirlemektedir. Sitemizi kullanarak 
                bu şartları kabul etmiş sayılırsınız.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Hizmet Tanımı</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ranker, futbol verilerini analiz etme, takım performanslarını takip etme 
                ve futbol öngörüleri yapma imkanı sunan bir web platformudur. Hizmetlerimiz 
                sürekli geliştirilmekte ve güncellenmektedir.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Kullanıcı Sorumlulukları</h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p><strong>Hesap Güvenliği:</strong></p>
                <ul className="ml-6 space-y-2">
                  <li>• Hesap bilgilerinizi güvenli tutmak sizin sorumluluğunuzdadır</li>
                  <li>• Şifrenizi kimseyle paylaşmayın</li>
                  <li>• Şüpheli aktivite fark ettiğinizde derhal bildirin</li>
                </ul>
                
                <p className="mt-4"><strong>Kabul Edilemez Davranışlar:</strong></p>
                <ul className="ml-6 space-y-2">
                  <li>• Yasadışı içerik paylaşımı</li>
                  <li>• Başkalarının haklarını ihlal etme</li>
                  <li>• Spam veya zararlı yazılım yayma</li>
                  <li>• Sistemi manipüle etmeye çalışma</li>
                  <li>• Telif hakkı ihlali</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. İçerik Politikası</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Platformumuzda paylaştığınız içeriklerden siz sorumlusunuz. İçerikleriniz:
              </p>
              <ul className="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Yasalara uygun olmalıdır</li>
                <li>• Başkalarının haklarını ihlal etmemelidir</li>
                <li>• Zararlı, tehdit edici veya rahatsız edici olmamalıdır</li>
                <li>• Telif hakkı ihlali içermemelidir</li>
                <li>• Spam veya reklam amaçlı olmamalıdır</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Fikri Mülkiyet Hakları</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ranker platformu ve tüm içerikleri telif hakkı ve diğer fikri mülkiyet 
                yasaları ile korunmaktadır. Platformumuzu kullanırken:
              </p>
              <ul className="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• İçeriklerimizi izinsiz kopyalayamazsınız</li>
                <li>• Ticari amaçla kullanamazsınız</li>
                <li>• Değiştiremez veya dağıtamazsınız</li>
                <li>• Tersine mühendislik yapamazsınız</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Hizmet Kesintileri</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Hizmetlerimizde aşağıdaki durumlarda kesintiler yaşanabilir:
              </p>
              <ul className="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Planlı bakım çalışmaları</li>
                <li>• Teknik sorunlar</li>
                <li>• Güvenlik güncellemeleri</li>
                <li>• Yasal zorunluluklar</li>
                <li>• Mücbir sebep durumları</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Bu durumlarda önceden bilgilendirme yapmaya çalışırız, ancak her zaman 
                mümkün olmayabilir.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Hesap Sonlandırma</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Aşağıdaki durumlarda hesabınızı sonlandırabiliriz:
              </p>
              <ul className="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Kullanım şartlarını ihlal etmeniz</li>
                <li>• Uzun süre aktif olmamanız</li>
                <li>• Sahte bilgi vermeniz</li>
                <li>• Yasadışı aktivitelerde bulunmanız</li>
                <li>• Diğer kullanıcıları rahatsız etmeniz</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Sorumluluk Sınırlaması</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ranker olarak, hizmetlerimizin kesintisiz olmasını garanti edemeyiz. 
                Aşağıdaki durumlardan sorumlu değiliz:
              </p>
              <ul className="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Geçici hizmet kesintileri</li>
                <li>• Veri kayıpları</li>
                <li>• Üçüncü taraf hizmetlerindeki sorunlar</li>
                <li>• Kullanıcı hatalarından kaynaklanan sorunlar</li>
                <li>• Mücbir sebep durumları</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Değişiklikler</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bu kullanım şartlarını önceden bildirim yaparak değiştirebiliriz. 
                Önemli değişiklikler için e-posta ile bilgilendirme yaparız. 
                Değişikliklerden sonra platformu kullanmaya devam etmeniz, 
                yeni şartları kabul ettiğiniz anlamına gelir.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Uygulanacak Hukuk</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bu kullanım şartları Türk hukukuna tabidir. Herhangi bir anlaşmazlık 
                durumunda Türkiye Cumhuriyeti mahkemeleri yetkilidir.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. İletişim</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Kullanım şartları hakkında sorularınız varsa, 
                <a href="/bize-ulasin" className="text-red-500 hover:text-red-600 ml-1">bizimle iletişime geçebilirsiniz</a>.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Kabul</h3>
              <p className="text-blue-700">
                Bu kullanım şartlarını okuyup anladığınızı ve kabul ettiğinizi beyan ederiz. 
                Şartları kabul etmiyorsanız, lütfen platformumuzu kullanmayın.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
