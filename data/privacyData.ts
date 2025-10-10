export const privacyData = {
  tr: `
    <div class="min-h-screen bg-orange-50">
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Gizlilik Politikası</h1>
          
          <div class="prose prose-gray max-w-none">
            <div class="mb-8">
              <p class="text-sm text-gray-500 mb-6">
                Son güncelleme: ${new Date().toLocaleDateString('tr-TR')}
              </p>
              <p class="text-gray-600 leading-relaxed mb-4">
                Vote olarak, kişisel verilerinizin korunması bizim için büyük önem taşımaktadır. 
                Bu gizlilik politikası, web sitemizi kullanırken kişisel bilgilerinizin nasıl toplandığını, 
                kullanıldığını ve korunduğunu açıklamaktadır.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">1. Toplanan Bilgiler</h2>
              <div class="text-gray-600 leading-relaxed space-y-3">
                <p><strong>Kişisel Bilgiler:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• Ad ve soyad</li>
                  <li>• E-posta adresi</li>
                  <li>• Kullanıcı adı</li>
                  <li>• Şifre (şifrelenmiş olarak)</li>
                </ul>
                
                <p class="mt-4"><strong>Teknik Bilgiler:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• IP adresi</li>
                  <li>• Tarayıcı türü ve versiyonu</li>
                  <li>• İşletim sistemi</li>
                  <li>• Site kullanım verileri</li>
                  <li>• Çerezler (cookies)</li>
                </ul>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">2. Bilgilerin Kullanımı</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Topladığımız bilgileri aşağıdaki amaçlarla kullanırız:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Hizmetlerimizi sağlamak ve geliştirmek</li>
                <li>• Kullanıcı hesaplarını yönetmek</li>
                <li>• Müşteri desteği sağlamak</li>
                <li>• Güvenlik ve dolandırıcılık önleme</li>
                <li>• Yasal yükümlülüklerimizi yerine getirmek</li>
                <li>• İstatistiksel analizler yapmak</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">3. Bilgi Paylaşımı</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Kişisel bilgilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmayız:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Açık rızanız ile</li>
                <li>• Yasal zorunluluk durumunda</li>
                <li>• Hizmet sağlayıcılarımızla (gizlilik sözleşmesi ile)</li>
                <li>• İş transferi durumunda</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">4. Veri Güvenliği</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Kişisel verilerinizi korumak için aşağıdaki güvenlik önlemlerini alırız:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• SSL şifreleme kullanımı</li>
                <li>• Güvenli sunucu altyapısı</li>
                <li>• Düzenli güvenlik güncellemeleri</li>
                <li>• Erişim kontrolü ve yetkilendirme</li>
                <li>• Veri yedekleme ve kurtarma planları</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">5. Çerezler (Cookies)</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Web sitemizde kullanıcı deneyimini iyileştirmek için çerezler kullanırız. 
                Çerezler, tarayıcınızda saklanan küçük metin dosyalarıdır. Çerezleri 
                tarayıcı ayarlarınızdan yönetebilirsiniz.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">6. Kullanıcı Hakları</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                KVKK kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>• İşlenen verileriniz hakkında bilgi talep etme</li>
                <li>• Verilerinizin işlenme amacını öğrenme</li>
                <li>• Yurt içi/yurt dışı aktarılan üçüncü kişileri bilme</li>
                <li>• Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
                <li>• Belirli şartlar altında verilerin silinmesini isteme</li>
              </ul>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-yellow-800 mb-3">Önemli Not</h3>
              <p class="text-yellow-700">
                Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler 
                olduğunda kullanıcılarımızı bilgilendiririz. Güncel politikayı düzenli 
                olarak kontrol etmenizi öneririz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  en: `
    <div class="min-h-screen bg-orange-50">
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div class="prose prose-gray max-w-none">
            <div class="mb-8">
              <p class="text-sm text-gray-500 mb-6">
                Last updated: ${new Date().toLocaleDateString('en-US')}
              </p>
              <p class="text-gray-600 leading-relaxed mb-4">
                As Vote, the protection of your personal data is of great importance to us. 
                This privacy policy explains how your personal information is collected, 
                used, and protected when using our website.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">1. Information Collected</h2>
              <div class="text-gray-600 leading-relaxed space-y-3">
                <p><strong>Personal Information:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• First and last name</li>
                  <li>• Email address</li>
                  <li>• Username</li>
                  <li>• Password (encrypted)</li>
                </ul>
                
                <p class="mt-4"><strong>Technical Information:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• IP address</li>
                  <li>• Browser type and version</li>
                  <li>• Operating system</li>
                  <li>• Site usage data</li>
                  <li>• Cookies</li>
                </ul>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">2. Use of Information</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• To provide and improve our services</li>
                <li>• To manage user accounts</li>
                <li>• To provide customer support</li>
                <li>• For security and fraud prevention</li>
                <li>• To fulfill our legal obligations</li>
                <li>• To perform statistical analysis</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">3. Information Sharing</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                We do not share your personal information with third parties except in the following cases:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• With your explicit consent</li>
                <li>• In case of legal obligation</li>
                <li>• With our service providers (with privacy agreement)</li>
                <li>• In case of business transfer</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                We take the following security measures to protect your personal data:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Use of SSL encryption</li>
                <li>• Secure server infrastructure</li>
                <li>• Regular security updates</li>
                <li>• Access control and authorization</li>
                <li>• Data backup and recovery plans</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">5. Cookies</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                We use cookies to improve user experience on our website. 
                Cookies are small text files stored in your browser. You can 
                manage cookies through your browser settings.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">6. User Rights</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Under GDPR, you have the following rights:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• To know whether your personal data is being processed</li>
                <li>• To request information about your processed data</li>
                <li>• To know the purpose of processing your data</li>
                <li>• To know third parties to whom data is transferred domestically/abroad</li>
                <li>• To request correction of incomplete or incorrectly processed data</li>
                <li>• To request deletion of data under certain conditions</li>
              </ul>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-yellow-800 mb-3">Important Note</h3>
              <p class="text-yellow-700">
                This privacy policy may be updated from time to time. We will inform our users 
                when important changes occur. We recommend that you regularly check the current policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  fr: `
    <div class="min-h-screen bg-orange-50">
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>
          
          <div class="prose prose-gray max-w-none">
            <div class="mb-8">
              <p class="text-sm text-gray-500 mb-6">
                Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}
              </p>
              <p class="text-gray-600 leading-relaxed mb-4">
                En tant que Vote, la protection de vos données personnelles est d'une grande importance pour nous. 
                Cette politique de confidentialité explique comment vos informations personnelles sont collectées, 
                utilisées et protégées lors de l'utilisation de notre site web.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">1. Informations Collectées</h2>
              <div class="text-gray-600 leading-relaxed space-y-3">
                <p><strong>Informations Personnelles:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• Prénom et nom de famille</li>
                  <li>• Adresse e-mail</li>
                  <li>• Nom d'utilisateur</li>
                  <li>• Mot de passe (chiffré)</li>
                </ul>
                
                <p class="mt-4"><strong>Informations Techniques:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• Adresse IP</li>
                  <li>• Type et version du navigateur</li>
                  <li>• Système d'exploitation</li>
                  <li>• Données d'utilisation du site</li>
                  <li>• Cookies</li>
                </ul>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">2. Utilisation des Informations</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Nous utilisons les informations que nous collectons aux fins suivantes:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Fournir et améliorer nos services</li>
                <li>• Gérer les comptes utilisateurs</li>
                <li>• Fournir un support client</li>
                <li>• Pour la sécurité et la prévention de la fraude</li>
                <li>• Remplir nos obligations légales</li>
                <li>• Effectuer des analyses statistiques</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">3. Partage d'Informations</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Nous ne partageons pas vos informations personnelles avec des tiers, sauf dans les cas suivants:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Avec votre consentement explicite</li>
                <li>• En cas d'obligation légale</li>
                <li>• Avec nos fournisseurs de services (avec accord de confidentialité)</li>
                <li>• En cas de transfert d'entreprise</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">4. Sécurité des Données</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Nous prenons les mesures de sécurité suivantes pour protéger vos données personnelles:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Utilisation du chiffrement SSL</li>
                <li>• Infrastructure de serveur sécurisée</li>
                <li>• Mises à jour de sécurité régulières</li>
                <li>• Contrôle d'accès et autorisation</li>
                <li>• Plans de sauvegarde et de récupération des données</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">5. Cookies</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Nous utilisons des cookies pour améliorer l'expérience utilisateur sur notre site web. 
                Les cookies sont de petits fichiers texte stockés dans votre navigateur. Vous pouvez 
                gérer les cookies via les paramètres de votre navigateur.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">6. Droits de l'Utilisateur</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Sous le RGPD, vous avez les droits suivants:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Savoir si vos données personnelles sont traitées</li>
                <li>• Demander des informations sur vos données traitées</li>
                <li>• Connaître le but du traitement de vos données</li>
                <li>• Connaître les tiers auxquels les données sont transférées au niveau national/étranger</li>
                <li>• Demander la correction de données incomplètes ou incorrectement traitées</li>
                <li>• Demander la suppression de données sous certaines conditions</li>
              </ul>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-yellow-800 mb-3">Note Importante</h3>
              <p class="text-yellow-700">
                Cette politique de confidentialité peut être mise à jour de temps à autre. Nous informerons nos utilisateurs 
                lorsque des changements importants se produisent. Nous recommandons de vérifier régulièrement la politique actuelle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  de: `
    <div class="min-h-screen bg-orange-50">
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Datenschutzrichtlinie</h1>
          
          <div class="prose prose-gray max-w-none">
            <div class="mb-8">
              <p class="text-sm text-gray-500 mb-6">
                Letzte Aktualisierung: ${new Date().toLocaleDateString('de-DE')}
              </p>
              <p class="text-gray-600 leading-relaxed mb-4">
                Als Vote ist der Schutz Ihrer persönlichen Daten von großer Bedeutung für uns. 
                Diese Datenschutzrichtlinie erklärt, wie Ihre persönlichen Informationen beim 
                Besuch unserer Website gesammelt, verwendet und geschützt werden.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">1. Gesammelte Informationen</h2>
              <div class="text-gray-600 leading-relaxed space-y-3">
                <p><strong>Persönliche Informationen:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• Vor- und Nachname</li>
                  <li>• E-Mail-Adresse</li>
                  <li>• Benutzername</li>
                  <li>• Passwort (verschlüsselt)</li>
                </ul>
                
                <p class="mt-4"><strong>Technische Informationen:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• IP-Adresse</li>
                  <li>• Browser-Typ und -Version</li>
                  <li>• Betriebssystem</li>
                  <li>• Website-Nutzungsdaten</li>
                  <li>• Cookies</li>
                </ul>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">2. Verwendung der Informationen</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Wir verwenden die gesammelten Informationen für folgende Zwecke:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Bereitstellung und Verbesserung unserer Dienste</li>
                <li>• Verwaltung von Benutzerkonten</li>
                <li>• Bereitstellung von Kundensupport</li>
                <li>• Für Sicherheit und Betrugsprävention</li>
                <li>• Erfüllung unserer rechtlichen Verpflichtungen</li>
                <li>• Durchführung statistischer Analysen</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">3. Informationsaustausch</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Wir teilen Ihre persönlichen Informationen nicht mit Dritten, außer in folgenden Fällen:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Mit Ihrer ausdrücklichen Zustimmung</li>
                <li>• Bei rechtlicher Verpflichtung</li>
                <li>• Mit unseren Dienstleistern (mit Datenschutzvereinbarung)</li>
                <li>• Bei Geschäftsübertragung</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">4. Datensicherheit</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Wir ergreifen folgende Sicherheitsmaßnahmen zum Schutz Ihrer persönlichen Daten:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Verwendung von SSL-Verschlüsselung</li>
                <li>• Sichere Serverinfrastruktur</li>
                <li>• Regelmäßige Sicherheitsupdates</li>
                <li>• Zugangskontrolle und Autorisierung</li>
                <li>• Datensicherungs- und Wiederherstellungspläne</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">5. Cookies</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Wir verwenden Cookies, um die Benutzererfahrung auf unserer Website zu verbessern. 
                Cookies sind kleine Textdateien, die in Ihrem Browser gespeichert werden. Sie können 
                Cookies über Ihre Browser-Einstellungen verwalten.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">6. Benutzerrechte</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Unter der DSGVO haben Sie folgende Rechte:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Zu wissen, ob Ihre persönlichen Daten verarbeitet werden</li>
                <li>• Informationen über Ihre verarbeiteten Daten anzufordern</li>
                <li>• Den Zweck der Verarbeitung Ihrer Daten zu kennen</li>
                <li>• Dritte zu kennen, an die Daten national/ausländisch übertragen werden</li>
                <li>• Korrektur unvollständiger oder falsch verarbeiteter Daten anzufordern</li>
                <li>• Löschung von Daten unter bestimmten Bedingungen anzufordern</li>
              </ul>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-yellow-800 mb-3">Wichtiger Hinweis</h3>
              <p class="text-yellow-700">
                Diese Datenschutzrichtlinie kann von Zeit zu Zeit aktualisiert werden. Wir werden unsere Benutzer 
                informieren, wenn wichtige Änderungen auftreten. Wir empfehlen, die aktuelle Richtlinie regelmäßig zu überprüfen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};

