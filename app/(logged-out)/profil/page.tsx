'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { editProfile, deleteAccount, clearError } from '@/redux/actions/userActions';
import ProfilePhotoUpload from '@/components/profile-photo-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ProfilPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading, error, isAuthenticated } = useSelector((state: any) => state.user);

  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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

  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!minLength) return 'Şifre en az 8 karakter olmalıdır';
    if (!hasUpperCase) return 'Şifre en az bir büyük harf içermelidir';
    if (!hasLowerCase) return 'Şifre en az bir küçük harf içermelidir';
    if (!hasNumbers) return 'Şifre en az bir rakam içermelidir';
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

    if (name === 'newPassword') {
      const passwordErrorMsg = validatePassword(value);
      setPasswordError(passwordErrorMsg);
    }
  };


  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(editProfile(profileData));
      setSuccessMessage('Profil başarıyla güncellendi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor');
      return;
    }

    const passwordErrorMsg = validatePassword(passwordData.newPassword);
    if (passwordErrorMsg) {
      setPasswordError(passwordErrorMsg);
      return;
    }

    try {
      await dispatch(editProfile({
        currentPassword: passwordData.currentPassword,
        password: passwordData.newPassword
      }));
      setSuccessMessage('Şifre başarıyla değiştirildi!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteAccount());
      router.push('/');
    } catch (error) {
      console.error('Delete account error:', error);
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
              <p className="text-sm text-gray-500">Üye olma tarihi: {new Date(user?.createdAt).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'profile', name: 'Profil Bilgileri' },
                { id: 'password', name: 'Şifre Değiştir' },
                { id: 'votes', name: 'Oyladığım Testler' }
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
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm mb-4">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
                {typeof error === 'string' ? error : error.message}
              </div>
            )}

            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Ad
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
                      Soyad
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
                    Biyografi
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    className="w-full bg-white"
                    placeholder="Kendiniz hakkında bir şeyler yazın..."
                  />
                  <p className="text-sm text-gray-500">
                    {profileData.bio.length}/500 karakter
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {loading ? 'Güncelleniyor...' : 'Güncelle'}
                  </Button>
                </div>
              </form>
            )}

            {/* Password Change Tab */}
            {activeTab === 'password' && (
              <div>
                {!showPasswordForm ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Şifrenizi değiştirmek için aşağıdaki butona tıklayın</p>
                    <Button
                      onClick={() => setShowPasswordForm(true)}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Şifre Değiştir
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                        Mevcut Şifre
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
                        Yeni Şifre
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
                      {passwordError && (
                        <p className="text-sm text-red-600">{passwordError}</p>
                      )}
                      {!passwordError && passwordData.newPassword && (
                        <p className="text-sm text-green-600">Şifre güçlü</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Yeni Şifre Tekrar
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
                        disabled={loading || passwordError !== '' || passwordData.newPassword !== passwordData.confirmPassword}
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          setPasswordError('');
                        }}
                        size="sm"
                        variant="outline"
                      >
                        İptal
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Voted Tests Tab */}
            {activeTab === 'votes' && (
              <div>
                <p className="text-gray-600 text-center py-8">
                  Oyladığınız testler burada görünecek. Henüz oy verdiğiniz test bulunmuyor.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-600">Hesabı Sil</h3>
              <p className="text-sm text-gray-500 mt-1">
                Hesabınızı kalıcı olarak silmek istiyorsanız bu seçeneği kullanın.
              </p>
            </div>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hesabımı Sil
            </Button>
          </div>

          {showDeleteConfirm && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 mb-4">
                Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleDeleteAccount}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Evet, Hesabımı Sil
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  size="sm"
                  variant="outline"
                >
                  İptal
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
