'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getAllTests, voteOnTest, getTestResults } from '@/redux/actions/userActions';
import { getActiveTestCategories } from '@/redux/actions/testCategoryActions';

interface CustomField {
  fieldName: string;
  fieldValue: string;
}

interface Option {
  _id: string;
  title: string;
  image: string;
  customFields: CustomField[];
  votes: number;
  winRate: number;
}

interface Test {
  _id: string;
  title: string;
  description: string;
  headerText: string;
  footerText: string;
  category: string;
  options: Option[];
  totalVotes: number;
  isActive: boolean;
  createdAt: string;
}

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const voteId = params?.vote as string;
  
  const { allTests, testsLoading, testResults } = useAppSelector((state) => state.user);
  const { activeCategories } = useAppSelector((state) => state.testCategory);
  const [test, setTest] = useState<Test | null>(null);
  const [currentPair, setCurrentPair] = useState<[Option, Option] | null>(null);
  const [remainingOptions, setRemainingOptions] = useState<Option[]>([]);
  const [winners, setWinners] = useState<Option[]>([]);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [optionScores, setOptionScores] = useState<{[key: string]: number}>({});
  const [finalRankings, setFinalRankings] = useState<Array<{option: Option, score: number}>>([]);
  const [finalWinner, setFinalWinner] = useState<Option | null>(null);

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = activeCategories?.find((cat: any) => cat._id === categoryId);
    return category ? category.name : categoryId;
  };

  // Load tests and categories
  useEffect(() => {
    dispatch(getAllTests({ isActive: true }));
    dispatch(getActiveTestCategories());
  }, [dispatch]);

  // Test'i yükle
  useEffect(() => {
    if (allTests.length > 0 && voteId) {
      const foundTest = allTests.find((t: any) => t._id === voteId);
      if (foundTest && !test) { // Sadece test yoksa yükle
        setTest(foundTest);
        initializeVoting(foundTest);
      }
    }
  }, [voteId, allTests, test]);

  // Test bittiğinde final rankings oluştur
  useEffect(() => {
    if (isComplete && test && finalWinner) {
      // Test results'ı getir
      dispatch(getTestResults(voteId));
    }
  }, [isComplete, test, finalWinner, voteId, dispatch]);

  // Test results değiştiğinde final rankings oluştur
  useEffect(() => {
    if (testResults && testResults.results) {
      console.log('Test results alındı:', testResults);
      const rankings = testResults.results.map((result: any) => ({
        option: {
          _id: result._id,
          title: result.title,
          image: result.image,
          customFields: result.customFields,
          votes: result.votes,
          winRate: result.winRate
        },
        score: result.percentage || result.winRate // Yüzde değerini kullan
      }));
      
      setFinalRankings(rankings);
    } else if (isComplete && test && finalWinner) {
      // Eğer test results henüz gelmediyse, test options'ından ranking oluştur
      const rankings = test.options.map((option: any) => ({
        option: {
          _id: option._id,
          title: option.title,
          image: option.image,
          customFields: option.customFields,
          votes: option.votes,
          winRate: option.winRate
        },
        score: option.winRate || 0
      })).sort((a: any, b: any) => b.score - a.score);
      
      setFinalRankings(rankings);
    }
  }, [testResults, isComplete, test, finalWinner]);

  // Oylama sistemini başlat
  const initializeVoting = (testData: Test) => {
    console.log(`Film testi başlatılıyor: ${testData.options.length} seçenek ile`);
    
    // Başlangıç skorları - her seçenek için 0 puan
    const initialScores: {[key: string]: number} = {};
    testData.options.forEach(option => {
      initialScores[option._id] = 0;
    });
    setOptionScores(initialScores);
    
    // Test mantığı: Sabit bir oylama sistemi
    // Her karşılaştırmada bir seçenek kazanır ve diğeri elenir
    // 10 seçenek = 9 karşılaştırma sonunda 1 kazanan kalır
    
    const shuffled = [...testData.options].sort(() => Math.random() - 0.5);
    console.log('Karıştırılmış seçenekler:', shuffled.map(s => s.title));
    
    // İlk karşılaştırma
    setCurrentPair([shuffled[0], shuffled[1]]);
    // Geriye kalan seçenekler (henüz görülmeyenler)
    setRemainingOptions(shuffled.slice(2));
    
    // Toplam karşılaştırma sayısı (10 seçenekte 9 karşılaştırma)
    setTotalRounds(testData.options.length - 1);
    setRound(1); // İlk round
    setWinners([]); // Kazananlar listesi temizle
    setIsComplete(false);
    
    console.log(`Başlangıç çifti: ${shuffled[0].title} vs ${shuffled[1].title}`);
    console.log(`Toplam ${testData.options.length - 1} karşılaştırma olacak`);
  };

  // Seçim yapıldığında
  const handleVote = (winner: Option) => {
    setSelectedOption(winner._id);
    
    setTimeout(() => {
      console.log(`Round ${round}: ${winner.title} seçildi. Remaining: ${remainingOptions.length}`);

      // Eğer hala kullanılacak seçenekler varsa
      if (remainingOptions.length > 0) {
        // Sonraki seçeneği al ve karşılaştır
        const nextOption = remainingOptions[0];
        
        // Aynı seçeneklerin gelmemesini kontrol et
        if (winner._id === nextOption._id) {
          // Aynı seçenek çıkarsa, farklı bir seçenek bul
          const differentOption = remainingOptions.find(opt => opt._id !== winner._id);
          if (differentOption) {
            console.log(`Sonraki karşılaştırma: ${winner.title} vs ${differentOption.title} (aynı seçenek önlendi)`);
            // Seçilen seçeneğin konumunu koru - winner'ın pozisyonunu kontrol et
            const winnerIndex = currentPair?.findIndex(opt => opt._id === winner._id) ?? 0;
            setCurrentPair(winnerIndex === 0 ? [winner, differentOption] : [differentOption, winner]);
            setRemainingOptions(prev => prev.filter(opt => opt._id !== differentOption._id));
          } else {
            // Eğer farklı seçenek yoksa, sadece kazananı al
            console.log(`Sonraki karşılaştırma: ${winner.title} vs ${nextOption.title}`);
            // Seçilen seçeneğin konumunu koru
            const winnerIndex = currentPair?.findIndex(opt => opt._id === winner._id) ?? 0;
            setCurrentPair(winnerIndex === 0 ? [winner, nextOption] : [nextOption, winner]);
            setRemainingOptions(prev => prev.slice(1));
          }
        } else {
          console.log(`Sonraki karşılaştırma: ${winner.title} vs ${nextOption.title}`);
          // Seçilen seçeneğin konumunu koru
          const winnerIndex = currentPair?.findIndex(opt => opt._id === winner._id) ?? 0;
          setCurrentPair(winnerIndex === 0 ? [winner, nextOption] : [nextOption, winner]);
          setRemainingOptions(prev => prev.slice(1));
        }
        setRound(prevRound => prevRound + 1);
      } else {
        // Tüm seçenekler tükendi - EN SON SEÇİLEN KAZANIR!
        console.log(`Final kazanan (en son seçilen): ${winner.title}! Test tamamlandı.`);
        setFinalWinner(winner); // En son seçilen seçeneği final kazanan olarak kaydet
        setIsComplete(true);
        
        // Vote'u backend'e gönder
        console.log('Vote gönderiliyor:', { testId: voteId, optionId: winner._id });
        
        dispatch(voteOnTest({
          testId: voteId,
          optionId: winner._id
        })).unwrap().then((result) => {
          console.log('Vote başarılı!', result);
          // Vote başarılı olduktan sonra test results'ı yenile
          dispatch(getTestResults(voteId));
        }).catch((error) => {
          console.error('Vote hatası:', error);
        });
      }
      
      setSelectedOption(null);
    }, 500);
  };

  if (testsLoading || !test || !currentPair) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Final ekranı - Yüzdesel Sıralama
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
             <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
               {getCategoryName(test.category).toUpperCase()} SIRALAMASI
             </h1>
             <p className="text-base text-gray-600 mb-2">{test.title}</p>
             <p className="text-sm text-gray-500">{test.description}</p>
             
             
          </div>

          {/* Podium - Top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end">
            {finalRankings.slice(0, 3).map((ranking, index) => (
              <div 
                key={ranking.option._id}
                className={`${index === 0 ? 'md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
              >
                <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform ${
                  ranking.option._id === finalWinner?._id ? 'scale-100 shadow-2xl ring-4 ring-green-500 ring-opacity-50' :
                  index === 0 ? 'scale-100 shadow-2xl ring-4 ring-yellow-400 ring-opacity-50' : 
                  index === 1 ? 'scale-99' : 'scale-95'
                }`}>
                  {/* Medal/Position */}
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                        ranking.option._id === finalWinner?._id ? 'bg-green-500' :
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    {/* Trophy for winner - top right */}
                    {ranking.option._id === finalWinner?._id && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🏆</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Image */}
                    <div className={`relative ${index === 0 ? 'h-48' : 'h-40'}`}>
                      <Image
                        src={ranking.option.image}
                        alt={ranking.option.title}
                        fill
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className={`font-bold text-gray-900 mb-2 ${index === 0 ? 'text-xl' : 'text-lg'}`}>
                      {ranking.option.title}
                    </h3>
                    
                    {/* Score */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">
                          {ranking.option._id === finalWinner?._id ? 'Kazanan (Sizin Seçiminiz)' : 'Diğer Katılımcıların Tercihi'}
                        </span>
                        <span className="text-lg font-bold text-orange-600">
                          {ranking.score.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            ranking.option._id === finalWinner?._id ? 'bg-green-500' :
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                          }`}
                          style={{ width: `${Math.min(ranking.score, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Custom Fields */}
                    <div className="space-y-1 text-xs">
                      {ranking.option.customFields.slice(0, 2).map((field, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-gray-600">{field.fieldName}:</span>
                          <span className="font-medium text-gray-900">{field.fieldValue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rest of Rankings */}
          {finalRankings.length > 3 && (
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Diğer Sıralamalar</h2>
              <div className="space-y-2">
                {finalRankings.slice(3).map((ranking, index) => (
                  <div 
                    key={ranking.option._id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Position */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      ranking.option._id === finalWinner?._id ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                    }`}>
                      {ranking.option._id === finalWinner?._id ? '🏆' : index + 4}
                    </div>

                    {/* Image */}
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={ranking.option.image}
                        alt={ranking.option.title}
                        fill
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate text-sm">{ranking.option.title}</h4>
                      <p className="text-xs text-gray-600">
                        {ranking.option.customFields[0]?.fieldValue}
                      </p>
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-lg font-bold text-orange-600">
                        {ranking.score.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {ranking.option._id === finalWinner?._id ? 'Kazanan (Sizin Seçiminiz)' : 'Diğer Katılımcıların Tercihi'}
                      </div>
                     
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Ana Sayfaya Dön
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Oylama ekranı
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
           <div className="flex items-center justify-between mb-3">
             <h1 className="text-base md:text-lg font-bold text-gray-900">
               {test.title}
             </h1>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${(round / totalRounds) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-600">
              {round}/{totalRounds}
            </span>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">{test.description}</p>
            <p className="text-xs text-gray-500">{test.headerText}</p>
          </div>
        </div>
      </div>

        {/* Voting Cards */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {currentPair.map((option) => (
            <button
              key={option._id}
              onClick={() => handleVote(option)}
              disabled={selectedOption !== null}
              className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                selectedOption === option._id ? 'ring-4 ring-green-500' : ''
              } ${selectedOption && selectedOption !== option._id ? 'opacity-50' : ''}`}
            >
              {/* Image */}
              <div className="relative h-64 md:h-80">
                <Image
                  src={option.image}
                  alt={option.title}
                  fill
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                    {option.title}
                  </h3>
                  
                  {/* Custom Fields */}
                  <div className="space-y-1">
                    {option.customFields.slice(0, 3).map((field, idx) => (
                      <div key={idx} className="flex items-center text-xs">
                        <span className="text-gray-300 font-medium">{field.fieldName}:</span>
                        <span className="ml-2 text-white">{field.fieldValue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white rounded-full p-4 shadow-xl">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Selected Indicator */}
              {selectedOption === option._id && (
                <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-center">
          <div 
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: test.footerText }}
          />
        </div>
      </div>
    </div>
  );
}
