"use client";

import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Share2, CheckCircle2, MessageCircle } from "lucide-react";
import { Event } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { getEventTitle, getEventOrganizer } from "@/lib/eventTranslations";
import { useToast } from "@/components/ui/toast-context";

interface EventDetailsProps {
    readonly event: Event;
    readonly onClose?: () => void;
    readonly onRegister?: () => void;
}

export function EventDetails({ event, onClose, onRegister }: EventDetailsProps) {
    const { language } = useLanguage();
    const { myTickets, registerForEvent } = usePersona();
    const { showToast } = useToast();
    const isRegistered = myTickets.includes(event.id);

    const handleRegister = () => {
        if (!isRegistered) {
            registerForEvent(event.id);
            showToast(
                language === 'ar' ? 'تم التسجيل بنجاح' : 'Registration successful',
                "success"
            );
            if (onRegister) onRegister();
        }
    };

    const eventUrl = globalThis.window === undefined ? '' : globalThis.window.location.href;
    const eventTitle = language === 'ar' ? event.titleAr : event.titleEn;
    const eventDescription = language === 'ar' ? event.descriptionAr : event.descriptionEn;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: eventTitle,
                text: eventDescription,
                url: eventUrl,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(eventUrl);
            showToast(
                language === 'ar' ? 'تم نسخ الرابط' : 'Link copied',
                "success"
            );
        }
    };

    const shareToTwitter = () => {
        const text = encodeURIComponent(`${eventTitle} - ${eventDescription.substring(0, 100)}...`);
        globalThis.window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(eventUrl)}`, '_blank');
    };

    const shareToFacebook = () => {
        globalThis.window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, '_blank');
    };

    const shareToLinkedIn = () => {
        globalThis.window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`, '_blank');
    };

    const shareToWhatsApp = () => {
        const text = encodeURIComponent(`${eventTitle}\n${eventDescription.substring(0, 100)}...\n${eventUrl}`);
        globalThis.window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    return (
        <div className="space-y-6">
            <LiquidGlassCard blurIntensity="xl" interactive={false}>
                <div className="space-y-6">
                    {/* Header */}
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
                                {language === 'ar' ? 'إغلاق' : 'Close'}
                            </GlassButton>
                        )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="default" className="bg-[var(--apple-blue)]/10 text-[var(--apple-blue)]">
                            {event.specialty}
                        </Badge>
                        <Badge variant="default" className="bg-[var(--apple-green)]/10 text-[var(--apple-green)]">
                            {event.cme_hours} {language === 'ar' ? 'ساعة' : 'Hours'} CME
                        </Badge>
                        {event.is_sponsored && (
                            <Badge variant="default" className="bg-[var(--apple-purple)]/10 text-[var(--apple-purple)]">
                                {language === 'ar' ? 'مدعوم' : 'Sponsored'}
                            </Badge>
                        )}
                    </div>

                    {/* Key Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[var(--apple-blue)]/10">
                                <Calendar className="w-5 h-5 text-[var(--apple-blue)]" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    {language === 'ar' ? 'التاريخ' : 'Date'}
                                </p>
                                <p className="font-medium text-[var(--label)]">
                                    {new Date(event.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[var(--apple-green)]/10">
                                <MapPin className="w-5 h-5 text-[var(--apple-green)]" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    {language === 'ar' ? 'الموقع' : 'Location'}
                                </p>
                                <p className="font-medium text-[var(--label)]">
                                    {language === 'ar' ? event.locationAr : event.locationEn}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[var(--apple-yellow)]/10">
                                <Clock className="w-5 h-5 text-[var(--apple-yellow)]" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    {language === 'ar' ? 'المدة' : 'Duration'}
                                </p>
                                <p className="font-medium text-[var(--label)]">
                                    {event.cme_hours} {language === 'ar' ? 'ساعة' : 'Hours'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                            {language === 'ar' ? 'الوصف' : 'Description'}
                        </h3>
                        <p className="text-[var(--secondary-label)] leading-relaxed">
                            {language === 'ar' ? event.descriptionAr : event.descriptionEn}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4 pt-4 border-t border-[var(--separator)]">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <GlassButton
                                onClick={handleRegister}
                                variant={isRegistered ? "outline" : "default"}
                                size="default"
                                disabled={isRegistered}
                                className="flex-1 flex items-center justify-center gap-2"
                            >
                                {isRegistered ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        {language === 'ar' ? 'مسجل' : 'Registered'}
                                    </>
                                ) : (
                                    <>
                                        <Users className="w-4 h-4" />
                                        {language === 'ar' ? 'سجل الآن' : 'Register Now'}
                                    </>
                                )}
                            </GlassButton>
                            <GlassButton
                                onClick={handleShare}
                                variant="outline"
                                size="default"
                                className="flex items-center gap-2"
                            >
                                <Share2 className="w-4 h-4" />
                                {language === 'ar' ? 'مشاركة' : 'Share'}
                            </GlassButton>
                        </div>
                        
                        {/* Social Sharing Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-[var(--secondary-label)] self-center mr-2">
                                {language === 'ar' ? 'شارك على:' : 'Share on:'}
                            </span>
                            <GlassButton
                                onClick={shareToTwitter}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Twitter
                            </GlassButton>
                            <GlassButton
                                onClick={shareToFacebook}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Facebook
                            </GlassButton>
                            <GlassButton
                                onClick={shareToLinkedIn}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                LinkedIn
                            </GlassButton>
                            <GlassButton
                                onClick={shareToWhatsApp}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                            </GlassButton>
                        </div>
                    </div>
                </div>
            </LiquidGlassCard>
        </div>
    );
}

