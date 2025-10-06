'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useAppDispatch } from '@/redux/hook';
import { editProfile } from '@/redux/actions/userActions';

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  userId?: string;
  onPhotoUpdate?: (newPhotoUrl: string) => void;
}

export default function ProfilePhotoUpload({ 
  currentPhoto, 
  userId, 
  onPhotoUpdate 
}: ProfilePhotoUploadProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    setError('');
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      // Convert file to base64 for upload
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64String = e.target?.result as string;
          
          // Upload to server
          const result = await dispatch(editProfile({ 
            picture: base64String 
          }));

          if (editProfile.fulfilled.match(result)) {
            // Clear preview and reset file input
            setPreviewUrl(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            
            // Call callback if provided
            if (onPhotoUpdate && result.payload?.user?.profile?.picture) {
              onPhotoUpdate(result.payload.user.profile.picture);
            }
          } else {
            setError('Fotoğraf yüklenirken bir hata oluştu.');
          }
        } catch (error) {
          console.error('Upload error:', error);
          setError('Fotoğraf yüklenirken bir hata oluştu.');
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Fotoğraf yüklenirken bir hata oluştu.');
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);
    setError('');

    try {
      const result = await dispatch(editProfile({ 
        picture: '' // Empty string to remove photo
      }));

      if (editProfile.fulfilled.match(result)) {
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        if (onPhotoUpdate) {
          onPhotoUpdate('');
        }
      } else {
        setError('Fotoğraf kaldırılırken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Remove error:', error);
      setError('Fotoğraf kaldırılırken bir hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayPhoto = previewUrl || currentPhoto;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Photo Display */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
          {displayPhoto ? (
            <Image
              src={displayPhoto}
              alt="Profil fotoğrafı"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Upload indicator */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm text-center max-w-xs">
          {error}
        </div>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2 w-full max-w-xs">
        {!previewUrl ? (
          // Upload Button
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {currentPhoto ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}
          </button>
        ) : (
          // Preview Actions
          <>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isUploading ? 'Yükleniyor...' : 'Kaydet'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              İptal
            </button>
          </>
        )}

        {/* Remove Button */}
        {currentPhoto && !previewUrl && (
          <button
            onClick={handleRemove}
            disabled={isUploading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isUploading ? 'Kaldırılıyor...' : 'Fotoğrafı Kaldır'}
          </button>
        )}
      </div>

      {/* File Info */}
      <div className="text-xs text-gray-500 text-center max-w-xs">
        Desteklenen formatlar: JPG, PNG, GIF<br />
        Maksimum dosya boyutu: 5MB
      </div>
    </div>
  );
}
