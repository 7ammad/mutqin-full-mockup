"use client";

import { useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { Target, Users, MapPin, Briefcase, GraduationCap, TrendingUp, Save } from "lucide-react";
import { Chart } from "@/components/shared/Chart";

export default function HCPTargeting() {
    const { t, language } = useLanguage();
    const [targetName, setTargetName] = useState("");
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [seniorityLevel, setSeniorityLevel] = useState<number[]>([1, 3]);
    const [minCMEHours, setMinCMEHours] = useState<number[]>([0]);
    const [maxCMEHours, setMaxCMEHours] = useState<number[]>([200]);
    const [targetAudienceSize, setTargetAudienceSize] = useState(0);

    const specialties = [
        { id: 'cardiology', label: t('specialties.cardiology') },
        { id: 'pediatrics', label: t('specialties.pediatrics') },
        { id: 'generalsurgery', label: t('specialties.generalSurgery') },
        { id: 'familymedicine', label: t('specialties.familyMedicine') },
        { id: 'emergency', label: t('specialties.emergency') },
    ];

    const regions = [
        { id: 'riyadh', label: t('regions.riyadh') },
        { id: 'jeddah', label: t('regions.jeddah') },
        { id: 'dammam', label: t('regions.dammam') },
    ];

    const seniorityLevels = [
        { id: 1, label: t('seniority.resident') },
        { id: 2, label: t('seniority.specialist') },
        { id: 3, label: t('seniority.consultant') },
    ];

    const handleSpecialtyChange = (id: string, checked: boolean) => {
        setSelectedSpecialties(prev =>
            checked ? [...prev, id] : prev.filter(s => s !== id)
        );
    };

    const handleRegionChange = (id: string, checked: boolean) => {
        setSelectedRegions(prev =>
            checked ? [...prev, id] : prev.filter(r => r !== id)
        );
    };

    const calculateAudience = () => {
        // Mock calculation
        let base = 5000;
        if (selectedSpecialties.length > 0) base += selectedSpecialties.length * 2000;
        if (selectedRegions.length > 0) base += selectedRegions.length * 3000;
        const seniorityRange = seniorityLevel[1] - seniorityLevel[0] + 1;
        base += seniorityRange * 1000;
        setTargetAudienceSize(Math.min(base, 50000));
    };

    const handleSaveTarget = () => {
        console.log("Saving target:", {
            targetName,
            selectedSpecialties,
            selectedRegions,
            seniorityLevel,
            minCMEHours: minCMEHours[0],
            maxCMEHours: maxCMEHours[0],
        });
        alert(language === 'ar' ? 'تم حفظ الهدف بنجاح' : 'Target saved successfully');
    };

    // Mock audience distribution data
    const audienceDistribution = [
        { name: t('specialties.cardiology'), value: 1200 },
        { name: t('specialties.pediatrics'), value: 800 },
        { name: t('specialties.generalSurgery'), value: 600 },
        { name: t('specialties.familyMedicine'), value: 900 },
        { name: t('specialties.emergency'), value: 300 },
    ];

    const title = language === 'ar' ? 'استهداف الممارسين الصحيين' : 'HCP Targeting';
    const targetNameText = language === 'ar' ? 'اسم الهدف' : 'Target Name';
    const specialtyText = language === 'ar' ? 'التخصص' : 'Specialty';
    const regionText = language === 'ar' ? 'المنطقة' : 'Region';
    const seniorityText = language === 'ar' ? 'المستوى الوظيفي' : 'Seniority Level';
    const cmeHoursText = language === 'ar' ? 'ساعات التعليم الطبي المستمر' : 'CME Hours';
    const estimatedAudienceText = language === 'ar' ? 'الجمهور المقدر' : 'Estimated Audience';
    const calculateText = language === 'ar' ? 'حساب الجمهور' : 'Calculate Audience';
    const saveTargetText = language === 'ar' ? 'حفظ الهدف' : 'Save Target';

    return (
        <div className="space-y-6">
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h2 className="text-xl font-bold text-[var(--label)] mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-[var(--apple-blue)]" />
                    {title}
                </h2>
                <p className="text-[var(--secondary-label)] mb-6">
                    {language === 'ar' 
                        ? 'أنشئ أهداف مخصصة للوصول إلى الممارسين الصحيين المناسبين'
                        : 'Create custom targets to reach the right healthcare professionals'}
                </p>

                <div className="space-y-6">
                    {/* Target Name */}
                    <div>
                        <Label htmlFor="targetName" className="text-base font-medium text-[var(--label)] mb-2">
                            {targetNameText}
                        </Label>
                        <Input
                            id="targetName"
                            placeholder={language === 'ar' ? 'مثال: أطباء القلب في الرياض' : 'e.g., Cardiologists in Riyadh'}
                            value={targetName}
                            onChange={(e) => setTargetName(e.target.value)}
                        />
                    </div>

                    {/* Specialty Filter */}
                    <div>
                        <Label className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-[var(--apple-green)]" />
                            {specialtyText}
                        </Label>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            {specialties.map(spec => (
                                <div key={spec.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`spec-${spec.id}`}
                                        checked={selectedSpecialties.includes(spec.id)}
                                        onCheckedChange={(checked) => handleSpecialtyChange(spec.id, !!checked)}
                                    />
                                    <label
                                        htmlFor={`spec-${spec.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[var(--label)]"
                                    >
                                        {spec.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Region Filter */}
                    <div>
                        <Label className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[var(--apple-orange)]" />
                            {regionText}
                        </Label>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            {regions.map(reg => (
                                <div key={reg.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`region-${reg.id}`}
                                        checked={selectedRegions.includes(reg.id)}
                                        onCheckedChange={(checked) => handleRegionChange(reg.id, !!checked)}
                                    />
                                    <label
                                        htmlFor={`region-${reg.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[var(--label)]"
                                    >
                                        {reg.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seniority Level */}
                    <div>
                        <Label className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-[var(--apple-purple)]" />
                            {seniorityText}
                        </Label>
                        <div className="mt-4 px-2">
                            <Slider
                                min={1}
                                max={3}
                                step={1}
                                value={seniorityLevel}
                                onValueChange={setSeniorityLevel}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-[var(--secondary-label)] mt-2">
                                {seniorityLevels.map(level => (
                                    <span key={level.id} className={
                                        seniorityLevel[0] <= level.id && level.id <= seniorityLevel[1]
                                            ? 'font-bold text-[var(--label)]'
                                            : ''
                                    }>
                                        {level.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CME Hours Range */}
                    <div>
                        <Label className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-[var(--apple-blue)]" />
                            {cmeHoursText}
                        </Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <Label className="text-sm text-[var(--secondary-label)] mb-1">
                                    {language === 'ar' ? 'الحد الأدنى' : 'Minimum'}
                                </Label>
                                <Input
                                    type="number"
                                    value={minCMEHours[0]}
                                    onChange={(e) => setMinCMEHours([Number(e.target.value)])}
                                />
                            </div>
                            <div>
                                <Label className="text-sm text-[var(--secondary-label)] mb-1">
                                    {language === 'ar' ? 'الحد الأقصى' : 'Maximum'}
                                </Label>
                                <Input
                                    type="number"
                                    value={maxCMEHours[0]}
                                    onChange={(e) => setMaxCMEHours([Number(e.target.value)])}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Estimated Audience */}
                    <div className="flex items-center justify-between bg-[var(--system-fill)] p-4 rounded-ios">
                        <p className="text-lg font-semibold text-[var(--label)]">
                            {estimatedAudienceText}
                        </p>
                        <p className="text-2xl font-bold text-[var(--apple-blue)]">
                            {targetAudienceSize > 0 
                                ? targetAudienceSize.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')
                                : '---'
                            }+
                        </p>
                    </div>

                    <div className="flex justify-end gap-2">
                        <GlassButton variant="outline" onClick={calculateAudience} className="flex items-center justify-center gap-2">
                            {calculateText}
                        </GlassButton>
                        <GlassButton onClick={handleSaveTarget} className="gap-2 flex items-center justify-center">
                            <Save className="h-4 w-4" />
                            {saveTargetText}
                        </GlassButton>
                    </div>
                </div>
            </LiquidGlassCard>

            {/* Audience Distribution Chart */}
            {targetAudienceSize > 0 && (
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        {language === 'ar' ? 'توزيع الجمهور حسب التخصص' : 'Audience Distribution by Specialty'}
                    </h3>
                    <Chart
                        type="pie"
                        data={audienceDistribution}
                        dataKey="value"
                        nameKey="name"
                        height={300}
                    />
                </LiquidGlassCard>
            )}
        </div>
    );
}

