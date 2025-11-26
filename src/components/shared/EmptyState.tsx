"use client";

import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
    actionLabel?: string;
    actionLabelAr?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    titleAr,
    description,
    descriptionAr,
    actionLabel,
    actionLabelAr,
    onAction,
    className,
}: EmptyStateProps) {
    const { language } = useLanguage();

    const displayTitle = language === 'ar' && titleAr ? titleAr : title;
    const displayDescription = language === 'ar' && descriptionAr ? descriptionAr : description;
    const displayActionLabel = language === 'ar' && actionLabelAr ? actionLabelAr : actionLabel;

    return (
        <LiquidGlassCard
            blurIntensity="lg"
            interactive={false}
            className={`p-12 ${className || ''}`}
        >
            <div className="text-center space-y-4">
                {Icon && (
                    <div className="flex justify-center">
                        <div className="p-4 rounded-full bg-[var(--system-fill)]">
                            <Icon className="w-12 h-12 text-[var(--secondary-label)]" />
                        </div>
                    </div>
                )}
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-[var(--label)]">
                        {displayTitle}
                    </h3>
                    <p className="text-sm text-[var(--secondary-label)] max-w-md mx-auto">
                        {displayDescription}
                    </p>
                </div>
                {onAction && displayActionLabel && (
                    <GlassButton
                        variant="default"
                        onClick={onAction}
                        className="mt-4"
                    >
                        {displayActionLabel}
                    </GlassButton>
                )}
            </div>
        </LiquidGlassCard>
    );
}

