"use client";

import { OnboardingFlow } from "@/components/shared/OnboardingFlow";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Zap, Briefcase } from "lucide-react";

interface VendorOnboardingProps {
    onComplete: () => void;
    onSkip?: () => void;
}

export function VendorOnboarding({ onComplete, onSkip }: VendorOnboardingProps) {
    const steps = [
        {
            title: "Welcome, Vendor!",
            titleAr: " !",
            content: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                        Discover sponsorship opportunities and track your campaign performance.
                    </p>
                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                        <Briefcase className="w-8 h-8 text-[var(--apple-blue)] mb-2" />
                        <p className="font-medium text-[var(--label)]">Marketplace</p>
                        <p className="text-sm text-[var(--secondary-label)]">Browse events seeking sponsorship</p>
                    </LiquidGlassCard>
                </div>
            ),
            contentAr: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                             .
                    </p>
                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                        <Briefcase className="w-8 h-8 text-[var(--apple-blue)] mb-2" />
                        <p className="font-medium text-[var(--label)]"></p>
                        <p className="text-sm text-[var(--secondary-label)]">     </p>
                    </LiquidGlassCard>
                </div>
            ),
        },
    ];

    return <OnboardingFlow steps={steps} onComplete={onComplete} onSkip={onSkip} />;
}

