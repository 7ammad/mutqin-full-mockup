"use client";

import { useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { Event } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { useToast } from "@/components/ui/toast-context";

interface RegistrationFlowProps {
    event: Event;
    onComplete: () => void;
    onCancel: () => void;
}

export function RegistrationFlow({ event, onComplete, onCancel }: RegistrationFlowProps) {
    const { language } = useLanguage();
    const { registerForEvent } = usePersona();
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        specialty: "",
        licenseNumber: "",
    });

    const handleSubmit = () => {
        registerForEvent(event.id);
        showToast(
            language === 'ar' ? 'تم التسجيل بنجاح' : 'Registration successful',
            "success"
        );
        onComplete();
    };

    const steps = [
        {
            title: language === 'ar' ? 'معلومات الاتصال' : 'Contact Information',
            fields: ['name', 'email', 'phone'],
        },
        {
            title: language === 'ar' ? 'المعلومات المهنية' : 'Professional Information',
            fields: ['specialty', 'licenseNumber'],
        },
        {
            title: language === 'ar' ? 'التأكيد' : 'Confirmation',
            fields: [],
        },
    ];

    const currentStepData = steps[step - 1];
    const isLastStep = step === steps.length;

    return (
        <LiquidGlassCard blurIntensity="xl" interactive={false} className="max-w-2xl mx-auto">
            <div className="space-y-6">
                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-[var(--secondary-label)]">
                        <span>
                            {language === 'ar' ? 'الخطوة' : 'Step'} {step} {language === 'ar' ? 'من' : 'of'} {steps.length}
                        </span>
                        <span>{Math.round((step / steps.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--system-fill)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--apple-blue)] transition-all duration-300"
                            style={{ width: `${(step / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step Content */}
                <div className="min-h-[300px]">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-[var(--label)]">
                                {currentStepData.title}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-[var(--label)] mb-1 block">
                                        {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                                    </label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[var(--label)] mb-1 block">
                                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                                    </label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder={language === 'ar' ? 'example@email.com' : 'example@email.com'}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[var(--label)] mb-1 block">
                                        {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                                    </label>
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder={language === 'ar' ? '+966501234567' : '+966501234567'}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-[var(--label)]">
                                {currentStepData.title}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-[var(--label)] mb-1 block">
                                        {language === 'ar' ? 'التخصص' : 'Specialty'}
                                    </label>
                                    <Input
                                        value={formData.specialty}
                                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                        placeholder={language === 'ar' ? 'أدخل تخصصك' : 'Enter your specialty'}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[var(--label)] mb-1 block">
                                        {language === 'ar' ? 'رقم الرخصة' : 'License Number'}
                                    </label>
                                    <Input
                                        value={formData.licenseNumber}
                                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                        placeholder={language === 'ar' ? 'رقم الرخصة الطبية' : 'Medical license number'}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="text-center py-8">
                                <CheckCircle2 className="w-16 h-16 text-[var(--apple-green)] mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-[var(--label)] mb-2">
                                    {language === 'ar' ? 'تأكيد التسجيل' : 'Confirm Registration'}
                                </h3>
                                <p className="text-[var(--secondary-label)]">
                                    {language === 'ar'
                                        ? 'يرجى مراجعة معلوماتك قبل التأكيد'
                                        : 'Please review your information before confirming'}
                                </p>
                            </div>
                            <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--secondary-label)]">{language === 'ar' ? 'الاسم' : 'Name'}:</span>
                                        <span className="text-[var(--label)] font-medium">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--secondary-label)]">{language === 'ar' ? 'البريد' : 'Email'}:</span>
                                        <span className="text-[var(--label)] font-medium">{formData.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--secondary-label)]">{language === 'ar' ? 'التخصص' : 'Specialty'}:</span>
                                        <span className="text-[var(--label)] font-medium">{formData.specialty}</span>
                                    </div>
                                </div>
                            </LiquidGlassCard>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--separator)]">
                    <GlassButton
                        onClick={step === 1 ? onCancel : () => setStep(step - 1)}
                        variant="outline"
                        size="default"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {step === 1
                            ? (language === 'ar' ? 'إلغاء' : 'Cancel')
                            : (language === 'ar' ? 'السابق' : 'Previous')}
                    </GlassButton>

                    <GlassButton
                        onClick={isLastStep ? handleSubmit : () => setStep(step + 1)}
                        variant="default"
                        size="default"
                    >
                        {isLastStep
                            ? (language === 'ar' ? 'تأكيد التسجيل' : 'Confirm Registration')
                            : (language === 'ar' ? 'التالي' : 'Next')}
                        {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
                    </GlassButton>
                </div>
            </div>
        </LiquidGlassCard>
    );
}

