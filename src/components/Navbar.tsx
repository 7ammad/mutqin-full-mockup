"use client";

import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { Persona } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Moon, Sun, Stethoscope, Building2, Briefcase, Languages, Shield, Calendar } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { currentPersona, switchPersona, userSession } = usePersona();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const personas: { id: Persona; labelAr: string; labelEn: string; icon: React.ElementType }[] = [
        { id: 'ORGANIZER', labelAr: '', labelEn: 'Organizer', icon: Building2 },
        { id: 'VENDOR', labelAr: '', labelEn: 'Vendor', icon: Briefcase },
        { id: 'REGULATOR', labelAr: '', labelEn: 'Regulator', icon: Shield },
        { id: 'HCP', labelAr: ' ', labelEn: 'HCP', icon: Stethoscope },
        { id: 'EVENT_MANAGER', labelAr: ' ', labelEn: 'Event Manager', icon: Calendar },
    ];

    return (
        <div className="sticky top-4 z-50 w-full px-4">
            <nav className="mx-auto max-w-6xl rounded-ios-lg border border-[var(--border)] bg-[var(--system-background)]/80 backdrop-blur-xl px-4 shadow-lg">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-[var(--apple-green)]">
                        <Stethoscope className="h-6 w-6" />
                        <span>MedEvent KSA</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Persona Switcher */}
                        <div className="hidden md:flex items-center p-1 bg-[var(--secondary-system-fill)] rounded-ios backdrop-blur-sm">
                            {personas.map((p) => (
                                <button key={p.id}
                                    onClick={() => switchPersona(p.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-ios-sm transition-all",
                                        currentPersona === p.id
                                            ? "bg-[var(--system-background)] text-[var(--apple-green)] shadow-sm backdrop-blur-sm"
                                            : "text-[var(--secondary-label)] hover:text-[var(--label)]"
                                    )}
                                >
                                    <p.icon className="h-4 w-4" />
                                    <span className="hidden sm:inline">{language === 'ar' ? p.labelAr : p.labelEn}</span>
                                </button>
                            ))}
                        </div>

                        {/* Mobile Persona Switcher (Icon Only) */}
                        <div className="flex md:hidden items-center p-1 bg-[var(--secondary-system-fill)] rounded-ios backdrop-blur-sm">
                            {personas.map((p) => (
                                <button key={p.id}
                                    onClick={() => switchPersona(p.id)}
                                    className={cn(
                                        "p-2 rounded-ios-sm transition-all",
                                        currentPersona === p.id
                                            ? "bg-[var(--system-background)] text-[var(--apple-green)] shadow-sm backdrop-blur-sm"
                                            : "text-[var(--secondary-label)]"
                                    )}
                                >
                                    <p.icon className="h-4 w-4" />
                                </button>
                            ))}
                        </div>

                        {/* User Info */}
                        <div className="hidden lg:flex flex-col items-end text-xs">
                            <span className="font-semibold text-[var(--label)]">
                                {userSession.name}
                            </span>
                            <span className="text-[var(--secondary-label)]">
                                {userSession.role_label}
                            </span>
                        </div>

                        {/* Language Toggle */}
                        <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                            className="p-2 rounded-full hover:bg-[var(--system-fill)] transition-colors border border-transparent hover:border-[var(--border)] flex items-center gap-1.5"
                            aria-label="Toggle Language"
                            title={language === 'ar' ? 'Switch to English' : '  '}
                        >
                            <Languages className="h-5 w-5 text-[var(--secondary-label)]" />
                            <span className="text-sm font-medium text-[var(--label)]">
                                {language === 'ar' ? 'EN' : 'AR'}
                            </span>
                        </button>

                        {/* Theme Toggle */}
                        {mounted && (
                            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-full hover:bg-[var(--system-fill)] transition-colors border border-transparent hover:border-[var(--border)]"
                                aria-label={language === 'ar' ? ' ' : 'Toggle Theme'}
                                title={language === 'ar' ? ' ' : 'Toggle Theme'}
                            >
                                {theme === "dark" ? (
                                    <Sun className="h-5 w-5 text-[var(--apple-yellow)]" />
                                ) : (
                                    <Moon className="h-5 w-5 text-[var(--secondary-label)]" />
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}
