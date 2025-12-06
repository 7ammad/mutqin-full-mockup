"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';

import { Users, MapPin, GraduationCap, Target, CheckCircle2 } from 'lucide-react';
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

interface TargetingCriteria {
    specialties: string[];
    regions: string[];
    seniorityLevels: string[];
    pastAttendance: boolean;
}

export default function AudienceTargeting() {
    const { language } = useLanguage();
    const [criteria, setCriteria] = useState<TargetingCriteria>({
        specialties: [],
        regions: [],
        seniorityLevels: [],
        pastAttendance: false,
    });

    const specialties = [
        getSpecialtyLabel('cardiology', language), 'Family Medicine', 'Emergency Medicine', 'Pediatrics',
        'Internal Medicine', 'Surgery', 'Orthopedics', 'Dermatology',
    ];

    const regions = [
        'Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Abha', 'Tabuk',
    ];

    const seniorityLevels = [
        language === 'ar' ? '' : 'Resident',
        language === 'ar' ? '' : 'Specialist',
        language === 'ar' ? '' : 'Consultant',
    ];

    const toggleSpecialty = (specialty: string) => {
        setCriteria((prev) => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter((s) => s !== specialty)
                : [...prev.specialties, specialty],
        }));
    };

    const toggleRegion = (region: string) => {
        setCriteria((prev) => ({
            ...prev,
            regions: prev.regions.includes(region)
                ? prev.regions.filter((r) => r !== region)
                : [...prev.regions, region],
        }));
    };

    const toggleSeniority = (level: string) => {
        setCriteria((prev) => ({
            ...prev,
            seniorityLevels: prev.seniorityLevels.includes(level)
                ? prev.seniorityLevels.filter((l) => l !== level)
                : [...prev.seniorityLevels, level],
        }));
    };

    const estimatedReach = criteria.specialties.length * criteria.regions.length * 1500; // Mock calculation

    const title = language === 'ar' ? ' ' : 'Audience Targeting';
    const specialtiesText = language === 'ar' ? '' : 'Specialties';
    const regionsText = language === 'ar' ? '' : 'Regions';
    const seniorityText = language === 'ar' ? ' ' : 'Seniority Level';
    const pastAttendanceText = language === 'ar' ? ' ' : 'Past Attendance';
    const includePastAttendeesText = language === 'ar' ? '  ' : 'Include Past Attendees';
    const estimatedReachText = language === 'ar' ? ' ' : 'Estimated Reach';
    const saveText = language === 'ar' ? '' : 'Save';
    const resetText = language === 'ar' ? ' ' : 'Reset';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
            </div>

            {/* Estimated Reach */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-[var(--secondary-label)] mb-1">{estimatedReachText}</p>
                        <p className="text-3xl font-bold text-[var(--label)]">
                            {estimatedReach.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </p>
                        <p className="text-sm text-[var(--tertiary-label)] mt-1">
                            {language === 'ar' ? '  ' : 'potential HCPs'}
                        </p>
                    </div>
                    <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                        <Target className="w-8 h-8 text-[var(--apple-blue)]" />
                    </div>
                </div>
            </LiquidGlassCard>

            {/* Specialties */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-[var(--apple-purple)]" />
                    <h3 className="text-lg font-semibold text-[var(--label)]">{specialtiesText}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {specialties.map((specialty) => {
                        const isSelected = criteria.specialties.includes(specialty);
                        return (
                            <button key={specialty}
                                onClick={() => toggleSpecialty(specialty)}
                                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                                    isSelected
                                        ? 'bg-[var(--apple-blue)] text-white'
                                        : 'bg-[var(--system-fill)] text-[var(--label)] hover:bg-[var(--system-fill)]/80'
                                }`}
                            >
                                {specialty}
                                {isSelected && <CheckCircle2 className="w-4 h-4 inline ml-2" />}
                            </button>
                        );
                    })}
                </div>
            </LiquidGlassCard>

            {/* Regions */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-[var(--apple-red)]" />
                    <h3 className="text-lg font-semibold text-[var(--label)]">{regionsText}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {regions.map((region) => {
                        const isSelected = criteria.regions.includes(region);
                        return (
                            <button key={region}
                                onClick={() => toggleRegion(region)}
                                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                                    isSelected
                                        ? 'bg-[var(--apple-red)] text-white'
                                        : 'bg-[var(--system-fill)] text-[var(--label)] hover:bg-[var(--system-fill)]/80'
                                }`}
                            >
                                {region}
                                {isSelected && <CheckCircle2 className="w-4 h-4 inline ml-2" />}
                            </button>
                        );
                    })}
                </div>
            </LiquidGlassCard>

            {/* Seniority Levels */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-[var(--apple-green)]" />
                    <h3 className="text-lg font-semibold text-[var(--label)]">{seniorityText}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {seniorityLevels.map((level) => {
                        const isSelected = criteria.seniorityLevels.includes(level);
                        return (
                            <button key={level}
                                onClick={() => toggleSeniority(level)}
                                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                                    isSelected
                                        ? 'bg-[var(--apple-green)] text-white'
                                        : 'bg-[var(--system-fill)] text-[var(--label)] hover:bg-[var(--system-fill)]/80'
                                }`}
                            >
                                {level}
                                {isSelected && <CheckCircle2 className="w-4 h-4 inline ml-2" />}
                            </button>
                        );
                    })}
                </div>
            </LiquidGlassCard>

            {/* Past Attendance */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-1">{pastAttendanceText}</h3>
                        <p className="text-sm text-[var(--secondary-label)]">{includePastAttendeesText}</p>
                    </div>
                    <button onClick={() => setCriteria((prev) => ({ ...prev, pastAttendance: !prev.pastAttendance }))}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                            criteria.pastAttendance ? 'bg-[var(--apple-green)]' : 'bg-[var(--system-fill)]'
                        }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                                criteria.pastAttendance ? 'translate-x-6' : 'translate-x-0'
                            }`}
                        />
                    </button>
                </div>
            </LiquidGlassCard>

            {/* Actions */}
            <div className="flex gap-4">
                <GlassButton variant="default" className="flex-1 items-center justify-center gap-2">
                    {saveText}
                </GlassButton>
                <GlassButton
                    variant="outline"
                    onClick={() => setCriteria({ specialties: [], regions: [], seniorityLevels: [], pastAttendance: false })}
                >
                    {resetText}
                </GlassButton>
            </div>
        </div>
    );
}

