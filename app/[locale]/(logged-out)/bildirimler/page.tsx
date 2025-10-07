'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id) as any);
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead() as any);
  };

  const handleDeleteNotification = (id: string) => {
    dispatch(deleteNotification(id) as any);
  };

  return (
    <div className="min-h-screen bg-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bildirimler</h1>
              <p className="text-gray-600 mt-2">
                {unreadCount > 0 
                  ? `${unreadCount} okunmamış bildiriminiz var`
                  : 'Tüm bildirimleriniz okundu'
                }
              </p>
            </div>
            {unreadCount > 0 && (
              <Button 
                onClick={handleMarkAllAsRead}
                variant="outline"
                className="flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Tümünü Okundu İşaretle
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tümü ({notifications?.length || 0})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Okunmamış ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Bildirimler yükleniyor...</p>
              </CardContent>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'unread' ? 'Okunmamış bildirim yok' : 'Bildirim yok'}
                </h3>
                <p className="text-gray-600">
                  {filter === 'unread' 
                    ? 'Tüm bildirimleriniz okunmuş durumda.'
                    : 'Henüz hiç bildiriminiz yok.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification: any) => (
              <Card 
                key={notification._id} 
                className={`transition-all duration-200 hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-orange-500 bg-white' : ''
                }`}
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
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <Badge className="bg-green-500 text-white text-xs hover:bg-green-500">
                                Yeni
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(notification.createdAt).toLocaleDateString('tr-TR', {
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
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteNotification(notification._id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
