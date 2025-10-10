export const termsData = {
  tr: `
    <div class="min-h-screen bg-orange-50">
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Kullanım Şartları</h1>
          
          <div class="prose prose-gray max-w-none">
            <div class="mb-8">
              <p class="text-sm text-gray-500 mb-6">
                Son güncelleme: ${new Date().toLocaleDateString('tr-TR')}
              </p>
              <p class="text-gray-600 leading-relaxed mb-4">
                Bu kullanım şartları, Vote web sitesini ve hizmetlerini kullanırken 
                uymanız gereken kuralları ve koşulları belirlemektedir. Sitemizi kullanarak 
                bu şartları kabul etmiş sayılırsınız.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">1. Hizmet Tanımı</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Vote, kullanıcıların çeşitli konularda oylama yapabileceği, testler oluşturabileceği 
                ve sonuçları analiz edebileceği kapsamlı bir oylama platformudur. Hizmetlerimiz 
                sürekli geliştirilmekte ve güncellenmektedir.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">2. Kullanıcı Sorumlulukları</h2>
              <div class="text-gray-600 leading-relaxed space-y-3">
                <p><strong>Hesap Güvenliği:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• Hesap bilgilerinizi güvenli tutmak sizin sorumluluğunuzdadır</li>
                  <li>• Şifrenizi kimseyle paylaşmayın</li>
                  <li>• Şüpheli aktivite fark ettiğinizde derhal bildirin</li>
                </ul>
                
                <p class="mt-4"><strong>Kabul Edilemez Davranışlar:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• Yasadışı içerik paylaşımı</li>
                  <li>• Başkalarının haklarını ihlal etme</li>
                  <li>• Spam veya zararlı yazılım yayma</li>
                  <li>• Sistemi manipüle etmeye çalışma</li>
                  <li>• Telif hakkı ihlali</li>
                </ul>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">3. İçerik Politikası</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Platformumuzda paylaştığınız içeriklerden siz sorumlusunuz. İçerikleriniz:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Yasalara uygun olmalıdır</li>
                <li>• Başkalarının haklarını ihlal etmemelidir</li>
                <li>• Zararlı, tehdit edici veya rahatsız edici olmamalıdır</li>
                <li>• Telif hakkı ihlali içermemelidir</li>
                <li>• Spam veya reklam amaçlı olmamalıdır</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">4. Fikri Mülkiyet Hakları</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Vote platformu ve tüm içerikleri telif hakkı ve diğer fikri mülkiyet 
                yasaları ile korunmaktadır. Platformumuzu kullanırken:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• İçeriklerimizi izinsiz kopyalayamazsınız</li>
                <li>• Ticari amaçla kullanamazsınız</li>
                <li>• Değiştiremez veya dağıtamazsınız</li>
                <li>• Tersine mühendislik yapamazsınız</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">5. Hizmet Kesintileri</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Hizmetlerimizde aşağıdaki durumlarda kesintiler yaşanabilir:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Planlı bakım çalışmaları</li>
                <li>• Teknik sorunlar</li>
                <li>• Güvenlik güncellemeleri</li>
                <li>• Yasal zorunluluklar</li>
                <li>• Mücbir sebep durumları</li>
              </ul>
              <p class="text-gray-600 leading-relaxed mt-4">
                Bu durumlarda önceden bilgilendirme yapmaya çalışırız, ancak her zaman 
                mümkün olmayabilir.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">6. Hesap Sonlandırma</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Aşağıdaki durumlarda hesabınızı sonlandırabiliriz:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Kullanım şartlarını ihlal etmeniz</li>
                <li>• Uzun süre aktif olmamanız</li>
                <li>• Sahte bilgi vermeniz</li>
                <li>• Yasadışı aktivitelerde bulunmanız</li>
                <li>• Diğer kullanıcıları rahatsız etmeniz</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">7. Sorumluluk Sınırlaması</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Vote olarak, hizmetlerimizin kesintisiz olmasını garanti edemeyiz. 
                Aşağıdaki durumlardan sorumlu değiliz:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Geçici hizmet kesintileri</li>
                <li>• Veri kayıpları</li>
                <li>• Üçüncü taraf hizmetlerindeki sorunlar</li>
                <li>• Kullanıcı hatalarından kaynaklanan sorunlar</li>
                <li>• Mücbir sebep durumları</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">8. Değişiklikler</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Bu kullanım şartlarını önceden bildirim yaparak değiştirebiliriz. 
                Önemli değişiklikler için e-posta ile bilgilendirme yaparız. 
                Değişikliklerden sonra platformu kullanmaya devam etmeniz, 
                yeni şartları kabul ettiğiniz anlamına gelir.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">9. Uygulanacak Hukuk</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Bu kullanım şartları Türk hukukuna tabidir. Herhangi bir anlaşmazlık 
                durumunda Türkiye Cumhuriyeti mahkemeleri yetkilidir.
              </p>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-blue-800 mb-3">Kabul</h3>
              <p class="text-blue-700">
                Bu kullanım şartlarını okuyup anladığınızı ve kabul ettiğinizi beyan ederiz. 
                Şartları kabul etmiyorsanız, lütfen platformumuzu kullanmayın.
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
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Terms of Use</h1>
          
          <div class="prose prose-gray max-w-none">
            <div class="mb-8">
              <p class="text-sm text-gray-500 mb-6">
                Last updated: ${new Date().toLocaleDateString('en-US')}
              </p>
              <p class="text-gray-600 leading-relaxed mb-4">
                These terms of use establish the rules and conditions you must follow when using 
                the Vote website and services. By using our site, you are deemed to have accepted these terms.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">1. Service Description</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Vote is a comprehensive voting platform where users can vote on various topics, 
                create tests, and analyze results. Our services are continuously developed and updated.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">2. User Responsibilities</h2>
              <div class="text-gray-600 leading-relaxed space-y-3">
                <p><strong>Account Security:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• You are responsible for keeping your account information secure</li>
                  <li>• Do not share your password with anyone</li>
                  <li>• Report suspicious activity immediately</li>
                </ul>
                
                <p class="mt-4"><strong>Unacceptable Behaviors:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• Sharing illegal content</li>
                  <li>• Violating others' rights</li>
                  <li>• Spreading spam or malicious software</li>
                  <li>• Attempting to manipulate the system</li>
                  <li>• Copyright infringement</li>
                </ul>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">3. Content Policy</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                You are responsible for the content you share on our platform. Your content should:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Comply with laws</li>
                <li>• Not violate others' rights</li>
                <li>• Not be harmful, threatening, or offensive</li>
                <li>• Not contain copyright infringement</li>
                <li>• Not be spam or advertising</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">4. Intellectual Property Rights</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                The Vote platform and all its content are protected by copyright and other 
                intellectual property laws. When using our platform:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• You cannot copy our content without permission</li>
                <li>• You cannot use it for commercial purposes</li>
                <li>• You cannot modify or distribute it</li>
                <li>• You cannot reverse engineer it</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">5. Service Interruptions</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Service interruptions may occur in the following situations:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Planned maintenance work</li>
                <li>• Technical issues</li>
                <li>• Security updates</li>
                <li>• Legal obligations</li>
                <li>• Force majeure situations</li>
              </ul>
              <p class="text-gray-600 leading-relaxed mt-4">
                We try to provide advance notice in these situations, but it may not always be possible.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">6. Account Termination</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                We may terminate your account in the following situations:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Violation of terms of use</li>
                <li>• Long-term inactivity</li>
                <li>• Providing false information</li>
                <li>• Engaging in illegal activities</li>
                <li>• Harassing other users</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                As Vote, we cannot guarantee uninterrupted service. We are not responsible for:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Temporary service interruptions</li>
                <li>• Data losses</li>
                <li>• Issues with third-party services</li>
                <li>• Problems arising from user errors</li>
                <li>• Force majeure situations</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">8. Changes</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                We may change these terms of use with prior notice. We will notify you by email 
                for important changes. Continuing to use the platform after changes means you 
                accept the new terms.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">9. Applicable Law</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                These terms of use are subject to Turkish law. Turkish Republic courts are 
                authorized in case of any dispute.
              </p>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-blue-800 mb-3">Acceptance</h3>
              <p class="text-blue-700">
                We declare that you have read, understood, and accepted these terms of use. 
                If you do not accept the terms, please do not use our platform.
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
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Conditions d'Utilisation</h1>
          
          <div class="prose prose-gray max-w-none">
            <div class="mb-8">
              <p class="text-sm text-gray-500 mb-6">
                Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}
              </p>
              <p class="text-gray-600 leading-relaxed mb-4">
                Ces conditions d'utilisation établissent les règles et conditions que vous devez 
                suivre lors de l'utilisation du site web et des services Vote. En utilisant notre site, 
                vous êtes réputé avoir accepté ces conditions.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">1. Description du Service</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Vote est une plateforme de vote complète où les utilisateurs peuvent voter sur 
                divers sujets, créer des tests et analyser les résultats. Nos services sont 
                continuellement développés et mis à jour.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">2. Responsabilités de l'Utilisateur</h2>
              <div class="text-gray-600 leading-relaxed space-y-3">
                <p><strong>Sécurité du Compte:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• Vous êtes responsable de la sécurité de vos informations de compte</li>
                  <li>• Ne partagez pas votre mot de passe avec qui que ce soit</li>
                  <li>• Signalez immédiatement toute activité suspecte</li>
                </ul>
                
                <p class="mt-4"><strong>Comportements Inacceptables:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• Partage de contenu illégal</li>
                  <li>• Violation des droits d'autrui</li>
                  <li>• Propagation de spam ou de logiciels malveillants</li>
                  <li>• Tentative de manipulation du système</li>
                  <li>• Violation du droit d'auteur</li>
                </ul>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">3. Politique de Contenu</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Vous êtes responsable du contenu que vous partagez sur notre plateforme. Votre contenu doit:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Être conforme aux lois</li>
                <li>• Ne pas violer les droits d'autrui</li>
                <li>• Ne pas être nuisible, menaçant ou offensant</li>
                <li>• Ne pas contenir de violation du droit d'auteur</li>
                <li>• Ne pas être du spam ou de la publicité</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">4. Droits de Propriété Intellectuelle</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                La plateforme Vote et tout son contenu sont protégés par le droit d'auteur et 
                d'autres lois sur la propriété intellectuelle. Lors de l'utilisation de notre plateforme:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Vous ne pouvez pas copier notre contenu sans permission</li>
                <li>• Vous ne pouvez pas l'utiliser à des fins commerciales</li>
                <li>• Vous ne pouvez pas le modifier ou le distribuer</li>
                <li>• Vous ne pouvez pas le rétro-ingénier</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">5. Interruptions de Service</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Des interruptions de service peuvent survenir dans les situations suivantes:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Travaux de maintenance planifiés</li>
                <li>• Problèmes techniques</li>
                <li>• Mises à jour de sécurité</li>
                <li>• Obligations légales</li>
                <li>• Situations de force majeure</li>
              </ul>
              <p class="text-gray-600 leading-relaxed mt-4">
                Nous essayons de fournir un préavis dans ces situations, mais ce n'est pas toujours possible.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">6. Résiliation de Compte</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Nous pouvons résilier votre compte dans les situations suivantes:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Violation des conditions d'utilisation</li>
                <li>• Inactivité prolongée</li>
                <li>• Fourniture de fausses informations</li>
                <li>• Participation à des activités illégales</li>
                <li>• Harcèlement d'autres utilisateurs</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">7. Limitation de Responsabilité</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                En tant que Vote, nous ne pouvons pas garantir un service ininterrompu. Nous ne sommes pas responsables de:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Interruptions temporaires de service</li>
                <li>• Pertes de données</li>
                <li>• Problèmes avec les services tiers</li>
                <li>• Problèmes résultant d'erreurs utilisateur</li>
                <li>• Situations de force majeure</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">8. Modifications</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Nous pouvons modifier ces conditions d'utilisation avec un préavis. Nous vous informerons par e-mail 
                pour les changements importants. Continuer à utiliser la plateforme après les modifications signifie 
                que vous acceptez les nouvelles conditions.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">9. Droit Applicable</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Ces conditions d'utilisation sont soumises au droit turc. Les tribunaux de la République de Turquie 
                sont autorisés en cas de litige.
              </p>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-blue-800 mb-3">Acceptation</h3>
              <p class="text-blue-700">
                Nous déclarons que vous avez lu, compris et accepté ces conditions d'utilisation. 
                Si vous n'acceptez pas les conditions, veuillez ne pas utiliser notre plateforme.
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
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Nutzungsbedingungen</h1>
          
          <div class="prose prose-gray max-w-none">
            <div class="mb-8">
              <p class="text-sm text-gray-500 mb-6">
                Letzte Aktualisierung: ${new Date().toLocaleDateString('de-DE')}
              </p>
              <p class="text-gray-600 leading-relaxed mb-4">
                Diese Nutzungsbedingungen legen die Regeln und Bedingungen fest, die Sie bei der 
                Nutzung der Vote-Website und -Dienste befolgen müssen. Durch die Nutzung unserer 
                Website erklären Sie sich mit diesen Bedingungen einverstanden.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">1. Dienstbeschreibung</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Vote ist eine umfassende Abstimmungsplattform, auf der Benutzer zu verschiedenen 
                Themen abstimmen, Tests erstellen und Ergebnisse analysieren können. Unsere Dienste 
                werden kontinuierlich entwickelt und aktualisiert.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">2. Benutzerverantwortlichkeiten</h2>
              <div class="text-gray-600 leading-relaxed space-y-3">
                <p><strong>Kontosicherheit:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• Sie sind dafür verantwortlich, Ihre Kontoinformationen sicher zu halten</li>
                  <li>• Teilen Sie Ihr Passwort mit niemandem</li>
                  <li>• Melden Sie verdächtige Aktivitäten sofort</li>
                </ul>
                
                <p class="mt-4"><strong>Unakzeptable Verhaltensweisen:</strong></p>
                <ul class="ml-6 space-y-2">
                  <li>• Teilen illegaler Inhalte</li>
                  <li>• Verletzung der Rechte anderer</li>
                  <li>• Verbreitung von Spam oder Malware</li>
                  <li>• Versuch der Systemmanipulation</li>
                  <li>• Urheberrechtsverletzung</li>
                </ul>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">3. Inhaltsrichtlinie</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Sie sind für die Inhalte verantwortlich, die Sie auf unserer Plattform teilen. Ihre Inhalte sollten:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Den Gesetzen entsprechen</li>
                <li>• Die Rechte anderer nicht verletzen</li>
                <li>• Nicht schädlich, bedrohlich oder beleidigend sein</li>
                <li>• Keine Urheberrechtsverletzung enthalten</li>
                <li>• Kein Spam oder Werbung sein</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">4. Geistige Eigentumsrechte</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Die Vote-Plattform und alle ihre Inhalte sind durch Urheberrecht und andere 
                Gesetze zum geistigen Eigentum geschützt. Bei der Nutzung unserer Plattform:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Sie können unsere Inhalte nicht ohne Erlaubnis kopieren</li>
                <li>• Sie können sie nicht für kommerzielle Zwecke verwenden</li>
                <li>• Sie können sie nicht ändern oder verteilen</li>
                <li>• Sie können sie nicht reverse-engineeren</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">5. Dienstunterbrechungen</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Dienstunterbrechungen können in folgenden Situationen auftreten:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Geplante Wartungsarbeiten</li>
                <li>• Technische Probleme</li>
                <li>• Sicherheitsupdates</li>
                <li>• Rechtliche Verpflichtungen</li>
                <li>• Höhere Gewalt</li>
              </ul>
              <p class="text-gray-600 leading-relaxed mt-4">
                Wir versuchen, in diesen Situationen Vorankündigungen zu geben, aber das ist nicht immer möglich.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">6. Kontobeendigung</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Wir können Ihr Konto in folgenden Situationen beenden:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Verletzung der Nutzungsbedingungen</li>
                <li>• Langfristige Inaktivität</li>
                <li>• Bereitstellung falscher Informationen</li>
                <li>• Teilnahme an illegalen Aktivitäten</li>
                <li>• Belästigung anderer Benutzer</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">7. Haftungsbeschränkung</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Als Vote können wir keinen unterbrechungsfreien Service garantieren. Wir sind nicht verantwortlich für:
              </p>
              <ul class="text-gray-600 leading-relaxed space-y-2 ml-6">
                <li>• Vorübergehende Dienstunterbrechungen</li>
                <li>• Datenverluste</li>
                <li>• Probleme mit Drittanbieterdiensten</li>
                <li>• Probleme durch Benutzerfehler</li>
                <li>• Höhere Gewalt</li>
              </ul>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">8. Änderungen</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Wir können diese Nutzungsbedingungen mit Vorankündigung ändern. Wir werden Sie per E-Mail 
                über wichtige Änderungen informieren. Die weitere Nutzung der Plattform nach Änderungen 
                bedeutet, dass Sie die neuen Bedingungen akzeptieren.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">9. Anwendbares Recht</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Diese Nutzungsbedingungen unterliegen türkischem Recht. Die Gerichte der Republik Türkei 
                sind bei Streitigkeiten zuständig.
              </p>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-blue-800 mb-3">Annahme</h3>
              <p class="text-blue-700">
                Wir erklären, dass Sie diese Nutzungsbedingungen gelesen, verstanden und akzeptiert haben. 
                Wenn Sie die Bedingungen nicht akzeptieren, verwenden Sie bitte nicht unsere Plattform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};

