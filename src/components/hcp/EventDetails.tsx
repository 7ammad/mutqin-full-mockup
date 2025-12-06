"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Share2, CheckCircle2, FileText, ListChecks, User, MessageSquare, Network, Send } from "lucide-react";
import { Event } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { getEventTitle, getEventOrganizer } from "@/lib/eventTranslations";
import { useToast } from "@/components/ui/toast-context";
import { api } from "@/lib/api";
import { buildRoute } from "@/lib/routes";
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

interface EventDetailsProps {
    readonly event: Event;
    readonly onClose?: () => void;
    readonly onRegister?: () => void;
    readonly variant?: 'hcp' | 'vendor';
}

export function EventDetails({ event, onClose, onRegister, variant = 'hcp' }: EventDetailsProps) {
    const { language } = useLanguage();
    const { myTickets } = usePersona();
    const { showToast } = useToast();
    const router = useRouter();
    const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set(myTickets));
    const [ticketInfo, setTicketInfo] = useState<{ ticketId: string; status: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'objectives' | 'agenda' | 'speakers'>('overview');
    const isRegistered = registeredIds.has(event.id);
    const isPublished = event.status?.toLowerCase?.() === 'published';
    const isHCP = variant === 'hcp';

    const handleRegister = async () => {
        if (isRegistered || !isPublished) return;
        try {
            const res = await api.createRegistration({ eventId: event.id, hcpId: 'hcp-1' });
            setRegisteredIds((prev) => new Set(prev).add(event.id));
            setTicketInfo({ ticketId: res.ticketId, status: res.status });
            showToast(
                language === 'ar' ? '  ' : 'Registration successful',
                "success"
            );
            if (onRegister) onRegister();
        } catch (err) {
            const message = err instanceof Error ? err.message : (language === 'ar' ? ' ' : 'An error occurred');
            showToast(message, "info");
        }
    };

    const eventUrl = typeof window === 'undefined' ? '' : window.location.href;
    const eventTitle = language === 'ar' ? event.titleAr : event.titleEn;
    const eventDescription = language === 'ar' ? event.descriptionAr : event.descriptionEn;
    const eventDate = new Date(event.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const eventLocation = language === 'ar' ? event.locationAr : event.locationEn;

    const handleShare = () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({
                title: eventTitle,
                text: eventDescription,
                url: eventUrl,
            });
        } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(eventUrl);
            showToast(
                language === 'ar' ? '  ' : 'Link copied',
                "success"
            );
        }
    };

    const shareToTwitter = () => {
        if (typeof window === 'undefined') return;
        const text = encodeURIComponent(`${eventTitle} - ${eventDescription.substring(0, 100)}...`);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(eventUrl)}`, '_blank');
    };

    const shareToLinkedIn = () => {
        if (typeof window === 'undefined') return;
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`, '_blank');
    };

    const shareToWhatsApp = () => {
        if (typeof window === 'undefined') return;
        const text = encodeURIComponent(`${eventTitle}\n${eventDescription.substring(0, 100)}...\n${eventUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    // Tab content
    const tabContent = {
        overview: eventDescription,
        objectives: language === 'ar' 
            ? ' :       .'
            : 'Learning Objectives: Understand fundamental principles and modern practices in the specialty.',
        agenda: language === 'ar'
            ? ' :       .'
            : 'Schedule: Detailed agenda will be provided upon registration.',
        speakers: language === 'ar'
            ? ':      .'
            : 'Speakers: Speaker list will be announced soon.',
    };

    return (
        <div className="space-y-6">
            {/* 2-column layout on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
                {/* Left Column - Event Hero + Info */}
                <div className="space-y-6">
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                        {/* Hero Section */}
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                                        {getEventTitle(event, language)}
                                    </h1>
                                    <p className="text-lg text-[var(--secondary-label)]">
                                        {getEventOrganizer(event, language)}
                                    </p>
                                </div>
                                {onClose && (
                                    <GlassButton
                                        onClick={onClose}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <span>{language === 'ar' ? '' : 'Close'}</span>
                                    </GlassButton>
                                )}
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="default" className="bg-[var(--apple-green)]/10 text-[var(--apple-green)]">
                                    {event.cme_hours} {language === 'ar' ? '' : 'Hours'} CME
                                </Badge>
                                <Badge variant="default" className="bg-[var(--apple-blue)]/10 text-[var(--apple-blue)]">
                                    {getSpecialtyLabel(event.specialty || '', language)}
                                </Badge>
                                {event.is_sponsored && (
                                    <Badge variant="default" className="bg-[var(--apple-purple)]/10 text-[var(--apple-purple)]">
                                        {language === 'ar' ? '' : 'Sponsored'}
                                    </Badge>
                                )}
                            </div>

                            {/* Meta Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-[var(--apple-blue)]/10">
                                        <Calendar className="w-5 h-5 text-[var(--apple-blue)]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[var(--secondary-label)]">
                                            {language === 'ar' ? '' : 'Date'}
                                        </p>
                                        <p className="text-sm font-medium text-[var(--label)]">
                                            {eventDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-[var(--apple-green)]/10">
                                        <MapPin className="w-5 h-5 text-[var(--apple-green)]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[var(--secondary-label)]">
                                            {language === 'ar' ? '' : 'Location'}
                                        </p>
                                        <p className="text-sm font-medium text-[var(--label)]">
                                            {eventLocation}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-[var(--apple-yellow)]/10">
                                        <Clock className="w-5 h-5 text-[var(--apple-yellow)]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[var(--secondary-label)]">
                                            {language === 'ar' ? '' : 'Duration'}
                                        </p>
                                        <p className="text-sm font-medium text-[var(--label)]">
                                            {event.cme_hours} {language === 'ar' ? '' : 'Hours'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Short Description */}
                        <div className="pt-4 border-t border-[var(--separator)] mt-4">
                            <p className="text-[var(--secondary-label)] leading-relaxed line-clamp-4">
                                {eventDescription}
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="pt-4 border-t border-[var(--separator)] mt-4">
                            {/* Tab Buttons */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <GlassButton
                                    onClick={() => setActiveTab('overview')}
                                    variant={activeTab === 'overview' ? 'default' : 'outline'}
                                    size="sm"
                                >
                                    <FileText className="h-4 w-4 shrink-0" />
                                    <span>{language === 'ar' ? ' ' : 'Overview'}</span>
                                </GlassButton>
                                <GlassButton
                                    onClick={() => setActiveTab('objectives')}
                                    variant={activeTab === 'objectives' ? 'default' : 'outline'}
                                    size="sm"
                                >
                                    <ListChecks className="h-4 w-4 shrink-0" />
                                    <span>{language === 'ar' ? '' : 'Objectives'}</span>
                                </GlassButton>
                                <GlassButton
                                    onClick={() => setActiveTab('agenda')}
                                    variant={activeTab === 'agenda' ? 'default' : 'outline'}
                                    size="sm"
                                >
                                    <Calendar className="h-4 w-4 shrink-0" />
                                    <span>{language === 'ar' ? '' : 'Agenda'}</span>
                                </GlassButton>
                                <GlassButton
                                    onClick={() => setActiveTab('speakers')}
                                    variant={activeTab === 'speakers' ? 'default' : 'outline'}
                                    size="sm"
                                >
                                    <User className="h-4 w-4 shrink-0" />
                                    <span>{language === 'ar' ? '' : 'Speakers'}</span>
                                </GlassButton>
                            </div>

                            {/* Tab Content */}
                            <div className="pt-2">
                                <p className="text-[var(--secondary-label)] leading-relaxed">
                                    {tabContent[activeTab]}
                                </p>
                            </div>
                        </div>
                    </LiquidGlassCard>
                </div>

                {/* Right Column - HCP-specific panel (only for HCP variant) */}
                {isHCP && (
                    <div className="space-y-4">
                        {/* Registration State Card */}
                        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                            <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                                {language === 'ar' ? '' : 'Registration'}
                            </h3>
                            {!isRegistered ? (
                                <div className="space-y-3">
                                    <GlassButton
                                        onClick={handleRegister}
                                        variant="default"
                                        size="default"
                                        disabled={!isPublished}
                                        className="w-full"
                                    >
                                        <Users className="h-4 w-4 shrink-0" />
                                        <span>{language === 'ar' ? ' ' : 'Register Now'}</span>
                                    </GlassButton>
                                    <GlassButton
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => {
                                            // Add to calendar functionality (placeholder)
                                            showToast(
                                                language === 'ar' ? '    ' : 'Event added to calendar',
                                                'success'
                                            );
                                        }}
                                    >
                                        <Calendar className="h-4 w-4 shrink-0" />
                                        <span>{language === 'ar' ? '  ' : 'Add to Calendar'}</span>
                                    </GlassButton>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {ticketInfo && (
                                        <div className="p-3 rounded-lg bg-[var(--system-fill)]/30 mb-3">
                                            <p className="text-xs text-[var(--secondary-label)] mb-1">
                                                {language === 'ar' ? ' ' : 'Ticket ID'}
                                            </p>
                                            <p className="text-sm font-medium text-[var(--label)]">
                                                {ticketInfo.ticketId}
                                            </p>
                                        </div>
                                    )}
                                    <GlassButton
                                        onClick={() => {
                                            if (ticketInfo) {
                                                router.push(buildRoute.hcpTicket(ticketInfo.ticketId));
                                            }
                                        }}
                                        variant="default"
                                        size="default"
                                        className="w-full"
                                        disabled={!ticketInfo}
                                    >
                                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                                        <span>{language === 'ar' ? ' ' : 'View Ticket'}</span>
                                    </GlassButton>
                                </div>
                            )}
                        </LiquidGlassCard>

                        {/* Share Card */}
                        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                            <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                                {language === 'ar' ? ' ' : 'Share Event'}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <GlassButton
                                    onClick={shareToWhatsApp}
                                    variant="ghost"
                                    size="icon"
                                    className="h-11 w-11 rounded-full border border-[var(--separator)] hover:bg-[#25D366]/10 hover:border-[#25D366]/40 transition-all duration-200 hover:scale-105"
                                    title="Share on WhatsApp"
                                    aria-label="Share on WhatsApp"
                                >
                                    <MessageSquare className="h-5 w-5 text-[#25D366]" strokeWidth={2} />
                                </GlassButton>
                                <GlassButton
                                    onClick={shareToLinkedIn}
                                    variant="ghost"
                                    size="icon"
                                    className="h-11 w-11 rounded-full border border-[var(--separator)] hover:bg-[#0077B5]/10 hover:border-[#0077B5]/40 transition-all duration-200 hover:scale-105"
                                    title="Share on LinkedIn"
                                    aria-label="Share on LinkedIn"
                                >
                                    <Network className="h-5 w-5 text-[#0077B5]" strokeWidth={2} />
                                </GlassButton>
                                <GlassButton
                                    onClick={shareToTwitter}
                                    variant="ghost"
                                    size="icon"
                                    className="h-11 w-11 rounded-full border border-[var(--separator)] hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/40 transition-all duration-200 hover:scale-105"
                                    title="Share on Twitter"
                                    aria-label="Share on Twitter"
                                >
                                    <Send className="h-5 w-5 text-[#1DA1F2]" strokeWidth={2} />
                                </GlassButton>
                                <GlassButton
                                    onClick={handleShare}
                                    variant="ghost"
                                    size="icon"
                                    className="h-11 w-11 rounded-full border border-[var(--separator)] hover:bg-[var(--system-fill)] hover:border-[var(--separator)] transition-all duration-200 hover:scale-105"
                                    title={language === 'ar' ? '' : 'Share'}
                                    aria-label={language === 'ar' ? '' : 'Share'}
                                >
                                    <Share2 className="h-5 w-5 text-[var(--label)]" strokeWidth={2} />
                                </GlassButton>
                            </div>
                        </LiquidGlassCard>
                    </div>
                )}
            </div>
        </div>
    );
}
