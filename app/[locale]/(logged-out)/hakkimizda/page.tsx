import React from 'react';
import { aboutData } from '@/data/aboutData';

interface HakkimizdaPageProps {
  params: Promise<{ locale: string }>;
}

export default async function HakkimizdaPage({ params }: HakkimizdaPageProps) {
  const { locale } = await params;
  
  // Get the HTML content based on locale, default to Turkish if locale not found
  const htmlContent = aboutData[locale as keyof typeof aboutData] || aboutData.tr;

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
