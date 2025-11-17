import React from 'react';
import { privacyData } from '@/data/privacyData';

interface GizlilikPolitikasiPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GizlilikPolitikasiPage({ params }: GizlilikPolitikasiPageProps) {
  const { locale } = await params;
  
  // Get the HTML content based on locale, default to Turkish if locale not found
  const htmlContent = privacyData[locale as keyof typeof privacyData] || privacyData.tr;

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
