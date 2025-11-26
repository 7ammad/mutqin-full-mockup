"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Persona } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { 
    Moon, 
    Sun, 
    Stethoscope, 
    Languages, 
    Menu,
    X,
    User,
    LogOut
} from "lucide-react";
import UserDropdown from "@/components/UserDropdown";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import { GlassButton } from "@/components/ui/glass-button";

export default function DashboardLayout({ 
    children, 
    role 
}: { 
    children: React.ReactNode;
    role: Persona;
}) {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // On desktop (lg+), sidebar should be open by default
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getUserDisplayName = () => {
        if (!user) return '';
        return user.nameAr || user.nameEn || user.name;
    };

    const getUserRoleLabel = () => {
        if (!user) return '';
        const roleLabels: Record<Persona, { ar: string; en: string }> = {
            ORGANIZER: { ar: 'المنظم', en: 'Organizer' },
            VENDOR: { ar: 'الداعم', en: 'Vendor' },
            REGULATOR: { ar: 'المعتمد', en: 'Regulator' },
            HCP: { ar: 'الممارس الصحي', en: 'Healthcare Professional' },
            EVENT_MANAGER: { ar: 'مدير الفعاليات', en: 'Event Manager' },
        };
        return language === 'ar' ? roleLabels[role].ar : roleLabels[role].en;
    };

    return (
        <div className="min-h-screen bg-[var(--system-background)]">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 z-40 h-screen w-64 border-[var(--border)] bg-[var(--secondary-system-background)] backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
                    language === 'ar' 
                        ? "right-0 border-l" 
                        : "left-0 border-r",
                    sidebarOpen ? "translate-x-0" : (language === 'ar' ? "translate-x-full" : "-translate-x-full")
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo Section */}
                    <div className="flex h-20 items-center justify-between border-b border-[var(--separator)] px-6">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-ios-sm bg-[var(--apple-green)] shadow-sm">
                                <Stethoscope className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-lg text-[var(--label)] tracking-tight">
                                MEDEVENT
                            </span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1.5 rounded-ios-sm hover:bg-[var(--system-fill)] transition-colors"
                        >
                            <X className="h-5 w-5 text-[var(--label)]" />
                        </button>
                    </div>

                    {/* Navigation - Role-specific menu items can be added here later */}
                    <nav className="flex-1 space-y-1.5 px-3 py-4">
                        {/* Navigation items will be role-specific and added in future phases */}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="border-t border-[var(--separator)] p-4 space-y-3">
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--system-fill)]">
                                <User className="h-4 w-4 text-[var(--secondary-label)]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[var(--label)] truncate">
                                    {getUserDisplayName()}
                                </p>
                                <p className="text-xs text-[var(--secondary-label)] truncate">
                                    {getUserRoleLabel()}
                                </p>
                            </div>
                        </div>
                        <GlassButton
                            variant="outline"
                            size="sm"
                            onClick={logout}
                            className="w-full"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                        </GlassButton>
                    </div>
                </div>
            </aside>

            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className={cn(
                "transition-all duration-300",
                language === 'ar' ? "lg:mr-64" : "lg:ml-64"
            )}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 h-16 sm:h-20 border-b border-[var(--separator)] bg-[var(--system-background)]/95 backdrop-blur-xl shadow-sm">
                    <div className="h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2">
                        {/* Left: Menu Button + Title Section */}
                        <div className="flex items-center gap-4 flex-1">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-ios-sm hover:bg-[var(--system-fill)] transition-colors lg:hidden"
                                aria-label={language === 'ar' ? 'فتح القائمة' : 'Open menu'}
                                aria-expanded={sidebarOpen}
                            >
                                <Menu className="h-5 w-5 text-[var(--label)]" aria-hidden="true" />
                            </button>
                            
                            <div className="flex-1">
                                <PageTitle />
                            </div>
                        </div>

                        {/* Right: Controls */}
                        <div className="flex items-center gap-2">
                            {/* Language Toggle */}
                            <button
                                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-ios-sm hover:bg-[var(--system-fill)] transition-colors"
                                aria-label="Toggle Language"
                                title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
                            >
                                <Languages className="h-4 w-4 text-[var(--secondary-label)]" />
                                <span className="text-sm font-medium text-[var(--label)]">
                                    {language === 'ar' ? 'EN' : 'AR'}
                                </span>
                            </button>

                            {/* Theme Toggle */}
                            {mounted && (
                                <button
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="p-2 rounded-ios-sm hover:bg-[var(--system-fill)] transition-colors"
                                    aria-label={language === 'ar' ? 'تبديل المظهر' : 'Toggle Theme'}
                                    title={language === 'ar' ? 'تبديل المظهر' : 'Toggle Theme'}
                                >
                                    {theme === "dark" ? (
                                        <Sun className="h-5 w-5 text-[var(--apple-yellow)]" />
                                    ) : (
                                        <Moon className="h-5 w-5 text-[var(--secondary-label)]" />
                                    )}
                                </button>
                            )}

                            {/* User Dropdown */}
                            <UserDropdown />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-3 sm:p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

