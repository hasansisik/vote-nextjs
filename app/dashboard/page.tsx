'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getAllTests,
  deleteTest,
  resetTestVotes,
} from '@/redux/actions/testActions';
import {
  getActiveTestCategories,
} from '@/redux/actions/testCategoryActions';
import { 
  Plus, 
  Edit, 
  Trash2, 
  RotateCcw, 
  Eye, 
  Loader2, 
  BarChart3, 
  Users, 
  Calendar, 
  TrendingUp,
  Settings,
  Menu,
  Globe,
  Shield,
  Activity,
  Clock,
  Star,
  Target,
  Zap,
  Database,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getTestTitle, getCategoryName } from '@/lib/multiLanguageUtils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, allUsers, usersLoading } = useSelector((state: any) => state.user);
  const { allTests, testsLoading, testsError } = useSelector((state: any) => state.test);
  const { activeCategories } = useSelector((state: any) => state.testCategory);

  // Real data states
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTests: 0,
    totalVotes: 0,
    systemUptime: '0%',
    lastBackup: 'Bilinmiyor'
  });

  const [recentActivity, setRecentActivity] = useState<Array<{
    id: number;
    type: string;
    user?: string;
    test?: string;
    message?: string;
    time: string;
    status: string;
  }>>([]);

  useEffect(() => {
    // Her zaman getAllTests tetikle - tüm testleri getir
    dispatch(getAllTests({}) as any);
    dispatch(getActiveTestCategories() as any);
  }, [dispatch, user]);

  // Update system stats when data changes
  useEffect(() => {
    if (allTests) {
      const totalVotes = allTests.reduce((sum: number, test: any) => sum + (test.totalVotes || 0), 0);
      const activeTests = allTests.filter((test: any) => test.isActive).length;
      
      // Calculate user stats
      const totalUsers = allUsers?.length || 0;
      const activeUsers = allUsers?.filter((u: any) => u.status === 'active').length || 0;
      
      setSystemStats(prev => ({
        ...prev,
        totalUsers: totalUsers,
        activeUsers: activeUsers,
        totalTests: allTests.length,
        totalVotes: totalVotes,
        systemUptime: '99.9%', // This would come from a real API
        lastBackup: '2 saat önce' // This would come from a real API
      }));

      // Generate recent activity from real test data
      const activities = allTests.slice(0, 4).map((test: any, index: number) => ({
        id: index + 1,
        type: 'test_created',
        user: test.createdBy?.name || 'Bilinmeyen Kullanıcı',
        test: getTestTitle(test),
        time: new Date(test.createdAt).toLocaleString('tr-TR', { 
          day: 'numeric', 
          month: 'short', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: 'success'
      }));
      
      setRecentActivity(activities);
    }
  }, [allTests, allUsers]);

  const handleDeleteTest = async (testId: string) => {
    if (confirm("Bu testi silmek istediğinizden emin misiniz?")) {
      await dispatch(deleteTest(testId) as any);
      dispatch(getAllTests({}) as any);
    }
  };

  const handleResetVotes = async (testId: string) => {
    if (confirm("Bu testin oylarını sıfırlamak istediğinizden emin misiniz?")) {
      await dispatch(resetTestVotes(testId) as any);
      dispatch(getAllTests({}) as any);
    }
  };

  const getCategoryColor = (categorySlug: string) => {
    if (!categorySlug) return 'bg-gray-100 text-gray-800';
    if (!activeCategories || activeCategories.length === 0) return 'bg-gray-100 text-gray-800';
    const category = activeCategories.find((cat: any) => cat.slug === categorySlug);
    if (category && category.color) {
      return `${category.color.replace('bg-', 'bg-').replace('-500', '-100')} ${category.color.replace('bg-', 'text-').replace('-500', '-800')}`;
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getCategoryNameBySlug = (categorySlug: string) => {
    if (!categorySlug) return 'Kategori Yok';
    if (!activeCategories || activeCategories.length === 0) return 'Kategori Yükleniyor...';
    const category = activeCategories.find((cat: any) => cat.slug === categorySlug);
    return getCategoryName(category) || categorySlug || 'Kategori Yok';
  };

  const getCategoryNameById = (categoryId: string) => {
    if (!categoryId) return 'Kategori Yok';
    if (!activeCategories || activeCategories.length === 0) return 'Kategori Yükleniyor...';
    const category = activeCategories.find((cat: any) => cat._id === categoryId);
    if (category && category.name) {
      // Handle multilingual name structure - return Turkish name directly
      if (typeof category.name === 'object' && category.name.tr) {
        return category.name.tr;
      }
      return category.name || categoryId;
    }
    return categoryId || 'Kategori Yok';
  };

  const handleViewTest = (testId: string) => {
    router.push(`/dashboard/votes/${testId}`);
  };

  const handleEditTest = (testId: string) => {
    router.push(`/dashboard/votes?edit=${testId}`);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'test_created': return <Plus className="h-4 w-4" />;
      case 'user_registered': return <Users className="h-4 w-4" />;
      case 'test_completed': return <CheckCircle className="h-4 w-4" />;
      case 'system_alert': return <AlertCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Calculate statistics
  const testsData = allTests;
  const totalTests = testsData?.length || 0;
  const totalVotes = testsData?.reduce((sum: number, test: any) => sum + (test.totalVotes || 0), 0) || 0;
  const activeTests = testsData?.filter((test: any) => test.isActive).length || 0;
  const avgVotesPerTest = totalTests > 0 ? Math.round(totalVotes / totalTests) : 0;
  const userEngagement = systemStats.totalUsers > 0 ? Math.round((systemStats.activeUsers / systemStats.totalUsers) * 100) : 0;

  if (testsLoading && testsData?.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Sistem yönetimi ve istatistikler
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>Admin Yetkisi</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Son güncelleme: {new Date().toLocaleString('tr-TR')}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push('/dashboard/settings')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Ayarlar
          </Button>
          <Button
            onClick={() => router.push('/dashboard/votes')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Yeni Oylama
          </Button>
        </div>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-3xl font-bold text-blue-600">{systemStats.totalUsers.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-gray-500">Toplam kullanıcı</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                <p className="text-3xl font-bold text-green-600">{systemStats.activeUsers.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300" 
                      style={{ width: `${userEngagement}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{userEngagement}%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Tests */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Test</p>
                <p className="text-3xl font-bold text-purple-600">{totalTests}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-gray-500">Oluşturulan testler</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Votes */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Oy</p>
                <p className="text-3xl font-bold text-orange-600">{totalVotes.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-gray-500">Toplam oy sayısı</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tests - 2/3 width */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Son Testler
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/dashboard/votes')}
                >
                  Tümünü Gör
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {testsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Yükleniyor...</span>
                  </div>
                </div>
              ) : testsError ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <p className="text-red-600">{testsError}</p>
                    <Button 
                      variant="outline" 
                      onClick={() => dispatch(getAllTests({}) as any)}
                      className="mt-2"
                    >
                      Tekrar Dene
                    </Button>
                  </div>
                </div>
              ) : testsData?.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz test yok</h3>
                  <p className="text-gray-500 mb-4">İlk testinizi oluşturmak için aşağıdaki butona tıklayın.</p>
                  <Button onClick={() => router.push('/dashboard/votes')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Test Oluştur
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {testsData?.slice(0, 4).map((test: any) => (
                    <div key={test._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(test.categories?.[0] || '').split(' ')[0]}`}></div>
                          <div>
                            <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                              {getTestTitle(test)}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{getCategoryNameById(test.categories?.[0])}</span>
                              <span>•</span>
                              <span>{test.totalVotes || 0} oy</span>
                              <span>•</span>
                              <Badge 
                                variant={test.isActive ? "default" : "secondary"}
                                className={test.isActive ? "bg-green-100 text-green-800" : ""}
                              >
                                {test.isActive ? 'Aktif' : 'Pasif'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTest(test._id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTest(test._id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResetVotes(test._id)}
                          disabled={testsLoading}
                        >
                          {testsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTest(test._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity - 1/3 width */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Son Aktiviteler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'test_created' && `${activity.user} yeni test oluşturdu`}
                        {activity.type === 'user_registered' && `${activity.user} kayıt oldu`}
                        {activity.type === 'test_completed' && `${activity.user} testi tamamladı`}
                        {activity.type === 'system_alert' && activity.message}
                      </p>
                      {activity.test && (
                        <p className="text-sm text-gray-600 truncate">{activity.test}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Hızlı İşlemler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => router.push('/dashboard/votes')}
            >
              <Plus className="h-6 w-6" />
              <span>Yeni Test</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => router.push('/dashboard/users')}
            >
              <Users className="h-6 w-6" />
              <span>Kullanıcılar</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => router.push('/dashboard/settings')}
            >
              <Settings className="h-6 w-6" />
              <span>Sistem Ayarları</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => router.push('/dashboard/menus')}
            >
              <Menu className="h-6 w-6" />
              <span>Menü Yönetimi</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}