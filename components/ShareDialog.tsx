'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Option {
  _id: string;
  title: string;
  image: string;
  customFields: Array<{ fieldName: string; fieldValue: string }>;
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
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = async () => {
    const shareText = `🎯 ${testTitle} oylama sonuçları!\n\n🏆 Kazanan: ${finalWinner?.title}\n\n📊 Sıralama:\n${finalRankings.slice(0, 5).map((ranking, index) => 
      `${index + 1}. ${ranking.option.title} - %${ranking.score.toFixed(1)}`
    ).join('\n')}\n\n#Oylama #${categoryName}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${testTitle} - Oylama Sonuçları`,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Sonuçlar panoya kopyalandı!');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  const copyResults = async () => {
    const shareText = `🎯 ${testTitle} oylama sonuçları!\n\n🏆 Kazanan: ${finalWinner?.title}\n\n📊 Sıralama:\n${finalRankings.slice(0, 5).map((ranking, index) => 
      `${index + 1}. ${ranking.option.title} - %${ranking.score.toFixed(1)}`
    ).join('\n')}\n\n#Oylama #${categoryName}`;

    try {
      await navigator.clipboard.writeText(shareText);
      alert('Sonuçlar panoya kopyalandı!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            🎯 Oylama Sonuçlarını Paylaş
          </DialogTitle>
          <DialogDescription className="text-center">
            {testTitle} - {categoryName} kategorisi sonuçları
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Test Info */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-lg text-gray-900 mb-2">{testTitle}</h3>
            <p className="text-sm text-gray-600">{testDescription}</p>
            <p className="text-xs text-gray-500 mt-1">Kategori: {categoryName}</p>
          </div>

          {/* Winner Highlight */}
          {finalWinner && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <h4 className="font-bold text-green-800">Kazanan</h4>
                  <p className="text-green-700">{finalWinner.title}</p>
                </div>
              </div>
            </div>
          )}

          {/* Top 3 Results */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900">🏅 İlk 3 Sıralama</h4>
            {finalRankings.slice(0, 3).map((ranking, index) => (
              <div key={ranking.option._id} className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500 text-white' : 
                  index === 1 ? 'bg-gray-400 text-white' : 
                  'bg-orange-600 text-white'
                }`}>
                  {index + 1}
                </div>
                
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={ranking.option.image}
                    alt={ranking.option.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-gray-900 truncate">{ranking.option.title}</h5>
                  <p className="text-sm text-gray-600">
                    {ranking.option.customFields[0]?.fieldValue}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600">
                    %{ranking.score.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Share Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              onClick={handleShare}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              📱 Paylaş
            </Button>
            <Button 
              onClick={copyResults}
              variant="outline"
              className="flex-1"
            >
              📋 Kopyala
            </Button>
          </div>

          {/* Share Preview */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Paylaşım Önizlemesi:</h5>
            <div className="text-xs text-gray-600 whitespace-pre-line bg-white p-2 rounded border">
              {`🎯 ${testTitle} oylama sonuçları!

🏆 Kazanan: ${finalWinner?.title}

📊 Sıralama:
${finalRankings.slice(0, 5).map((ranking, index) => 
  `${index + 1}. ${ranking.option.title} - %${ranking.score.toFixed(1)}`
).join('\n')}

#Oylama #${categoryName}`}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
