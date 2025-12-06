"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Persona } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import {
    Moon,
    Sun,
    Languages,
    Menu,
    X,
    User,
    LogOut,
    FileText,
    HelpCircle,
    Calendar,
    Package,
    Building2,
    ClipboardList,
    Inbox,
    Eye,
    History,
    Shield,
    BarChart3,
    LayoutDashboard,
    Activity,
    CheckCircle2,
    Users
} from "lucide-react";
import { MutqinLogo } from "@/components/MutqinLogo";
import UserDropdown from "@/components/UserDropdown";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import CompactCMETracker from "@/components/hcp/CompactCMETracker";

type NavItem = {
    key: string;
    icon: typeof FileText;
    label: { en: string; ar: string };
    path: string;
    count?: number;
};

// Navigation configuration per persona
const getNavItemsForPersona = (persona: Persona, language: 'en' | 'ar'): NavItem[] => {
    switch (persona) {
        case 'REGULATOR':
            return [
                {
                    key: 'queue',
                    icon: Inbox,
                    label: { en: 'Queue', ar: ' ' },
                    path: '/dashboard/regulator?tab=queue'
                },
                {
                    key: 'review',
                    icon: Eye,
                    label: { en: 'Review Workspace', ar: ' ' },
                    path: '/dashboard/regulator?tab=review'
                },
                {
                    key: 'decisions',
                    icon: History,
                    label: { en: 'Decisions', ar: '' },
                    path: '/dashboard/regulator?tab=decisions'
                },
                {
                    key: 'monitoring',
                    icon: Shield,
                    label: { en: 'Monitoring', ar: ' ' },
                    path: '/dashboard/regulator?tab=monitoring'
                },
                {
                    key: 'analytics',
                    icon: BarChart3,
                    label: { en: 'Analytics', ar: '' },
                    path: '/dashboard/regulator?tab=analytics'
                }
            ];
        case 'ORGANIZER':
            return [
                {
                    key: 'overview',
                    icon: LayoutDashboard,
                    label: { en: 'Overview', ar: ' ' },
                    path: '/dashboard/organizer?tab=overview'
                },
                {
                    key: 'activities',
                    icon: Activity,
                    label: { en: 'Activities', ar: '' },
                    path: '/dashboard/organizer?tab=activities'
                },
                {
                    key: 'accreditation',
                    icon: CheckCircle2,
                    label: { en: 'Accreditation', ar: '' },
                    path: '/dashboard/organizer?tab=accreditation'
                },
                {
                    key: 'execution',
                    icon: ClipboardList,
                    label: { en: 'Execution & Compliance', ar: ' ' },
                    path: '/dashboard/organizer?tab=execution'
                },
                {
                    key: 'sponsors',
                    icon: Users,
                    label: { en: 'Sponsors', ar: '' },
                    path: '/dashboard/organizer?tab=sponsors'
                }
            ];
        case 'VENDOR':
            return [
                {
                    key: 'campaigns',
                    icon: Package,
                    label: { en: 'Campaigns', ar: '' },
                    path: '/dashboard/vendor?tab=campaigns'
                },
                {
                    key: 'events',
                    icon: Calendar,
                    label: { en: 'Events', ar: '' },
                    path: '/dashboard/vendor?tab=events'
                }
            ];
        case 'HCP':
            return [
                {
                    key: 'discover',
                    icon: Calendar,
                    label: { en: 'Discover', ar: '' },
                    path: '/dashboard/hcp?tab=discover'
                },
                {
                    key: 'journey',
                    icon: ClipboardList,
                    label: { en: 'My Journey', ar: '  ' },
                    path: '/dashboard/hcp?tab=journey'
                },
                {
                    key: 'files',
                    icon: FileText,
                    label: { en: 'My Files', ar: '' },
                    path: '/dashboard/hcp?tab=files'
                },
                {
                    key: 'credits',
                    icon: BarChart3,
                    label: { en: 'CME Credits', ar: ' ' },
                    path: '/dashboard/hcp?tab=credits'
                }
            ];
        case 'EVENT_MANAGER':
            return [
                {
                    key: 'inbox',
                    icon: Inbox,
                    label: { en: 'Inbox', ar: '' },
                    path: '/dashboard/event-manager?tab=inbox'
                },
                {
                    key: 'live-ops',
                    icon: Activity,
                    label: { en: 'Live Ops', ar: ' ' },
                    path: '/dashboard/event-manager?tab=live-ops'
                },
                {
                    key: 'attendance',
                    icon: ClipboardList,
                    label: { en: 'Attendance & Exceptions', ar: ' ' },
                    path: '/dashboard/event-manager?tab=attendance'
                },
                {
                    key: 'handover',
                    icon: FileText,
                    label: { en: 'Handover Pack', ar: ' ' },
                    path: '/dashboard/event-manager?tab=handover'
                },
                {
                    key: 'analytics',
                    icon: BarChart3,
                    label: { en: 'Analytics', ar: ' ' },
                    path: '/dashboard/event-manager?tab=analytics'
                }
            ];
        default:
            return [];
    }
};

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
    const searchParams = useSearchParams();
    const router = useRouter();

    const getDefaultTab = (persona: Persona): string => {
        switch (persona) {
            case 'ORGANIZER': return 'overview';
            case 'REGULATOR': return 'queue';
            case 'HCP': return 'discover';
            case 'EVENT_MANAGER': return 'inbox';
            case 'VENDOR': return 'campaigns';
            default: return 'queue';
        }
    };
    const currentTab = searchParams.get('tab') || getDefaultTab(role);

    useEffect(() => {
        setMounted(true);
    }, []);

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
            ORGANIZER: { ar: '', en: 'Organizer' },
            VENDOR: { ar: '', en: 'Vendor' },
            REGULATOR: { ar: '', en: 'Regulator' },
            HCP: { ar: ' ', en: 'Healthcare Professional' },
            EVENT_MANAGER: { ar: ' ', en: 'Event Manager' },
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
                        <MutqinLogo variant="sidebar" />
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1.5 rounded-ios-sm hover:bg-[var(--system-fill)] transition-colors"
                        >
                            <X className="h-5 w-5 text-[var(--label)]" />
                        </button>
                    </div>

                    {/* Navigation - Role-specific menu items */}
                    <nav className="flex-1 space-y-1.5 px-3 py-4">
                        {getNavItemsForPersona(role, language).map((item) => {
                            const Icon = item.icon;
                            const isActive = currentTab === item.key;
                            return (
                                <button key={item.key}
                                    onClick={() => router.push(item.path)}
                                    className={cn(
                                        "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-ios-sm transition-all text-sm",
                                        isActive
                                            ? "bg-[var(--apple-blue)] text-white shadow-sm"
                                            : "text-[var(--label)] hover:bg-[var(--system-fill)]"
                                    )}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon className="h-4 w-4 flex-shrink-0" />
                                        <span className="font-medium truncate">{item.label[language]}</span>
                                    </div>
                                    {item.count !== undefined && item.count > 0 && (
                                        <Badge
                                            variant={isActive ? 'secondary' : 'outline'}
                                            className="ml-auto flex-shrink-0 min-w-[20px] h-5 text-xs"
                                        >
                                            {item.count}
                                        </Badge>
                                    )}
                                </button>
                            );
                        })}
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
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            {language === 'ar' ? ' ' : 'Logout'}
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
                            <button onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-ios-sm hover:bg-[var(--system-fill)] transition-colors lg:hidden"
                                aria-label={language === 'ar' ? ' ' : 'Open menu'}
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
                            {/* CME Tracker - Only for HCP */}
                            {role === 'HCP' && (
                                <div className="hidden sm:flex items-center">
                                    <CompactCMETracker 
                                        variant="circular" 
                                        showInHeader={true}
                                        expandable={true}
                                    />
                                </div>
                            )}

                            {/* Language Toggle */}
                            <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-ios-sm hover:bg-[var(--system-fill)] transition-colors"
                                aria-label="Toggle Language"
                                title={language === 'ar' ? 'Switch to English' : '  '}
                            >
                                <Languages className="h-4 w-4 text-[var(--secondary-label)]" />
                                <span className="text-sm font-medium text-[var(--label)]">
                                    {language === 'ar' ? 'EN' : 'AR'}
                                </span>
                            </button>

                            {/* Theme Toggle */}
                            {mounted && (
                                <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="p-2 rounded-ios-sm hover:bg-[var(--system-fill)] transition-colors"
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


