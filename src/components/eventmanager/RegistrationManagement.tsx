"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { QRCode } from '@/components/shared/QRCode';
import { Download, Mail, Search, UserCheck, UserX } from 'lucide-react';
import { getEventTitle } from '@/lib/eventTranslations';
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

interface Registration {
    id: string;
    name: string;
    email: string;
    licenseNumber?: string;
    specialty: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    registeredAt: string;
    ticketId: string;
}

interface RegistrationManagementProps {
    eventId: string;
}

export default function RegistrationManagement({ eventId }: RegistrationManagementProps) {
    const { language } = useLanguage();
    const { events } = usePersona();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedRegistration, setSelectedRegistration] = useState<string | null>(null);

    const event = events.find(e => e.id === eventId);

    // Mock registrations
    const [registrations, _setRegistrations] = useState<Registration[]>([
        { id: '1', name: 'Dr. Sarah Al-Otaibi', email: 'sarah@example.com', licenseNumber: 'HCP-001', specialty: 'family_medicine', status: 'confirmed', registeredAt: '2025-03-01', ticketId: 'TICKET-001' },
        { id: '2', name: 'Dr. Ahmed Al-Mansour', email: 'ahmed@example.com', licenseNumber: 'HCP-002', specialty: 'cardiology', status: 'confirmed', registeredAt: '2025-03-02', ticketId: 'TICKET-002' },
        { id: '3', name: 'Dr. Fatima Al-Zahra', email: 'fatima@example.com', specialty: 'pediatrics', status: 'pending', registeredAt: '2025-03-03', ticketId: 'TICKET-003' },
    ]);

    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch = reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            reg.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || reg.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: registrations.length,
        confirmed: registrations.filter(r => r.status === 'confirmed').length,
        pending: registrations.filter(r => r.status === 'pending').length,
        cancelled: registrations.filter(r => r.status === 'cancelled').length,
    };

    const handleSendTicket = (registrationId: string) => {
        console.log('Sending ticket to:', registrationId);
    };

    const handleDownloadTickets = () => {
        console.log('Downloading all tickets...');
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

    const title = language === 'ar' ? ' ' : 'Registration Management';
    const confirmedText = language === 'ar' ? '' : 'Confirmed';
    const pendingText = language === 'ar' ? ' ' : 'Pending';
    const cancelledText = language === 'ar' ? '' : 'Cancelled';
    const totalText = language === 'ar' ? '' : 'Total';
    const searchPlaceholder = language === 'ar' ? '  ...' : 'Search registrations...';
    const allStatusText = language === 'ar' ? '' : 'All';
    const specialtyText = language === 'ar' ? '' : 'Specialty';
    const ticketText = language === 'ar' ? '' : 'Ticket';
    const emailText = language === 'ar' ? ' ' : 'Email';
    const sendTicketText = language === 'ar' ? ' ' : 'Send Ticket';
    const downloadAllText = language === 'ar' ? ' ' : 'Download All';
    const viewTicketText = language === 'ar' ? ' ' : 'View Ticket';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
                    <p className="text-sm text-[var(--secondary-label)] mt-1">
                        {getEventTitle(event, language)}
                    </p>
                </div>
                <GlassButton
                    variant="default"
                    onClick={handleDownloadTickets}
                 className="flex items-center justify-center gap-2">
                    <Download className="w-4 h-4 mr-2" />
                    {downloadAllText}
                </GlassButton>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{totalText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{stats.total}</p>
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{confirmedText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{stats.confirmed}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                            <UserCheck className="w-8 h-8 text-[var(--apple-green)]" />
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
                            <UserX className="w-8 h-8 text-[var(--apple-orange)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{cancelledText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{stats.cancelled}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-red)]/10">
                            <UserX className="w-8 h-8 text-[var(--apple-red)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--tertiary-label)]" />
                    <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-[var(--label)] focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]"
                >
                    <option value="all">{allStatusText}</option>
                    <option value="confirmed">{confirmedText}</option>
                    <option value="pending">{pendingText}</option>
                    <option value="cancelled">{cancelledText}</option>
                </select>
            </div>

            {/* Registrations List */}
            <div className="space-y-3">
                {filteredRegistrations.map((registration) => (
                    <LiquidGlassCard
                        key={registration.id}
                        blurIntensity="lg"
                        interactive={true}
                        className="p-6"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-[var(--label)]">
                                        {registration.name}
                                    </h3>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        registration.status === 'confirmed'
                                            ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]'
                                            : registration.status === 'pending'
                                            ? 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]'
                                            : 'bg-[var(--apple-red)]/10 text-[var(--apple-red)]'
                                    }`}>
                                        {registration.status}
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm text-[var(--secondary-label)]">
                                    <p>{emailText}: {registration.email}</p>
                                    {registration.licenseNumber && (
                                        <p>{language === 'ar' ? ' ' : 'License'}: {registration.licenseNumber}</p>
                                    )}
                                    <p>{specialtyText}: {registration.specialty}</p>
                                    <p>{ticketText} ID: {registration.ticketId}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <GlassButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedRegistration(registration.id)}
                                >
                                    {viewTicketText}
                                </GlassButton>
                                <GlassButton
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleSendTicket(registration.id)}
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    {sendTicketText}
                                </GlassButton>
                            </div>
                        </div>
                    </LiquidGlassCard>
                ))}
            </div>

            {/* QR Code Modal */}
            {selectedRegistration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <LiquidGlassCard blurIntensity="xl" className="w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-[var(--label)]">{ticketText}</h3>
                                <GlassButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedRegistration(null)}
                                >
                                    {language === 'ar' ? '' : 'Close'}
                                </GlassButton>
                            </div>
                            <div className="flex justify-center mb-4">
                                <QRCode
                                    text={registrations.find(r => r.id === selectedRegistration)?.ticketId || ''}
                                    size={200}
                                />
                            </div>
                            <div className="text-center text-sm text-[var(--secondary-label)]">
                                {registrations.find(r => r.id === selectedRegistration)?.ticketId}
                            </div>
                        </div>
                    </LiquidGlassCard>
                </div>
            )}
        </div>
    );
}

