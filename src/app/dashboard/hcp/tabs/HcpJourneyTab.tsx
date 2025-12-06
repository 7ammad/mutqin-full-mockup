"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect, useMemo, useRef } from "react";
import { useToast } from "@/components/ui/toast-context";
import { EmptyState } from "@/components/shared/EmptyState";
import { Ticket } from "lucide-react";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { convertDemoEventToEvent } from "@/lib/eventConverter";
import { cn } from "@/lib/utils";
import { formatDate, getEventTitle, getEventOrganizer, getEventLocation } from "@/lib/eventTranslations";
import type { DemoTicket, DemoEvent, DemoCertificate } from "@/context/demoSeed";
import type { Event } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, FileText, Star } from "lucide-react";

interface JourneyActivity {
    event: Event;
    ticket?: DemoTicket;
    certificate?: DemoCertificate;
    status: 'registered' | 'attended' | 'missed';
    registrationStatus: 'confirmed' | 'attended' | 'missed';
}

// Inline Details Dropdown Component
function JourneyDetailsDropdown({ activity }: { activity: JourneyActivity }) {
    const { t, language } = useLanguage();
    const router = useRouter();

    const handleViewTicket = () => {
        if (activity.ticket) {
            const params = new URLSearchParams();
            params.set('tab', 'files');
            params.set('view', 'tickets');
            params.set('activityId', activity.event.id);
            router.push(`/dashboard/hcp?${params.toString()}`);
        }
    };

    const handleViewCertificate = () => {
        if (activity.certificate) {
            const params = new URLSearchParams();
            params.set('tab', 'files');
            params.set('view', 'certificates');
            params.set('activityId', activity.event.id);
            router.push(`/dashboard/hcp?${params.toString()}`);
        }
    };

    const steps = [
        {
            key: 'registered',
            label: t('myJourney.steps.registered'),
            completed: true,
        },
        {
            key: 'checkedIn',
            label: t('myJourney.steps.checkedIn'),
            completed: activity.registrationStatus === 'attended' || activity.status === 'attended',
        },
        {
            key: 'hoursPosted',
            label: t('myJourney.steps.hoursPosted'),
            completed: !!activity.certificate?.cme_hours || !!activity.event.cme_hours,
        },
        {
            key: 'certificateIssued',
            label: t('myJourney.steps.certificateIssued'),
            completed: !!activity.certificate,
        },
        {
            key: 'reviewSubmitted',
            label: t('myJourney.steps.reviewSubmitted'),
            completed: false,
        },
    ];

    return (
        <Card className="border border-[var(--border)] bg-[var(--system-background)]">
            <CardContent className="p-4 space-y-4">
                {/* Event Details */}
                <div className="space-y-2 text-sm">
                    <p className="text-[var(--secondary-label)]">
                        <strong className="text-[var(--label)]">{language === 'ar' ? ':' : 'Organizer:'}</strong> {getEventOrganizer(activity.event, language)}
                    </p>
                    <p className="text-[var(--secondary-label)]">
                        <strong className="text-[var(--label)]">{language === 'ar' ? ':' : 'Location:'}</strong> {getEventLocation(activity.event, language)}
                    </p>
                </div>

                {/* Step Progression Timeline */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--label)]">
                        {language === 'ar' ? '' : 'Progress'}
                    </h3>
                    <div className="space-y-2">
                        {steps.map((step, index) => (
                            <div key={step.key} className="flex items-center gap-3">
                                <div className="flex flex-col items-center">
                                    {step.completed ? (
                                        <CheckCircle2 className="h-4 w-4 text-[var(--apple-green)]" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-[var(--tertiary-label)]" />
                                    )}
                                    {index < steps.length - 1 && (
                                        <div className={cn(
                                            "w-0.5 min-h-[20px] mt-1",
                                            step.completed ? "bg-[var(--apple-green)]" : "bg-[var(--separator)]"
                                        )} />
                                    )}
                                </div>
                                <span className={cn(
                                    "text-sm",
                                    step.completed ? "text-[var(--label)]" : "text-[var(--secondary-label)]"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--separator)]">
                    {activity.ticket && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={handleViewTicket}
                        >
                            <Ticket className="h-3 w-3 mr-1" />
                            {t('myJourney.actions.openTicket')}
                        </Button>
                    )}
                    {activity.certificate && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={handleViewCertificate}
                        >
                            <FileText className="h-3 w-3 mr-1" />
                            {t('myJourney.actions.downloadCertificate')}
                        </Button>
                    )}
                    {activity.status === 'attended' && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                                const params = new URLSearchParams();
                                params.set('tab', 'credits');
                                router.push(`/dashboard/hcp?${params.toString()}`);
                            }}
                        >
                            <Star className="h-3 w-3 mr-1" />
                            {t('myJourney.actions.rateActivity')}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Internal Timeline Component - Kendo-style alternating layout
function HcpJourneyTimeline({ 
    activities, 
    onSelect,
    expandedActivityId,
    onToggleExpand
}: { 
    activities: JourneyActivity[];
    onSelect?: (activity: JourneyActivity) => void;
    expandedActivityId: string | null;
    onToggleExpand: (activityId: string) => void;
}) {
    const { language } = useLanguage();
    const isRTL = language === 'ar';

    if (activities.length === 0) {
        return null;
    }

    const getStatusDotColor = (status: JourneyActivity['status']): string => {
        switch (status) {
            case 'attended':
                return 'bg-[var(--apple-green)] border-[var(--apple-green)]';
            case 'missed':
                return 'bg-red-500 border-red-500';
            default:
                return 'bg-[var(--apple-blue)] border-[var(--apple-blue)]';
        }
    };

    return (
        <div className="relative">
            {/* Vertical center line */}
            <div className={cn(
                "absolute top-0 bottom-0 w-0.5 bg-[var(--separator)]",
                isRTL ? "right-1/2 translate-x-1/2" : "left-1/2 -translate-x-1/2"
            )} />

            {/* Timeline items container */}
            <div className="relative space-y-8">
                {activities.map((activity, index) => {
                    // Alternate sides: even indices on left (or right for RTL), odd on right (or left for RTL)
                    const isEven = index % 2 === 0;
                    const isLeft = isRTL ? !isEven : isEven;
                    
                    return (
                        <div
                            key={activity.event.id}
                            className={cn(
                                "relative flex items-start gap-4",
                                isLeft 
                                    ? (isRTL ? "flex-row-reverse" : "flex-row")
                                    : (isRTL ? "flex-row" : "flex-row-reverse")
                            )}
                        >
                            {/* Left/Right side content */}
                            <div className={cn(
                                "flex-1",
                                isLeft 
                                    ? (isRTL ? "text-right" : "text-left")
                                    : (isRTL ? "text-left" : "text-right")
                            )}>
                                {/* Date Label */}
                                <time className={cn(
                                    "text-xs font-medium text-[var(--secondary-label)] block mb-2",
                                    isLeft ? (isRTL ? "text-right" : "text-left") : (isRTL ? "text-left" : "text-right")
                                )}>
                                    {formatDate(activity.event.date, language)}
                                </time>

                                {/* Activity Card */}
                                <ActivityCard
                                    event={activity.event}
                                    variant="journey"
                                    context="hcp"
                                    journeyStatus={activity.status}
                                    ticketId={activity.ticket?.id}
                                    certificateId={activity.certificate?.id}
                                    onSelect={onSelect ? () => onSelect(activity) : undefined}
                                    onViewDetails={() => onToggleExpand(activity.event.id)}
                                />

                                {/* Expandable Details Section */}
                                {expandedActivityId === activity.event.id && (
                                    <div className="mt-4 border-t border-[var(--separator)] pt-4">
                                        <JourneyDetailsDropdown activity={activity} />
                                    </div>
                                )}
                            </div>

                            {/* Center timeline dot */}
                            <div className={cn(
                                "absolute w-4 h-4 rounded-full border-2 flex-shrink-0 z-10",
                                getStatusDotColor(activity.status),
                                isRTL ? "right-1/2 translate-x-1/2" : "left-1/2 -translate-x-1/2",
                                "ring-4 ring-[var(--system-background)]"
                            )} />

                            {/* Spacer for opposite side (empty on alternating side) */}
                            <div className="flex-1" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function HcpJourneyTab() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t, language } = useLanguage();
    const { showToast } = useToast();
    const [tickets, setTickets] = useState<DemoTicket[]>([]);
    const [events, setEvents] = useState<DemoEvent[]>([]);
    const [certificates, setCertificates] = useState<DemoCertificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { getHcpSummaryFull, getAllEventsFull } = await import('@/lib/dataSource');
                const summary = await getHcpSummaryFull('hcp-1');
                setTickets(summary.tickets);
                setCertificates(summary.certificates);
                
                const eventIds = summary.tickets.map((t: DemoTicket) => t.eventId);
                if (eventIds.length > 0) {
                    const allEvents = await getAllEventsFull();
                    const eventsData = allEvents.filter(e => eventIds.includes(e.id));
                    setEvents(eventsData);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load journey';
                console.error('Error fetching journey:', err);
                showToast(message, 'info');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showToast]);

    // Build journey activities from tickets, events, and certificates
    const journeyActivities = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const activities: JourneyActivity[] = tickets
            .map(ticket => {
                const event = events.find(e => e.id === ticket.eventId);
                if (!event) return null;

                const eventDate = event.date ? new Date(event.date) : null;
                let status: 'registered' | 'attended' | 'missed' = 'registered';
                
                if (eventDate) {
                    const eventDateOnly = new Date(eventDate);
                    eventDateOnly.setHours(0, 0, 0, 0);
                    
                    if (eventDateOnly < now) {
                        // Past event
                        if (ticket.status === 'attended') {
                            status = 'attended';
                        } else {
                            status = 'missed';
                        }
                    }
                }

                const certificate = certificates.find(c => c.eventId === event.id);
                let registrationStatus: 'confirmed' | 'attended' | 'missed' = ticket.status as 'confirmed' | 'attended';
                if (status === 'missed') {
                    registrationStatus = 'missed';
                } else if (status === 'attended') {
                    registrationStatus = 'attended';
                }

                const activity: JourneyActivity = {
                    event: convertDemoEventToEvent(event),
                    ticket,
                    certificate,
                    status,
                    registrationStatus,
                };
                return activity;
            })
            .filter((item): item is JourneyActivity => item !== null);

        // Sort by date (oldest first for timeline)
        activities.sort((a, b) => {
            const dateA = a.event?.date ? new Date(a.event.date).getTime() : 0;
            const dateB = b.event?.date ? new Date(b.event.date).getTime() : 0;
            return dateA - dateB;
        });

        return activities;
    }, [tickets, events, certificates]);

    // Use all journey activities (no filtering)
    const filteredActivities = journeyActivities;


    if (loading) {
        return (
            <div className="space-y-6">
                <div className="text-center py-8 text-[var(--secondary-label)]">
                    {language === 'ar' ? ' ...' : 'Loading journey...'}
                </div>
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <EmptyState
                title={t('myJourney.title')}
                description={language === 'ar' 
                    ? '    '
                    : 'Start by discovering and registering for events'}
                icon={Ticket}
                actionLabel={language === 'ar' ? ' ' : 'Discover events'}
                onAction={() => {
                    const params = new URLSearchParams();
                    params.set('tab', 'discover');
                    router.push(`/dashboard/hcp?${params.toString()}`);
                }}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Timeline (Full Width) */}
            {filteredActivities.length > 0 ? (
                <HcpJourneyTimeline 
                    activities={filteredActivities}
                    onSelect={() => {}}
                    expandedActivityId={expandedActivityId}
                    onToggleExpand={(activityId) => {
                        setExpandedActivityId(expandedActivityId === activityId ? null : activityId);
                    }}
                />
            ) : (
                <EmptyState
                    title={language === 'ar' ? '  ' : 'No activities'}
                    description={language === 'ar' 
                        ? '   '
                        : 'No registered activities'}
                    icon={Ticket}
                />
            )}
        </div>
    );
}

