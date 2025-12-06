"use client";

import { OnboardingFlow } from "@/components/shared/OnboardingFlow";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { ClipboardCheck, QrCode, FileText } from "lucide-react";

interface EventManagerOnboardingProps {
    onComplete: () => void;
    onSkip?: () => void;
}

export function EventManagerOnboarding({ onComplete, onSkip }: EventManagerOnboardingProps) {
    const steps = [
        {
            title: "Welcome, Event Manager!",
            titleAr: "  !",
            content: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                        Manage event assignments, handle check-ins, and generate certificates.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                            <ClipboardCheck className="w-6 h-6 text-[var(--apple-blue)] mb-2" />
                            <p className="text-sm font-medium text-[var(--label)]">Assignments</p>
                        </LiquidGlassCard>
                        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                            <QrCode className="w-6 h-6 text-[var(--apple-green)] mb-2" />
                            <p className="text-sm font-medium text-[var(--label)]">Check-in</p>
                        </LiquidGlassCard>
                        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                            <FileText className="w-6 h-6 text-[var(--apple-yellow)] mb-2" />
                            <p className="text-sm font-medium text-[var(--label)]">Certificates</p>
                        </LiquidGlassCard>
                    </div>
                </div>
            ),
            contentAr: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                                .
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                            <ClipboardCheck className="w-6 h-6 text-[var(--apple-blue)] mb-2" />
                            <p className="text-sm font-medium text-[var(--label)]"></p>
                        </LiquidGlassCard>
                        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                            <QrCode className="w-6 h-6 text-[var(--apple-green)] mb-2" />
                            <p className="text-sm font-medium text-[var(--label)]"> </p>
                        </LiquidGlassCard>
                        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                            <FileText className="w-6 h-6 text-[var(--apple-yellow)] mb-2" />
                            <p className="text-sm font-medium text-[var(--label)]"></p>
                        </LiquidGlassCard>
                    </div>
                </div>
            ),
        },
    ];

    return <OnboardingFlow steps={steps} onComplete={onComplete} onSkip={onSkip} />;
}

