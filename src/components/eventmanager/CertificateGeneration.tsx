"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { FileUpload } from '@/components/shared/FileUpload';
import { Download, FileText, Users, CheckCircle2, Upload } from 'lucide-react';
import { getEventTitle } from '@/lib/eventTranslations';

interface CertificateGenerationProps {
    eventId: string;
}

export default function CertificateGeneration({ eventId }: CertificateGenerationProps) {
    const { language } = useLanguage();
    const { events } = usePersona();
    const [certificateTemplate, setCertificateTemplate] = useState<File | null>(null);
    const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'completed'>('idle');

    const event = events.find(e => e.id === eventId);

    // Mock data
    const attendeesCount: number = 192;
    const generatedCount = generationStatus === 'completed' ? attendeesCount : 0;

    const handleGenerate = () => {
        setGenerationStatus('generating');
        setTimeout(() => {
            setGenerationStatus('completed');
        }, 2000);
    };

    const handleBulkDownload = () => {
        console.log('Downloading all certificates...');
    };

    if (!event) {
        return (
            <LiquidGlassCard blurIntensity="lg" className="p-12">
                <div className="text-center text-[var(--secondary-label)]">
                    {language === 'ar' ? 'الفعالية غير موجودة' : 'Event not found'}
                </div>
            </LiquidGlassCard>
        );
    }

    const title = language === 'ar' ? 'إنشاء الشهادات' : 'Certificate Generation';
    const uploadTemplateText = language === 'ar' ? 'رفع قالب الشهادة' : 'Upload Certificate Template';
    const attendeesText = language === 'ar' ? 'الحضور' : 'Attendees';
    const generateText = language === 'ar' ? 'إنشاء الشهادات' : 'Generate Certificates';
    const generatingText = language === 'ar' ? 'جاري الإنشاء...' : 'Generating...';
    const completedText = language === 'ar' ? 'تم الإنشاء' : 'Completed';
    const bulkDownloadText = language === 'ar' ? 'تحميل الكل' : 'Download All';
    const certificatesGeneratedText = language === 'ar' ? 'الشهادات المولدة' : 'Certificates Generated';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
                    <p className="text-sm text-[var(--secondary-label)] mt-1">
                        {getEventTitle(event, language)}
                    </p>
                </div>
            </div>

            {/* Template Upload */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{uploadTemplateText}</h3>
                <FileUpload
                    accept=".pdf,.docx"
                    maxSize={10}
                    onFilesSelected={(files) => {
                        if (files.length > 0) {
                            setCertificateTemplate(files[0]);
                        }
                    }}
                />
                {certificateTemplate && (
                    <div className="mt-4 p-3 bg-[var(--apple-green)]/10 rounded-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[var(--apple-green)]" />
                        <span className="text-sm text-[var(--label)]">
                            {certificateTemplate.name}
                        </span>
                    </div>
                )}
            </LiquidGlassCard>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{attendeesText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{attendeesCount}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                            <Users className="w-8 h-8 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{certificatesGeneratedText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{generatedCount}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                            <FileText className="w-8 h-8 text-[var(--apple-green)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <GlassButton
                    variant="default"
                    onClick={handleGenerate}
                    disabled={!certificateTemplate || generationStatus === 'generating' || attendeesCount <= 0}
                    className="flex-1 items-center justify-center gap-2"
                >
                    {generationStatus === 'generating' ? (
                        <>
                            <Upload className="w-4 h-4 mr-2 animate-spin" />
                            {generatingText}
                        </>
                    ) : generationStatus === 'completed' ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {completedText}
                        </>
                    ) : (
                        <>
                            <FileText className="w-4 h-4 mr-2" />
                            {generateText}
                        </>
                    )}
                </GlassButton>
                {generationStatus === 'completed' && (
                    <GlassButton
                        variant="outline"
                        onClick={handleBulkDownload}
                        className="flex-1 items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {bulkDownloadText}
                    </GlassButton>
                )}
            </div>
        </div>
    );
}

