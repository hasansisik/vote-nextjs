'use client';

import { useEffect, useMemo } from "react";
import Script from "next/script";
import { useTranslations } from 'next-intl';
import StatsBanner from "@/components/stats-banner";
import HeroSection from "@/components/hero-section";
import ContentGrid from "@/components/content-grid";
import FeaturedGrid from "@/components/featured-grid";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getAllTests } from "@/redux/actions/testActions";
import { getActiveTestCategories } from "@/redux/actions/testCategoryActions";
import { getHomePageHtmlContent } from "@/redux/actions/settingsActions";
import { getText } from "@/lib/multiLanguageUtils";
import { useLocale } from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');
  const dispatch = useAppDispatch();
  const locale = useLocale() as 'tr' | 'en' | 'de' | 'fr';
  const { allTests, testsLoading } = useAppSelector((state) => state.test);
  const { activeCategories, loading: categoriesLoading } = useAppSelector((state) => state.testCategory);
  const { homePageHtmlContent } = useAppSelector((state) => state.settings);

  useEffect(() => {
    dispatch(getAllTests({}));
    dispatch(getActiveTestCategories());
    dispatch(getHomePageHtmlContent() as any);
  }, [dispatch]);

  // Get category name by ID
  const getCategoryNameById = (categoryId: string) => {
    const category = activeCategories?.find((cat: any) => cat._id === categoryId);
    if (category && category.name) {
      // Handle multilingual name structure
      const categoryName = getText(category.name, locale);
      return categoryName ? categoryName.toUpperCase() : 'GENEL';
    }
    return 'GENEL';
  };

  // Convert tests to homepage card format - sadece aktif testleri göster
  const homepageData = useMemo(() => {
    
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://whowins.vote';

  // Schema.org JSON-LD
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "whowins",
    "url": `${baseUrl}/`,
    "inLanguage": locale,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={query}`,
      "query-input": "required name=query"
    },
    "publisher": {
      "@type": "Organization",
      "name": "whowins",
      "url": `${baseUrl}/`
    }
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
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
        
        {/* Home Page HTML Content */}
        {homePageHtmlContent && getText(homePageHtmlContent, locale) && (
          <div className="mt-12 max-w-6xl mx-auto px-2 lg:px-6">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: getText(homePageHtmlContent, locale) 
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
