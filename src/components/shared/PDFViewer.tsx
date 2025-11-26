"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
// PDF CSS imports - commented out if react-pdf CSS files are not available
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
    file?: string | File | ArrayBuffer;
    url?: string; // Alias for file when using URL string
    className?: string;
    onLoadSuccess?: (numPages: number) => void;
    height?: number;
}

export function PDFViewer({ file, url, className, onLoadSuccess, height }: PDFViewerProps) {
    const { language } = useLanguage();
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use url as file if file is not provided
    const pdfFile = file || url;

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setLoading(false);
        if (onLoadSuccess) {
            onLoadSuccess(numPages);
        }
    };

    const onDocumentLoadError = (error: Error) => {
        setError(error.message);
        setLoading(false);
    };

    const goToPrevPage = () => {
        setPageNumber((prev) => Math.max(1, prev - 1));
    };

    const goToNextPage = () => {
        setPageNumber((prev) => Math.min(numPages, prev + 1));
    };

    const zoomIn = () => {
        setScale((prev) => Math.min(3.0, prev + 0.2));
    };

    const zoomOut = () => {
        setScale((prev) => Math.max(0.5, prev - 0.2));
    };

    const handleDownload = () => {
        const fileToDownload = pdfFile;
        if (typeof fileToDownload === 'string') {
            window.open(fileToDownload, '_blank');
        }
    };

    return (
        <LiquidGlassCard
            className={cn("p-6 space-y-4", className)}
            blurIntensity="lg"
            interactive={false}
        >
            {/* Controls */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <GlassButton
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        variant="outline"
                        size="sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </GlassButton>
                    <span className="text-sm text-[var(--label)] px-3">
                        {language === 'ar' ? 'صفحة' : 'Page'} {pageNumber} {language === 'ar' ? 'من' : 'of'} {numPages}
                    </span>
                    <GlassButton
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        variant="outline"
                        size="sm"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </GlassButton>
                </div>

                <div className="flex items-center gap-2">
                    <GlassButton
                        onClick={zoomOut}
                        variant="outline"
                        size="sm"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </GlassButton>
                    <span className="text-sm text-[var(--secondary-label)] px-2">
                        {Math.round(scale * 100)}%
                    </span>
                    <GlassButton
                        onClick={zoomIn}
                        variant="outline"
                        size="sm"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </GlassButton>
                    {typeof pdfFile === 'string' && (
                        <GlassButton
                            onClick={handleDownload}
                            variant="outline"
                            size="sm"
                        >
                            <Download className="w-4 h-4" />
                        </GlassButton>
                    )}
                </div>
            </div>

            {/* PDF Viewer */}
            <div 
                className="flex justify-center bg-[var(--system-fill)] rounded-lg p-4 overflow-auto"
                style={height ? { minHeight: `${height}px` } : {}}
            >
                {loading && (
                    <div className="py-12 text-center">
                        <p className="text-[var(--secondary-label)]">
                            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                        </p>
                    </div>
                )}

                {error && (
                    <div className="py-12 text-center">
                        <p className="text-[var(--apple-red)]">
                            {language === 'ar' ? 'خطأ في تحميل PDF' : 'Error loading PDF'}: {error}
                        </p>
                    </div>
                )}

                {!loading && !error && pdfFile && (
                    <Document
                        file={pdfFile}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                            <div className="py-12 text-center">
                                <p className="text-[var(--secondary-label)]">
                                    {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                                </p>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            className="shadow-lg"
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                        />
                    </Document>
                )}
            </div>
        </LiquidGlassCard>
    );
}


