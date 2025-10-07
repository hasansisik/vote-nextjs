'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useAppDispatch } from '@/redux/hook';
import { editProfile } from '@/redux/actions/userActions';
import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';
import ImageCropper from '@/components/ImageCropper';

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
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

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
    
    // Create URL for cropping
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImageUrl(imageUrl);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = async (croppedImageUrl: string) => {
    setIsUploading(true);
    setError('');

    try {
      // Convert cropped image to base64
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64String = e.target?.result as string;
          
          // Upload to server
          const result = await dispatch(editProfile({ 
            picture: base64String 
          }));

          if (editProfile.fulfilled.match(result)) {
            // Reset file input
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
      
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Fotoğraf yüklenirken bir hata oluştu.');
      setIsUploading(false);
    }
  };

  const handleCropperClose = () => {
    setShowCropper(false);
    setSelectedImageUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        {/* Photo Display */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
            {currentPhoto ? (
              <Image
                src={currentPhoto}
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
          
          {/* Edit Button - Bottom Right Corner */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-600 hover:bg-orange-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-50"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          
          {/* Upload indicator */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
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

      {/* Image Cropper Modal */}
      {selectedImageUrl && (
        <ImageCropper
          isOpen={showCropper}
          onClose={handleCropperClose}
          onCrop={handleCrop}
          imageUrl={selectedImageUrl}
          aspectRatio={1}
        />
      )}
    </>
  );
}
