"use client";

import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Camera, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface MobileQRScannerProps {
    onScan: (result: string) => void;
    onClose?: () => void;
    eventId?: string;
}

export default function MobileQRScanner({ onScan, onClose }: MobileQRScannerProps) {
    const { language } = useLanguage();
    const [isScanning, setIsScanning] = useState(false);
    const [scannedResult, setScannedResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scanAreaRef = useRef<HTMLDivElement>(null);

    const handleStart = async () => {
        try {
            setError(null);
            const scanner = new Html5Qrcode("mobile-qr-reader");
            scannerRef.current = scanner;

            // Mobile-optimized settings
            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 300, height: 300 }, // Larger for mobile
                    aspectRatio: 1.0,
                    disableFlip: false,
                },
                (decodedText) => {
                    setScannedResult(decodedText);
                    onScan(decodedText);
                    handleStop();
                },
                (_errorMessage) => {
                    // Ignore scanning errors (continuous scanning)
                }
            );

            setIsScanning(true);
        } catch (error) {
            console.error("Failed to start scanner:", error);
            setError(language === 'ar' ? 'فشل بدء الماسح' : 'Failed to start scanner');
        }
    };

    const handleStop = async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                await scannerRef.current.clear();
            } catch (error) {
                console.error("Error stopping scanner:", error);
            }
            scannerRef.current = null;
            setIsScanning(false);
        }
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current && isScanning) {
                handleStop();
            }
        };
    }, [isScanning, handleStop]);

    const title = language === 'ar' ? 'ماسح QR للموبايل' : 'Mobile QR Scanner';
    const startScanningText = language === 'ar' ? 'بدء المسح' : 'Start Scanning';
    const stopScanningText = language === 'ar' ? 'إيقاف' : 'Stop';
    const scannedSuccessfullyText = language === 'ar' ? 'تم المسح بنجاح' : 'Scanned Successfully';
    const resultText = language === 'ar' ? 'النتيجة' : 'Result';
    const clickToStartText = language === 'ar' ? 'اضغط لبدء المسح' : 'Click to start scanning';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <LiquidGlassCard
                blurIntensity="xl"
                interactive={false}
                className="w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[var(--label)]">{title}</h3>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full hover:bg-[var(--system-fill)] transition-colors"
                            >
                                <X className="w-5 h-5 text-[var(--secondary-label)]" />
                            </button>
                        )}
                    </div>

                    {/* Mobile-optimized scanner area */}
                    <div className="relative w-full aspect-square bg-[var(--system-fill)] rounded-lg overflow-hidden">
                        <div
                            id="mobile-qr-reader"
                            ref={scanAreaRef}
                            className={cn(
                                "w-full h-full",
                                !isScanning && "flex items-center justify-center"
                            )}
                        >
                            {!isScanning && (
                                <div className="text-center p-4">
                                    <Camera className="w-20 h-20 text-[var(--secondary-label)] mx-auto mb-4" />
                                    <p className="text-sm text-[var(--secondary-label)]">
                                        {clickToStartText}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Success overlay */}
                        {scannedResult && (
                            <div className="absolute inset-0 bg-[var(--apple-green)]/20 flex items-center justify-center z-10">
                                <div className="text-center p-4">
                                    <CheckCircle2 className="w-16 h-16 text-[var(--apple-green)] mx-auto mb-2" />
                                    <p className="text-[var(--label)] font-medium">
                                        {scannedSuccessfullyText}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error overlay */}
                        {error && (
                            <div className="absolute inset-0 bg-[var(--apple-red)]/20 flex items-center justify-center z-10">
                                <div className="text-center p-4">
                                    <AlertCircle className="w-16 h-16 text-[var(--apple-red)] mx-auto mb-2" />
                                    <p className="text-[var(--label)] font-medium">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3">
                        {!isScanning ? (
                            <GlassButton
                                onClick={handleStart}
                                variant="default"
                                size="default"
                                className="flex-1 flex items-center justify-center gap-2"
                            >
                                <Camera className="w-5 h-5" />
                                {startScanningText}
                            </GlassButton>
                        ) : (
                            <GlassButton
                                onClick={handleStop}
                                variant="outline"
                                size="default"
                                className="flex-1"
                            >
                                {stopScanningText}
                            </GlassButton>
                        )}
                    </div>

                    {/* Scanned result */}
                    {scannedResult && (
                        <div className="p-4 rounded-lg bg-[var(--system-fill)]">
                            <p className="text-xs text-[var(--secondary-label)] mb-2">{resultText}</p>
                            <p className="text-sm font-mono text-[var(--label)] break-all">
                                {scannedResult}
                            </p>
                        </div>
                    )}
                </div>
            </LiquidGlassCard>
        </div>
    );
}

