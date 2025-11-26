"use client";

import { useState } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, Clock, FileText, Calendar, MapPin, Award, User, XCircle, AlertTriangle } from "lucide-react";
import { getEventTitle, getEventOrganizer } from "@/lib/eventTranslations";
import { EmptyState } from "@/components/shared/EmptyState";

interface ReviewStep {
    id: string;
    name: string;
    nameAr: string;
    completed: boolean;
    notes?: string;
}

export default function ReviewWorkflow() {
    const { events, approveEvent } = usePersona();
    const { language } = useLanguage();
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [reviewSteps, setReviewSteps] = useState<ReviewStep[]>([
        { id: 'step1', name: 'Basic Information', nameAr: 'المعلومات الأساسية', completed: false },
        { id: 'step2', name: 'Learning Objectives', nameAr: 'أهداف التعلم', completed: false },
        { id: 'step3', name: 'Speaker Credentials', nameAr: 'اعتماد المتحدثين', completed: false },
        { id: 'step4', name: 'CME Hours Validation', nameAr: 'التحقق من ساعات التعليم', completed: false },
        { id: 'step5', name: 'SFDA Compliance', nameAr: 'الامتثال للهيئة', completed: false },
        { id: 'step6', name: 'Date/Specialty Conflicts', nameAr: 'تعارضات التاريخ/التخصص', completed: false },
        { id: 'step7', name: 'Final Review', nameAr: 'المراجعة النهائية', completed: false },
    ]);
    const [reviewNotes, setReviewNotes] = useState<string>("");
    const [decision, setDecision] = useState<'approve' | 'reject' | 'request-modification' | null>(null);

    const pendingEvents = events.filter(e => e.status === "Pending Approval");
    const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

    const handleStepComplete = (stepIndex: number) => {
        const newSteps = [...reviewSteps];
        newSteps[stepIndex].completed = !newSteps[stepIndex].completed;
        setReviewSteps(newSteps);
    };

    const handleNextStep = () => {
        if (currentStep < reviewSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmitDecision = () => {
        if (!decision) {
            alert(language === 'ar' ? 'يرجى اختيار قرار' : 'Please select a decision');
            return;
        }

        if (decision === 'approve' && selectedEventId) {
            approveEvent(selectedEventId);
            alert(language === 'ar' ? 'تمت الموافقة بنجاح' : 'Approved successfully');
        } else if (decision === 'reject') {
            if (!reviewNotes.trim()) {
                alert(language === 'ar' ? 'يرجى إضافة ملاحظات للرفض' : 'Please add rejection notes');
                return;
            }
            alert(language === 'ar' ? 'تم رفض الفعالية' : 'Event rejected');
        } else if (decision === 'request-modification') {
            if (!reviewNotes.trim()) {
                alert(language === 'ar' ? 'يرجى إضافة ملاحظات للتعديل' : 'Please add modification notes');
                return;
            }
            alert(language === 'ar' ? 'تم طلب التعديلات' : 'Modification requested');
        }

        // Reset
        setSelectedEventId(null);
        setCurrentStep(0);
        setReviewSteps(reviewSteps.map(s => ({ ...s, completed: false })));
        setReviewNotes("");
        setDecision(null);
    };

    const allStepsCompleted = reviewSteps.every(s => s.completed);

    const title = language === 'ar' ? 'سير عمل المراجعة' : 'Review Workflow';
    const selectEventText = language === 'ar' ? 'اختر فعالية للمراجعة' : 'Select Event to Review';
    const completedText = language === 'ar' ? 'مكتمل' : 'Completed';
    const pendingText = language === 'ar' ? 'قيد الانتظار' : 'Pending';
    const notesText = language === 'ar' ? 'ملاحظات المراجعة' : 'Review Notes';
    const decisionText = language === 'ar' ? 'القرار' : 'Decision';
    const approveText = language === 'ar' ? 'موافقة' : 'Approve';
    const rejectText = language === 'ar' ? 'رفض' : 'Reject';
    const requestModificationText = language === 'ar' ? 'طلب تعديلات' : 'Request Modifications';
    const submitText = language === 'ar' ? 'إرسال القرار' : 'Submit Decision';

    return (
        <div className="space-y-6">
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h2 className="text-2xl font-bold text-[var(--label)] mb-6 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-[var(--apple-blue)]" />
                    {title}
                </h2>

                {/* Event Selection */}
                <div className="mb-6">
                    <Label className="text-base font-medium text-[var(--label)] mb-2 block">
                        {selectEventText}
                    </Label>
                    <Select value={selectedEventId || ''} onValueChange={setSelectedEventId}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={selectEventText} />
                        </SelectTrigger>
                        <SelectContent glass={true}>
                            {pendingEvents.map(event => (
                                <SelectItem key={event.id} value={event.id}>
                                    {getEventTitle(event, language)} - {getEventOrganizer(event, language)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedEvent ? (
                    <div className="space-y-6">
                        {/* Event Summary */}
                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-[var(--apple-blue)]" />
                                    <div>
                                        <p className="text-xs text-[var(--secondary-label)]">{language === 'ar' ? 'التاريخ' : 'Date'}</p>
                                        <p className="text-sm font-medium text-[var(--label)]">
                                            {new Date(selectedEvent.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-[var(--apple-green)]" />
                                    <div>
                                        <p className="text-xs text-[var(--secondary-label)]">{language === 'ar' ? 'المكان' : 'Location'}</p>
                                        <p className="text-sm font-medium text-[var(--label)]">
                                            {language === 'ar' ? selectedEvent.locationAr : selectedEvent.locationEn}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4 text-[var(--apple-orange)]" />
                                    <div>
                                        <p className="text-xs text-[var(--secondary-label)]">{language === 'ar' ? 'ساعات التعليم' : 'CME Hours'}</p>
                                        <p className="text-sm font-medium text-[var(--label)]">{selectedEvent.cme_hours}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-[var(--apple-purple)]" />
                                    <div>
                                        <p className="text-xs text-[var(--secondary-label)]">{language === 'ar' ? 'المنظم' : 'Organizer'}</p>
                                        <p className="text-sm font-medium text-[var(--label)]">
                                            {getEventOrganizer(selectedEvent, language)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </LiquidGlassCard>

                        {/* Review Steps */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[var(--label)]">
                                {language === 'ar' ? 'خطوات المراجعة' : 'Review Steps'}
                            </h3>
                            {reviewSteps.map((step, index) => (
                                <LiquidGlassCard
                                    key={step.id}
                                    blurIntensity="lg"
                                    interactive={true}
                                    className={`p-4 ${step.completed ? 'border border-[var(--apple-green)]' : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                step.completed
                                                    ? 'bg-[var(--apple-green)]/20 text-[var(--apple-green)]'
                                                    : currentStep === index
                                                    ? 'bg-[var(--apple-blue)]/20 text-[var(--apple-blue)]'
                                                    : 'bg-[var(--system-fill)] text-[var(--secondary-label)]'
                                            }`}>
                                                {step.completed ? (
                                                    <CheckCircle2 className="h-5 w-5" />
                                                ) : (
                                                    <span className="text-sm font-bold">{index + 1}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--label)]">
                                                    {language === 'ar' ? step.nameAr : step.name}
                                                </p>
                                                <p className="text-xs text-[var(--secondary-label)]">
                                                    {step.completed ? completedText : pendingText}
                                                </p>
                                            </div>
                                        </div>
                                        <Checkbox
                                            checked={step.completed}
                                            onCheckedChange={() => handleStepComplete(index)}
                                        />
                                    </div>
                                </LiquidGlassCard>
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between">
                            <GlassButton
                                variant="outline"
                                onClick={handlePreviousStep}
                                disabled={currentStep === 0}
                            >
                                {language === 'ar' ? 'السابق' : 'Previous'}
                            </GlassButton>
                            <GlassButton
                                onClick={handleNextStep}
                                disabled={currentStep === reviewSteps.length - 1}
                            >
                                {language === 'ar' ? 'التالي' : 'Next'}
                            </GlassButton>
                        </div>

                        {/* Review Notes */}
                        <div>
                            <Label className="text-base font-medium text-[var(--label)] mb-2 block">
                                {notesText}
                            </Label>
                            <Textarea
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder={language === 'ar' ? 'أضف ملاحظات المراجعة...' : 'Add review notes...'}
                                rows={4}
                            />
                        </div>

                        {/* Decision */}
                        {allStepsCompleted && (
                            <div className="space-y-4 p-4 bg-[var(--system-fill)] rounded-ios">
                                <Label className="text-base font-medium text-[var(--label)] block">
                                    {decisionText}
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <GlassButton
                                        variant={decision === 'approve' ? 'default' : 'outline'}
                                        onClick={() => setDecision('approve')}
                                        className="gap-2"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        {approveText}
                                    </GlassButton>
                                    <GlassButton
                                        variant={decision === 'reject' ? 'default' : 'outline'}
                                        onClick={() => setDecision('reject')}
                                        className="gap-2"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        {rejectText}
                                    </GlassButton>
                                    <GlassButton
                                        variant={decision === 'request-modification' ? 'default' : 'outline'}
                                        onClick={() => setDecision('request-modification')}
                                        className="gap-2"
                                    >
                                        <AlertTriangle className="h-4 w-4" />
                                        {requestModificationText}
                                    </GlassButton>
                                </div>
                                <GlassButton
                                    onClick={handleSubmitDecision}
                                    className="w-full gap-2"
                                    disabled={!decision}
                                >
                                    <FileText className="h-4 w-4" />
                                    {submitText}
                                </GlassButton>
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState
                        title={language === 'ar' ? 'لم يتم اختيار فعالية' : 'No Event Selected'}
                        description={language === 'ar' ? 'يرجى اختيار فعالية للمراجعة' : 'Please select an event to review'}
                        icon={FileText}
                    />
                )}
            </LiquidGlassCard>
        </div>
    );
}

