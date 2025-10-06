import React from 'react';

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Hakkımızda</h1>
          
          <div className="prose prose-gray max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ranker Nedir?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ranker, futbol severlerin takımlarını, oyuncularını ve maçlarını analiz edebileceği, 
                öngörüler yapabileceği ve performans takibi yapabileceği kapsamlı bir platformdur. 
                Amacımız, futbol dünyasında veri odaklı kararlar almanıza yardımcı olmak ve 
                futbol deneyiminizi zenginleştirmektir.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Misyonumuz</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Futbol verilerini herkes için erişilebilir hale getirerek, taraftarların 
                takımları hakkında daha bilinçli kararlar almasını sağlamak. Teknoloji ve 
                futbol tutkusunu birleştirerek, sporun analitik yönünü ön plana çıkarmak.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vizyonumuz</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Türkiye'nin en kapsamlı futbol analiz platformu olmak ve futbol dünyasında 
                veri odaklı yaklaşımın öncüsü haline gelmek. Futbol severlerin ihtiyaçlarını 
                karşılayan, sürekli gelişen ve yenilikçi çözümler sunan bir platform yaratmak.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Değerlerimiz</h2>
              <ul className="text-gray-600 leading-relaxed space-y-2">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span><strong>Şeffaflık:</strong> Tüm verilerimizi açık ve anlaşılır şekilde sunuyoruz</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span><strong>Doğruluk:</strong> Sunduğumuz bilgilerin güncel ve doğru olmasına özen gösteriyoruz</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span><strong>Kullanıcı Odaklılık:</strong> Kullanıcı deneyimini sürekli iyileştirmeye odaklanıyoruz</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span><strong>İnovasyon:</strong> Futbol analizinde yeni teknolojiler ve yöntemler geliştiriyoruz</span>
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ekibimiz</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ranker ekibi, futbol tutkusu olan yazılım geliştiricileri, veri analistleri 
                ve spor uzmanlarından oluşmaktadır. Her birimiz, futbol dünyasına katkıda 
                bulunmak ve kullanıcılarımıza en iyi deneyimi sunmak için çalışmaktayız.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">İletişim</h3>
              <p className="text-gray-600">
                Sorularınız, önerileriniz veya işbirliği teklifleriniz için bizimle iletişime geçebilirsiniz. 
                <a href="/bize-ulasin" className="text-red-500 hover:text-red-600 ml-1">Bize Ulaşın</a> sayfasından 
                detaylı iletişim bilgilerimize ulaşabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
