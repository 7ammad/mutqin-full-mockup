"use client";

import { useState } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, FileText, AlertTriangle, Save } from "lucide-react";
import { getEventTitle } from "@/lib/eventTranslations";
import { EmptyState } from "@/components/shared/EmptyState";

interface Standard {
    id: string;
    category: string;
    categoryAr: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    mandatory: boolean;
    checked: boolean;
    notes?: string;
}

const STANDARDS: Standard[] = [
    {
        id: 'std1',
        category: 'Event Information',
        categoryAr: 'معلومات الفعالية',
        name: 'Event Title and Description',
        nameAr: 'عنوان ووصف الفعالية',
        description: 'Clear, accurate event title and description in both Arabic and English',
        descriptionAr: 'عنوان ووصف واضح ودقيق للفعالية بالعربية والإنجليزية',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std2',
        category: 'Event Information',
        categoryAr: 'معلومات الفعالية',
        name: 'Date and Location',
        nameAr: 'التاريخ والمكان',
        description: 'Valid date and complete location information',
        descriptionAr: 'تاريخ صحيح ومعلومات مكان كاملة',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std3',
        category: 'Learning Objectives',
        categoryAr: 'أهداف التعلم',
        name: 'SMART Learning Objectives',
        nameAr: 'أهداف تعلم SMART',
        description: 'Specific, Measurable, Achievable, Relevant, Time-bound objectives',
        descriptionAr: 'أهداف محددة وقابلة للقياس وقابلة للتحقيق وذات صلة ومحددة بوقت',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std4',
        category: 'Learning Objectives',
        categoryAr: 'أهداف التعلم',
        name: 'Learning Objectives Alignment',
        nameAr: 'محاذاة أهداف التعلم',
        description: 'Objectives align with event content and specialty',
        descriptionAr: 'الأهداف تتماشى مع محتوى الفعالية والتخصص',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std5',
        category: 'CME Hours',
        categoryAr: 'ساعات التعليم',
        name: 'CME Hours Justification',
        nameAr: 'مبرر ساعات التعليم',
        description: 'CME hours are justified based on event duration and content',
        descriptionAr: 'ساعات التعليم مبررة بناءً على مدة الفعالية والمحتوى',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std6',
        category: 'CME Hours',
        categoryAr: 'ساعات التعليم',
        name: 'CME Hours Calculation',
        nameAr: 'حساب ساعات التعليم',
        description: 'Accurate calculation of CME hours (excluding breaks)',
        descriptionAr: 'حساب دقيق لساعات التعليم (باستثناء الاستراحات)',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std7',
        category: 'Speakers',
        categoryAr: 'المتحدثون',
        name: 'Speaker Credentials',
        nameAr: 'اعتماد المتحدثين',
        description: 'All speakers have verified credentials and qualifications',
        descriptionAr: 'جميع المتحدثين لديهم اعتمادات ومؤهلات موثقة',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std8',
        category: 'Speakers',
        categoryAr: 'المتحدثون',
        name: 'Speaker Expertise',
        nameAr: 'خبرة المتحدثين',
        description: 'Speakers have relevant expertise in the event specialty',
        descriptionAr: 'المتحدثون لديهم خبرة ذات صلة بتخصص الفعالية',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std9',
        category: 'Speakers',
        categoryAr: 'المتحدثون',
        name: 'Speaker Disclosure',
        nameAr: 'إفصاح المتحدثين',
        description: 'All speakers have completed conflict of interest disclosures',
        descriptionAr: 'جميع المتحدثين أكملوا إفصاحات تضارب المصالح',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std10',
        category: 'Content',
        categoryAr: 'المحتوى',
        name: 'Evidence-Based Content',
        nameAr: 'محتوى قائم على الأدلة',
        description: 'Event content is based on current evidence and best practices',
        descriptionAr: 'محتوى الفعالية قائم على الأدلة الحالية وأفضل الممارسات',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std11',
        category: 'Content',
        categoryAr: 'المحتوى',
        name: 'No Commercial Bias',
        nameAr: 'عدم وجود تحيز تجاري',
        description: 'Content is free from commercial bias and promotional material',
        descriptionAr: 'المحتوى خالٍ من التحيز التجاري والمواد الترويجية',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std12',
        category: 'Content',
        categoryAr: 'المحتوى',
        name: 'Content Quality',
        nameAr: 'جودة المحتوى',
        description: 'Content is appropriate for the target audience and specialty',
        descriptionAr: 'المحتوى مناسب للجمهور المستهدف والتخصص',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std13',
        category: 'SFDA Compliance',
        categoryAr: 'الامتثال للهيئة',
        name: 'SFDA License',
        nameAr: 'ترخيص الهيئة',
        description: 'Valid SFDA license number provided for sponsored events',
        descriptionAr: 'تم تقديم رقم ترخيص هيئة صالح للفعاليات الممولة',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std14',
        category: 'SFDA Compliance',
        categoryAr: 'الامتثال للهيئة',
        name: 'License Verification',
        nameAr: 'التحقق من الترخيص',
        description: 'SFDA license is verified and active',
        descriptionAr: 'ترخيص الهيئة موثق ونشط',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std15',
        category: 'Organizer',
        categoryAr: 'المنظم',
        name: 'Organizer Credentials',
        nameAr: 'اعتماد المنظم',
        description: 'Organizer has valid credentials and registration',
        descriptionAr: 'المنظم لديه اعتمادات وتسجيل صالح',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std16',
        category: 'Organizer',
        categoryAr: 'المنظم',
        name: 'Organizer Track Record',
        nameAr: 'سجل المنظم',
        description: 'Organizer has a positive track record (if applicable)',
        descriptionAr: 'المنظم لديه سجل إيجابي (إن أمكن)',
        mandatory: false,
        checked: false,
    },
    {
        id: 'std17',
        category: 'Scheduling',
        categoryAr: 'الجدولة',
        name: 'No Date Conflicts',
        nameAr: 'عدم وجود تعارضات في التاريخ',
        description: 'Event date does not conflict with major holidays or other major events',
        descriptionAr: 'تاريخ الفعالية لا يتعارض مع العطلات الكبرى أو الفعاليات الكبرى الأخرى',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std18',
        category: 'Scheduling',
        categoryAr: 'الجدولة',
        name: 'No Specialty Conflicts',
        nameAr: 'عدم وجود تعارضات في التخصص',
        description: 'Event does not conflict with other events in the same specialty on the same date',
        descriptionAr: 'الفعالية لا تتعارض مع فعاليات أخرى في نفس التخصص في نفس التاريخ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std19',
        category: 'Accessibility',
        categoryAr: 'إمكانية الوصول',
        name: 'Venue Accessibility',
        nameAr: 'إمكانية الوصول للمكان',
        description: 'Venue is accessible for people with disabilities',
        descriptionAr: 'المكان يمكن الوصول إليه للأشخاص ذوي الإعاقة',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std20',
        category: 'Documentation',
        categoryAr: 'التوثيق',
        name: 'Complete Documentation',
        nameAr: 'توثيق كامل',
        description: 'All required documents are provided and complete',
        descriptionAr: 'جميع المستندات المطلوبة مقدمة وكاملة',
        mandatory: true,
        checked: false,
    },
];

export default function StandardsChecklist() {
    const { events } = usePersona();
    const { language } = useLanguage();
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [standards, setStandards] = useState<Standard[]>(STANDARDS.map(s => ({ ...s })));
    const [notes, setNotes] = useState<Record<string, string>>({});

    const pendingEvents = events.filter(e => e.status === "Pending Approval");
    const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

    const handleStandardToggle = (standardId: string) => {
        setStandards(standards.map(s => 
            s.id === standardId ? { ...s, checked: !s.checked } : s
        ));
    };

    const handleNoteChange = (standardId: string, note: string) => {
        setNotes({ ...notes, [standardId]: note });
    };

    const handleSave = () => {
        console.log("Saving checklist:", { standards, notes });
        alert(language === 'ar' ? 'تم حفظ القائمة' : 'Checklist saved');
    };

    const mandatoryStandards = standards.filter(s => s.mandatory);
    const completedMandatory = mandatoryStandards.filter(s => s.checked).length;
    const allMandatoryCompleted = mandatoryStandards.every(s => s.checked);

    const groupedStandards = standards.reduce((acc, std) => {
        const key = language === 'ar' ? std.categoryAr : std.category;
        if (!acc[key]) acc[key] = [];
        acc[key].push(std);
        return acc;
    }, {} as Record<string, Standard[]>);

    const title = language === 'ar' ? 'قائمة المعايير' : 'Standards Checklist';
    const selectEventText = language === 'ar' ? 'اختر فعالية للمراجعة' : 'Select Event to Review';
    const mandatoryText = language === 'ar' ? 'إلزامي' : 'Mandatory';
    const optionalText = language === 'ar' ? 'اختياري' : 'Optional';
    const progressText = language === 'ar' ? 'التقدم' : 'Progress';
    const saveText = language === 'ar' ? 'حفظ' : 'Save';
    const addNoteText = language === 'ar' ? 'إضافة ملاحظة' : 'Add Note';

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
                                    {getEventTitle(event, language)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Progress Summary */}
                {selectedEvent && (
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4 mb-6 bg-[var(--system-fill)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--secondary-label)] mb-1">{progressText}</p>
                                <p className="text-lg font-bold text-[var(--label)]">
                                    {completedMandatory} / {mandatoryStandards.length} {mandatoryText}
                                </p>
                            </div>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                allMandatoryCompleted
                                    ? 'bg-[var(--apple-green)]/20 text-[var(--apple-green)]'
                                    : 'bg-[var(--apple-orange)]/20 text-[var(--apple-orange)]'
                            }`}>
                                {allMandatoryCompleted ? (
                                    <CheckCircle2 className="h-8 w-8" />
                                ) : (
                                    <AlertTriangle className="h-8 w-8" />
                                )}
                            </div>
                        </div>
                    </LiquidGlassCard>
                )}

                {selectedEvent ? (
                    <div className="space-y-6">
                        {Object.entries(groupedStandards).map(([category, categoryStandards]) => (
                            <LiquidGlassCard key={category} blurIntensity="lg" interactive={false} className="p-6">
                                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{category}</h3>
                                <div className="space-y-4">
                                    {categoryStandards.map((standard) => (
                                        <div key={standard.id} className="space-y-2">
                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    checked={standard.checked}
                                                    onCheckedChange={() => handleStandardToggle(standard.id)}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Label className="font-medium text-[var(--label)] cursor-pointer">
                                                            {language === 'ar' ? standard.nameAr : standard.name}
                                                        </Label>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                            standard.mandatory
                                                                ? 'bg-[var(--apple-red)]/10 text-[var(--apple-red)]'
                                                                : 'bg-[var(--secondary-label)]/10 text-[var(--secondary-label)]'
                                                        }`}>
                                                            {standard.mandatory ? mandatoryText : optionalText}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-[var(--secondary-label)]">
                                                        {language === 'ar' ? standard.descriptionAr : standard.description}
                                                    </p>
                                                    {standard.checked && (
                                                        <div className="mt-2">
                                                            <Textarea
                                                                placeholder={addNoteText}
                                                                value={notes[standard.id] || ''}
                                                                onChange={(e) => handleNoteChange(standard.id, e.target.value)}
                                                                rows={2}
                                                                className="text-sm"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </LiquidGlassCard>
                        ))}

                        <div className="flex justify-end">
                            <GlassButton onClick={handleSave} className="gap-2">
                                <Save className="h-4 w-4" />
                                {saveText}
                            </GlassButton>
                        </div>
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

