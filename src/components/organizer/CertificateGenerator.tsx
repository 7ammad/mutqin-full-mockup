"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { FileUpload } from '@/components/shared/FileUpload';
import { Download, FileText, Users, CheckCircle2, Upload } from 'lucide-react';

interface Attendee {
    id: string;
    name: string;
    email: string;
    licenseNumber?: string;
    checkedIn: boolean;
}

export default function CertificateGenerator() {
    const { language } = useLanguage();
    const { events } = usePersona();
    const [selectedEvent, setSelectedEvent] = useState<string>('');
    const [attendees, setAttendees] = useState<Attendee[]>([
        { id: '1', name: 'Dr. Sarah Al-Otaibi', email: 'sarah@example.com', licenseNumber: 'HCP-001', checkedIn: true },
        { id: '2', name: 'Dr. Ahmed Al-Mansour', email: 'ahmed@example.com', licenseNumber: 'HCP-002', checkedIn: true },
        { id: '3', name: 'Dr. Fatima Al-Zahra', email: 'fatima@example.com', licenseNumber: 'HCP-003', checkedIn: false },
    ]);
    const [certificateTemplate, setCertificateTemplate] = useState<File | null>(null);
    const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'completed'>('idle');

    const selectedEventData = events.find(e => e.id === selectedEvent);
    const checkedInAttendees = attendees.filter(a => a.checkedIn);
    const generatedCount = generationStatus === 'completed' ? checkedInAttendees.length : 0;

    const handleGenerate = () => {
        setGenerationStatus('generating');
        setTimeout(() => {
            setGenerationStatus('completed');
        }, 2000);
    };

    const handleBulkDownload = () => {
        console.log('Downloading all certificates...');
    };

    const handleDownload = (attendeeId: string) => {
        console.log('Downloading certificate for:', attendeeId);
    };

    const title = language === 'ar' ? ' ' : 'Certificate Generator';
    const selectEventText = language === 'ar' ? ' ' : 'Select Event';
    const uploadTemplateText = language === 'ar' ? '  ' : 'Upload Certificate Template';
    const attendeesText = language === 'ar' ? '' : 'Attendees';
    const checkedInText = language === 'ar' ? ' ' : 'Checked In';
    const generateText = language === 'ar' ? ' ' : 'Generate Certificates';
    const generatingText = language === 'ar' ? ' ...' : 'Generating...';
    const completedText = language === 'ar' ? ' ' : 'Completed';
    const bulkDownloadText = language === 'ar' ? ' ' : 'Download All';
    const downloadText = language === 'ar' ? '' : 'Download';
    const licenseText = language === 'ar' ? ' ' : 'License Number';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
            </div>

            {/* Event Selection */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {selectEventText}
                </label>
                <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full px-4 py-2 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-[var(--label)] focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]"
                >
                    <option value="">{selectEventText}</option>
                    {events.map((event) => (
                        <option key={event.id} value={event.id}>
                            {language === 'ar' ? event.titleAr : event.titleEn}
                        </option>
                    ))}
                </select>
            </LiquidGlassCard>

            {selectedEvent && (
                <>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--secondary-label)] mb-1">{attendeesText}</p>
                                    <p className="text-3xl font-bold text-[var(--label)]">{attendees.length}</p>
                                </div>
                                <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                                    <Users className="w-8 h-8 text-[var(--apple-blue)]" />
                                </div>
                            </div>
                        </LiquidGlassCard>

                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--secondary-label)] mb-1">{checkedInText}</p>
                                    <p className="text-3xl font-bold text-[var(--label)]">{checkedInAttendees.length}</p>
                                </div>
                                <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                                    <CheckCircle2 className="w-8 h-8 text-[var(--apple-green)]" />
                                </div>
                            </div>
                        </LiquidGlassCard>

                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--secondary-label)] mb-1">
                                        {language === 'ar' ? ' ' : 'Certificates Generated'}
                                    </p>
                                    <p className="text-3xl font-bold text-[var(--label)]">{generatedCount}</p>
                                </div>
                                <div className="p-3 rounded-full bg-[var(--apple-purple)]/10">
                                    <FileText className="w-8 h-8 text-[var(--apple-purple)]" />
                                </div>
                            </div>
                        </LiquidGlassCard>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <GlassButton
                            variant="default"
                            onClick={handleGenerate}
                            disabled={!certificateTemplate || generationStatus === 'generating' || checkedInAttendees.length === 0}
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

                    {/* Attendees List */}
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{attendeesText}</h3>
                        <div className="space-y-3">
                            {attendees.map((attendee) => (
                                <div
                                    key={attendee.id}
                                    className="p-4 rounded-lg bg-[var(--system-fill)]/30 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        {attendee.checkedIn ? (
                                            <CheckCircle2 className="w-5 h-5 text-[var(--apple-green)]" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-[var(--tertiary-label)]" />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium text-[var(--label)]">{attendee.name}</p>
                                            <p className="text-sm text-[var(--secondary-label)]">{attendee.email}</p>
                                            {attendee.licenseNumber && (
                                                <p className="text-xs text-[var(--tertiary-label)]">
                                                    {licenseText}: {attendee.licenseNumber}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-sm font-medium ${
                                            attendee.checkedIn
                                                ? 'text-[var(--apple-green)]'
                                                : 'text-[var(--apple-red)]'
                                        }`}>
                                            {attendee.checkedIn ? checkedInText : (language === 'ar' ? '  ' : 'Not Checked In')}
                                        </span>
                                        {generationStatus === 'completed' && attendee.checkedIn && (
                                            <GlassButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownload(attendee.id)}
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                {downloadText}
                                            </GlassButton>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LiquidGlassCard>
                </>
            )}
        </div>
    );
}

