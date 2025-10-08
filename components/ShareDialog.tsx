'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getOptionTitle, getCustomFieldValue } from '@/lib/multiLanguageUtils';

interface Option {
  _id: string;
  title: string | { tr: string; en?: string; de?: string; fr?: string; };
  image: string;
  customFields: Array<{ 
    fieldName: string | { tr: string; en?: string; de?: string; fr?: string; };
    fieldValue: string | { tr: string; en?: string; de?: string; fr?: string; };
  }>;
  votes: number;
  winRate: number;
}

interface ShareDialogProps {
  testTitle: string;
  testDescription: string;
  categoryName: string;
  finalRankings: Array<{ option: Option; score: number }>;
  finalWinner: Option | null;
  children: React.ReactNode;
}

export default function ShareDialog({
  testTitle,
  testDescription,
  categoryName,
  finalRankings,
  finalWinner,
  children
}: ShareDialogProps) {
  const t = useTranslations('ShareDialog');
  const [isOpen, setIsOpen] = useState(false);

  const shareText = `${testTitle} ${t('shareResultsText')}!\n\n${t('yourChoice')}: ${finalWinner ? getOptionTitle(finalWinner) : ''}\n\n${t('rankings')}:\n${finalRankings.slice(0, 5).map((ranking, index) => 
    `${index + 1}. ${getOptionTitle(ranking.option)} - %${ranking.score.toFixed(1)}`
  ).join('\n')}\n\n#${t('voting')} #${categoryName}`;

  const shareUrl = window.location.href;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${testTitle} - ${t('votingResults')}`,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success(t('resultsCopied'));
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error(t('copyFailed'));
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(t('linkCopied'));
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error(t('linkCopyFailed'));
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let url = '';
    let platformName = '';
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        platformName = 'Twitter';
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        platformName = 'Facebook';
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        platformName = 'WhatsApp';
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        platformName = 'Telegram';
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      toast.success(t('shareWindowOpened', { platform: platformName }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-hidden p-0">
        {/* Modern Header with Gradient */}
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white p-3">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{t('votingResult')}</h2>
            </div>
            
            {/* Test Info with Image */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                {/* Test Image */}
                {finalWinner && (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                    <Image
                      src={finalWinner.image}
                      alt={getOptionTitle(finalWinner)}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{testTitle}</h3>
                  <p className="text-orange-100 text-sm mt-1">{testDescription}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                      {categoryName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="p-4 space-y-2">
            
            {/* Winner Card - Modern Design */}
            {finalWinner && (
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-orange-800 ">{t('yourChoice')}</h4>
                    <p className="text-md font-semibold text-orange-900">{getOptionTitle(finalWinner)}</p>
                    <p className="text-sm text-orange-700">{t('congratulations')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Rankings - Modern Cards */}
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                {t('rankings')}
              </h4>
              
              <div className="grid gap-2">
                {finalRankings.slice(0, 3).map((ranking, index) => (
                  <div key={ranking.option._id} className="group bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' : 
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' : 
                        'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                        <Image
                          src={ranking.option.image}
                          alt={getOptionTitle(ranking.option)}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-900 text-lg">{getOptionTitle(ranking.option)}</h5>
                        <p className="text-sm text-gray-600">
                          {ranking.option.customFields[0] ? getCustomFieldValue(ranking.option.customFields[0]) : ''}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-bold text-orange-600">
                          %{ranking.score.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">{t('voteRate')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Options - Combined */}
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                {t('shareAndCopy')}
              </h4>
              
              {/* Primary Share Button */}
              <div className="mb-4">
                <Button 
                  onClick={handleNativeShare}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  {t('shareResults')}
                </Button>
              </div>

              {/* Social Media Buttons */}
              <div className="grid grid-cols-5 gap-2">
                <Button 
                  onClick={() => shareToSocial('twitter')}
                  className="h-10 bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-1 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-xs"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Twitter
                </Button>
                <Button 
                  onClick={() => shareToSocial('facebook')}
                  className="h-10 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-xs"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
                <Button 
                  onClick={() => shareToSocial('whatsapp')}
                  className="h-10 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-1 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-xs"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  WhatsApp
                </Button>
                <Button 
                  onClick={() => shareToSocial('telegram')}
                  className="h-10 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-1 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-xs"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Telegram
                </Button>
                <Button 
                  onClick={copyLink}
                  className="h-10 bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center gap-1 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-xs"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {t('copyLink')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
