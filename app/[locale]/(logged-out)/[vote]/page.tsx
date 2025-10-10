'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getAllTests, voteOnTest, getTestResults, getSingleTestBySlug, voteOnTestBySlug, getTestResultsBySlug, getUserVotedTests } from '@/redux/actions/testActions';
import { getActiveTestCategories } from '@/redux/actions/testCategoryActions';
import { Skeleton } from '@/components/ui/skeleton';
import { getTestTitle, getTestDescription, getCategoryName, getOptionTitle, getCustomFieldName, getCustomFieldValue, getText } from '@/lib/multiLanguageUtils';
// Utility functions for slug/ID detection
const isObjectId = (str: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(str);
};

const isSlug = (str: string): boolean => {
  return /^[a-z0-9-]+$/.test(str);
};

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
  const t = useTranslations('VotePage');
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const voteId = params?.vote as string;
  
  const { allTests, testsLoading, testResults, userVotedTests, userVotedTestsLoading } = useAppSelector((state) => state.test);
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
  const [votingInitialized, setVotingInitialized] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [userVotedOption, setUserVotedOption] = useState<Option | null>(null);

  // Get category name by ID
  const getCategoryNameById = (categoryId: string) => {
    const category = activeCategories?.find((cat: any) => cat._id === categoryId);
    return category ? getCategoryName(category) : categoryId;
  };



  // Load tests and categories
  useEffect(() => {
    dispatch(getAllTests({ isActive: true }));
    dispatch(getActiveTestCategories());
  }, [dispatch]);

  // Kullanıcının oy verdiği testleri yükle - sadece bir kez
  useEffect(() => {
    dispatch(getUserVotedTests());
  }, [dispatch]);

  // Test'i yükle - slug veya ID ile
  useEffect(() => {
    if (voteId && !test) {
      // Voting initialized state'ini sıfırla
      setVotingInitialized(false);
      
      // Eğer slug formatındaysa direkt slug ile yükle
      if (isSlug(voteId)) {
        dispatch(getSingleTestBySlug(voteId)).unwrap()
          .then((result) => {
            if (result.test) {
              setTest(result.test);
              initializeVoting(result.test);
            }
          })
          .catch((error) => {
            console.error('Test yükleme hatası:', error);
          });
      } 
      // Eğer ObjectId formatındaysa eski yöntemle yükle
      else if (isObjectId(voteId)) {
        if (allTests.length > 0) {
          const foundTest = allTests.find((t: any) => t._id === voteId);
          if (foundTest) {
            setTest(foundTest);
            initializeVoting(foundTest);
          }
        }
      }
    }
  }, [voteId, allTests, dispatch]);

  // Test results değiştiğinde final rankings oluştur
  useEffect(() => {
    if (testResults && testResults.results && showResults) {
      const rankings = testResults.results.map((result: any) => ({
        option: {
          _id: result._id,
          title: result.title,
          image: result.image,
          customFields: result.customFields,
          votes: result.votes,
          winRate: result.winRate
        },
        score: result.percentage || result.winRate
      }));
      
      setFinalRankings(rankings);
    }
  }, [testResults, showResults]);

  // Kullanıcının bu teste oy verip vermediğini kontrol et
  useEffect(() => {
    if (test && userVotedTests && userVotedTests.length > 0 && !hasUserVoted) {
      const currentTestId = test._id;
      const votedTest = userVotedTests.find((votedTest: any) => 
        votedTest.test._id === currentTestId
      );
      
      if (votedTest && votedTest.selectedOption) {
        // Kullanıcı bu teste daha önce oy vermiş
        setHasUserVoted(true);
        
        // Seçilen seçeneği bul
        const selectedOption = test.options.find(option => 
          option._id === votedTest.selectedOption._id
        );
        
        if (selectedOption) {
          setUserVotedOption(selectedOption);
          setFinalWinner(selectedOption);
          setIsComplete(true);
          setShowResults(true);
          
          // Test results'ı da yükle
          if (isSlug(voteId)) {
            dispatch(getTestResultsBySlug(voteId));
          } else {
            dispatch(getTestResults(voteId));
          }
        }
      }
    }
  }, [test, userVotedTests, hasUserVoted, voteId, dispatch]);

  // Fallback: Eğer API'den veri gelmezse, test options'ından basit ranking oluştur
  useEffect(() => {
    if (showResults && finalRankings.length === 0 && test && finalWinner) {
      // Basit fallback ranking oluştur
      const fallbackRankings = test.options.map((option, index) => ({
        option: {
          _id: option._id,
          title: option.title,
          image: option.image,
          customFields: option.customFields,
          votes: option.votes || 0,
          winRate: option.winRate || 0
        },
        score: option._id === finalWinner._id ? 100 : Math.max(10, 100 - (index * 15))
      }));
      
      setFinalRankings(fallbackRankings);
    }
  }, [showResults, finalRankings.length, test, finalWinner]);

  // Oylama sistemini başlat
  const initializeVoting = (testData: Test) => {
    // Eğer zaten initialize edilmişse veya kullanıcı daha önce oy vermişse tekrar etme
    if (votingInitialized || hasUserVoted) {
      return;
    }
    
    
    // Başlangıç skorları - her seçenek için 0 puan
    const initialScores: {[key: string]: number} = {};
    testData.options.forEach(option => {
      initialScores[option._id] = 0;
    });
    setOptionScores(initialScores);
    
    // Test mantığı: Sabit bir oylama sistemi
    // Her karşılaştırmada bir seçenek kazanır ve diğeri elenir
    // 10 seçenek = 9 karşılaştırma sonunda 1 kazanan kalır
    
    // Test ID'sine göre sabit sıralama (her test için aynı sıra)
    const shuffled = [...testData.options].sort((a, b) => {
      // Test ID'sinin son karakterlerini kullanarak sabit bir sıralama yap
      const testIdHash = testData._id.slice(-4);
      const aHash = a._id.slice(-4);
      const bHash = b._id.slice(-4);
      return (testIdHash + aHash).localeCompare(testIdHash + bHash);
    });
    
    // İlk karşılaştırma
    setCurrentPair([shuffled[0], shuffled[1]]);
    // Geriye kalan seçenekler (henüz görülmeyenler)
    setRemainingOptions(shuffled.slice(2));
    
    // Toplam karşılaştırma sayısı (10 seçenekte 9 karşılaştırma)
    setTotalRounds(testData.options.length - 1);
    setRound(1); // İlk round
    setWinners([]); // Kazananlar listesi temizle
    setIsComplete(false);
    setFinalRankings([]); // Final rankings'i temizle
    setShowResults(false); // Results gösterimini sıfırla
    setVotingInitialized(true); // Initialize edildi olarak işaretle
    
  };

  // Seçim yapıldığında
  const handleVote = (winner: Option) => {
    setSelectedOption(winner._id);
    
    setTimeout(() => {

      // Eğer hala kullanılacak seçenekler varsa
      if (remainingOptions.length > 0) {
        // Sonraki seçeneği al ve karşılaştır
        const nextOption = remainingOptions[0];
        
        // Aynı seçeneklerin gelmemesini kontrol et
        if (winner._id === nextOption._id) {
          // Aynı seçenek çıkarsa, farklı bir seçenek bul
          const differentOption = remainingOptions.find(opt => opt._id !== winner._id);
          if (differentOption) {
            // Seçilen seçeneğin konumunu koru - winner'ın pozisyonunu kontrol et
            const winnerIndex = currentPair?.findIndex(opt => opt._id === winner._id) ?? 0;
            setCurrentPair(winnerIndex === 0 ? [winner, differentOption] : [differentOption, winner]);
            setRemainingOptions(prev => prev.filter(opt => opt._id !== differentOption._id));
          } else {
            // Eğer farklı seçenek yoksa, sadece kazananı al
            // Seçilen seçeneğin konumunu koru
            const winnerIndex = currentPair?.findIndex(opt => opt._id === winner._id) ?? 0;
            setCurrentPair(winnerIndex === 0 ? [winner, nextOption] : [nextOption, winner]);
            setRemainingOptions(prev => prev.slice(1));
          }
        } else {
          // Seçilen seçeneğin konumunu koru
          const winnerIndex = currentPair?.findIndex(opt => opt._id === winner._id) ?? 0;
          setCurrentPair(winnerIndex === 0 ? [winner, nextOption] : [nextOption, winner]);
          setRemainingOptions(prev => prev.slice(1));
        }
        setRound(prevRound => prevRound + 1);
      } else {
        // Tüm seçenekler tükendi - EN SON SEÇİLEN KAZANIR!
        setFinalWinner(winner);
        setIsComplete(true);
        
        // Önce results'ı göster, sonra vote'u gönder
        setShowResults(true);
        
        // Vote'u backend'e gönder - slug veya ID ile
        if (isSlug(voteId)) {
          dispatch(voteOnTestBySlug({ slug: voteId, optionId: winner._id })).unwrap().then((result) => {
            // Vote başarılı olduktan sonra test results'ı yenile
            dispatch(getTestResultsBySlug(voteId));
          }).catch((error) => {
            console.error('Vote error:', error);
          });
        } else {
          dispatch(voteOnTest({ testId: voteId, optionId: winner._id })).unwrap().then((result) => {
            // Vote başarılı olduktan sonra test results'ı yenile
            dispatch(getTestResults(voteId));
          }).catch((error) => {
            console.error('Vote error:', error);
          });
        }
      }
      
      setSelectedOption(null);
    }, 500);
  };

  // Eğer kullanıcı daha önce oy vermişse, test results yüklenene kadar basit loading göster
  if (hasUserVoted && !test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Test yükleniyor...</p>
        </div>
      </div>
    );
  } else if (testsLoading || userVotedTestsLoading || !test || (!currentPair && !hasUserVoted)) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
            
            {/* Progress Bar Skeleton */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
              <Skeleton className="h-4 w-8" />
            </div>
            
            <div className="text-center">
              <Skeleton className="h-3 w-64 mx-auto mb-1" />
              <Skeleton className="h-3 w-48 mx-auto" />
            </div>
          </div>
        </div>

        {/* Voting Cards Skeleton */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Left Card Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <Skeleton className="h-64 md:h-80 w-full" />
            </div>
            
            {/* Right Card Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <Skeleton className="h-64 md:h-80 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Final ekranı - Yüzdesel Sıralama
  if ((isComplete && showResults) || hasUserVoted) {
    // Eğer final rankings henüz yüklenmediyse ve kullanıcı daha önce oy vermişse fallback göster
    if (finalRankings.length === 0 && hasUserVoted && test && finalWinner) {
      // Fallback ranking oluştur
      const fallbackRankings = test.options.map((option, index) => ({
        option: {
          _id: option._id,
          title: option.title,
          image: option.image,
          customFields: option.customFields,
          votes: option.votes || 0,
          winRate: option.winRate || 0
        },
        score: option._id === finalWinner._id ? 100 : Math.max(10, 100 - (index * 15))
      }));
      
      setFinalRankings(fallbackRankings);
    }
    
    // Eğer hala final rankings yoksa skeleton göster
    if (finalRankings.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50 p-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <Skeleton className="h-8 w-96 mx-auto mb-2" />
              <Skeleton className="h-6 w-64 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>

            {/* Podium Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end">
              {[1, 2, 3].map((index) => (
                <div key={index} className={`${index === 1 ? 'md:order-2' : index === 2 ? 'md:order-1' : 'md:order-3'}`}>
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="relative">
                      <div className="absolute top-4 left-4 z-10">
                        <Skeleton className="w-12 h-12 rounded-full" />
                      </div>
                      <Skeleton className={`${index === 1 ? 'h-48' : 'h-40'} w-full`} />
                    </div>
                    <div className="p-4">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-24 mb-3" />
                      <Skeleton className="h-2 w-full mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Other Rankings Skeleton */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                    <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <Skeleton className="h-6 w-12 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 p-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
             <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
               {t('finalRankingsTitle', { category: getCategoryNameById(test.category).toUpperCase() })}
             </h1>
             <p className="text-base text-gray-600 mb-2">{getTestTitle(test)}</p>
             <p className="text-sm text-gray-500">{getTestDescription(test)}</p>
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
                        alt={getOptionTitle(ranking.option)}
                        fill
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className={`font-bold text-gray-900 mb-2 ${index === 0 ? 'text-xl' : 'text-lg'}`}>
                      {getOptionTitle(ranking.option)}
                    </h3>
                    
                    {/* Score */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">
                          {ranking.option._id === finalWinner?._id ? t('yourChoice') : t('otherParticipantsChoice')}
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
                          <span className="text-gray-600">{getCustomFieldName(field)}:</span>
                          <span className="font-medium text-gray-900">{getCustomFieldValue(field)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Share Buttons Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">{t('shareResults')}</h2>
            
            {/* Social Media Buttons - Mobile Responsive */}
            <div className="space-y-3 sm:space-y-0">
              {/* First 4 buttons in 2x2 grid on mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                <button 
                  onClick={() => {
                    const shareText = `${getTestTitle(test)} ${t('shareResultsText')}!\n\n${t('yourChoice')}: ${finalWinner ? getOptionTitle(finalWinner) : ''}\n\n${t('rankings')}:\n${finalRankings.slice(0, 5).map((ranking, index) => 
                      `${index + 1}. ${getOptionTitle(ranking.option)} - %${ranking.score.toFixed(1)}`
                    ).join('\n')}\n\n#${t('voting')} #${getCategoryNameById(test.category)}`;
                    const shareUrl = window.location.href;
                    const encodedText = encodeURIComponent(shareText);
                    const encodedUrl = encodeURIComponent(shareUrl);
                    const url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="h-12 bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-1 sm:gap-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="hidden sm:inline">Twitter</span>
                </button>
                
                <button 
                  onClick={() => {
                    const shareText = `${getTestTitle(test)} ${t('shareResultsText')}!\n\n${t('yourChoice')}: ${finalWinner ? getOptionTitle(finalWinner) : ''}\n\n${t('rankings')}:\n${finalRankings.slice(0, 5).map((ranking, index) => 
                      `${index + 1}. ${getOptionTitle(ranking.option)} - %${ranking.score.toFixed(1)}`
                    ).join('\n')}\n\n#${t('voting')} #${getCategoryNameById(test.category)}`;
                    const shareUrl = window.location.href;
                    const encodedText = encodeURIComponent(shareText);
                    const encodedUrl = encodeURIComponent(shareUrl);
                    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="h-12 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1 sm:gap-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="hidden sm:inline">Facebook</span>
                </button>
                
                <button 
                  onClick={() => {
                    const shareText = `${getTestTitle(test)} ${t('shareResultsText')}!\n\n${t('yourChoice')}: ${finalWinner ? getOptionTitle(finalWinner) : ''}\n\n${t('rankings')}:\n${finalRankings.slice(0, 5).map((ranking, index) => 
                      `${index + 1}. ${getOptionTitle(ranking.option)} - %${ranking.score.toFixed(1)}`
                    ).join('\n')}\n\n#${t('voting')} #${getCategoryNameById(test.category)}`;
                    const shareUrl = window.location.href;
                    const encodedText = encodeURIComponent(shareText);
                    const encodedUrl = encodeURIComponent(shareUrl);
                    const url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="h-12 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-1 sm:gap-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
                
                <button 
                  onClick={() => {
                    const shareText = `${getTestTitle(test)} ${t('shareResultsText')}!\n\n${t('yourChoice')}: ${finalWinner ? getOptionTitle(finalWinner) : ''}\n\n${t('rankings')}:\n${finalRankings.slice(0, 5).map((ranking, index) => 
                      `${index + 1}. ${getOptionTitle(ranking.option)} - %${ranking.score.toFixed(1)}`
                    ).join('\n')}\n\n#${t('voting')} #${getCategoryNameById(test.category)}`;
                    const shareUrl = window.location.href;
                    const encodedText = encodeURIComponent(shareText);
                    const encodedUrl = encodeURIComponent(shareUrl);
                    const url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="h-12 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-1 sm:gap-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="hidden sm:inline">Telegram</span>
                </button>
              </div>
              
              {/* Copy Link Button - Full width on mobile, normal grid on desktop */}
              <button 
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    // You can add a toast notification here if needed
                  } catch (error) {
                    console.error('Failed to copy link:', error);
                  }
                }}
                className="w-full sm:w-auto h-12 bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center gap-1 sm:gap-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="hidden sm:inline">{t('copyLink')}</span>
              </button>
            </div>
          </div>

          {/* Rest of Rankings */}
          {finalRankings.length > 3 && (
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t('otherRankings')}</h2>
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
                        alt={getOptionTitle(ranking.option)}
                        fill
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate text-sm">{getOptionTitle(ranking.option)}</h4>
                      <p className="text-xs text-gray-600">
                        {ranking.option.customFields[0] ? getCustomFieldValue(ranking.option.customFields[0]) : ''}
                      </p>
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-lg font-bold text-orange-600">
                        {ranking.score.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {ranking.option._id === finalWinner?._id ? t('yourChoice') : t('otherParticipantsChoice')}
                      </div>
                     
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              {t('backToHome')}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Eğer kullanıcı daha önce oy vermişse, oylama ekranını gösterme
  if (hasUserVoted) {
    return null; // Bu durumda yukarıdaki sonuç ekranı gösterilecek
  }

  // Oylama ekranı
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
           <div className="flex items-center justify-between mb-3">
             <h1 className="text-base md:text-lg font-bold text-gray-900">
               {getTestTitle(test)}
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
            <p className="text-xs text-gray-600 mb-1">{getTestDescription(test)}</p>
            <p className="text-xs text-gray-500">{getTestTitle(test)}</p>
          </div>
        </div>
      </div>

        {/* Voting Cards */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {currentPair?.map((option) => (
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
                  alt={getOptionTitle(option)}
                  fill
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                    {getOptionTitle(option)}
                  </h3>
                  
                  {/* Custom Fields */}
                  <div className="space-y-1">
                    {option.customFields.slice(0, 3).map((field, idx) => (
                      <div key={idx} className="flex items-center text-xs">
                        <span className="text-gray-300 font-medium">{getCustomFieldName(field)}:</span>
                        <span className="ml-2 text-white">{getCustomFieldValue(field)}</span>
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
        {test.footerText && getText(test.footerText, 'tr') && (
          <div className="mt-8 text-center">
            {(() => {
              const footerText = getText(test.footerText, 'tr');
              // HTML tag kontrolü
              const hasHtmlTags = /<[^>]*>/g.test(footerText);
              
              if (hasHtmlTags) {
                return (
                  <div 
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: footerText }}
                  />
                );
              } else {
                return (
                  <div className="text-gray-600">
                    {footerText}
                  </div>
                );
              }
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
