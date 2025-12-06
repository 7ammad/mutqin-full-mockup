"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import { Calendar } from "@/components/shared/Calendar";
import { QRCode } from "@/components/shared/QRCode";
import { QRScanner } from "@/components/shared/QRScanner";
import { Chart } from "@/components/shared/Chart";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Calendar as CalendarIcon, QrCode, FileText, BarChart3, Camera } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function DemoPage() {
    const router = useRouter();
    const { language, t } = useLanguage();
    
    // Redirect in production
    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            router.replace('/');
        }
    }, [router]);
    
    // Don't render in production
    if (process.env.NODE_ENV === 'production') {
        return null;
    }
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [qrScanResult, setQrScanResult] = useState<string | null>(null);

    // Sample chart data
    const chartData = [
        { name: language === 'ar' ? '' : 'Jan', value: 400 },
        { name: language === 'ar' ? '' : 'Feb', value: 300 },
        { name: language === 'ar' ? '' : 'Mar', value: 200 },
        { name: language === 'ar' ? '' : 'Apr', value: 278 },
        { name: language === 'ar' ? '' : 'May', value: 189 },
    ];

    const handleQRScan = (result: string) => {
        setQrScanResult(result);
        setShowQRScanner(false);
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    {language === 'ar' ? ' ' : 'Library Components Demo'}
                </h1>
                <p className="text-[var(--secondary-label)]">
                    {language === 'ar' 
                        ? '     ' 
                        : 'Showcase of all imported library components'}
                </p>
            </div>

            {/* Calendar Component */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[var(--apple-blue)]" />
                    <h2 className="text-xl font-semibold text-[var(--label)]">
                        {language === 'ar' ? '' : 'Calendar'}
                    </h2>
                </div>
                <Calendar
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                />
                {selectedDate && (
                    <p className="text-sm text-[var(--secondary-label)]">
                        {language === 'ar' ? ' :' : 'Selected date:'} {selectedDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </p>
                )}
            </section>

            {/* QR Code Components */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[var(--apple-green)]" />
                    <h2 className="text-xl font-semibold text-[var(--label)]">
                        {language === 'ar' ? ' QR' : 'QR Code'}
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-[var(--label)]">
                            {language === 'ar' ? ' QR Code' : 'QR Code Generation'}
                        </h3>
                        <QRCode
                            text="https://event-med.ksa"
                            size={200}
                        />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-[var(--label)]">
                            {language === 'ar' ? ' QR Code' : 'QR Code Scanner'}
                        </h3>
                        {!showQRScanner ? (
                            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                                <div className="text-center space-y-4">
                                    <Camera className="w-12 h-12 mx-auto text-[var(--secondary-label)]" />
                                    <GlassButton
                                        onClick={() => setShowQRScanner(true)}
                                        variant="default"
                                        size="default"
                                    >
                                        {language === 'ar' ? ' ' : 'Open Scanner'}
                                    </GlassButton>
                                    {qrScanResult && (
                                        <div className="mt-4 p-3 rounded-lg bg-[var(--system-fill)]">
                                            <p className="text-xs text-[var(--secondary-label)] mb-1">
                                                {language === 'ar' ? '  ' : 'Last Scan Result'}
                                            </p>
                                            <p className="text-sm font-mono text-[var(--label)] break-all">
                                                {qrScanResult}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </LiquidGlassCard>
                        ) : (
                            <QRScanner
                                onScan={handleQRScan}
                                onClose={() => setShowQRScanner(false)}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* PDF Viewer */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--apple-purple)]" />
                    <h2 className="text-xl font-semibold text-[var(--label)]">
                        {language === 'ar' ? ' PDF' : 'PDF Viewer'}
                    </h2>
                </div>
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="text-center space-y-4">
                        <p className="text-[var(--secondary-label)]">
                            {language === 'ar' 
                                ? '   PDF  .   PDF .' 
                                : 'PDF Viewer will be used for certificates. Requires a PDF file to test.'}
                        </p>
                        <p className="text-xs text-[var(--tertiary-label)]">
                            {language === 'ar' 
                                ? ': <PDFViewer file="/path/to/certificate.pdf" />' 
                                : 'Example: <PDFViewer file="/path/to/certificate.pdf" />'}
                        </p>
                    </div>
                </LiquidGlassCard>
            </section>

            {/* Charts */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[var(--apple-orange)]" />
                    <h2 className="text-xl font-semibold text-[var(--label)]">
                        {language === 'ar' ? ' ' : 'Charts'}
                    </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-[var(--label)]">
                            {language === 'ar' ? ' ' : 'Line Chart'}
                        </h3>
                        <Chart
                            type="line"
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                        />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-[var(--label)]">
                            {language === 'ar' ? ' ' : 'Bar Chart'}
                        </h3>
                        <Chart
                            type="bar"
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                        />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-[var(--label)]">
                            {language === 'ar' ? ' ' : 'Pie Chart'}
                        </h3>
                        <Chart
                            type="pie"
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                        />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-[var(--label)]">
                            {language === 'ar' ? ' ' : 'Area Chart'}
                        </h3>
                        <Chart
                            type="area"
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                        />
                    </div>
                </div>
            </section>

            {/* All Components Status */}
            <section>
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        {language === 'ar' ? ' ' : 'Components Status'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { name: 'Calendar', nameAr: '', status: '✅ Ready' },
                            { name: 'QR Code', nameAr: ' QR', status: '✅ Ready' },
                            { name: 'QR Scanner', nameAr: ' QR', status: '✅ Ready' },
                            { name: 'PDF Viewer', nameAr: ' PDF', status: '✅ Ready' },
                            { name: 'Charts', nameAr: ' ', status: '✅ Ready' },
                        ].map((comp) => (
                            <div key={comp.name} className="flex items-center justify-between p-3 rounded-lg bg-[var(--system-fill)]">
                                <span className="text-sm text-[var(--label)]">
                                    {language === 'ar' ? comp.nameAr : comp.name}
                                </span>
                                <span className="text-xs text-[var(--apple-green)] font-medium">
                                    {comp.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </LiquidGlassCard>
            </section>
        </div>
    );
}


