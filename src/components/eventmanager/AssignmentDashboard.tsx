"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Calendar, Clock, CheckCircle2, Filter } from 'lucide-react';
import { MOCK_EVENT_ASSIGNMENTS } from '@/lib/mockData';
import { getEventTitle } from '@/lib/eventTranslations';

export default function AssignmentDashboard() {
    const { language } = useLanguage();
    const { events } = usePersona();
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const assignments = MOCK_EVENT_ASSIGNMENTS.filter(a => {
        if (filterStatus === 'all') return true;
        return a.status === filterStatus;
    });

    const assignedEvents = events.filter(e => 
        assignments.some(a => a.eventId === e.id)
    );

    const stats = {
        active: assignments.filter(a => a.status === 'Active').length,
        pending: assignments.filter(a => a.status === 'Pending').length,
        completed: assignments.filter(a => a.status === 'Completed').length,
        total: assignments.length,
    };

    const title = language === 'ar' ? ' ' : 'Assignment Dashboard';
    const activeText = language === 'ar' ? '' : 'Active';
    const pendingText = language === 'ar' ? ' ' : 'Pending';
    const completedText = language === 'ar' ? '' : 'Completed';
    const totalText = language === 'ar' ? '' : 'Total';
    const assignedDateText = language === 'ar' ? ' ' : 'Assigned Date';
    const viewDetailsText = language === 'ar' ? ' ' : 'View Details';
    const allStatusText = language === 'ar' ? '' : 'All';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[var(--secondary-label)]" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-[var(--label)] focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]"
                    >
                        <option value="all">{allStatusText}</option>
                        <option value="Pending">{pendingText}</option>
                        <option value="Active">{activeText}</option>
                        <option value="Completed">{completedText}</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{totalText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{stats.total}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                            <Calendar className="w-8 h-8 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{activeText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{stats.active}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                            <CheckCircle2 className="w-8 h-8 text-[var(--apple-green)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{pendingText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{stats.pending}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-orange)]/10">
                            <Clock className="w-8 h-8 text-[var(--apple-orange)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{completedText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{stats.completed}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-purple)]/10">
                            <CheckCircle2 className="w-8 h-8 text-[var(--apple-purple)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {/* Assignments List */}
            <div className="space-y-4">
                {assignments.length === 0 ? (
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-12">
                        <div className="text-center">
                            <Calendar className="w-16 h-16 mx-auto mb-4 text-[var(--secondary-label)]" />
                            <p className="text-[var(--secondary-label)]">
                                {language === 'ar' ? '  ' : 'No assignments'}
                            </p>
                        </div>
                    </LiquidGlassCard>
                ) : (
                    assignments.map((assignment) => {
                        const event = assignedEvents.find(e => e.id === assignment.eventId);
                        if (!event) return null;

                        const statusColors = {
                            Pending: 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]',
                            Active: 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]',
                            Completed: 'bg-[var(--apple-purple)]/10 text-[var(--apple-purple)]',
                            Rejected: 'bg-[var(--apple-red)]/10 text-[var(--apple-red)]',
                            Cancelled: 'bg-[var(--system-fill)] text-[var(--secondary-label)]',
                        };

                        return (
                            <LiquidGlassCard
                                key={assignment.id}
                                blurIntensity="lg"
                                interactive={true}
                                className="p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-[var(--label)]">
                                                {getEventTitle(event, language)}
                                            </h3>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[assignment.status as keyof typeof statusColors] || statusColors.Pending}`}>
                                                {assignment.status}
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-sm text-[var(--secondary-label)]">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>
                                                    {assignedDateText}: {new Date(assignment.assignedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <GlassButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            console.log('View assignment details:', assignment.id);
                                        }}
                                    >
                                        {viewDetailsText}
                                    </GlassButton>
                                </div>
                            </LiquidGlassCard>
                        );
                    })
                )}
            </div>
        </div>
    );
}

