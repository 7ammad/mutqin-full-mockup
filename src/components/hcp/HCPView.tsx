"use client";

import { useState } from "react";
import DiscoveryGrid from "./DiscoveryGrid";
import MyTickets from "./MyTickets";
import CMETrackingDashboard from "./CMETrackingDashboard";
import CertificatePortfolio from "./CertificatePortfolio";
import LearningProfile from "./LearningProfile";
import ReviewsRatings from "./ReviewsRatings";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Ticket, BarChart3, FileText, GraduationCap, Star } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getEventTitle } from "@/lib/eventTranslations";

export default function HCPView() {
    const [view, setView] = useState<'DISCOVERY' | 'TICKETS' | 'TRACKING' | 'CERTIFICATES' | 'PROFILE' | 'REVIEWS'>('DISCOVERY');
    const { events, myTickets } = usePersona();
    const { t, language } = useLanguage();
    
    // Calculate CME stats
    const registeredEvents = events.filter(e => myTickets.includes(e.id));
    const totalCMEHours = registeredEvents.reduce((sum, e) => sum + e.cme_hours, 0);
    const requiredHours = 40; // Annual requirement for specialists
    const progress = Math.min((totalCMEHours / requiredHours) * 100, 100);
    const remainingHours = Math.max(requiredHours - totalCMEHours, 0);

    return (
        <div className="space-y-6">
            {/* CME Tracking Card */}
            <Card glass={true} interactive={false} className="border-2 border-[var(--apple-green)]/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[var(--label)]">
                        <BarChart3 className="h-5 w-5 text-[var(--apple-green)]" />
                        {t('hcp.cmeTracking')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-[var(--label)]">
                                    {totalCMEHours}
                                </p>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    {t('hcp.hoursEarned')} {registeredEvents.length} {t('hcp.events')}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-[var(--apple-green)]">
                                    {Math.round(progress)}%
                                </p>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    {t('hcp.annualGoal')}
                                </p>
                            </div>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--secondary-label)]">
                                {t('hcp.goal')}: {requiredHours} {t('hcp.hoursPerYear')}
                            </span>
                            <span className={`font-medium ${remainingHours > 0 ? 'text-[var(--apple-orange)]' : 'text-[var(--apple-green)]'}`}>
                                {remainingHours > 0 ? `${t('hcp.remaining')}: ${remainingHours} ${t('hcp.hours')}` : t('hcp.goalAchieved')}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Navigation Tabs */}
            <div className="flex justify-center">
                <div className="bg-[var(--secondary-system-fill)] p-1 rounded-ios inline-flex backdrop-blur-sm">
                    <Button
                        variant={view === 'DISCOVERY' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('DISCOVERY')}
                        className="gap-2"
                    >
                        <LayoutGrid className="h-4 w-4" />
                        {t('hcp.allEvents')}
                    </Button>
                    <Button
                        variant={view === 'TICKETS' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('TICKETS')}
                        className="gap-2"
                    >
                        <Ticket className="h-4 w-4" />
                        {t('hcp.myTickets')} ({registeredEvents.length})
                    </Button>
                    <Button
                        variant={view === 'TRACKING' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('TRACKING')}
                        className="gap-2"
                    >
                        <BarChart3 className="h-4 w-4" />
                        {t('hcp.tracking')}
                    </Button>
                    <Button
                        variant={view === 'CERTIFICATES' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('CERTIFICATES')}
                        className="gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        {language === 'ar' ? 'الشهادات' : 'Certificates'}
                    </Button>
                    <Button
                        variant={view === 'PROFILE' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('PROFILE')}
                        className="gap-2"
                    >
                        <GraduationCap className="h-4 w-4" />
                        {language === 'ar' ? 'الملف التعليمي' : 'Learning Profile'}
                    </Button>
                    <Button
                        variant={view === 'REVIEWS' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('REVIEWS')}
                        className="gap-2"
                    >
                        <Star className="h-4 w-4" />
                        {language === 'ar' ? 'التقييمات' : 'Reviews'}
                    </Button>
                </div>
            </div>

            {/* Content Views */}
            {view === 'DISCOVERY' && <DiscoveryGrid />}
            {view === 'TICKETS' && <MyTickets />}
            {view === 'TRACKING' && <CMETrackingDashboard />}
            {view === 'CERTIFICATES' && <CertificatePortfolio />}
            {view === 'PROFILE' && <LearningProfile />}
            {view === 'REVIEWS' && <ReviewsRatings />}
        </div>
    );
}
