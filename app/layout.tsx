import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../redux/provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://whowins.vote';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "whowins – Join Fun Online Polls and Discover Top Choices",
  description: "Join fun online polls and vote for your favorite options! Make your choices, see instant results, and explore the most popular picks trending now.",
  keywords: "online poll, vote online, voting website, best choice, ranking poll, favorite voting, online survey",
  authors: [{ name: "whowins" }],
  creator: "whowins",
  publisher: "whowins",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    url: baseUrl,
    title: "whowins – Join Fun Online Polls and Discover Top Choices",
    description: "Join fun online polls and vote for your favorite options! Make your choices, see instant results, and explore the most popular picks trending now.",
    siteName: "whowins – Join Fun Online Polls and Discover Top Choices",
    images: [
      {
        url: `${baseUrl}/assets/images/vote-best.webp`,
        width: 1200,
        height: 630,
        alt: "whowins – Join Fun Online Polls and Discover Top Choices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "whowins – Join Fun Online Polls and Discover Top Choices",
    description: "Join fun online polls and vote for your favorite options! Make your choices, see instant results, and explore the most popular picks trending now.",
    images: [`${baseUrl}/assets/images/vote-best.webp`],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            expand={true}
            richColors
            closeButton
          />
        </Providers>
      </body>
    </html>
  );
}
