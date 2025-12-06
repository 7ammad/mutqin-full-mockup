"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';

import { QRScanner } from '@/components/shared/QRScanner';
import { CheckCircle2, XCircle, Users, QrCode, Camera } from 'lucide-react';

interface Attendee {
    id: string;
    name: string;
    email: string;
    checkedIn: boolean;
    checkInTime?: string;
    ticketId: string;
}

export default function QRCheckInSystem() {
    const { language } = useLanguage();
    const { events } = usePersona();
    const [selectedEvent, setSelectedEvent] = useState<string>('');
    const [showScanner, setShowScanner] = useState(false);
    const [attendees, setAttendees] = useState<Attendee[]>([
        { id: '1', name: 'Dr. Sarah Al-Otaibi', email: 'sarah@example.com', checkedIn: true, checkInTime: '2025-03-20T09:15:00', ticketId: 'TICKET-001' },
        { id: '2', name: 'Dr. Ahmed Al-Mansour', email: 'ahmed@example.com', checkedIn: false, ticketId: 'TICKET-002' },
        { id: '3', name: 'Dr. Fatima Al-Zahra', email: 'fatima@example.com', checkedIn: true, checkInTime: '2025-03-20T09:30:00', ticketId: 'TICKET-003' },
    ]);

    const selectedEventData = events.find((e) => e.id === selectedEvent);
    const checkedInCount = attendees.filter((a) => a.checkedIn).length;
    const totalAttendees = attendees.length;
    const checkInRate = totalAttendees > 0 ? (checkedInCount / totalAttendees) * 100 : 0;

    const handleQRScan = (result: string) => {
        const ticketId = result;
        const attendee = attendees.find((a) => a.ticketId === ticketId);
        
        if (attendee && !attendee.checkedIn) {
            setAttendees((prev) =>
                prev.map((a) =>
                    a.id === attendee.id
                        ? { ...a, checkedIn: true, checkInTime: new Date().toISOString() }
                        : a
                )
            );
        }
        setShowScanner(false);
    };

    const handleManualCheckIn = (attendeeId: string) => {
        setAttendees((prev) =>
            prev.map((a) =>
                a.id === attendeeId
                    ? { ...a, checkedIn: true, checkInTime: new Date().toISOString() }
                    : a
            )
        );
    };

    const title = language === 'ar' ? 'نظام تسجيل الحضور' : 'QR Check-In System';
    const selectEventText = language === 'ar' ? 'اختر الفعالية' : 'Select Event';
    const scanQRText = language === 'ar' ? 'مسح رمز QR' : 'Scan QR Code';
    const generateQRText = language === 'ar' ? 'إنشاء رموز QR' : 'Generate QR Codes';
    const attendeesText = language === 'ar' ? 'الحضور' : 'Attendees';
    const checkedInText = language === 'ar' ? 'تم التسجيل' : 'Checked In';
    const notCheckedInText = language === 'ar' ? 'لم يتم التسجيل' : 'Not Checked In';
    const checkInRateText = language === 'ar' ? 'معدل الحضور' : 'Check-In Rate';
    const manualCheckInText = language === 'ar' ? 'تسجيل يدوي' : 'Manual Check-In';
    const nameText = language === 'ar' ? 'الاسم' : 'Name';
    const emailText = language === 'ar' ? 'البريد الإلكتروني' : 'Email';
    const ticketIdText = language === 'ar' ? 'رقم التذكرة' : 'Ticket ID';
    const statusText = language === 'ar' ? 'الحالة' : 'Status';
    const timeText = language === 'ar' ? 'الوقت' : 'Time';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
            </div>

            {/* Event Selection */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {selectEventText}
                </label>
                <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full px-4 py-2 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-[var(--label)] focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]"
                >
                    <option value="">{selectEventText}</option>
                    {events.map((event) => (
                        <option key={event.id} value={event.id}>
                            {language === 'ar' ? event.titleAr : event.titleEn}
                        </option>
                    ))}
                </select>
            </LiquidGlassCard>

            {selectedEvent && (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--secondary-label)] mb-1">{attendeesText}</p>
                                    <p className="text-3xl font-bold text-[var(--label)]">{totalAttendees}</p>
                                </div>
                                <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                                    <Users className="w-8 h-8 text-[var(--apple-blue)]" />
                                </div>
                            </div>
                        </LiquidGlassCard>

                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--secondary-label)] mb-1">{checkedInText}</p>
                                    <p className="text-3xl font-bold text-[var(--label)]">{checkedInCount}</p>
                                </div>
                                <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                                    <CheckCircle2 className="w-8 h-8 text-[var(--apple-green)]" />
                                </div>
                            </div>
                        </LiquidGlassCard>

                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--secondary-label)] mb-1">{checkInRateText}</p>
                                    <p className="text-3xl font-bold text-[var(--label)]">{checkInRate.toFixed(0)}%</p>
                                </div>
                                <div className="p-3 rounded-full bg-[var(--apple-purple)]/10">
                                    <QrCode className="w-8 h-8 text-[var(--apple-purple)]" />
                                </div>
                            </div>
                        </LiquidGlassCard>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <GlassButton
                            variant="default"
                            onClick={() => setShowScanner(true)}
                            className="flex-1"
                        >
                            <Camera className="w-4 h-4 mr-2" />
                            {scanQRText}
                        </GlassButton>
                        <GlassButton variant="outline" className="flex-1 items-center justify-center gap-2">
                            <QrCode className="w-4 h-4 mr-2" />
                            {generateQRText}
                        </GlassButton>
                    </div>

                    {/* QR Scanner Modal */}
                    {showScanner && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <LiquidGlassCard blurIntensity="xl" className="w-full max-w-md">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-[var(--label)]">{scanQRText}</h3>
                                        <GlassButton
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowScanner(false)}
                                        >
                                            {language === 'ar' ? 'إغلاق' : 'Close'}
                                        </GlassButton>
                                    </div>
                                    <QRScanner onScan={handleQRScan} />
                                </div>
                            </LiquidGlassCard>
                        </div>
                    )}

                    {/* Attendees List */}
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{attendeesText}</h3>
                        <div className="space-y-3">
                            {attendees.map((attendee) => (
                                <div
                                    key={attendee.id}
                                    className="p-4 rounded-lg bg-[var(--system-fill)]/30 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        {attendee.checkedIn ? (
                                            <CheckCircle2 className="w-5 h-5 text-[var(--apple-green)]" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-[var(--apple-red)]" />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium text-[var(--label)]">{attendee.name}</p>
                                            <p className="text-sm text-[var(--secondary-label)]">{attendee.email}</p>
                                            <p className="text-xs text-[var(--tertiary-label)]">
                                                {ticketIdText}: {attendee.ticketId}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-[var(--label)]">
                                            {attendee.checkedIn ? checkedInText : notCheckedInText}
                                        </p>
                                        {attendee.checkInTime && (
                                            <p className="text-xs text-[var(--tertiary-label)]">
                                                {timeText}: {new Date(attendee.checkInTime).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                            </p>
                                        )}
                                        {!attendee.checkedIn && (
                                            <GlassButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleManualCheckIn(attendee.id)}
                                                className="mt-2"
                                            >
                                                {manualCheckInText}
                                            </GlassButton>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LiquidGlassCard>
                </>
            )}
        </div>
    );
}

