'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { editProfile, deleteAccount, clearError, logout } from '@/redux/actions/userActions';
import { getUserVotedTests } from '@/redux/actions/testActions';
import { getActiveTestCategories } from '@/redux/actions/testCategoryActions';
import { getTestTitle, getTestDescription, getCategoryName, getOptionTitle, getCustomFieldValue } from '@/lib/multiLanguageUtils';
import ProfilePhotoUpload from '@/components/profile-photo-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function ProfilPage() {
  const t = useTranslations('ProfilePage');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading, error, isAuthenticated } = useSelector((state: any) => state.user);
  const { userVotedTests, userVotedTestsLoading, userVotedTestsError } = useSelector((state: any) => state.test);
  const { activeCategories } = useSelector((state: any) => state.testCategory);

  const [activeTab, setActiveTab] = useState('votes');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    surname: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });


  // Get category name by ID or from populated category object
  const getCategoryNameById = (category: any) => {
    // If category is already populated (has name property), use it directly
    if (category && typeof category === 'object' && category.name) {
      return getCategoryName(category);
    }
    // If category is just an ID string, find it in activeCategories
    if (typeof category === 'string') {
      const foundCategory = activeCategories?.find((cat: any) => cat._id === category);
      return foundCategory ? getCategoryName(foundCategory) : category;
    }
    return category || 'Kategori Yok';
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/giris');
      return;
    }

    if (user) {
      setProfileData({
        name: user.name || '',
        surname: user.surname || '',
        bio: user.profile?.bio || ''
      });
    }
  }, [user, isAuthenticated, router]);

  // Load categories when component mounts
  useEffect(() => {
    dispatch(getActiveTestCategories());
  }, [dispatch]);

  // Load voted tests when votes tab is active
  useEffect(() => {
    if (activeTab === 'votes' && isAuthenticated) {
      dispatch(getUserVotedTests());
    }
  }, [activeTab, isAuthenticated, dispatch]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!minLength) return t('passwordValidation.minLength');
    if (!hasUpperCase) return t('passwordValidation.hasUpperCase');
    if (!hasLowerCase) return t('passwordValidation.hasLowerCase');
    if (!hasNumbers) return t('passwordValidation.hasNumbers');
    return '';
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setProfileData({
      ...profileData,
      [name]: value
    });

    if (error) {
      dispatch(clearError());
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };


  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(editProfile(profileData));
      
      if (editProfile.fulfilled.match(result)) {
        toast.success(t('messages.profileUpdated'));
      } else {
        const errorMessage = (result.payload as string) || t('messages.profileUpdateError');
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(t('messages.profileUpdateError'));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('messages.passwordsNotMatch'));
      return;
    }

    const passwordErrorMsg = validatePassword(passwordData.newPassword);
    if (passwordErrorMsg) {
      toast.error(passwordErrorMsg);
      return;
    }

    if (!passwordData.currentPassword) {
      toast.error(t('messages.currentPasswordRequired'));
      return;
    }

    try {
      const result = await dispatch(editProfile({
        currentPassword: passwordData.currentPassword,
        password: passwordData.newPassword
      }));
      
      if (editProfile.fulfilled.match(result)) {
        toast.success(t('messages.passwordChanged'));
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        // Handle error from Redux
        const errorMessage = (result.payload as string) || t('messages.passwordChangeError');
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(t('messages.passwordChangeError'));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await dispatch(deleteAccount());
      
      if (deleteAccount.fulfilled.match(result)) {
        toast.success(t('messages.accountDeleted'));
        router.push('/');
      } else {
        const errorMessage = (result.payload as string) || t('messages.accountDeleteError');
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error(t('messages.accountDeleteError'));
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-6">
            <ProfilePhotoUpload 
              currentPhoto={user?.profile?.picture}
              userId={user?._id}
              onPhotoUpdate={(newPhotoUrl) => {
                // Photo update will be handled by Redux state
              }}
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.name} {user?.surname}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">{t('memberSince')}: {new Date(user?.createdAt).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'votes', name: t('votesUsed') },
                { id: 'profile', name: t('profileInfo') },
                { id: 'password', name: t('changePassword') }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">

            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      {t('firstName')}
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surname" className="text-sm font-medium text-gray-700">
                      {t('lastName')}
                    </Label>
                    <Input
                      type="text"
                      id="surname"
                      name="surname"
                      value={profileData.surname}
                      onChange={handleProfileChange}
                      className="w-full bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                    {t('bio')}
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    className="w-full bg-white"
                    placeholder={t('bioPlaceholder')}
                  />
                  <p className="text-sm text-gray-500">
                    {profileData.bio.length}/500 {t('characters')}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {loading ? t('updating') : t('update')}
                  </Button>
                </div>
              </form>
            )}

            {/* Password Change Tab */}
            {activeTab === 'password' && (
              <div>
                {!showPasswordForm ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">{t('changePasswordDesc')}</p>
                    <Button
                      onClick={() => setShowPasswordForm(true)}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {t('changePasswordBtn')}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                        {t('currentPassword')}
                      </Label>
                      <Input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                        {t('newPassword')}
                      </Label>
                      <Input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full bg-white"
                      />
                      {passwordData.newPassword && validatePassword(passwordData.newPassword) === '' && (
                        <p className="text-sm text-green-600">{t('passwordStrong')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        {t('confirmPassword')}
                      </Label>
                      <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full bg-white"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={loading || passwordData.newPassword !== passwordData.confirmPassword || validatePassword(passwordData.newPassword) !== ''}
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {loading ? t('changing') : t('changePasswordSubmit')}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        }}
                        size="sm"
                        variant="outline"
                      >
                        {t('cancel')}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Voted Tests Tab */}
            {activeTab === 'votes' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{t('votesUsed')}</h3>
                  <span className="text-sm text-gray-500">
                    {userVotedTests?.length || 0} {t('test')}
                  </span>
                </div>

                {userVotedTestsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  </div>
                ) : userVotedTestsError ? (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {userVotedTestsError}
                  </div>
                ) : userVotedTests && userVotedTests.length > 0 ? (
                  <div className="space-y-4">
                    {userVotedTests.map((votedTest: any) => (
                      <div key={votedTest._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        {/* Mobile Layout */}
                        <div className="block sm:hidden">
                          {/* Test Image - Full Width on Mobile */}
                          <div className="w-full mb-3">
                            {votedTest.test.coverImage ? (
                              <Image
                                src={votedTest.test.coverImage}
                                alt={getTestTitle(votedTest.test)}
                                width={200}
                                height={120}
                                className="w-full h-32 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-sm">{t('noImage')}</span>
                              </div>
                            )}
                          </div>

                          {/* Test Info */}
                          <div className="mb-3">
                            <h4 className="font-semibold text-gray-900 text-base mb-2">
                              {getTestTitle(votedTest.test)}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                              {getTestDescription(votedTest.test)}
                            </p>
                            
                            {/* Vote Details - Stacked on Mobile */}
                            <div className="space-y-1 text-xs text-gray-500 mb-3">
                              <div>{t('category')}: {votedTest.test.categories && votedTest.test.categories.length > 0 ? getCategoryNameById(votedTest.test.categories[0]) : 'Kategori Yok'}</div>
                              <div>{t('totalVotes')}: {votedTest.test.totalVotes}</div>
                              <div>{t('votedOn')}: {new Date(votedTest.votedAt).toLocaleDateString('tr-TR')}</div>
                            </div>
                          </div>

                          {/* Selected Option - Full Width on Mobile */}
                          {votedTest.selectedOption && (
                            <div className="mb-4 p-3 bg-white rounded-lg border">
                              <div className="text-sm font-medium text-gray-900 mb-2">
                                {t('selectedOption')}
                              </div>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={votedTest.selectedOption.image}
                                  alt={getOptionTitle(votedTest.selectedOption)}
                                  width={50}
                                  height={50}
                                  className="rounded object-cover flex-shrink-0"
                                />
                                <div className="text-sm text-gray-700 flex-1">
                                  <div className="font-medium">
                                    {getOptionTitle(votedTest.selectedOption)}
                                  </div>
                                  {votedTest.selectedOption.customFields && votedTest.selectedOption.customFields.length > 0 && (
                                    <div className="text-xs text-gray-500">
                                      {getCustomFieldValue(votedTest.selectedOption.customFields[0])}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Action Button - Full Width on Mobile */}
                          <Button
                            onClick={() => router.push(`/${votedTest.test.slug || votedTest.test._id}`)}
                            size="sm"
                            variant="outline"
                            className="w-full text-orange-600 border-orange-600 hover:bg-orange-50"
                          >
                            {t('viewTestAgain')}
                          </Button>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:block">
                          <div className="flex items-start gap-4">
                            {/* Test Image */}
                            <div className="flex-shrink-0">
                              {votedTest.test.coverImage ? (
                                <Image
                                  src={votedTest.test.coverImage}
                                  alt={getTestTitle(votedTest.test)}
                                  width={80}
                                  height={80}
                                  className="rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">{t('noImage')}</span>
                                </div>
                              )}
                            </div>

                            {/* Test Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {getTestTitle(votedTest.test)}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 overflow-hidden" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {getTestDescription(votedTest.test)}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>{t('category')}: {votedTest.test.categories && votedTest.test.categories.length > 0 ? getCategoryNameById(votedTest.test.categories[0]) : 'Kategori Yok'}</span>
                                <span>•</span>
                                <span>{t('totalVotes')}: {votedTest.test.totalVotes}</span>
                                <span>•</span>
                                <span>{t('votedOn')}: {new Date(votedTest.votedAt).toLocaleDateString('tr-TR')}</span>
                              </div>
                            </div>

                            {/* Selected Option */}
                            {votedTest.selectedOption && (
                              <div className="flex-shrink-0 text-right">
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                  {t('selectedOption')}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={votedTest.selectedOption.image}
                                    alt={getOptionTitle(votedTest.selectedOption)}
                                    width={40}
                                    height={40}
                                    className="rounded object-cover"
                                  />
                                  <div className="text-sm text-gray-700 max-w-32">
                                    <div className="font-medium truncate">
                                      {getOptionTitle(votedTest.selectedOption)}
                                    </div>
                                    {votedTest.selectedOption.customFields && votedTest.selectedOption.customFields.length > 0 && (
                                      <div className="text-xs text-gray-500 truncate">
                                        {getCustomFieldValue(votedTest.selectedOption.customFields[0])}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="mt-4 flex justify-end">
                            <Button
                              onClick={() => router.push(`/${votedTest.test.slug || votedTest.test._id}`)}
                              size="sm"
                              variant="outline"
                              className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            >
                              {t('viewTestAgain')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noVotedTests')}</h3>
                    <p className="text-gray-600 mb-4">
                      {t('noVotedTestsDesc')}
                    </p>
                    <Button
                      onClick={() => router.push('/')}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {t('browseTests')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-600">{t('deleteAccount')}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {t('deleteAccountDesc')}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {t('deleteMyAccount')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">{t('deleteConfirmTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('deleteConfirmDesc')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {t('yesDeleteAccount')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

        </div>
      </div>
    </div>
  );
}
