"use client";

import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Award, FileCheck, Plus } from "lucide-react";
import { DEMO_STATS } from "@/lib/mockData";
import { ActivityCard } from "@/components/shared/ActivityCard";

interface DashboardProps {
    onCreateClick: () => void;
    onEventClick?: (eventId: string) => void;
}

export default function Dashboard({ onCreateClick, onEventClick }: DashboardProps) {
    const { events } = usePersona();
    const { t, language } = useLanguage();
    
    const stats = [
        {
            label: t('stats.totalEvents'),
            value: DEMO_STATS.totalEvents,
            icon: Calendar,
            color: 'text-[var(--apple-blue)]',
            bgColor: 'bg-[var(--apple-blue)]/10',
        },
        {
            label: t('stats.registrations'),
            value: DEMO_STATS.totalRegistrations.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US'),
            icon: Users,
            color: 'text-[var(--apple-green)]',
            bgColor: 'bg-[var(--apple-green)]/10',
        },
        {
            label: t('stats.cmeHours'),
            value: DEMO_STATS.totalCMEHours,
            icon: Award,
            color: 'text-[var(--apple-yellow)]',
            bgColor: 'bg-[var(--apple-yellow)]/10',
        },
        {
            label: t('stats.pendingApprovals'),
            value: DEMO_STATS.pendingApprovals,
            icon: FileCheck,
            color: 'text-[var(--apple-purple)]',
            bgColor: 'bg-[var(--apple-purple)]/10',
        },
    ];

    const publishedEvents = events.filter(e => e.status === 'Published');
    const pendingEvents = events.filter(e => e.status === 'Pending Approval' || (e.status === 'Draft' && e.needs_sponsorship));

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} glass={true} interactive={true} className="border-[var(--border)]">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-[var(--secondary-label)] mb-1">
                                            {stat.label}
                                        </p>
                                        <p className="text-2xl font-bold text-[var(--label)]">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-ios-sm ${stat.bgColor} shadow-sm backdrop-blur-sm`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--label)]">{t('stats.activeEvents')}</h2>
                    <p className="text-sm text-[var(--secondary-label)] mt-1">
                        {publishedEvents.length} {t('stats.published')} • {pendingEvents.length} {t('stats.underReview')}
                    </p>
                </div>
                <Button onClick={onCreateClick} className="gap-2 flex items-center justify-center">
                    <Plus className="h-4 w-4" />
                    {t('organizer.createEvent')}
                </Button>
            </div>

            {/* Events Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => {
                    // Deterministic mock registration count based on event ID (for consistent SSR)
                    const eventIdNum = parseInt(event.id.replace(/\D/g, '')) || 1;
                    const mockRegistrations = 50 + (eventIdNum * 23) % 200; // Deterministic based on ID
                    const mockCapacity = event.is_sponsored && event.status === 'Published' ? 300 : undefined;
                    return (
                        <ActivityCard
                            key={event.id}
                            event={event}
                            context="organizer"
                            variant="full"
                            showDescription={true}
                            registrationCount={event.status === 'Published' ? mockRegistrations : undefined}
                            capacity={mockCapacity}
                            actionButton={onEventClick ? {
                                label: language === 'ar' ? ' ' : 'View Details',
                                onClick: () => onEventClick(event.id),
                                variant: 'default'
                            } : undefined}
                        />
                    );
                })}
            </div>
        </div>
    );
}
