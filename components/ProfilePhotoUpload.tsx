'use client';

import { IconCamera } from '@tabler/icons-react';
import React, { useRef, useState, useEffect } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';

interface ProfilePhotoUploadProps {
  user: User;
  onFileSelect?: (file: File | null) => void;
  maxSize?: number; // default 5MB in bytes
}

export function ProfilePhotoUpload({
  user,
  onFileSelect,
  maxSize = 1024 * 1024 * 5
}: ProfilePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.avatar || null);
  const [error, setError] = useState<string | null>(null);

  // Sync preview if initial user avatar changes
  useEffect(() => {
    if (user?.avatar && !selectedFile) {
      setPreviewUrl(user.avatar);
    }
  }, [user?.avatar, selectedFile]);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    // Validate image type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate size limit
    if (file.size > maxSize) {
      setError(`File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB`);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onFileSelect?.(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="group relative">
        <Avatar className="border-background h-20 w-20 border-2 shadow-md">
          <AvatarImage
            src={previewUrl || user?.avatar}
            alt={user?.name?.split(' ')[0] || 'User Avatar'}
          />
          <AvatarFallback className="text-xl font-bold">
            {user?.name?.split(' ')[0] ? user.name.split(' ')[0].slice(0, 2).toUpperCase() : 'AD'}
          </AvatarFallback>
        </Avatar>

        {/* Hidden HTML File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Enabled Trigger Button */}
        <button
          type="button"
          onClick={handleButtonClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary absolute right-0 bottom-0 rounded-full p-1.5 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:outline-none"
          title="Change Avatar"
        >
          <IconCamera className="h-4 w-4" />
        </button>
      </div>

      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
    </div>
  );
}
