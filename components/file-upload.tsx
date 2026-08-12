'use client';

import { UploadCloud, FileIcon, XIcon, AlertCircle, ImageIcon } from 'lucide-react';
import * as React from 'react';
import { useDropzone, type DropzoneOptions, type FileRejection } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SingleFileUploaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'> {
  value?: File | null;
  onValueChange?: (file: File | null) => void;
  dropzoneOptions?: DropzoneOptions;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
}

export function SingleFileUploader({
  value = null,
  onValueChange,
  dropzoneOptions,
  maxSize = 1024 * 1024 * 5, // Default 5MB
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
  },
  className,
  ...props
}: SingleFileUploaderProps) {
  const [file, setFile] = React.useState<File | null>(value);
  const [progress, setProgress] = React.useState<number>(0);
  const [error, setError] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  // Synchronize internal state with external controlled value
  React.useEffect(() => {
    setFile(value);
    if (!value) {
      setPreviewUrl(null);
      setProgress(0);
      setError(null);
    } else if (value.type.startsWith('image/')) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  const simulateUpload = React.useCallback(() => {
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

  const onDrop = React.useCallback(
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

      // Simulate upload progress
      simulateUpload();
    },
    [onValueChange, simulateUpload]
  );

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
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

  const isImage = file?.type.startsWith('image/');

  return (
    <div className={cn('w-full space-y-3', className)} {...props}>
      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            'text-muted-foreground bg-background hover:bg-muted/50 border-muted-foreground/20 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-2 transition-colors duration-200 ease-in-out',
            isDragActive && 'border-primary bg-muted/50 text-foreground',
            error && 'border-destructive/50 bg-destructive/5'
          )}
        >
          <input {...getInputProps()} />
          <div
            className={cn(
              'bg-muted mb-3 rounded-full p-3',
              error && 'bg-destructive/10 text-destructive'
            )}
          >
            {error ? (
              <AlertCircle className="h-6 w-6" />
            ) : (
              <UploadCloud className="text-muted-foreground h-6 w-6" />
            )}
          </div>
          <p className="text-center text-sm font-medium">
            <span className="text-primary font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Single file up to {Math.round(maxSize / (1024 * 1024))}MB.
          </p>
          {error && <p className="text-destructive mt-2 text-xs font-medium">{error}</p>}
        </div>
      ) : (
        <div className="bg-background relative space-y-3 rounded-xl p-1">
          <div className="flex flex-col items-center justify-between">
            <div className="relative flex min-w-0 flex-1 flex-col items-center space-x-3">
              {/* Image Thumbnail or File Icon */}
              {isImage && previewUrl ? (
                <div className="bg-muted h-full w-full shrink-0 overflow-hidden rounded-lg border">
                  <img src={previewUrl} alt={file.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="bg-muted shrink-0 rounded-lg p-3">
                  {isImage ? (
                    <ImageIcon className="text-muted-foreground h-6 w-6" />
                  ) : (
                    <FileIcon className="text-muted-foreground h-6 w-6" />
                  )}
                </div>
              )}
            </div>

            {/* Remove button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
              onClick={removeFile}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          {progress < 100 && (
            <div className="space-y-1">
              <Progress value={progress} className="h-1 w-full" />
              <p className="text-muted-foreground text-right text-[10px]">{progress}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
