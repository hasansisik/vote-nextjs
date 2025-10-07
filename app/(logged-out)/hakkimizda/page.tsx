import React from 'react';

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Hakkımızda</h1>
          
          <div className="prose prose-gray max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">VoteRanker Nedir?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                VoteRanker, kullanıcıların çeşitli konularda oylama yapabileceği, testler oluşturabileceği 
                ve sonuçları analiz edebileceği kapsamlı bir oylama platformudur. Amacımız, 
                farklı kategorilerdeki konular hakkında toplumsal görüşleri toplamak, 
                karşılaştırmalar yapmak ve veri odaklı sonuçlar elde etmektir.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Misyonumuz</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Demokratik katılımı teşvik ederek, kullanıcıların görüşlerini özgürce 
                ifade edebileceği güvenli bir platform sunmak. Teknoloji ve toplumsal 
                etkileşimi birleştirerek, oylama süreçlerini şeffaf ve erişilebilir hale getirmek.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vizyonumuz</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Türkiye'nin en kapsamlı oylama ve test platformu olmak ve dijital demokrasi 
                alanında öncü konumda yer almak. Kullanıcıların ihtiyaçlarını karşılayan, 
                sürekli gelişen ve yenilikçi oylama çözümleri sunan bir platform yaratmak.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Özelliklerimiz</h2>
              <ul className="text-gray-600 leading-relaxed space-y-2">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>Çoklu Kategori:</strong> Farklı konularda oylama testleri oluşturabilirsiniz</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>Görsel Oylama:</strong> Her seçenek için görsel ve özel alanlar ekleyebilirsiniz</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>Gerçek Zamanlı Sonuçlar:</strong> Oylama sonuçlarını anlık olarak takip edebilirsiniz</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>Kullanıcı Dostu:</strong> Basit ve anlaşılır arayüz ile kolay kullanım</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>Mobil Uyumlu:</strong> Tüm cihazlarda sorunsuz çalışan responsive tasarım</span>
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Değerlerimiz</h2>
              <ul className="text-gray-600 leading-relaxed space-y-2">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>Şeffaflık:</strong> Tüm oylama sonuçlarını açık ve anlaşılır şekilde sunuyoruz</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>Güvenilirlik:</strong> Oylama süreçlerinin adil ve güvenli olmasına özen gösteriyoruz</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>Kullanıcı Odaklılık:</strong> Kullanıcı deneyimini sürekli iyileştirmeye odaklanıyoruz</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>İnovasyon:</strong> Oylama teknolojilerinde yeni yöntemler ve özellikler geliştiriyoruz</span>
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nasıl Kullanılır?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Oylama Oluştur</h3>
                  <p className="text-orange-700 text-sm">
                    İstediğiniz konuda oylama testi oluşturun, seçenekleri ekleyin ve görsellerle zenginleştirin.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Oylama Yap</h3>
                  <p className="text-orange-700 text-sm">
                    Diğer kullanıcıların oluşturduğu testlere katılın ve görüşlerinizi paylaşın.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Sonuçları İncele</h3>
                  <p className="text-orange-700 text-sm">
                    Oylama sonuçlarını detaylı grafikler ve istatistiklerle analiz edin.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Paylaş</h3>
                  <p className="text-orange-700 text-sm">
                    Oluşturduğunuz testleri sosyal medyada paylaşarak daha fazla katılım sağlayın.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ekibimiz</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                VoteRanker ekibi, teknoloji tutkusu olan yazılım geliştiricileri, UX/UI tasarımcıları 
                ve veri analistleri ile toplumsal etkileşim uzmanlarından oluşmaktadır. Her birimiz, 
                dijital demokrasi alanına katkıda bulunmak ve kullanıcılarımıza en iyi oylama deneyimini 
                sunmak için çalışmaktayız.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
