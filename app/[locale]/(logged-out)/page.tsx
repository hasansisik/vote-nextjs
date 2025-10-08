'use client';

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import StatsBanner from "@/components/stats-banner";
import HeroSection from "@/components/hero-section";
import ContentGrid from "@/components/content-grid";
import FeaturedGrid from "@/components/featured-grid";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getAllTests } from "@/redux/actions/testActions";
import { getActiveTestCategories } from "@/redux/actions/testCategoryActions";
import { getText } from "@/lib/multiLanguageUtils";

export default function Home() {
  const t = useTranslations('HomePage');
  const dispatch = useAppDispatch();
  const { allTests, testsLoading } = useAppSelector((state) => state.test);
  const { activeCategories, loading: categoriesLoading } = useAppSelector((state) => state.testCategory);

  useEffect(() => {
    dispatch(getAllTests({}));
    dispatch(getActiveTestCategories());
  }, [dispatch]);

  // Get category name by ID
  const getCategoryNameById = (categoryId: string) => {
    const category = activeCategories?.find((cat: any) => cat._id === categoryId);
    if (category && category.name) {
      // Handle multilingual name structure
      const categoryName = getText(category.name, 'tr');
      return categoryName ? categoryName.toUpperCase() : t('general');
    }
    return t('general');
  };

  // Convert tests to homepage card format - sadece aktif testleri göster
  const homepageData = useMemo(() => {
    // Debug: Log categories and tests
    console.log('Homepage - Active categories:', activeCategories);
    console.log('Homepage - All tests:', allTests);
    if (allTests?.length > 0) {
      console.log('Homepage - First test categories:', allTests[0]?.categories);
      console.log('Homepage - First test slug:', allTests[0]?.slug);
    }
    
    return allTests.filter((test: any) => test.isActive).map((test: any, index: number) => {
      // Use local images from public/images folder as fallback
      const imageIndex = index % 8; // Cycle through v1.jpg to v8.jpg
      const localImage = `/images/v${imageIndex + 1}.jpg`;
      
      let imageUrl = localImage;
      
      // Önce coverImage'ı kontrol et
      if (test.coverImage) {
        imageUrl = test.coverImage;
      } else if (test.options && test.options.length > 0 && test.options[0].image) {
        const optionImage = test.options[0].image;
        // Eğer görsel local path ise veya cloudinary'den geliyorsa kullan
        if (optionImage.startsWith('/') || optionImage.includes('cloudinary.com')) {
          imageUrl = optionImage;
        }
      }
      
      return {
        id: index + 1,
        testId: test._id, // Gerçek test ID'si
        slug: test.slug, // Test slug'ı
        categories: test.categories && test.categories.length > 0 ? test.categories.map((catId: string) => {
          return getCategoryNameById(catId);
        }) : [t('general')],
        title: test.title,
        image: imageUrl,
        description: test.description,
        tag: index < 10 ? "popular" : "featured"
      };
    });
  }, [allTests, activeCategories]);

  // Filter data by tags
  const popularData = homepageData.filter(item => item.tag === "popular");
  const featuredData = homepageData; // Tüm testleri göster

  return (
    <div className="font-sans bg-white max-w-6xl mx-auto ">
      {/* İstatistik Banner */}
      <StatsBanner />
      
      {/* Ana Hero Section */}
      <div className=" px-2 lg:px-6">
        <HeroSection />
      </div>
      
      {/* İçerik Grid */}
      <ContentGrid 
        title={t('popularVotes')}
      />
      
      {/* Featured Grid */}
      <FeaturedGrid 
        title={t('featuredContent')}
        cards={featuredData}
      />
    </div>
  );
}
