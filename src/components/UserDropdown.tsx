"use client";

import { useState, useRef, useEffect } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserDropdown() {
    const { userSession } = usePersona();
    const { language, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[var(--system-fill)] transition-colors"
                aria-label="User menu"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--apple-green)]/20 border-2 border-[var(--apple-green)]/30 backdrop-blur-sm">
                    <User className="h-5 w-5 text-[var(--apple-green)]" />
                </div>
                <ChevronDown className={cn(
                    "h-4 w-4 text-[var(--secondary-label)] transition-transform",
                    isOpen && "rotate-180"
                )} />
            </button>

            {isOpen && (
                <div className={cn(
                    "absolute top-full mt-2 w-56 rounded-ios border border-[var(--border)] bg-[var(--system-background)] backdrop-blur-xl shadow-lg z-50",
                    language === 'ar' ? "left-0" : "right-0"
                )}>
                    <div className="p-2">
                        {/* User Info */}
                        <div className="px-3 py-2 border-b border-[var(--separator)]">
                            <p className="text-sm font-medium text-[var(--label)]">
                                {userSession.name}
                            </p>
                            <p className="text-xs text-[var(--secondary-label)] mt-0.5">
                                {userSession.role_label}
                            </p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--label)] hover:bg-[var(--system-fill)] rounded-ios-sm transition-colors inline-flex items-center justify-center"
                            >
                                <User className="h-4 w-4" />
                                <span>{t('common.profile')}</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--label)] hover:bg-[var(--system-fill)] rounded-ios-sm transition-colors inline-flex items-center justify-center"
                            >
                                <Settings className="h-4 w-4" />
                                <span>{t('common.settings')}</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--apple-red)] hover:bg-[var(--apple-red)]/10 rounded-ios-sm transition-colors inline-flex items-center justify-center"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>{t('common.logout')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

