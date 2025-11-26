"use client";

import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Camera, X, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface QRScannerProps {
    onScan: (result: string) => void;
    onClose?: () => void;
    className?: string;
}

export function QRScanner({ onScan, onClose, className }: QRScannerProps) {
    const { language } = useLanguage();
    const [isScanning, setIsScanning] = useState(false);
    const [scannedResult, setScannedResult] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scanAreaRef = useRef<HTMLDivElement>(null);

    const handleStart = async () => {
        try {
            const scanner = new Html5Qrcode("qr-reader");
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    setScannedResult(decodedText);
                    onScan(decodedText);
                    handleStop();
                },
                (errorMessage) => {
                    // Ignore scanning errors (continuous scanning)
                }
            );

            setIsScanning(true);
        } catch (error) {
            console.error("Failed to start scanner:", error);
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

    return (
        <LiquidGlassCard
            className={cn("p-6 space-y-4", className)}
            blurIntensity="xl"
            interactive={false}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--label)]">
                    {language === 'ar' ? 'ماسح QR' : 'QR Scanner'}
                </h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-[var(--system-fill)] transition-colors"
                    >
                        <X className="w-5 h-5 text-[var(--secondary-label)]" />
                    </button>
                )}
            </div>

            <div className="relative aspect-square bg-[var(--system-fill)] rounded-lg overflow-hidden">
                <div
                    id="qr-reader"
                    ref={scanAreaRef}
                    className={cn(
                        "w-full h-full",
                        !isScanning && "flex items-center justify-center"
                    )}
                >
                    {!isScanning && (
                        <div className="text-center">
                            <Camera className="w-16 h-16 text-[var(--secondary-label)] mx-auto mb-2" />
                            <p className="text-sm text-[var(--secondary-label)]">
                                {language === 'ar' ? 'اضغط لبدء المسح' : 'Click to start scanning'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Success overlay */}
                {scannedResult && (
                    <div className="absolute inset-0 bg-[var(--apple-green)]/20 flex items-center justify-center z-10">
                        <div className="text-center">
                            <CheckCircle2 className="w-16 h-16 text-[var(--apple-green)] mx-auto mb-2" />
                            <p className="text-[var(--label)] font-medium">
                                {language === 'ar' ? 'تم المسح بنجاح' : 'Scanned Successfully'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                {!isScanning ? (
                    <GlassButton
                        onClick={handleStart}
                        variant="default"
                        size="default"
                        className="flex-1 flex items-center justify-center gap-2"
                    >
                        <Camera className="w-4 h-4" />
                        {language === 'ar' ? 'بدء المسح' : 'Start Scanning'}
                    </GlassButton>
                ) : (
                    <GlassButton
                        onClick={handleStop}
                        variant="outline"
                        size="default"
                        className="flex-1"
                    >
                        {language === 'ar' ? 'إيقاف' : 'Stop'}
                    </GlassButton>
                )}
            </div>

            {scannedResult && (
                <div className="p-3 rounded-lg bg-[var(--system-fill)]">
                    <p className="text-xs text-[var(--secondary-label)] mb-1">
                        {language === 'ar' ? 'النتيجة' : 'Result'}
                    </p>
                    <p className="text-sm font-mono text-[var(--label)] break-all">
                        {scannedResult}
                    </p>
                </div>
            )}
        </LiquidGlassCard>
    );
}

