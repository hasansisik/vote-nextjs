import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Providers } from "../../redux/provider";
import Header from "../../components/header";
import Footer from "../../components/footer";
import AuthWrapper from "../../components/auth-wrapper";
import ScrollToTopButton from "../../components/scroll-to-top-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vote App",
  description: "Vote management application",
};

export default function LoggedOutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthWrapper>
            <Header />
            <main className="min-h-screen flex flex-col">
              {children}
            </main>
            <Footer />
            <ScrollToTopButton />
          </AuthWrapper>
        </Providers>
      </body>
    </html>
  );
}
