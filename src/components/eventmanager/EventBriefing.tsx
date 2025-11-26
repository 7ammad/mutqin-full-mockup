"use client";

import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Calendar, MapPin, Users, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { getEventTitle, getEventOrganizer } from '@/lib/eventTranslations';

interface EventBriefingProps {
    eventId: string;
}

export default function EventBriefing({ eventId }: EventBriefingProps) {
    const { language } = useLanguage();
    const { events } = usePersona();
    const event = events.find(e => e.id === eventId);

    if (!event) {
        return (
            <LiquidGlassCard blurIntensity="lg" className="p-12">
                <div className="text-center text-[var(--secondary-label)]">
                    {language === 'ar' ? 'الفعالية غير موجودة' : 'Event not found'}
                </div>
            </LiquidGlassCard>
        );
    }

    // Mock briefing data
    const expectedAttendees = 200;
    const confirmedAttendees = 145;
    const sessions = [
        { title: language === 'ar' ? 'الجلسة الافتتاحية' : 'Opening Session', time: '09:00 - 10:00', speaker: 'Dr. Ahmed' },
        { title: language === 'ar' ? 'محاضرة رئيسية' : 'Keynote Lecture', time: '10:30 - 12:00', speaker: 'Dr. Sarah' },
        { title: language === 'ar' ? 'ورشة عمل' : 'Workshop', time: '14:00 - 16:00', speaker: 'Dr. Mohammed' },
    ];
    const logistics = [
        language === 'ar' ? 'تجهيز القاعة الرئيسية' : 'Main hall setup',
        language === 'ar' ? 'تجهيز قاعات الورش' : 'Workshop rooms setup',
        language === 'ar' ? 'تجهيز منطقة التسجيل' : 'Registration area setup',
        language === 'ar' ? 'تجهيز منطقة الاستراحة' : 'Break area setup',
    ];

    const title = language === 'ar' ? 'ملخص الفعالية' : 'Event Briefing';
    const eventDetailsText = language === 'ar' ? 'تفاصيل الفعالية' : 'Event Details';
    const expectedAttendeesText = language === 'ar' ? 'الحضور المتوقع' : 'Expected Attendees';
    const confirmedAttendeesText = language === 'ar' ? 'الحضور المؤكد' : 'Confirmed Attendees';
    const agendaText = language === 'ar' ? 'الجدول الزمني' : 'Agenda';

    const timeText = language === 'ar' ? 'الوقت' : 'Time';
    const speakerText = language === 'ar' ? 'المتحدث' : 'Speaker';
    const checklistText = language === 'ar' ? 'قائمة المهام' : 'Checklist';
    const markCompleteText = language === 'ar' ? 'تم' : 'Complete';
    const dateText = language === 'ar' ? 'التاريخ' : 'Date';
    const locationText = language === 'ar' ? 'الموقع' : 'Location';
    const organizerText = language === 'ar' ? 'المنظم' : 'Organizer';
    const specialtyText = language === 'ar' ? 'التخصص' : 'Specialty';
    const cmeHoursText = language === 'ar' ? 'ساعات التعليم الطبي' : 'CME Hours';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
            </div>

            {/* Event Details */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{eventDetailsText}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[var(--apple-blue)]" />
                            <div>
                                <p className="text-sm text-[var(--secondary-label)]">{dateText}</p>
                                <p className="text-[var(--label)] font-medium">{event.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[var(--apple-red)]" />
                            <div>
                                <p className="text-sm text-[var(--secondary-label)]">{locationText}</p>
                                <p className="text-[var(--label)] font-medium">
                                    {language === 'ar' ? event.locationAr : event.locationEn}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-[var(--apple-green)]" />
                            <div>
                                <p className="text-sm text-[var(--secondary-label)]">{organizerText}</p>
                                <p className="text-[var(--label)] font-medium">
                                    {getEventOrganizer(event, language)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[var(--apple-purple)]" />
                            <div>
                                <p className="text-sm text-[var(--secondary-label)]">{specialtyText}</p>
                                <p className="text-[var(--label)] font-medium">{event.specialty}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--separator)]">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[var(--apple-orange)]" />
                        <div>
                            <p className="text-sm text-[var(--secondary-label)]">{cmeHoursText}</p>
                            <p className="text-[var(--label)] font-medium">{event.cme_hours} {language === 'ar' ? 'ساعة' : 'hours'}</p>
                        </div>
                    </div>
                </div>
            </LiquidGlassCard>

            {/* Attendees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{expectedAttendeesText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{expectedAttendees}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                            <Users className="w-8 h-8 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{confirmedAttendeesText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{confirmedAttendees}</p>
                            <p className="text-xs text-[var(--tertiary-label)] mt-1">
                                {((confirmedAttendees / expectedAttendees) * 100).toFixed(0)}%
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                            <CheckCircle2 className="w-8 h-8 text-[var(--apple-green)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {/* Agenda */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{agendaText}</h3>
                <div className="space-y-3">
                    {sessions.map((session, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg bg-[var(--system-fill)]/30 flex items-center justify-between"
                        >
                            <div className="flex-1">
                                <p className="font-medium text-[var(--label)]">{session.title}</p>
                                <div className="flex items-center gap-4 mt-1 text-sm text-[var(--secondary-label)]">
                                    <span>{timeText}: {session.time}</span>
                                    <span>{speakerText}: {session.speaker}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </LiquidGlassCard>

            {/* Logistics Checklist */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{checklistText}</h3>
                <div className="space-y-2">
                    {logistics.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-[var(--system-fill)]/30"
                        >
                            <span className="text-[var(--label)]">{item}</span>
                            <GlassButton
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    console.log('Mark complete:', item);
                                }}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                {markCompleteText}
                            </GlassButton>
                        </div>
                    ))}
                </div>
            </LiquidGlassCard>
        </div>
    );
}

