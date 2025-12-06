"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Ticket, FileText, Star } from "lucide-react";
import { getEventTitle, getEventOrganizer, getEventLocation } from "@/lib/eventTranslations";
import { formatDate } from "@/lib/eventTranslations";
import type { Event } from "@/lib/mockData";
import type { DemoTicket, DemoCertificate } from "@/context/demoSeed";
import { cn } from "@/lib/utils";

interface JourneyActivity {
    event: Event;
    ticket?: DemoTicket;
    certificate?: DemoCertificate;
    status: 'registered' | 'attended' | 'missed';
    registrationStatus: 'confirmed' | 'attended' | 'missed';
}

interface JourneyDetailsPanelProps {
    selected: JourneyActivity | undefined;
}

export function JourneyDetailsPanel({ selected }: JourneyDetailsPanelProps) {
    const { t, language } = useLanguage();
    const router = useRouter();

    if (!selected) {
        return (
            <Card className="lg:sticky lg:top-6 lg:h-fit">
                <CardContent className="p-8 text-center">
                    <div className="text-[var(--secondary-label)] space-y-2">
                        <p className="text-base">
                            {t('myJourney.selectActivity')}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const handleViewTicket = () => {
        if (selected.ticket) {
            const params = new URLSearchParams();
            params.set('tab', 'files');
            params.set('view', 'tickets');
            params.set('activityId', selected.event.id);
            router.push(`/dashboard/hcp?${params.toString()}`);
        }
    };

    const handleViewCertificate = () => {
        if (selected.certificate) {
            const params = new URLSearchParams();
            params.set('tab', 'files');
            params.set('view', 'certificates');
            params.set('activityId', selected.event.id);
            router.push(`/dashboard/hcp?${params.toString()}`);
        }
    };

    const handleRateActivity = () => {
        // Navigate to reviews/ratings if available
        const params = new URLSearchParams();
        params.set('tab', 'credits');
        router.push(`/dashboard/hcp?${params.toString()}`);
    };

    // Determine step completion based on existing data
    const steps = [
        {
            key: 'registered',
            label: t('myJourney.steps.registered'),
            completed: true, // Always true if we have this activity
        },
        {
            key: 'checkedIn',
            label: t('myJourney.steps.checkedIn'),
            completed: selected.registrationStatus === 'attended' || selected.status === 'attended',
        },
        {
            key: 'hoursPosted',
            label: t('myJourney.steps.hoursPosted'),
            completed: !!selected.certificate?.cme_hours || !!selected.event.cme_hours,
        },
        {
            key: 'certificateIssued',
            label: t('myJourney.steps.certificateIssued'),
            completed: !!selected.certificate,
        },
        {
            key: 'reviewSubmitted',
            label: t('myJourney.steps.reviewSubmitted'),
            completed: false, // Would need review data - using existing fields only
        },
    ];

    const statusColors = {
        registered: 'bg-[var(--system-fill)] text-[var(--secondary-label)] border border-[var(--border)]',
        attended: 'bg-[var(--apple-green)]/10 text-[var(--apple-green)] border border-[var(--apple-green)]/30',
        missed: 'bg-red-500/10 text-red-500 border border-red-500/30 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/30',
    };

    return (
        <Card className="lg:sticky lg:top-6 lg:h-fit">
            <CardHeader>
                <CardTitle className="text-lg">
                    {getEventTitle(selected.event, language)}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                    <Badge className={cn("text-xs font-medium", statusColors[selected.status])}>
                        {t(`myJourney.status.${selected.status}`)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Event Details */}
                <div className="space-y-2 text-sm">
                    <p className="text-[var(--secondary-label)]">
                        {getEventOrganizer(selected.event, language)}
                    </p>
                    <p className="text-[var(--secondary-label)]">
                        {getEventLocation(selected.event, language)}
                    </p>
                    <p className="text-[var(--secondary-label)]">
                        {formatDate(selected.event.date, language)}
                    </p>
                </div>

                {/* Step Progression Timeline */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--label)]">
                        {language === 'ar' ? 'التقدم' : 'Progress'}
                    </h3>
                    <div className="space-y-2">
                        {steps.map((step, index) => (
                            <div key={step.key} className="flex items-center gap-3">
                                <div className="flex flex-col items-center">
                                    {step.completed ? (
                                        <CheckCircle2 className="h-5 w-5 text-[var(--apple-green)]" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-[var(--tertiary-label)]" />
                                    )}
                                    {index < steps.length - 1 && (
                                        <div className={cn(
                                            "w-0.5 min-h-[24px] mt-1",
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
                <div className="space-y-2 pt-4 border-t border-[var(--separator)]">
                    {selected.ticket && (
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={handleViewTicket}
                        >
                            <Ticket className="h-4 w-4" />
                            {t('myJourney.actions.openTicket')}
                        </Button>
                    )}
                    {selected.certificate && (
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={handleViewCertificate}
                        >
                            <FileText className="h-4 w-4" />
                            {t('myJourney.actions.downloadCertificate')}
                        </Button>
                    )}
                    {selected.status === 'attended' && (
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={handleRateActivity}
                        >
                            <Star className="h-4 w-4" />
                            {t('myJourney.actions.rateActivity')}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}


