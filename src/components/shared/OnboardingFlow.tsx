"use client";

import { useState, ReactNode } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface OnboardingStep {
    title: string;
    titleAr: string;
    content: ReactNode;
    contentAr?: ReactNode;
}

interface OnboardingFlowProps {
    steps: OnboardingStep[];
    onComplete: () => void;
    onSkip?: () => void;
    showSkip?: boolean;
}

export function OnboardingFlow({
    steps,
    onComplete,
    onSkip,
    showSkip = true,
}: OnboardingFlowProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const { language } = useLanguage();

    const isLastStep = currentStep === steps.length - 1;
    const isFirstStep = currentStep === 0;

    const handleNext = () => {
        if (isLastStep) {
            onComplete();
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep(currentStep - 1);
        }
    };

    const currentStepData = steps[currentStep];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <LiquidGlassCard
                className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                blurIntensity="xl"
                interactive={false}
            >
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--label)]">
                                {language === 'ar' ? currentStepData.titleAr : currentStepData.title}
                            </h2>
                            <p className="text-sm text-[var(--secondary-label)] mt-1">
                                {language === 'ar' ? 'الخطوة' : 'Step'} {currentStep + 1} {language === 'ar' ? 'من' : 'of'} {steps.length}
                            </p>
                        </div>
                        {showSkip && onSkip && (
                            <button onClick={onSkip}
                                className="p-2 rounded-full hover:bg-[var(--system-fill)] transition-colors inline-flex items-center justify-center"
                            >
                                <X className="w-5 h-5 text-[var(--secondary-label)]" />
                            </button>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[var(--system-fill)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--apple-blue)] transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    {/* Content */}
                    <div className="min-h-[300px]">
                        {language === 'ar' && currentStepData.contentAr
                            ? currentStepData.contentAr
                            : currentStepData.content}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--separator)]">
                        <GlassButton
                            onClick={handlePrevious}
                            variant="outline"
                            size="default"
                            disabled={isFirstStep}
                         className="flex items-center justify-center gap-2">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'السابق' : 'Previous'}
                        </GlassButton>

                        <div className="flex gap-2">
                            {showSkip && onSkip && (
                                <GlassButton
                                    onClick={onSkip}
                                    variant="outline"
                                    size="default"
                                 className="flex items-center justify-center gap-2">
                                    {language === 'ar' ? 'تخطي' : 'Skip'}
                                </GlassButton>
                            )}
                            <GlassButton
                                onClick={handleNext}
                                variant="default"
                                size="default"
                             className="flex items-center justify-center gap-2">
                                {isLastStep
                                    ? (language === 'ar' ? 'إنهاء' : 'Finish')
                                    : (language === 'ar' ? 'التالي' : 'Next')}
                                {!isLastStep && <ChevronRight className="w-4 h-4 ml-2" />}
                            </GlassButton>
                        </div>
                    </div>
                </div>
            </LiquidGlassCard>
        </div>
    );
}

