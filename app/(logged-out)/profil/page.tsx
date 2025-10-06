'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { editProfile, deleteAccount, clearError } from '@/redux/actions/userActions';
import ProfilePhotoUpload from '@/components/profile-photo-upload';

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
    <div className="min-h-screen bg-gray-50 py-8">
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
                      ? 'border-red-500 text-red-600'
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
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Ad
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                      Soyad
                    </label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      value={profileData.surname}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>


                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Biyografi
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Kendiniz hakkında bir şeyler yazın..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {profileData.bio.length}/500 karakter
                  </p>
                </div>


                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Güncelleniyor...' : 'Güncelle'}
                  </button>
                </div>
              </form>
            )}

            {/* Password Change Tab */}
            {activeTab === 'password' && (
              <div>
                {!showPasswordForm ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Şifrenizi değiştirmek için aşağıdaki butona tıklayın</p>
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
                    >
                      Şifre Değiştir
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Mevcut Şifre
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        Yeni Şifre
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                      {passwordError && (
                        <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                      )}
                      {!passwordError && passwordData.newPassword && (
                        <p className="mt-1 text-sm text-green-600">Şifre güçlü</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Yeni Şifre Tekrar
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading || passwordError !== '' || passwordData.newPassword !== passwordData.confirmPassword}
                        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          setPasswordError('');
                        }}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                      >
                        İptal
                      </button>
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
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-900">Hesabı Sil</h3>
              <p className="text-sm text-red-700 mt-1">
                Hesabınızı kalıcı olarak silmek istiyorsanız bu seçeneği kullanın.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Hesabımı Sil
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 mb-4">
                Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Evet, Hesabımı Sil
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  İptal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
