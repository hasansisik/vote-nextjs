'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useAppDispatch } from '@/redux/hook';
import { editProfile } from '@/redux/actions/userActions';
import { Button } from '@/components/ui/button';
import { Camera, X, Check, XCircle } from 'lucide-react';

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
    <div className="flex items-center space-x-4">
      {/* Photo Display */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
          {displayPhoto ? (
            <Image
              src={displayPhoto}
              alt="Profil fotoğrafı"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Upload indicator */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        {!previewUrl ? (
          // Upload/Change Button
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            {currentPhoto ? 'Değiştir' : 'Yükle'}
          </Button>
        ) : (
          // Preview Actions
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isUploading}
              size="sm"
              variant="outline"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Remove Button */}
        {currentPhoto && !previewUrl && (
          <Button
            onClick={handleRemove}
            disabled={isUploading}
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-xs max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}
