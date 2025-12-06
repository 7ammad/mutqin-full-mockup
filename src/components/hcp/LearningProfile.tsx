"use client";

import { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Chart } from '@/components/shared/Chart';
import { Input } from '@/components/ui/input';

import { GraduationCap, TrendingUp, BookOpen, Edit2, Save } from 'lucide-react';
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

interface LearningGoal {
    id: string;
    specialtyKey: string; // Store key instead of label for i18n
    targetHours: number;
    currentHours: number;
    deadline: string;
}

export default function LearningProfile() {
    const { language } = useLanguage();
    const { myTickets, events } = usePersona();
    const [isEditing, setIsEditing] = useState(false);
    // Store the key and translate on render
    const [specialtyKey, setSpecialtyKey] = useState('family_medicine');
    const [licenseNumber, setLicenseNumber] = useState('HCP-2024-001');
    const [goals, _setGoals] = useState<LearningGoal[]>([
        {
            id: '1',
            specialtyKey: 'family_medicine',
            targetHours: 50,
            currentHours: 32,
            deadline: '2025-12-31',
        },
        {
            id: '2',
            specialtyKey: 'emergency_medicine',
            targetHours: 30,
            currentHours: 12,
            deadline: '2025-06-30',
        },
    ]);

    const registeredEvents = useMemo(() => events.filter(e => myTickets.includes(e.id)), [events, myTickets]);

    const { hoursBySpecialty, chartData, totalHours } = useMemo(() => {
        const hoursBySpecialty = registeredEvents.reduce((acc, event) => {
            const specialtyLabel = getSpecialtyLabel(event.specialty, language);
            acc[specialtyLabel] = (acc[specialtyLabel] || 0) + event.cme_hours;
            return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(hoursBySpecialty).map(([name, value]) => ({ name, value }));
        const totalHours = registeredEvents.reduce((sum, e) => sum + e.cme_hours, 0);
        return { hoursBySpecialty, chartData, totalHours };
    }, [registeredEvents, language]);

    const averageRating = 4.5;
    const eventsAttended = registeredEvents.length;

    const title = language === 'ar' ? ' ' : 'Learning Profile';
    const specialtyText = language === 'ar' ? '' : 'Specialty';
    const licenseText = language === 'ar' ? ' ' : 'License Number';
    const editText = language === 'ar' ? '' : 'Edit';
    const saveText = language === 'ar' ? '' : 'Save';
    const goalsText = language === 'ar' ? ' ' : 'Learning Goals';
    const progressText = language === 'ar' ? '' : 'Progress';
    const addGoalText = language === 'ar' ? ' ' : 'Add Goal';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
                <GlassButton
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            {saveText}
                        </>
                    ) : (
                        <>
                            <Edit2 className="w-4 h-4 mr-2" />
                            {editText}
                        </>
                    )}
                </GlassButton>
            </div>

            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {specialtyText}
                        </label>
                        {isEditing ? (
                            <Input
                                value={getSpecialtyLabel(specialtyKey, language)}
                                onChange={(e) => setSpecialtyKey(e.target.value)} // Note: This would need a reverse lookup or a select dropdown
                                className="w-full"
                            />
                        ) : (
                            <p className="text-[var(--label)]">{getSpecialtyLabel(specialtyKey, language)}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {licenseText}
                        </label>
                        {isEditing ? (
                            <Input
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                className="w-full"
                            />
                        ) : (
                            <p className="text-[var(--label)]">{licenseNumber}</p>
                        )}
                    </div>
                </div>
            </LiquidGlassCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LiquidGlassCard blurIntensity="lg" interactive={false}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                {language === 'ar' ? ' ' : 'Total Hours'}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{totalHours}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                            <BookOpen className="w-6 h-6 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                {language === 'ar' ? '' : 'Events Attended'}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{eventsAttended}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                            <GraduationCap className="w-6 h-6 text-[var(--apple-green)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                {language === 'ar' ? ' ' : 'Average Rating'}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{averageRating.toFixed(1)}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-purple)]/10">
                            <TrendingUp className="w-6 h-6 text-[var(--apple-purple)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {chartData.length > 0 && (
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        {language === 'ar' ? '  ' : 'Hours by Specialty'}
                    </h3>
                    <Chart
                        type="bar"
                        data={chartData}
                        dataKey="value"
                        height={300}
                    />
                </LiquidGlassCard>
            )}

            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--label)]">{goalsText}</h3>
                    {isEditing && (
                        <GlassButton variant="outline" size="sm" className="flex items-center justify-center gap-2">
                            {addGoalText}
                        </GlassButton>
                    )}
                </div>
                <div className="space-y-4">
                    {goals.map((goal) => {
                        const progress = (goal.currentHours / goal.targetHours) * 100;
                        return (
                            <div
                                key={goal.id}
                                className="p-4 rounded-lg bg-[var(--system-fill)]/30"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="font-medium text-[var(--label)]">{getSpecialtyLabel(goal.specialtyKey, language)}</p>
                                        <p className="text-sm text-[var(--secondary-label)]">
                                            {goal.currentHours} / {goal.targetHours} {language === 'ar' ? '' : 'hours'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[var(--apple-green)]">
                                            {progress.toFixed(0)}%
                                        </p>
                                        <p className="text-xs text-[var(--tertiary-label)]">
                                            {progressText}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-[var(--system-fill)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--apple-green)] transition-all duration-500 rounded-full"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-[var(--tertiary-label)] mt-2">
                                    {language === 'ar' ? ' ' : 'Deadline'}: {new Date(goal.deadline).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </LiquidGlassCard>
        </div>
    );
}
