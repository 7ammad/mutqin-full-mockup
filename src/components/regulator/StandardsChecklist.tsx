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
        categoryAr: ' ',
        name: 'Event Title and Description',
        nameAr: '  ',
        description: 'Clear, accurate event title and description in both Arabic and English',
        descriptionAr: '      ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std2',
        category: 'Event Information',
        categoryAr: ' ',
        name: 'Date and Location',
        nameAr: ' ',
        description: 'Valid date and complete location information',
        descriptionAr: '    ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std3',
        category: 'Learning Objectives',
        categoryAr: ' ',
        name: 'SMART Learning Objectives',
        nameAr: '  SMART',
        description: 'Specific, Measurable, Achievable, Relevant, Time-bound objectives',
        descriptionAr: '         ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std4',
        category: 'Learning Objectives',
        categoryAr: ' ',
        name: 'Learning Objectives Alignment',
        nameAr: '  ',
        description: 'Objectives align with event content and specialty',
        descriptionAr: '     ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std5',
        category: 'CME Hours',
        categoryAr: ' ',
        name: 'CME Hours Justification',
        nameAr: '  ',
        description: 'CME hours are justified based on event duration and content',
        descriptionAr: '       ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std6',
        category: 'CME Hours',
        categoryAr: ' ',
        name: 'CME Hours Calculation',
        nameAr: '  ',
        description: 'Accurate calculation of CME hours (excluding breaks)',
        descriptionAr: '    ( )',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std7',
        category: 'Speakers',
        categoryAr: '',
        name: 'Speaker Credentials',
        nameAr: ' ',
        description: 'All speakers have verified credentials and qualifications',
        descriptionAr: '     ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std8',
        category: 'Speakers',
        categoryAr: '',
        name: 'Speaker Expertise',
        nameAr: ' ',
        description: 'Speakers have relevant expertise in the event specialty',
        descriptionAr: '      ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std9',
        category: 'Speakers',
        categoryAr: '',
        name: 'Speaker Disclosure',
        nameAr: ' ',
        description: 'All speakers have completed conflict of interest disclosures',
        descriptionAr: '     ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std10',
        category: 'Content',
        categoryAr: '',
        name: 'Evidence-Based Content',
        nameAr: '   ',
        description: 'Event content is based on current evidence and best practices',
        descriptionAr: '       ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std11',
        category: 'Content',
        categoryAr: '',
        name: 'No Commercial Bias',
        nameAr: '   ',
        description: 'Content is free from commercial bias and promotional material',
        descriptionAr: '      ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std12',
        category: 'Content',
        categoryAr: '',
        name: 'Content Quality',
        nameAr: ' ',
        description: 'Content is appropriate for the target audience and specialty',
        descriptionAr: '    ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std13',
        category: 'SFDA Compliance',
        categoryAr: ' ',
        name: 'SFDA License',
        nameAr: ' ',
        description: 'Valid SFDA license number provided for sponsored events',
        descriptionAr: '       ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std14',
        category: 'SFDA Compliance',
        categoryAr: ' ',
        name: 'License Verification',
        nameAr: '  ',
        description: 'SFDA license is verified and active',
        descriptionAr: '   ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std15',
        category: 'Organizer',
        categoryAr: '',
        name: 'Organizer Credentials',
        nameAr: ' ',
        description: 'Organizer has valid credentials and registration',
        descriptionAr: '    ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std16',
        category: 'Organizer',
        categoryAr: '',
        name: 'Organizer Track Record',
        nameAr: ' ',
        description: 'Organizer has a positive track record (if applicable)',
        descriptionAr: '    ( )',
        mandatory: false,
        checked: false,
    },
    {
        id: 'std17',
        category: 'Scheduling',
        categoryAr: '',
        name: 'No Date Conflicts',
        nameAr: '    ',
        description: 'Event date does not conflict with major holidays or other major events',
        descriptionAr: '          ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std18',
        category: 'Scheduling',
        categoryAr: '',
        name: 'No Specialty Conflicts',
        nameAr: '    ',
        description: 'Event does not conflict with other events in the same specialty on the same date',
        descriptionAr: '           ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std19',
        category: 'Accessibility',
        categoryAr: ' ',
        name: 'Venue Accessibility',
        nameAr: '  ',
        description: 'Venue is accessible for people with disabilities',
        descriptionAr: '      ',
        mandatory: true,
        checked: false,
    },
    {
        id: 'std20',
        category: 'Documentation',
        categoryAr: '',
        name: 'Complete Documentation',
        nameAr: ' ',
        description: 'All required documents are provided and complete',
        descriptionAr: '    ',
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
        alert(language === 'ar' ? '  ' : 'Checklist saved');
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

    const title = language === 'ar' ? ' ' : 'Standards Checklist';
    const selectEventText = language === 'ar' ? '  ' : 'Select Event to Review';
    const mandatoryText = language === 'ar' ? '' : 'Mandatory';
    const optionalText = language === 'ar' ? '' : 'Optional';
    const progressText = language === 'ar' ? '' : 'Progress';
    const saveText = language === 'ar' ? '' : 'Save';
    const addNoteText = language === 'ar' ? ' ' : 'Add Note';

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
                            <GlassButton onClick={handleSave} className="gap-2 flex items-center justify-center">
                                <Save className="h-4 w-4" />
                                {saveText}
                            </GlassButton>
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        title={language === 'ar' ? '   ' : 'No Event Selected'}
                        description={language === 'ar' ? '   ' : 'Please select an event to review'}
                        icon={FileText}
                    />
                )}
            </LiquidGlassCard>
        </div>
    );
}

