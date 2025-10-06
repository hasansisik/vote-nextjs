'use client';

import { useEffect, useMemo } from "react";
import Image from "next/image";
import StatsBanner from "../../components/stats-banner";
import HeroSection from "../../components/hero-section";
import ContentGrid from "../../components/content-grid";
import FeaturedGrid from "../../components/featured-grid";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getAllTests } from "@/redux/actions/userActions";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { allTests, testsLoading } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllTests({}));
  }, [dispatch]);

  // Convert tests to homepage card format - sadece aktif testleri göster
  const homepageData = useMemo(() => {
    return allTests.filter((test: any) => test.isActive).map((test: any, index: number) => {
      // Use local images from public/images folder as fallback
      const imageIndex = index % 8; // Cycle through v1.jpg to v8.jpg
      const localImage = `/images/v${imageIndex + 1}.jpg`;
      
      // Görsel öncelik sırası:
      // 1. Test'in ilk option'ının görseli (eğer local path ise)
      // 2. Cloudinary veya başka bir CDN'den gelen görsel
      // 3. Local fallback görsel
      let imageUrl = localImage;
      
      if (test.options && test.options.length > 0 && test.options[0].image) {
        const optionImage = test.options[0].image;
        // Eğer görsel local path ise veya cloudinary'den geliyorsa kullan
        if (optionImage.startsWith('/') || optionImage.includes('cloudinary.com')) {
          imageUrl = optionImage;
        }
      }
      
      return {
        id: index + 1,
        testId: test._id, // Gerçek test ID'si
        category: test.category?.toUpperCase() || 'GENEL',
        title: test.title,
        image: imageUrl,
        description: test.description,
        tag: index < 10 ? "popular" : "featured"
      };
    });
  }, [allTests]);

  // Filter data by tags
  const popularData = homepageData.filter(item => item.tag === "popular");
  const featuredData = homepageData.filter(item => item.tag === "featured");

  if (testsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-white">
      {/* İstatistik Banner */}
      <StatsBanner />
      
      {/* Ana Hero Section */}
      <div className="max-w-7xl mx-auto px-2 lg:px-6">
        <HeroSection />
      </div>
      
      {/* İçerik Grid */}
      <ContentGrid 
        title="EN POPÜLER OYLAMALAR"
        cards={popularData}
      />
      
      {/* Featured Grid */}
      <FeaturedGrid 
        title="ÖNE ÇIKAN İÇERİKLER"
        cards={featuredData}
      />
    </div>
  );
}
