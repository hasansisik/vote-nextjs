'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getAllTests } from '@/redux/actions/userActions';

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
  
  const { allTests, testsLoading } = useAppSelector((state) => state.user);
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

  // Load tests
  useEffect(() => {
    dispatch(getAllTests({ isActive: true }));
  }, [dispatch]);

  // Test'i yükle
  useEffect(() => {
    if (allTests.length > 0) {
      const foundTest = allTests.find((t: any) => t._id === voteId);
      if (foundTest) {
        setTest(foundTest);
        initializeVoting(foundTest);
      }
    }
  }, [voteId, allTests]);

  // Test bittiğinde final rankings oluştur
  useEffect(() => {
    if (isComplete && test && finalWinner) {
      // Diğer katılımcıların tercihlerine göre yüzdelendirme yap
      // Bu örnekte mock data'daki winRate değerlerini kullanıyoruz
      // Gerçek uygulamada API'den diğer katılımcıların oyları gelecek
      
      const rankings = test.options.map(option => ({
        option,
        score: option.winRate // Mock data'daki winRate değerini kullan
      })).sort((a, b) => b.score - a.score);
      
      setFinalRankings(rankings);
    }
  }, [isComplete, test, finalWinner]);

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
        if (winner._id === nextOption._id && remainingOptions.length > 1) {
          // Aynı seçenek çıkarsa bir sonrakini al ve ikisini de kaldır
          const alternativeOption = remainingOptions[1];
          console.log(`Sonraki karşılaştırma: ${winner.title} vs ${alternativeOption.title} (aynı seçenek önlendi)`);
          setCurrentPair([winner, alternativeOption]);
          setRemainingOptions(prev => prev.slice(2));
        } else {
          console.log(`Sonraki karşılaştırma: ${winner.title} vs ${nextOption.title}`);
          setCurrentPair([winner, nextOption]);
          setRemainingOptions(prev => prev.slice(1));
        }
        setRound(prevRound => prevRound + 1);
      } else {
        // Tüm seçenekler tükendi - EN SON SEÇİLEN KAZANIR!
        console.log(`Final kazanan (en son seçilen): ${winner.title}! Test tamamlandı.`);
        setFinalWinner(winner); // En son seçilen seçeneği final kazanan olarak kaydet
        setIsComplete(true);
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
          <div className="text-center mb-8">
             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
               {test.category.toUpperCase()} SIRALAMASI
             </h1>
             <p className="text-lg text-gray-600 mb-2">{test.title}</p>
             <p className="text-base text-gray-500">{test.description}</p>
             
             {/* Final Kazanan */}
             {finalWinner && (
               <div className="mt-6 p-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl shadow-lg">
                 <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                   🏆 KAZANAN
                 </h2>
                 <p className="text-xl font-semibold text-white">
                   {finalWinner.title}
                 </p>
                 <p className="text-yellow-100 text-sm mt-1">
                   (En son seçilen seçenek)
                 </p>
               </div>
             )}
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
                    <div className={`relative ${index === 0 ? 'h-80' : 'h-64'}`}>
                      <Image
                        src={ranking.option.image}
                        alt={ranking.option.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className={`font-bold text-gray-900 mb-3 ${index === 0 ? 'text-3xl' : 'text-2xl'}`}>
                      {ranking.option.title}
                    </h3>
                    
                    {/* Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          {ranking.option._id === finalWinner?._id ? 'Kazanan (Sizin Seçiminiz)' : 'Diğer Katılımcıların Tercihi'}
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          {ranking.score.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            ranking.option._id === finalWinner?._id ? 'bg-green-500' :
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                          }`}
                          style={{ width: `${ranking.score}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Custom Fields */}
                    <div className="space-y-1 text-sm">
                      {ranking.option.customFields.slice(0, 3).map((field, idx) => (
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
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Diğer Sıralamalar</h2>
              <div className="space-y-3">
                {finalRankings.slice(3).map((ranking, index) => (
                  <div 
                    key={ranking.option._id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Position */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      ranking.option._id === finalWinner?._id ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                    }`}>
                      {ranking.option._id === finalWinner?._id ? '🏆' : index + 4}
                    </div>

                    {/* Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={ranking.option.image}
                        alt={ranking.option.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{ranking.option.title}</h4>
                      <p className="text-sm text-gray-600">
                        {ranking.option.customFields[0]?.fieldValue}
                      </p>
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xl font-bold text-blue-600">
                        {ranking.score.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {ranking.option._id === finalWinner?._id ? 'Kazanan (Sizin Seçiminiz)' : 'Diğer Katılımcıların Tercihi'}
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            ranking.option._id === finalWinner?._id ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${ranking.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => router.push('/logged-out')}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Ana Sayfaya Dön
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors font-medium"
            >
              Tekrar Oyla
            </button>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-8 p-6 bg-white rounded-2xl shadow-lg">
            <div 
              className="text-lg text-gray-700 font-medium"
              dangerouslySetInnerHTML={{ __html: test.footerText }}
            />
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
        <div className="max-w-7xl mx-auto px-4 py-4">
           <div className="flex items-center justify-between mb-2">
             <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase">
               {test.category}
             </h1>
            <button
              onClick={() => router.push('/logged-out')}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(round / totalRounds) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {round}/{totalRounds}
            </span>
          </div>
          
          <div className="text-center mt-3">
            <p className="text-gray-600 mb-2">{test.description}</p>
            <p className="text-gray-600 font-medium">{test.headerText}</p>
          </div>
        </div>
      </div>

      {/* Voting Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
              <div className="relative h-80 md:h-96">
                <Image
                  src={option.image}
                  alt={option.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {option.title}
                  </h3>
                  
                  {/* Custom Fields */}
                  <div className="space-y-1">
                    {option.customFields.slice(0, 4).map((field, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <span className="text-gray-300 font-medium">{field.fieldName}:</span>
                        <span className="ml-2 text-white">{field.fieldValue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white rounded-full p-4 shadow-xl">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
