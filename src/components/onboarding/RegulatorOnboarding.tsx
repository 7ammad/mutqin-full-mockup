"use client";

import { OnboardingFlow } from "@/components/shared/OnboardingFlow";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Shield } from "lucide-react";

interface RegulatorOnboardingProps {
    onComplete: () => void;
    onSkip?: () => void;
}

export function RegulatorOnboarding({ onComplete, onSkip }: RegulatorOnboardingProps) {
    const steps = [
        {
            title: "Welcome, Regulator!",
            titleAr: "مرحباً، المعتمد!",
            content: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                        Review event applications, monitor compliance, and track national CME analytics.
                    </p>
                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                        <Shield className="w-8 h-8 text-[var(--apple-blue)] mb-2" />
                        <p className="font-medium text-[var(--label)]">Accreditation Queue</p>
                        <p className="text-sm text-[var(--secondary-label)]">Review and approve event applications</p>
                    </LiquidGlassCard>
                </div>
            ),
            contentAr: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                        راجع طلبات الفعاليات، راقب الامتثال، وتتبع تحليلات التعليم الطبي الوطنية.
                    </p>
                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                        <Shield className="w-8 h-8 text-[var(--apple-blue)] mb-2" />
                        <p className="font-medium text-[var(--label)]">قائمة الاعتماد</p>
                        <p className="text-sm text-[var(--secondary-label)]">راجع ووافق على طلبات الفعاليات</p>
                    </LiquidGlassCard>
                </div>
            ),
        },
    ];

    return <OnboardingFlow steps={steps} onComplete={onComplete} onSkip={onSkip} />;
}

