'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { getSlugForLocale } from '@/lib/multiLanguageUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from '@/redux/actions/notificationActions';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Star, 
  Heart, 
  MessageCircle, 
  Users,
  Calendar,
  Clock,
  X,
  User
} from 'lucide-react';


const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'vote':
    case 'new_vote':
    case 'category_vote':
      return <Star className="w-5 h-5" />;
    case 'welcome':
      return <Users className="w-5 h-5" />;
    case 'usage_stats':
    case 'stats':
      return <Calendar className="w-5 h-5" />;
    case 'profile_update':
    case 'profile':
      return <User className="w-5 h-5" />;
    case 'system_maintenance':
    case 'maintenance':
      return <Bell className="w-5 h-5" />;
    case 'category':
      return <MessageCircle className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-100 text-blue-600';
    case 'green':
      return 'bg-green-100 text-green-600';
    case 'red':
      return 'bg-red-100 text-red-600';
    case 'purple':
      return 'bg-purple-100 text-purple-600';
    case 'orange':
      return 'bg-orange-100 text-orange-600';
    case 'gray':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function NotificationsPage() {
  const t = useTranslations('NotificationsPage');
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();
  const { notifications, stats, loading } = useSelector((state: any) => state.notification);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Load notifications on component mount
  useEffect(() => {
    dispatch(getNotifications({ page: 1, limit: 50 }) as any);
  }, [dispatch]);

  const filteredNotifications = notifications.filter((notification: any) => {
    if (filter === 'unread') {
      return !notification.isRead;
    }
    return true;
  });

  const unreadCount = stats?.unread || 0;

  // Helper function to get localized text from multi-language object
  const getLocalizedText = (textObj: any, fallback: string = '') => {
    if (!textObj || typeof textObj !== 'object') return fallback;
    
    // Try current locale first, then fallback to Turkish, then English, then any available
    return textObj[locale] || textObj.tr || textObj.en || textObj[Object.keys(textObj)[0]] || fallback;
  };

  // Get translated notification content based on type
  const getNotificationContent = (notification: any) => {
    const type = notification.type;
    const metadata = notification.metadata || {};
    
    switch (type) {
      case 'welcome':
        return {
          title: t('types.welcome.title'),
          message: t('types.welcome.message')
        };
      case 'profile_update':
        return {
          title: t('types.profileUpdate.title'),
          message: t('types.profileUpdate.message')
        };
      case 'new_vote':
        // Handle both string and multi-language category names
        let categoryName = metadata.categoryName;
        if (categoryName && typeof categoryName === 'object') {
          categoryName = getLocalizedText(categoryName, 'Kategori');
        } else if (!categoryName) {
          categoryName = notification.message?.match(/"([^"]+)"/)?.[1] || 'Kategori';
        }
        
        return {
          title: t('types.newVote.title'),
          message: t('types.newVote.message', { categoryName })
        };
      case 'test_voted':
        // Handle both string and multi-language test titles
        let testTitle = metadata.testTitle;
        if (testTitle && typeof testTitle === 'object') {
          testTitle = getLocalizedText(testTitle, 'Test');
        } else if (!testTitle) {
          testTitle = notification.message?.match(/"([^"]+)"/)?.[1] || 'Test';
        }
        
        return {
          title: t('types.testVoted.title'),
          message: t('types.testVoted.message', { testTitle })
        };
      case 'usage_stats':
        return {
          title: t('types.usageStats.title'),
          message: t('types.usageStats.message', { 
            voteCount: metadata.stats?.voteCount || 0,
            categoryCount: metadata.stats?.categoryCount || 0
          })
        };
      case 'system_maintenance':
        return {
          title: t('types.systemMaintenance.title'),
          message: notification.message || t('types.systemMaintenance.message')
        };
      default:
        return {
          title: notification.title,
          message: notification.message
        };
    }
  };

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id) as any);
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead() as any);
  };

  const handleDeleteNotification = (id: string) => {
    dispatch(deleteNotification(id) as any);
  };

  const handleNotificationClick = (notification: any) => {
    
    // Mark as read if not already read
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
    
    // Navigate to action URL if available
    let targetUrl = notification.actionUrl || '/';
    
    // Eğer actionUrl bozuk (encoded obje içeriyorsa) veya obje formatında ise, metadata'dan slug'ı al
    if (targetUrl.includes('%7B') || targetUrl.includes('{') || targetUrl.includes('tr:') || targetUrl.includes('en:')) {
      // URL'de obje var, metadata'dan slug'ı al
      let slug = notification.metadata?.testSlug || notification.metadata?.testId?.slug;
      
      // Eğer slug bir obje ise, locale'e göre doğru slug'ı al
      if (slug && typeof slug === 'object') {
        slug = getSlugForLocale(slug, locale as 'tr' | 'en' | 'de' | 'fr');
        targetUrl = `/${slug}`;
      } else if (slug && typeof slug === 'string') {
        targetUrl = `/${slug}`;
      } else {
        // Fallback: testId kullan
        const testId = notification.metadata?.testId?._id || notification.metadata?.testId;
        if (testId) {
          targetUrl = `/${testId}`;
        } else {
          targetUrl = '/';
        }
      }
    } else if (targetUrl.startsWith('/vote/')) {
      // Eğer actionUrl ID formatında ise (/vote/ID), slug formatına çevir
      const testId = targetUrl.replace('/vote/', '');
      // Metadata'dan slug'ı al (hem testSlug hem de testId.slug'ı kontrol et)
      let slug = notification.metadata?.testSlug || notification.metadata?.testId?.slug;
      
      // Eğer slug bir obje ise, locale'e göre doğru slug'ı al
      if (slug && typeof slug === 'object') {
        slug = getSlugForLocale(slug, locale as 'tr' | 'en' | 'de' | 'fr');
      }
      
      // Eğer testId populate edilmişse, slug'ı oradan al
      if (!slug && notification.metadata?.testId?.slug) {
        slug = notification.metadata.testId.slug;
        if (typeof slug === 'object') {
          slug = getSlugForLocale(slug, locale as 'tr' | 'en' | 'de' | 'fr');
        }
      }
      
      targetUrl = slug ? `/${slug}` : `/${testId}`;
    } else if (targetUrl.startsWith('/kategori/') || targetUrl.startsWith('/category/') || targetUrl.startsWith('/kategorie/') || targetUrl.startsWith('/categorie/')) {
      // Kategori URL'lerini dil bazlı olarak güncelle
      const categorySlug = targetUrl.replace(/^\/(kategori|category|kategorie|categorie)\//, '');
      const categoryPaths = {
        'tr': 'kategori',
        'en': 'category',
        'de': 'kategorie', 
        'fr': 'categorie'
      };
      const categoryPath = categoryPaths[locale as keyof typeof categoryPaths] || 'category';
      targetUrl = `/${categoryPath}/${categorySlug}`;
    } else if (targetUrl.startsWith('/')) {
      // Normal URL - eğer başında / varsa ve slug obje formatında değilse olduğu gibi kullan
      // Ama yine de metadata'dan slug kontrolü yap
      if (notification.metadata?.testSlug || notification.metadata?.testId?.slug) {
        let slug = notification.metadata?.testSlug || notification.metadata?.testId?.slug;
        if (slug && typeof slug === 'object') {
          slug = getSlugForLocale(slug, locale as 'tr' | 'en' | 'de' | 'fr');
          targetUrl = `/${slug}`;
        }
      }
    }
    
    // URL'yi temizle ve navigate et
    try {
      // URL'yi decode et ve temizle
      try {
        const decodedUrl = decodeURIComponent(targetUrl);
        if (decodedUrl !== targetUrl && !decodedUrl.includes('{') && !decodedUrl.includes('tr:')) {
          targetUrl = decodedUrl;
        }
      } catch (e) {
        // Decode başarısız olursa, orijinal URL'i kullan
      }
      
      router.push(targetUrl);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600 mt-2">
                {unreadCount > 0 
                  ? `${unreadCount} ${t('unreadCount')}`
                  : t('allRead')
                }
              </p>
            </div>
            {unreadCount > 0 && (
              <Button 
                onClick={handleMarkAllAsRead}
                variant="outline"
                className="flex items-center gap-2 cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                {t('markAllRead')}
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('all')} ({notifications?.length || 0})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                filter === 'unread'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('unread')} ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">{t('loading')}</p>
              </CardContent>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'unread' ? t('noUnreadNotifications') : t('noNotifications')}
                </h3>
                <p className="text-gray-600">
                  {filter === 'unread' 
                    ? t('allNotificationsRead')
                    : t('noNotificationsYet')
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification: any) => {
              const content = getNotificationContent(notification);
              return (
                <Card 
                  key={notification._id} 
                  className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                    !notification.isRead ? 'border-l-4 border-l-orange-500 bg-white' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-full ${getColorClasses(notification.color)}`}>
                        {getIcon(notification.icon)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {content.title}
                              </h3>
                              {!notification.isRead && (
                                <Badge className="bg-green-500 text-white text-xs hover:bg-green-500">
                                  {t('new')}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {content.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(notification.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
                                  day: 'numeric',
                                  month: 'long',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification._id);
                              }}
                              className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification._id);
                            }}
                            className="text-gray-500 hover:text-red-600 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
