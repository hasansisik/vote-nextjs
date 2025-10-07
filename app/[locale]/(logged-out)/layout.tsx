import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollToTopButton from "@/components/scroll-to-top-button";

export default function LoggedOutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col">
        {children}
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
