"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { BarChart3, ChevronDown, ChevronUp, Target, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCmeData } from "@/hooks/useCmeData";

interface CompactCMETrackerProps {
    variant?: "circular" | "hourglass" | "compact-bar" | "badge";
    showInHeader?: boolean;
    expandable?: boolean;
}

/**
 * Compact CME Tracker Component
 * 
 * Multiple design variants:
 * - circular: Circular progress indicator (most compact)
 * - hourglass: Hourglass-shaped progress (unique, time-related)
 * - compact-bar: Horizontal compact bar
 * - badge: Minimal badge with percentage
 * 
 * Designed to replace the large banner in HCPView
 */
export default function CompactCMETracker({ 
    variant = "circular",
    showInHeader = false,
    expandable = true 
}: CompactCMETrackerProps) {
    const { language } = useLanguage();
    const { events, myTickets } = usePersona();
    const [isExpanded, setIsExpanded] = useState(false);
    const [animatedHours, setAnimatedHours] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close expanded view when clicking outside
    useEffect(() => {
        if (!isExpanded || !showInHeader) return;

        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExpanded, showInHeader]);

    // Get unified CME data from single source
    const hcpId = "hcp-1";
    const cmeData = useCmeData(hcpId);
    
    // Use unified values
    const totalCMEHours = cmeData.currentHours;
    const requiredHours = cmeData.requiredHours;
    const progress = cmeData.progress;
    const remainingHours = cmeData.remainingHours;

    // Animate hours counter
    useEffect(() => {
        const duration = 1000;
        const steps = 30;
        const increment = totalCMEHours / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= totalCMEHours) {
                setAnimatedHours(totalCMEHours);
                clearInterval(timer);
            } else {
                setAnimatedHours(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [totalCMEHours]);

    // Circular Progress SVG Component
    const CircularProgress = ({ size = 48, strokeWidth = 4 }: { size?: number; strokeWidth?: number }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress / 100) * circumference;

        return (
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--system-fill)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--apple-green)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                />
                {/* Center text */}
                <text
                    x={size / 2}
                    y={size / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-bold fill-[var(--label)]"
                    style={{ fontSize: size * 0.2 }}
                >
                    {Math.round(progress)}%
                </text>
            </svg>
        );
    };

    // Hourglass Progress Component
    const HourglassProgress = ({ size = 48 }: { size?: number }) => {
        const fillHeight = (progress / 100) * size;
        const isFilled = progress >= 100;

        return (
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Hourglass shape */}
                    <path
                        d={`M ${size * 0.2} 0 L ${size * 0.8} 0 L ${size * 0.6} ${size * 0.5} L ${size * 0.8} ${size} L ${size * 0.2} ${size} L ${size * 0.4} ${size * 0.5} Z`}
                        fill="none"
                        stroke="var(--system-fill)"
                        strokeWidth="2"
                    />
                    {/* Top fill */}
                    {!isFilled && (
                        <motion.rect
                            x={size * 0.2}
                            y={0}
                            width={size * 0.6}
                            height={fillHeight}
                            fill="var(--apple-green)"
                            initial={{ height: 0 }}
                            animate={{ height: fillHeight }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            opacity={0.3}
                        />
                    )}
                    {/* Bottom fill (when complete) */}
                    {isFilled && (
                        <motion.rect
                            x={size * 0.2}
                            y={size * 0.5}
                            width={size * 0.6}
                            height={size * 0.5}
                            fill="var(--apple-green)"
                            initial={{ height: 0 }}
                            animate={{ height: size * 0.5 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            opacity={0.3}
                        />
                    )}
                </svg>
                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-[var(--label)]">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>
        );
    };

    // Compact content (shown in header or inline)
    const compactContent = (
        <div className={cn(
            "flex items-center gap-3",
            showInHeader ? "px-2 py-1" : "px-4 py-3"
        )}>
            {variant === "circular" && (
                <>
                    <CircularProgress size={showInHeader ? 40 : 56} strokeWidth={4} />
                    <div className="flex flex-col min-w-0">
                        <span className="text-base font-semibold text-[var(--label)] leading-tight">
                            {Math.round(animatedHours)}/{requiredHours}
                        </span>
                        <span className="text-xs text-[var(--secondary-label)] leading-tight">
                            {language === "ar" ? "ساعة CME" : "CME hrs"}
                        </span>
                    </div>
                </>
            )}

            {variant === "hourglass" && (
                <>
                    <HourglassProgress size={showInHeader ? 40 : 48} />
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-[var(--label)] leading-tight">
                            {Math.round(animatedHours)}/{requiredHours}
                        </span>
                        <span className="text-xs text-[var(--secondary-label)] leading-tight">
                            {language === "ar" ? "ساعة CME" : "CME hrs"}
                        </span>
                    </div>
                </>
            )}

            {variant === "compact-bar" && (
                <div className="flex items-center gap-2 min-w-0">
                    <BarChart3 className="h-4 w-4 text-[var(--apple-green)] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-sm font-semibold text-[var(--label)]">
                                {Math.round(animatedHours)}/{requiredHours}
                            </span>
                            <span className="text-xs text-[var(--apple-green)] font-medium">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="w-full bg-[var(--system-fill)] rounded-full h-1.5">
                            <motion.div
                                className="bg-[var(--apple-green)] h-1.5 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {variant === "badge" && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--apple-green)]/10 border border-[var(--apple-green)]/20">
                    <Target className="h-3.5 w-3.5 text-[var(--apple-green)]" />
                    <span className="text-xs font-semibold text-[var(--apple-green)]">
                        {Math.round(animatedHours)}/{requiredHours}
                    </span>
                    <span className="text-xs text-[var(--apple-green)]/70">
                        ({Math.round(progress)}%)
                    </span>
                </div>
            )}

            {expandable && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="p-2 rounded-ios-sm hover:bg-[var(--system-fill)] transition-colors flex-shrink-0 ml-auto"
                    aria-label={language === "ar" ? "عرض التفاصيل" : "View details"}
                >
                    {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-[var(--secondary-label)]" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-[var(--secondary-label)]" />
                    )}
                </button>
            )}
        </div>
    );

    // Expanded detail view
    const expandedContent = (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                        "overflow-hidden",
                        showInHeader && "absolute top-full left-0 right-0 z-50 mt-1 bg-[var(--system-background)] rounded-lg border border-[var(--separator)] shadow-lg p-4 min-w-[280px]"
                    )}
                >
                    <div className={cn(
                        "space-y-2",
                        !showInHeader && "pt-3 mt-3 border-t border-[var(--separator)]"
                    )}>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-[var(--secondary-label)] mb-1">
                                    {language === "ar" ? "مكتسب" : "Earned"}
                                </p>
                                <p className="text-lg font-bold text-[var(--label)]">
                                    {Math.round(animatedHours)} {language === "ar" ? "ساعة" : "hrs"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[var(--secondary-label)] mb-1">
                                    {language === "ar" ? "المتبقي" : "Remaining"}
                                </p>
                                <p className={cn(
                                    "text-lg font-bold",
                                    remainingHours > 0 ? "text-[var(--apple-orange)]" : "text-[var(--apple-green)]"
                                )}>
                                    {remainingHours} {language === "ar" ? "ساعة" : "hrs"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[var(--secondary-label)]">
                            <span>
                                {cmeData.creditsData.items.length} {language === "ar" ? "فعالية" : "events"}
                            </span>
                            <span>
                                {language === "ar" ? "الهدف" : "Goal"}: {requiredHours} {language === "ar" ? "ساعة/سنة" : "hrs/year"}
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Header variant (minimal, no card wrapper)
    if (showInHeader) {
        return (
            <div ref={containerRef} className="relative">
                {compactContent}
                {expandedContent}
            </div>
        );
    }

    // Inline variant (with card wrapper)
    return (
        <LiquidGlassCard 
            blurIntensity="md" 
            interactive={false}
            className="transition-all"
        >
            <div className="flex items-center justify-between">
                {compactContent}
            </div>
            {expandedContent}
        </LiquidGlassCard>
    );
}
