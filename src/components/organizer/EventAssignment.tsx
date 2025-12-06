"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Users, MapPin, Search, CheckCircle2, Clock } from 'lucide-react';
import { Event, EventManager, MOCK_EVENT_MANAGERS } from '@/lib/mockData';

interface EventAssignmentProps {
    eventId: string;
    onAssign: (eventId: string, eventManagerId: string) => void;
}

export default function EventAssignment({ eventId, onAssign }: EventAssignmentProps) {
    const { language } = useLanguage();
    const { events } = usePersona();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedManager, setSelectedManager] = useState<string>('');
    const [contractTerms, setContractTerms] = useState('');

    const event = events.find(e => e.id === eventId);
    const availableManagers = MOCK_EVENT_MANAGERS.filter(em => 
        em.active && 
        (em.specialties.includes(event?.specialty || '') || em.specialties.length === 0) &&
        (searchQuery === '' || 
         em.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         em.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAssign = () => {
        if (selectedManager && eventId) {
            onAssign(eventId, selectedManager);
        }
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

    const title = language === 'ar' ? '  ' : 'Assign Event Manager';
    const searchPlaceholder = language === 'ar' ? '   ...' : 'Search event managers...';
    const eventDetailsText = language === 'ar' ? ' ' : 'Event Details';
    const availableManagersText = language === 'ar' ? '  ' : 'Available Event Managers';
    const contractTermsText = language === 'ar' ? ' ' : 'Contract Terms';
    const assignText = language === 'ar' ? '' : 'Assign';
    const ratingText = language === 'ar' ? '' : 'Rating';
    const eventsManagedText = language === 'ar' ? ' ' : 'Events Managed';
    const completionRateText = language === 'ar' ? ' ' : 'Completion Rate';
    const specialtiesText = language === 'ar' ? '' : 'Specialties';
    const serviceAreasText = language === 'ar' ? ' ' : 'Service Areas';
    const pricingText = language === 'ar' ? '' : 'Pricing';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
            </div>

            {/* Event Details */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{eventDetailsText}</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[var(--apple-blue)]" />
                        <span className="text-[var(--label)]">
                            {language === 'ar' ? event.titleAr : event.titleEn}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[var(--apple-orange)]" />
                        <span className="text-[var(--secondary-label)]">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[var(--apple-red)]" />
                        <span className="text-[var(--secondary-label)]">
                            {language === 'ar' ? event.locationAr : event.locationEn}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-[var(--apple-green)]" />
                        <span className="text-[var(--secondary-label)]">
                            {event.specialty} • {event.cme_hours} {language === 'ar' ? ' CME' : 'CME hours'}
                        </span>
                    </div>
                </div>
            </LiquidGlassCard>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--tertiary-label)]" />
                <Input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Available Managers */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{availableManagersText}</h3>
                <div className="space-y-3">
                    {availableManagers.length === 0 ? (
                        <div className="text-center py-8 text-[var(--secondary-label)]">
                            {language === 'ar' ? '  ' : 'No results found'}
                        </div>
                    ) : (
                        availableManagers.map((manager) => {
                            const isSelected = selectedManager === manager.id;
                            return (
                                <div
                                    key={manager.id}
                                    onClick={() => setSelectedManager(manager.id)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        isSelected
                                            ? 'border-[var(--apple-blue)] bg-[var(--apple-blue)]/10'
                                            : 'border-[var(--separator)] hover:border-[var(--apple-blue)]/50'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="text-lg font-semibold text-[var(--label)]">
                                                    {manager.companyName}
                                                </h4>
                                                {manager.verified && (
                                                    <div className="px-2 py-1 rounded-full bg-[var(--apple-green)]/10 text-[var(--apple-green)] text-xs font-medium">
                                                        {language === 'ar' ? '' : 'Verified'}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-[var(--secondary-label)] mb-3">
                                                {manager.contactPerson}
                                            </p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                <div>
                                                    <p className="text-[var(--tertiary-label)]">{ratingText}</p>
                                                    <p className="text-[var(--label)] font-medium">
                                                        {manager.rating.toFixed(1)} ⭐
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[var(--tertiary-label)]">{eventsManagedText}</p>
                                                    <p className="text-[var(--label)] font-medium">
                                                        {manager.totalEventsManaged}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[var(--tertiary-label)]">{completionRateText}</p>
                                                    <p className="text-[var(--label)] font-medium">
                                                        {manager.completionRate}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[var(--tertiary-label)]">{pricingText}</p>
                                                    <p className="text-[var(--label)] font-medium">
                                                        {manager.pricingModel}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-3 space-y-1">
                                                <p className="text-xs text-[var(--tertiary-label)]">
                                                    {specialtiesText}: {manager.specialties.join(', ')}
                                                </p>
                                                <p className="text-xs text-[var(--tertiary-label)]">
                                                    {serviceAreasText}: {manager.serviceAreas.join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <CheckCircle2 className="w-6 h-6 text-[var(--apple-blue)] flex-shrink-0" />
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </LiquidGlassCard>

            {/* Contract Terms */}
            {selectedManager && (
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{contractTermsText}</h3>
                    <Textarea
                        value={contractTerms}
                        onChange={(e) => setContractTerms(e.target.value)}
                        placeholder={language === 'ar' ? '  ...' : 'Enter contract terms...'}
                        className="min-h-[100px]"
                    />
                    <div className="mt-4">
                        <GlassButton
                            variant="default"
                            onClick={handleAssign}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {assignText}
                        </GlassButton>
                    </div>
                </LiquidGlassCard>
            )}
        </div>
    );
}

