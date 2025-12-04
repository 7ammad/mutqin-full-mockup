"use client";

import { useState } from 'react';
import { usePersona } from '@/context/PersonaContext';
import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/shared/FileUpload';
import { Calendar } from '@/components/shared/Calendar';
import { ArrowRight, ArrowLeft, CheckCircle2, FileText, Users, Target, Mail, CreditCard, Eye } from 'lucide-react';
import { Event } from '@/lib/mockData';
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

interface EnhancedEventWizardProps {
    onCancel: () => void;
    onComplete: (event: Event) => void;
}

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function EnhancedEventWizard({ onCancel, onComplete }: EnhancedEventWizardProps) {
    const { userSession } = usePersona();
    const { language } = useLanguage();
    const [currentStep, setCurrentStep] = useState<WizardStep>(1);
    const [formData, setFormData] = useState({
        // Step 1: Basic Information
        titleAr: '',
        titleEn: '',
        eventType: 'Conference',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        locationAr: '',
        locationEn: '',
        format: 'in-person',
        expectedCapacity: '',
        
        // Step 2: Accreditation
        scientificCommitteeChair: '',
        learningObjectives: '',
        targetAudience: [] as string[],
        educationalMethodology: '',
        commercialBias: false,
        
        // Step 3: Scientific Program
        sessions: [] as Array<{ title: string; duration: number; speaker?: string }>,
        totalCMEHours: 0,
        
        // Step 4: Speakers
        speakers: [] as Array<{ name: string; specialty: string; cv?: File }>,
        
        // Step 5: Marketing
        marketingDescription: '',
        socialMediaPreview: '',
        emailTemplate: '',
        
        // Step 6: Pricing
        registrationFee: '',
        earlyBirdFee: '',
        earlyBirdDeadline: '',
        discountCodes: [] as string[],
        
        // Step 7: Review
        needsSponsorship: false,
    });

    const specialties = [getSpecialtyLabel('cardiology', language), 'Family Medicine', 'Emergency Medicine', 'Pediatrics', 'Internal Medicine', 'Surgery'];
    const eventTypes = ['Conference', 'Workshop', 'Webinar', 'Symposium', 'Internal Training'];
    const formats = ['in-person', 'virtual', 'hybrid'];

    const handleNext = () => {
        if (currentStep < 7) {
            setCurrentStep((prev) => (prev + 1) as WizardStep);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as WizardStep);
        }
    };

    const handleSubmit = () => {
        const newEvent: Event = {
            id: Math.random().toString(36).substr(2, 9),
            titleAr: formData.titleAr,
            titleEn: formData.titleEn,
            organizerAr: userSession?.name || '',
            organizerEn: userSession?.name || '',
            specialty: formData.targetAudience[0] || 'General',
            cme_hours: formData.totalCMEHours || 0,
            date: formData.startDate,
            locationAr: formData.locationAr,
            locationEn: formData.locationEn,
            status: formData.needsSponsorship ? 'Draft' : 'Pending Approval',
            is_sponsored: false,
            needs_sponsorship: formData.needsSponsorship,
            descriptionAr: formData.marketingDescription || formData.titleAr,
            descriptionEn: formData.marketingDescription || formData.titleEn,
        };
        onComplete(newEvent);
    };

    const stepTitles = language === 'ar' 
        ? ['المعلومات الأساسية', 'طلب الاعتماد', 'البرنامج العلمي', 'المتحدثون', 'التسويق', 'التسعير', 'المراجعة']
        : ['Basic Information', 'Accreditation', 'Scientific Program', 'Speakers', 'Marketing', 'Pricing', 'Review'];

    const renderStep1 = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'عنوان الفعالية (عربي)' : 'Event Title (Arabic)'}
                </label>
                <Input
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    placeholder={language === 'ar' ? 'مثال: مؤتمر القلب السعودي' : 'Example: Saudi Cardiology Conference'}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'عنوان الفعالية (إنجليزي)' : 'Event Title (English)'}
                </label>
                <Input
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="Example: Saudi Cardiology Conference"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--label)] mb-2">
                        {language === 'ar' ? 'نوع الفعالية' : 'Event Type'}
                    </label>
                    <select
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        className="w-full px-4 py-2 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-[var(--label)]"
                    >
                        {eventTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--label)] mb-2">
                        {language === 'ar' ? 'التنسيق' : 'Format'}
                    </label>
                    <select
                        value={formData.format}
                        onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                        className="w-full px-4 py-2 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-[var(--label)]"
                    >
                        {formats.map(format => (
                            <option key={format} value={format}>{format}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--label)] mb-2">
                        {language === 'ar' ? 'تاريخ البداية' : 'Start Date'}
                    </label>
                    <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--label)] mb-2">
                        {language === 'ar' ? 'تاريخ النهاية' : 'End Date'}
                    </label>
                    <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'الموقع (عربي)' : 'Location (Arabic)'}
                </label>
                <Input
                    value={formData.locationAr}
                    onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })}
                    placeholder={language === 'ar' ? 'الرياض - فندق شيراتون' : 'Riyadh - Sheraton Hotel'}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'الموقع (إنجليزي)' : 'Location (English)'}
                </label>
                <Input
                    value={formData.locationEn}
                    onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                    placeholder="Riyadh - Sheraton Hotel"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'السعة المتوقعة' : 'Expected Capacity'}
                </label>
                <Input
                    type="number"
                    value={formData.expectedCapacity}
                    onChange={(e) => setFormData({ ...formData, expectedCapacity: e.target.value })}
                    placeholder="200"
                />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'رئيس اللجنة العلمية' : 'Scientific Committee Chair'}
                </label>
                <Input
                    value={formData.scientificCommitteeChair}
                    onChange={(e) => setFormData({ ...formData, scientificCommitteeChair: e.target.value })}
                    placeholder={language === 'ar' ? 'رقم التصنيف' : 'Classification Number'}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'أهداف التعلم (SMART)' : 'Learning Objectives (SMART)'}
                </label>
                <Textarea
                    value={formData.learningObjectives}
                    onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
                    placeholder={language === 'ar' ? 'اكتب الأهداف بصيغة SMART...' : 'Write objectives in SMART format...'}
                    className="min-h-[100px]"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'الجمهور المستهدف' : 'Target Audience'}
                </label>
                <div className="flex flex-wrap gap-2">
                    {specialties.map(spec => {
                        const isSelected = formData.targetAudience.includes(spec);
                        return (
                            <button key={spec}
                                type="button"
                                onClick={() => {
                                    if (isSelected) {
                                        setFormData({
                                            ...formData,
                                            targetAudience: formData.targetAudience.filter(s => s !== spec)
                                        });
                                    } else {
                                        setFormData({
                                            ...formData,
                                            targetAudience: [...formData.targetAudience, spec]
                                        });
                                    }
                                }}
                                className={`px-4 py-2 rounded-2xl text-sm transition-all ${
                                    isSelected
                                        ? 'bg-[var(--apple-blue)] text-white'
                                        : 'bg-[var(--system-fill)] text-[var(--label)] hover:bg-[var(--system-fill)]/80'
                                }`}
                            >
                                {spec}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'المنهجية التعليمية' : 'Educational Methodology'}
                </label>
                <Textarea
                    value={formData.educationalMethodology}
                    onChange={(e) => setFormData({ ...formData, educationalMethodology: e.target.value })}
                    placeholder={language === 'ar' ? 'وصف المنهجية...' : 'Describe methodology...'}
                />
            </div>
            <div className="flex items-center gap-3 p-4 border border-[var(--separator)] rounded-lg">
                <input
                    type="checkbox"
                    checked={formData.commercialBias}
                    onChange={(e) => setFormData({ ...formData, commercialBias: e.target.checked })}
                    className="w-5 h-5"
                />
                <span className="text-sm text-[var(--label)]">
                    {language === 'ar' ? 'الكشف عن التحيز التجاري' : 'Disclosure of commercial bias'}
                </span>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--label)]">
                    {language === 'ar' ? 'الجلسات' : 'Sessions'}
                </h3>
                <GlassButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setFormData({
                            ...formData,
                            sessions: [...formData.sessions, { title: '', duration: 0 }]
                        });
                    }}
                >
                    {language === 'ar' ? 'إضافة جلسة' : 'Add Session'}
                </GlassButton>
            </div>
            <div className="space-y-3">
                {formData.sessions.map((session, index) => (
                    <LiquidGlassCard key={index} blurIntensity="md" className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                value={session.title}
                                onChange={(e) => {
                                    const newSessions = [...formData.sessions];
                                    newSessions[index].title = e.target.value;
                                    setFormData({ ...formData, sessions: newSessions });
                                }}
                                placeholder={language === 'ar' ? 'عنوان الجلسة' : 'Session Title'}
                            />
                            <Input
                                type="number"
                                value={session.duration}
                                onChange={(e) => {
                                    const newSessions = [...formData.sessions];
                                    newSessions[index].duration = Number(e.target.value);
                                    setFormData({
                                        ...formData,
                                        sessions: newSessions,
                                        totalCMEHours: newSessions.reduce((sum, s) => sum + s.duration, 0)
                                    });
                                }}
                                placeholder={language === 'ar' ? 'المدة (ساعة)' : 'Duration (hours)'}
                            />
                        </div>
                    </LiquidGlassCard>
                ))}
            </div>
            <div className="p-4 bg-[var(--apple-green)]/10 rounded-lg">
                <p className="text-sm text-[var(--secondary-label)]">
                    {language === 'ar' ? 'إجمالي ساعات CME' : 'Total CME Hours'}
                </p>
                <p className="text-2xl font-bold text-[var(--apple-green)]">
                    {formData.totalCMEHours}
                </p>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--label)]">
                    {language === 'ar' ? 'المتحدثون' : 'Speakers'}
                </h3>
                <GlassButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setFormData({
                            ...formData,
                            speakers: [...formData.speakers, { name: '', specialty: '' }]
                        });
                    }}
                >
                    {language === 'ar' ? 'إضافة متحدث' : 'Add Speaker'}
                </GlassButton>
            </div>
            <div className="space-y-3">
                {formData.speakers.map((speaker, index) => (
                    <LiquidGlassCard key={index} blurIntensity="md" className="p-4">
                        <div className="space-y-3">
                            <Input
                                value={speaker.name}
                                onChange={(e) => {
                                    const newSpeakers = [...formData.speakers];
                                    newSpeakers[index].name = e.target.value;
                                    setFormData({ ...formData, speakers: newSpeakers });
                                }}
                                placeholder={language === 'ar' ? 'اسم المتحدث' : 'Speaker Name'}
                            />
                            <Input
                                value={speaker.specialty}
                                onChange={(e) => {
                                    const newSpeakers = [...formData.speakers];
                                    newSpeakers[index].specialty = e.target.value;
                                    setFormData({ ...formData, speakers: newSpeakers });
                                }}
                                placeholder={language === 'ar' ? 'التخصص' : 'Specialty'}
                            />
                            <FileUpload
                                accept=".pdf"
                                maxSize={5}
                                onFilesSelected={(files) => {
                                    if (files.length > 0) {
                                        const newSpeakers = [...formData.speakers];
                                        newSpeakers[index].cv = files[0];
                                        setFormData({ ...formData, speakers: newSpeakers });
                                    }
                                }}
                            />
                        </div>
                    </LiquidGlassCard>
                ))}
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'وصف التسويق' : 'Marketing Description'}
                </label>
                <Textarea
                    value={formData.marketingDescription}
                    onChange={(e) => setFormData({ ...formData, marketingDescription: e.target.value })}
                    placeholder={language === 'ar' ? 'وصف الفعالية للتسويق...' : 'Event description for marketing...'}
                    className="min-h-[100px]"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'معاينة وسائل التواصل' : 'Social Media Preview'}
                </label>
                <Textarea
                    value={formData.socialMediaPreview}
                    onChange={(e) => setFormData({ ...formData, socialMediaPreview: e.target.value })}
                    placeholder={language === 'ar' ? 'نص للمشاركة على وسائل التواصل...' : 'Text for social media sharing...'}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'قالب البريد الإلكتروني' : 'Email Template'}
                </label>
                <Textarea
                    value={formData.emailTemplate}
                    onChange={(e) => setFormData({ ...formData, emailTemplate: e.target.value })}
                    placeholder={language === 'ar' ? 'محتوى البريد الإلكتروني...' : 'Email content...'}
                    className="min-h-[100px]"
                />
            </div>
        </div>
    );

    const renderStep6 = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--label)] mb-2">
                        {language === 'ar' ? 'رسوم التسجيل' : 'Registration Fee'}
                    </label>
                    <Input
                        type="number"
                        value={formData.registrationFee}
                        onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                        placeholder="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--label)] mb-2">
                        {language === 'ar' ? 'رسوم التسجيل المبكر' : 'Early Bird Fee'}
                    </label>
                    <Input
                        type="number"
                        value={formData.earlyBirdFee}
                        onChange={(e) => setFormData({ ...formData, earlyBirdFee: e.target.value })}
                        placeholder="0"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'موعد انتهاء التسجيل المبكر' : 'Early Bird Deadline'}
                </label>
                <Input
                    type="date"
                    value={formData.earlyBirdDeadline}
                    onChange={(e) => setFormData({ ...formData, earlyBirdDeadline: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {language === 'ar' ? 'أكواد الخصم' : 'Discount Codes'}
                </label>
                <div className="space-y-2">
                    {formData.discountCodes.map((code, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={code}
                                onChange={(e) => {
                                    const newCodes = [...formData.discountCodes];
                                    newCodes[index] = e.target.value;
                                    setFormData({ ...formData, discountCodes: newCodes });
                                }}
                                placeholder="CODE10"
                            />
                            <GlassButton
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setFormData({
                                        ...formData,
                                        discountCodes: formData.discountCodes.filter((_, i) => i !== index)
                                    });
                                }}
                            >
                                {language === 'ar' ? 'حذف' : 'Remove'}
                            </GlassButton>
                        </div>
                    ))}
                    <GlassButton
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setFormData({
                                ...formData,
                                discountCodes: [...formData.discountCodes, '']
                            });
                        }}
                    >
                        {language === 'ar' ? 'إضافة كود' : 'Add Code'}
                    </GlassButton>
                </div>
            </div>
        </div>
    );

    const renderStep7 = () => (
        <div className="space-y-4">
            <LiquidGlassCard blurIntensity="lg" className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                    {language === 'ar' ? 'ملخص الفعالية' : 'Event Summary'}
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-[var(--secondary-label)]">{language === 'ar' ? 'العنوان' : 'Title'}:</span>
                        <span className="text-[var(--label)] font-medium">{formData.titleEn || formData.titleAr}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--secondary-label)]">{language === 'ar' ? 'التاريخ' : 'Date'}:</span>
                        <span className="text-[var(--label)] font-medium">{formData.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--secondary-label)]">{language === 'ar' ? 'الموقع' : 'Location'}:</span>
                        <span className="text-[var(--label)] font-medium">{formData.locationEn || formData.locationAr}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--secondary-label)]">{language === 'ar' ? 'ساعات CME' : 'CME Hours'}:</span>
                        <span className="text-[var(--label)] font-medium">{formData.totalCMEHours}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--secondary-label)]">{language === 'ar' ? 'الجلسات' : 'Sessions'}:</span>
                        <span className="text-[var(--label)] font-medium">{formData.sessions.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--secondary-label)]">{language === 'ar' ? 'المتحدثون' : 'Speakers'}:</span>
                        <span className="text-[var(--label)] font-medium">{formData.speakers.length}</span>
                    </div>
                </div>
            </LiquidGlassCard>
            <div className="flex items-center gap-3 p-4 border border-[var(--separator)] rounded-lg">
                <input
                    type="checkbox"
                    checked={formData.needsSponsorship}
                    onChange={(e) => setFormData({ ...formData, needsSponsorship: e.target.checked })}
                    className="w-5 h-5"
                />
                <span className="text-sm text-[var(--label)]">
                    {language === 'ar' ? 'طلب رعاية لهذه الفعالية' : 'Request sponsorship for this event'}
                </span>
            </div>
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            case 5: return renderStep5();
            case 6: return renderStep6();
            case 7: return renderStep7();
            default: return null;
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1: return formData.titleAr && formData.titleEn && formData.startDate && formData.locationAr;
            case 2: return formData.scientificCommitteeChair && formData.learningObjectives && formData.targetAudience.length > 0;
            case 3: return formData.sessions.length > 0 && formData.totalCMEHours > 0;
            case 4: return formData.speakers.length > 0;
            case 5: return formData.marketingDescription;
            case 6: return true;
            case 7: return true;
            default: return false;
        }
    };

    const stepIcons = [FileText, Target, Calendar, Users, Mail, CreditCard, Eye];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between">
                {[1, 2, 3, 4, 5, 6, 7].map((step) => {
                    const Icon = stepIcons[step - 1];
                    const isActive = step === currentStep;
                    const isCompleted = step < currentStep;
                    return (
                        <div key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                        isActive
                                            ? 'bg-[var(--apple-blue)] text-white'
                                            : isCompleted
                                            ? 'bg-[var(--apple-green)] text-white'
                                            : 'bg-[var(--system-fill)] text-[var(--secondary-label)]'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                </div>
                                <p className={`text-xs mt-2 text-center ${isActive ? 'text-[var(--apple-blue)] font-medium' : 'text-[var(--secondary-label)]'}`}>
                                    {stepTitles[step - 1]}
                                </p>
                            </div>
                            {step < 7 && (
                                <div className={`h-1 flex-1 mx-2 ${step < currentStep ? 'bg-[var(--apple-green)]' : 'bg-[var(--system-fill)]'}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Step Content */}
            <LiquidGlassCard blurIntensity="lg" className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[var(--label)]">
                        {stepTitles[currentStep - 1]}
                    </h2>
                    <p className="text-sm text-[var(--secondary-label)] mt-1">
                        {language === 'ar' ? `الخطوة ${currentStep} من 7` : `Step ${currentStep} of 7`}
                    </p>
                </div>
                {renderStepContent()}
            </LiquidGlassCard>

            {/* Navigation */}
            <div className="flex justify-between">
                <GlassButton
                    variant="outline"
                    onClick={currentStep === 1 ? onCancel : handlePrevious}
                 className="flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {currentStep === 1 
                        ? (language === 'ar' ? 'إلغاء' : 'Cancel')
                        : (language === 'ar' ? 'السابق' : 'Previous')
                    }
                </GlassButton>
                {currentStep < 7 ? (
                    <GlassButton
                        variant="default"
                        onClick={handleNext}
                        disabled={!canProceed()}
                     className="flex items-center justify-center gap-2">
                        {language === 'ar' ? 'التالي' : 'Next'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </GlassButton>
                ) : (
                    <GlassButton
                        variant="default"
                        onClick={handleSubmit}
                        disabled={!canProceed()}
                     className="flex items-center justify-center gap-2">
                        {language === 'ar' ? 'إرسال' : 'Submit'}
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                    </GlassButton>
                )}
            </div>
        </div>
    );
}

