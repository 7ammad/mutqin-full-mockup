"use client";

import { OnboardingFlow } from "@/components/shared/OnboardingFlow";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Calendar } from "lucide-react";

interface OrganizerOnboardingProps {
    onComplete: () => void;
    onSkip?: () => void;
}

export function OrganizerOnboarding({ onComplete, onSkip }: OrganizerOnboardingProps) {
    const steps = [
        {
            title: "Welcome, Organizer!",
            titleAr: "مرحباً، المنظم!",
            content: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                        Create and manage CME events, track registrations, and generate certificates.
                    </p>
                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                        <Calendar className="w-8 h-8 text-[var(--apple-blue)] mb-2" />
                        <p className="font-medium text-[var(--label)]">Event Creation</p>
                        <p className="text-sm text-[var(--secondary-label)]">Create events with our step-by-step wizard</p>
                    </LiquidGlassCard>
                </div>
            ),
            contentAr: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                        أنشئ وأدر فعاليات التعليم الطبي، تتبع التسجيلات، وأنشئ الشهادات.
                    </p>
                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                        <Calendar className="w-8 h-8 text-[var(--apple-blue)] mb-2" />
                        <p className="font-medium text-[var(--label)]">إنشاء الفعاليات</p>
                        <p className="text-sm text-[var(--secondary-label)]">أنشئ الفعاليات باستخدام معالج الخطوات</p>
                    </LiquidGlassCard>
                </div>
            ),
        },
    ];

    return <OnboardingFlow steps={steps} onComplete={onComplete} onSkip={onSkip} />;
}

