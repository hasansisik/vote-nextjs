import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Providers } from "../../redux/provider";
import AuthWrapper from "../../components/auth-wrapper";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import NotificationLoader from '@/components/notification-loader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://whowins.vote';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const title = "whowins – Join Fun Online Polls and Discover Top Choices";
  const description = "Join fun online polls and vote for your favorite options! Make your choices, see instant results, and explore the most popular picks trending now.";
  const keywords = "online poll, vote online, voting website, best choice, ranking poll, favorite voting, online survey";
  const canonicalUrl = baseUrl;
  const ogImage = `${baseUrl}/assets/images/vote-best.webp`;

  // Generate hreflang links for all locales
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    languages[loc] = loc === 'en' ? `${baseUrl}/` : `${baseUrl}/${loc}`;
  });
  languages['x-default'] = `${baseUrl}/`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
    authors: [{ name: "whowins" }],
    creator: "whowins",
    publisher: "whowins",
    alternates: {
      canonical: canonicalUrl,
      languages: languages,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title,
      description,
      siteName: "whowins – Join Fun Online Polls and Discover Top Choices",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "whowins – Join Fun Online Polls and Discover Top Choices",
        },
      ],
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@whowins",
      site: "@whowins",
    },
    icons: {
      icon: [
        { url: "/apple-icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/apple-icon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/apple-icon/android-icon-128x128.png", sizes: "128x128", type: "image/png" },
      ],
      apple: [
        { url: "/apple-icon/apple-icon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/apple-icon/apple-icon-48x48.png", sizes: "48x48", type: "image/png" },
        { url: "/apple-icon/apple-icon-64x64.png", sizes: "64x64", type: "image/png" },
        { url: "/apple-icon/apple-icon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/apple-icon/apple-icon-128x128.png", sizes: "128x128", type: "image/png" },
        { url: "/apple-icon/apple-icon-256x256.png", sizes: "256x256", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "whowins – Join Fun Online Polls and Discover Top Choices",
    },
    other: {
      "mobile-web-app-capable": "yes",
      "msapplication-TileColor": "#ffffff",
      "msapplication-TileImage": "/apple-icon/ms-icon-144x144.png",
      "theme-color": "#ffffff",
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <AuthWrapper>
              <NotificationLoader />
              <main className="min-h-screen flex flex-col">
                {children}
              </main>
            </AuthWrapper>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

