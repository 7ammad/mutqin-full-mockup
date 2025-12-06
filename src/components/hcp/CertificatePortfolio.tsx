"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { PDFViewer } from '@/components/shared/PDFViewer';
import { Download, FileText, Calendar, Award, Search, Filter, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { buildRoute } from '@/lib/routes';

interface Certificate {
    id: string;
    eventId: string;
    eventTitle: string;
    eventTitleAr: string;
    cmeHours: number;
    issueDate: string;
    expiryDate?: string;
    certificateNumber: string;
    pdfUrl?: string;
    verified: boolean;
}

export default function CertificatePortfolio() {
    const router = useRouter();
    const { language } = useLanguage();
    const { myTickets, events } = usePersona();
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterYear, setFilterYear] = useState<string>('all');

    const certificates: Certificate[] = events
        .filter(e => myTickets.includes(e.id))
        .map((event, index) => ({
            id: `cert-${event.id}`,
            eventId: event.id,
            eventTitle: event.titleEn,
            eventTitleAr: event.titleAr,
            cmeHours: event.cme_hours,
            issueDate: new Date(event.date).toISOString(),
            certificateNumber: `CME-${new Date(event.date).getFullYear()}-${String(index + 1).padStart(4, '0')}`,
            verified: true,
        }));

    const filteredCertificates = certificates.filter(cert => {
        const matchesSearch = language === 'ar'
            ? cert.eventTitleAr.toLowerCase().includes(searchQuery.toLowerCase())
            : cert.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesYear = filterYear === 'all' || 
            new Date(cert.issueDate).getFullYear().toString() === filterYear;
        
        return matchesSearch && matchesYear;
    });

    const totalHours = certificates.reduce((sum, cert) => sum + cert.cmeHours, 0);
    const years = Array.from(new Set(certificates.map(c => new Date(c.issueDate).getFullYear().toString())))
        .sort((a, b) => parseInt(b) - parseInt(a));

    const handleDownload = (cert: Certificate) => {
        console.log('Downloading certificate:', cert.certificateNumber);
    };

    const title = language === 'ar' ? 'محفظة الشهادات' : 'Certificate Portfolio';
    const totalHoursText = language === 'ar' ? 'إجمالي الساعات المعتمدة' : 'Total Accredited Hours';
    const searchPlaceholder = language === 'ar' ? 'ابحث عن شهادة...' : 'Search certificates...';
    const allYearsText = language === 'ar' ? 'جميع السنوات' : 'All Years';
    const viewText = language === 'ar' ? 'عرض' : 'View';
    const downloadText = language === 'ar' ? 'تحميل' : 'Download';
    const noCertificatesText = language === 'ar' ? 'لا توجد شهادات متاحة' : 'No certificates available';
    const certificateNumberText = language === 'ar' ? 'رقم الشهادة' : 'Certificate Number';
    const issuedText = language === 'ar' ? 'صدرت في' : 'Issued on';
    const hoursText = language === 'ar' ? 'ساعة' : 'hours';
    const verifiedText = language === 'ar' ? 'متحقق' : 'Verified';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
            </div>

            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-[var(--secondary-label)] mb-1">{totalHoursText}</p>
                        <p className="text-3xl font-bold text-[var(--label)]">{totalHours}</p>
                        <p className="text-sm text-[var(--tertiary-label)] mt-1">
                            {certificates.length} {language === 'ar' ? 'شهادة' : 'certificates'}
                        </p>
                    </div>
                    <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                        <Award className="w-8 h-8 text-[var(--apple-green)]" />
                    </div>
                </div>
            </LiquidGlassCard>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--tertiary-label)]" />
                    <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[var(--secondary-label)]" />
                    <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="px-4 py-2 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-[var(--label)] focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]"
                    >
                        <option value="all">{allYearsText}</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredCertificates.length === 0 ? (
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-12">
                    <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-[var(--secondary-label)]" />
                        <p className="text-[var(--secondary-label)]">{noCertificatesText}</p>
                    </div>
                </LiquidGlassCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCertificates.map((cert) => (
                        <LiquidGlassCard
                            key={cert.id}
                            blurIntensity="lg"
                            interactive={true}
                            className="p-6"
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-[var(--label)] mb-1">
                                            {language === 'ar' ? cert.eventTitleAr : cert.eventTitle}
                                        </h3>
                                        <p className="text-xs text-[var(--secondary-label)]">
                                            {certificateNumberText}: {cert.certificateNumber}
                                        </p>
                                    </div>
                                    {cert.verified && (
                                        <div className="px-2 py-1 rounded-full bg-[var(--apple-green)]/10 text-[var(--apple-green)] text-xs font-medium">
                                            {verifiedText}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-[var(--tertiary-label)]" />
                                        <span className="text-[var(--secondary-label)]">
                                            {issuedText}: {new Date(cert.issueDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Award className="w-4 h-4 text-[var(--apple-green)]" />
                                        <span className="text-[var(--label)] font-medium">
                                            {cert.cmeHours} {hoursText}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <GlassButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(buildRoute.hcpCertificate(cert.id))}
                                        className="flex-1 gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        {language === 'ar' ? 'عرض الشهادة' : 'View Certificate'}
                                    </GlassButton>
                                    <GlassButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedCertificate(cert)}
                                        className="flex-1 gap-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        {viewText}
                                    </GlassButton>
                                    <GlassButton
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleDownload(cert)}
                                        className="flex-1 gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        {downloadText}
                                    </GlassButton>
                                </div>
                            </div>
                        </LiquidGlassCard>
                    ))}
                </div>
            )}

            {selectedCertificate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <LiquidGlassCard
                        blurIntensity="xl"
                        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-[var(--label)]">
                                    {language === 'ar' ? selectedCertificate.eventTitleAr : selectedCertificate.eventTitle}
                                </h3>
                                <GlassButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedCertificate(null)}
                                >
                                    {language === 'ar' ? 'إغلاق' : 'Close'}
                                </GlassButton>
                            </div>
                            <div className="border border-[var(--separator)] rounded-lg overflow-hidden">
                                <PDFViewer
                                    url={selectedCertificate.pdfUrl || '/certificate-placeholder.pdf'}
                                    height={600}
                                />
                            </div>
                        </div>
                    </LiquidGlassCard>
                </div>
            )}
        </div>
    );
}

