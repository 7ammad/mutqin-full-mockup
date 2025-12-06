"use client";

import { OnboardingFlow } from "@/components/shared/OnboardingFlow";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { CheckCircle, Search, Calendar, Award } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface HCPOnboardingProps {
    onComplete: () => void;
    onSkip?: () => void;
}

export function HCPOnboarding({ onComplete, onSkip }: HCPOnboardingProps) {


    const steps = [
        {
            title: "Welcome to MedEvent KSA",
            titleAr: "     ",
            content: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                        Discover and register for CME events, track your hours, and manage your certificates all in one place.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                            <Search className="w-8 h-8 text-[var(--apple-blue)] mb-2" />
                            <p className="font-medium text-[var(--label)]">Search Events</p>
                            <p className="text-sm text-[var(--secondary-label)]">Find CME events by specialty, location, or date</p>
                        </LiquidGlassCard>
                        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                            <Calendar className="w-8 h-8 text-[var(--apple-green)] mb-2" />
                            <p className="font-medium text-[var(--label)]">Track Hours</p>
                            <p className="text-sm text-[var(--secondary-label)]">Monitor your CME hours and requirements</p>
                        </LiquidGlassCard>
                    </div>
                </div>
            ),
            contentAr: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                                     .
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                            <Search className="w-8 h-8 text-[var(--apple-blue)] mb-2" />
                            <p className="font-medium text-[var(--label)]">  </p>
                            <p className="text-sm text-[var(--secondary-label)]">          </p>
                        </LiquidGlassCard>
                        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                            <Calendar className="w-8 h-8 text-[var(--apple-green)] mb-2" />
                            <p className="font-medium text-[var(--label)]"> </p>
                            <p className="text-sm text-[var(--secondary-label)]">    </p>
                        </LiquidGlassCard>
                    </div>
                </div>
            ),
        },
        {
            title: "Register for Events",
            titleAr: "  ",
            content: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                        One-click registration with automatic form filling. View your tickets and manage registrations easily.
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-[var(--apple-green)]" />
                            <span className="text-[var(--label)]">Quick registration process</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-[var(--apple-green)]" />
                            <span className="text-[var(--label)]">Digital ticket management</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-[var(--apple-green)]" />
                            <span className="text-[var(--label)]">Calendar integration</span>
                        </li>
                    </ul>
                </div>
            ),
            contentAr: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                              .     .
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-[var(--apple-green)]" />
                            <span className="text-[var(--label)]">  </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-[var(--apple-green)]" />
                            <span className="text-[var(--label)]">  </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-[var(--apple-green)]" />
                            <span className="text-[var(--label)]"> </span>
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            title: "Track Your CME Hours",
            titleAr: "   ",
            content: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                        Monitor your CME hours, view your certificate portfolio, and sync with Mumaris Plus.
                    </p>
                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                        <Award className="w-8 h-8 text-[var(--apple-yellow)] mb-2" />
                        <p className="font-medium text-[var(--label)]">Digital Certificates</p>
                        <p className="text-sm text-[var(--secondary-label)]">All your certificates in one secure portfolio</p>
                    </LiquidGlassCard>
                </div>
            ),
            contentAr: (
                <div className="space-y-4">
                    <p className="text-[var(--label)]">
                                  .
                    </p>
                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                        <Award className="w-8 h-8 text-[var(--apple-yellow)] mb-2" />
                        <p className="font-medium text-[var(--label)]"> </p>
                        <p className="text-sm text-[var(--secondary-label)]">     </p>
                    </LiquidGlassCard>
                </div>
            ),
        },
    ];

    return <OnboardingFlow steps={steps} onComplete={onComplete} onSkip={onSkip} />;
}

