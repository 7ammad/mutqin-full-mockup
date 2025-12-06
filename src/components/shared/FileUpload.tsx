"use client";

import { useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Upload, X, File, CheckCircle2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in MB
    onFilesSelected?: (files: File[]) => void;
    className?: string;
}

interface UploadedFile {
    id: string;
    file: File;
    status: 'uploading' | 'success' | 'error';
    progress?: number;
    error?: string;
}

export function FileUpload({
    accept,
    multiple = false,
    maxSize = 10,
    onFilesSelected,
    className,
}: FileUploadProps) {
    const { language } = useLanguage();
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return;

        const validFiles: File[] = [];
        const newFiles: UploadedFile[] = [];

        Array.from(selectedFiles).forEach((file) => {
            if (file.size > maxSize * 1024 * 1024) {
                newFiles.push({
                    id: `${Date.now()}-${Math.random()}`,
                    file,
                    status: 'error',
                    error: language === 'ar' 
                        ? `   ${maxSize} `
                        : `File exceeds ${maxSize}MB`,
                });
            } else {
                validFiles.push(file);
                newFiles.push({
                    id: `${Date.now()}-${Math.random()}`,
                    file,
                    status: 'uploading',
                    progress: 0,
                });
            }
        });

        setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles));

        // Simulate upload progress
        newFiles.forEach((uploadedFile) => {
            if (uploadedFile.status === 'uploading') {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === uploadedFile.id
                                ? { ...f, progress: Math.min(progress, 100) }
                                : f
                        )
                    );

                    if (progress >= 100) {
                        clearInterval(interval);
                        setFiles((prev) =>
                            prev.map((f) =>
                                f.id === uploadedFile.id
                                    ? { ...f, status: 'success', progress: 100 }
                                    : f
                            )
                        );
                    }
                }, 100);
            }
        });

        if (validFiles.length > 0 && onFilesSelected) {
            onFilesSelected(validFiles);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleRemove = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const uploadText = language === 'ar' ? ' ' : 'Upload File';
    const dragText = language === 'ar' ? '     ' : 'Drag files here or click to select';
    const supportedFormatsText = language === 'ar' ? ' ' : 'Supported formats';
    const maxSizeText = language === 'ar' ? '  ' : 'Max size';
    const removeText = language === 'ar' ? '' : 'Remove';

    return (
        <div className={className}>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <LiquidGlassCard
                    blurIntensity="lg"
                    interactive={false}
                    className={`p-6 border-2 border-dashed transition-colors ${
                        isDragging
                            ? 'border-[var(--apple-blue)] bg-[var(--apple-blue)]/10'
                            : 'border-[var(--separator)]'
                    }`}
                >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                />

                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-4 rounded-full bg-[var(--apple-blue)]/10">
                            <Upload className="w-8 h-8 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[var(--label)] font-medium mb-1">{uploadText}</p>
                        <p className="text-sm text-[var(--secondary-label)]">{dragText}</p>
                    </div>
                    <GlassButton
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {uploadText}
                    </GlassButton>
                    <div className="text-xs text-[var(--tertiary-label)] space-y-1">
                        {accept && (
                            <p>
                                {supportedFormatsText}: {accept}
                            </p>
                        )}
                        <p>
                            {maxSizeText}: {maxSize}MB
                        </p>
                    </div>
                </div>
            </LiquidGlassCard>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((uploadedFile) => (
                        <LiquidGlassCard
                            key={uploadedFile.id}
                            blurIntensity="md"
                            interactive={false}
                            className="p-4"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <File className="w-5 h-5 text-[var(--secondary-label)] flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[var(--label)] truncate">
                                            {uploadedFile.file.name}
                                        </p>
                                        <p className="text-xs text-[var(--tertiary-label)]">
                                            {(uploadedFile.file.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {uploadedFile.status === 'uploading' && (
                                        <div className="w-16 h-2 bg-[var(--system-fill)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--apple-blue)] transition-all duration-300"
                                                style={{ width: `${uploadedFile.progress || 0}%` }}
                                            />
                                        </div>
                                    )}
                                    {uploadedFile.status === 'success' && (
                                        <CheckCircle2 className="w-5 h-5 text-[var(--apple-green)]" />
                                    )}
                                    {uploadedFile.status === 'error' && (
                                        <div className="flex items-center gap-1">
                                            <AlertCircle className="w-5 h-5 text-[var(--apple-red)]" />
                                            <span className="text-xs text-[var(--apple-red)]">
                                                {uploadedFile.error}
                                            </span>
                                        </div>
                                    )}
                                    <button onClick={() => handleRemove(uploadedFile.id)}
                                        className="p-1 rounded-md hover:bg-[var(--system-fill)] transition-colors"
                                        aria-label={removeText}
                                    >
                                        <X className="w-4 h-4 text-[var(--secondary-label)]" />
                                    </button>
                                </div>
                            </div>
                        </LiquidGlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}

