'use client';
import { UploadCloud, FileIcon, XIcon, AlertCircle, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { useDropzone, type DropzoneOptions, type FileRejection } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SingleFileUploaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'> {
  value: File | string;
  onValueChange?: (file: File | null) => void;
  dropzoneOptions?: DropzoneOptions;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
}

export function SingleFileUploader({
  value,
  onValueChange,
  dropzoneOptions,
  maxSize = 1024 * 1024 * 5, // Default 5MB
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
  },
  className,
  ...props
}: SingleFileUploaderProps) {
  const [file, setFile] = useState<File | string>(value);
  const [progress, setProgress] = useState<number>(100); // Default to 100% for existing images
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Synchronize internal state with external controlled value
  useEffect(() => {
    setFile(value);

    if (!value) {
      setPreviewUrl(null);
      setProgress(0);
      setError(null);
    } else if (typeof value === 'string') {
      // Handle string URL passed as default value (e.g. from existing category)
      setPreviewUrl(value);
      setProgress(100);
      setError(null);
    } else if (value instanceof File && value.type.startsWith('image/')) {
      // Handle newly selected File object
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  const simulateUpload = useCallback(() => {
    setProgress(0);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 20) + 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }
      setProgress(currentProgress);
    }, 150);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejectionError = rejectedFiles[0]?.errors[0]?.message || 'Invalid file';
        setError(rejectionError);
        return;
      }

      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      setFile(selectedFile);
      onValueChange?.(selectedFile);

      // Setup preview if image
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }

      // Simulate upload progress for new files
      simulateUpload();
    },
    [onValueChange, simulateUpload]
  );

  const removeFile = () => {
    if (previewUrl && file instanceof File) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(value || '');
    setPreviewUrl(null);
    setProgress(0);
    setError(null);
    onValueChange?.(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    maxSize,
    accept,
    ...dropzoneOptions
  });

  // Determine if current item is an image
  const isImage = Boolean(
    previewUrl ||
      (typeof file === 'string' && file.length > 0) ||
      (file instanceof File && file.type.startsWith('image/'))
  );

  // Helper to resolve display name
  const getFileName = () => {
    if (file instanceof File) return file.name;
    if (typeof file === 'string' && file) {
      return file.split('/').pop() || 'Existing Image';
    }
    return 'Uploaded File';
  };

  return (
    <div className={cn('w-full space-y-3', className)} {...props}>
      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            'text-muted-foreground bg-background hover:bg-muted/50 border-muted-foreground/20 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-colors duration-200 ease-in-out',
            isDragActive && 'border-primary bg-muted/50 text-foreground',
            error && 'border-destructive/50 bg-destructive/5'
          )}
        >
          <input {...getInputProps()} />
          <div
            className={cn(
              'bg-muted mb-2 rounded-full p-2.5',
              error && 'bg-destructive/10 text-destructive'
            )}
          >
            {error ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <UploadCloud className="text-muted-foreground h-5 w-5" />
            )}
          </div>
          <p className="text-center text-xs font-medium">
            <span className="text-primary font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-muted-foreground mt-0.5 text-[11px]">
            Max size: {Math.round(maxSize / (1024 * 1024))}MB
          </p>
          {error && <p className="text-destructive mt-1.5 text-xs font-medium">{error}</p>}
        </div>
      ) : (
        <div className="bg-background border-muted relative flex items-center justify-between rounded-xl border p-2 shadow-sm">
          <div className="flex h-28 min-w-0 items-center space-x-3">
            {/* Image Thumbnail or File Icon */}
            {isImage && previewUrl ? (
              <div className="bg-muted h-12 w-12 shrink-0 overflow-hidden rounded-lg border">
                <Image
                  src={previewUrl}
                  alt={getFileName()}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-muted shrink-0 rounded-lg p-2.5">
                {isImage ? (
                  <ImageIcon className="text-muted-foreground h-5 w-5" />
                ) : (
                  <FileIcon className="text-muted-foreground h-5 w-5" />
                )}
              </div>
            )}

            {/* File Info */}
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-xs font-medium">{getFileName()}</p>
              {file instanceof File && (
                <p className="text-muted-foreground text-[11px]">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive h-7 w-7 shrink-0"
            onClick={removeFile}
          >
            <XIcon className="h-4 w-4" />
          </Button>

          {/* Upload Progress Bar (Only visible while simulating new file upload) */}
          {progress < 100 && (
            <div className="absolute inset-x-0 -bottom-1 px-1">
              <Progress value={progress} className="h-1 w-full" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
