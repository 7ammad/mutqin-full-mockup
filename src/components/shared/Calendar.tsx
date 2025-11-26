"use client";

import { DayPicker } from "react-day-picker";
import { Locale } from "date-fns";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

interface CalendarProps {
    selected?: Date;
    onSelect?: (date: Date | undefined) => void;
    className?: string;
    disabled?: (date: Date) => boolean;
}

export function Calendar({
    selected,
    onSelect,
    className,
    disabled,
}: CalendarProps) {
    const { language } = useLanguage();

    // Import locales dynamically
    let locale: Locale | undefined;
    try {
        if (language === 'ar') {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            locale = require('date-fns/locale/ar-SA').default;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            locale = require('date-fns/locale/en-US').default;
        }
    } catch {
        // Fallback if locale not available
        locale = undefined;
    }

    return (
        <LiquidGlassCard
            className={cn("p-4", className)}
            blurIntensity="lg"
            interactive={false}
        >
            <DayPicker
                mode="single"
                selected={selected}
                onSelect={onSelect}
                disabled={disabled}
                locale={locale}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                className="rounded-lg"
                classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium text-[var(--label)]",
                    nav: "space-x-1 flex items-center",
                    nav_button: cn(
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                        "text-[var(--label)] hover:bg-[var(--system-fill)] rounded-md"
                    ),
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-[var(--secondary-label)] rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[var(--system-fill)] focus-within:relative focus-within:z-20",
                    day: cn(
                        "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                        "hover:bg-[var(--system-fill)] rounded-md",
                        "text-[var(--label)]"
                    ),
                    day_selected: "bg-[var(--apple-blue)] text-white hover:bg-[var(--apple-blue)] hover:text-white focus:bg-[var(--apple-blue)] focus:text-white",
                    day_today: "bg-[var(--apple-blue)]/10 text-[var(--apple-blue)] font-semibold",
                    day_outside: "text-[var(--tertiary-label)] opacity-50",
                    day_disabled: "text-[var(--tertiary-label)] opacity-50",
                    day_range_middle: "aria-selected:bg-[var(--apple-blue)]/20 aria-selected:text-[var(--label)]",
                    day_hidden: "invisible",
                }}
            />
        </LiquidGlassCard>
    );
}

