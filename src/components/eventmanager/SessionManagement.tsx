"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';

import { Clock, Users, Play, Pause, CheckCircle2 } from 'lucide-react';
import { getEventTitle } from '@/lib/eventTranslations';

interface Session {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    speaker: string;
    status: 'upcoming' | 'active' | 'completed';
    attendance: number;
    expectedAttendance: number;
}

interface SessionManagementProps {
    eventId: string;
}

export default function SessionManagement({ eventId }: SessionManagementProps) {
    const { language } = useLanguage();
    const { events } = usePersona();
    const [sessions, setSessions] = useState<Session[]>([
        {
            id: '1',
            title: language === 'ar' ? ' ' : 'Opening Session',
            startTime: '09:00',
            endTime: '10:00',
            speaker: 'Dr. Ahmed Al-Mansour',
            status: 'completed',
            attendance: 145,
            expectedAttendance: 200,
        },
        {
            id: '2',
            title: language === 'ar' ? ' ' : 'Keynote Lecture',
            startTime: '10:30',
            endTime: '12:00',
            speaker: 'Dr. Sarah Al-Otaibi',
            status: 'active',
            attendance: 138,
            expectedAttendance: 200,
        },
        {
            id: '3',
            title: language === 'ar' ? ' ' : 'Workshop',
            startTime: '14:00',
            endTime: '16:00',
            speaker: 'Dr. Mohammed Al-Rashid',
            status: 'upcoming',
            attendance: 0,
            expectedAttendance: 150,
        },
    ]);

    const event = events.find(e => e.id === eventId);

    const handleStartSession = (sessionId: string) => {
        setSessions(prev => prev.map(s => 
            s.id === sessionId ? { ...s, status: 'active' as const } : s
        ));
    };

    const handleEndSession = (sessionId: string) => {
        setSessions(prev => prev.map(s => 
            s.id === sessionId ? { ...s, status: 'completed' as const } : s
        ));
    };

    if (!event) {
        return (
            <LiquidGlassCard blurIntensity="lg" className="p-12">
                <div className="text-center text-[var(--secondary-label)]">
                    {language === 'ar' ? '  ' : 'Event not found'}
                </div>
            </LiquidGlassCard>
        );
    }

    const title = language === 'ar' ? ' ' : 'Session Management';
    const speakerText = language === 'ar' ? '' : 'Speaker';
    const timeText = language === 'ar' ? '' : 'Time';
    const attendanceText = language === 'ar' ? '' : 'Attendance';
    const startText = language === 'ar' ? '' : 'Start';
    const endText = language === 'ar' ? '' : 'End';
    const upcomingText = language === 'ar' ? '' : 'Upcoming';
    const activeText = language === 'ar' ? '' : 'Active';
    const completedText = language === 'ar' ? '' : 'Completed';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
                    <p className="text-sm text-[var(--secondary-label)] mt-1">
                        {getEventTitle(event, language)}
                    </p>
                </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-4">
                {sessions.map((session) => {
                    const attendanceRate = session.expectedAttendance > 0
                        ? (session.attendance / session.expectedAttendance) * 100
                        : 0;

                    const statusColors = {
                        upcoming: 'bg-[var(--system-fill)] text-[var(--secondary-label)]',
                        active: 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]',
                        completed: 'bg-[var(--apple-purple)]/10 text-[var(--apple-purple)]',
                    };

                    return (
                        <LiquidGlassCard
                            key={session.id}
                            blurIntensity="lg"
                            interactive={false}
                            className="p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-lg font-semibold text-[var(--label)]">
                                            {session.title}
                                        </h3>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[session.status]}`}>
                                            {session.status === 'upcoming' ? upcomingText :
                                             session.status === 'active' ? activeText :
                                             completedText}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-[var(--apple-orange)]" />
                                            <div>
                                                <p className="text-xs text-[var(--secondary-label)]">{timeText}</p>
                                                <p className="text-sm font-medium text-[var(--label)]">
                                                    {session.startTime} - {session.endTime}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-[var(--apple-blue)]" />
                                            <div>
                                                <p className="text-xs text-[var(--secondary-label)]">{speakerText}</p>
                                                <p className="text-sm font-medium text-[var(--label)]">
                                                    {session.speaker}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-[var(--apple-green)]" />
                                            <div>
                                                <p className="text-xs text-[var(--secondary-label)]">{attendanceText}</p>
                                                <p className="text-sm font-medium text-[var(--label)]">
                                                    {session.attendance} / {session.expectedAttendance} ({attendanceRate.toFixed(0)}%)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {session.status === 'active' && (
                                        <div className="w-full h-2 bg-[var(--system-fill)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--apple-green)] transition-all duration-500 rounded-full"
                                                style={{ width: `${Math.min(attendanceRate, 100)}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 ml-4">
                                    {session.status === 'upcoming' && (
                                        <GlassButton
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleStartSession(session.id)}
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            {startText}
                                        </GlassButton>
                                    )}
                                    {session.status === 'active' && (
                                        <GlassButton
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEndSession(session.id)}
                                        >
                                            <Pause className="w-4 h-4 mr-2" />
                                            {endText}
                                        </GlassButton>
                                    )}
                                    {session.status === 'completed' && (
                                        <div className="px-3 py-2 rounded-lg bg-[var(--apple-purple)]/10 text-[var(--apple-purple)] text-sm font-medium">
                                            {completedText}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </LiquidGlassCard>
                    );
                })}
            </div>
        </div>
    );
}

