import React from 'react';
import { termsData } from '@/data/termsData';

interface KullanimSartlariPageProps {
  params: Promise<{ locale: string }>;
}

export default async function KullanimSartlariPage({ params }: KullanimSartlariPageProps) {
  const { locale } = await params;
  
  // Get the HTML content based on locale, default to Turkish if locale not found
  const htmlContent = termsData[locale as keyof typeof termsData] || termsData.tr;

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
