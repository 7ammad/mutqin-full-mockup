"use client";

import { useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/context/LanguageContext";
import { Package, Plus, Trash2, Save, Star, Award, Users, Megaphone } from "lucide-react";

interface PackageFeature {
    id: string;
    name: string;
    included: boolean;
}

interface SponsorshipPackage {
    id: string;
    name: string;
    nameAr?: string;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Custom';
    price: number;
    description: string;
    descriptionAr?: string;
    features: PackageFeature[];
    maxEvents: number;
    duration: number; // months
    active: boolean;
}

export default function SponsorshipPackages() {
    const { t, language } = useLanguage();
    const [packages, setPackages] = useState<SponsorshipPackage[]>([
        {
            id: 'pkg1',
            name: 'Gold Package',
            nameAr: 'الحزمة الذهبية',
            tier: 'Gold',
            price: 50000,
            description: 'Premium sponsorship package with maximum visibility',
            descriptionAr: 'حزمة رعاية مميزة مع أقصى قدر من الرؤية',
            features: [
                { id: 'f1', name: 'Logo on event materials', included: true },
                { id: 'f2', name: 'Booth space', included: true },
                { id: 'f3', name: 'Speaking slot', included: true },
                { id: 'f4', name: 'Social media promotion', included: true },
            ],
            maxEvents: 10,
            duration: 12,
            active: true,
        },
    ]);
    const [editingPackage, setEditingPackage] = useState<SponsorshipPackage | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleSavePackage = (pkg: SponsorshipPackage) => {
        if (pkg.id && packages.find(p => p.id === pkg.id)) {
            setPackages(packages.map(p => p.id === pkg.id ? pkg : p));
        } else {
            setPackages([...packages, { ...pkg, id: `pkg-${Date.now()}` }]);
        }
        setEditingPackage(null);
        setIsCreating(false);
    };

    const handleDeletePackage = (id: string) => {
        if (confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete this package?')) {
            setPackages(packages.filter(p => p.id !== id));
        }
    };

    const title = language === 'ar' ? 'حزم الرعاية' : 'Sponsorship Packages';
    const createPackageText = language === 'ar' ? 'إنشاء حزمة جديدة' : 'Create New Package';
    const tierText = language === 'ar' ? 'المستوى' : 'Tier';
    const priceText = language === 'ar' ? 'السعر (ريال سعودي)' : 'Price (SAR)';
    const descriptionText = language === 'ar' ? 'الوصف' : 'Description';
    const featuresText = language === 'ar' ? 'المميزات' : 'Features';
    const maxEventsText = language === 'ar' ? 'الحد الأقصى للفعاليات' : 'Max Events';
    const durationText = language === 'ar' ? 'المدة (شهور)' : 'Duration (Months)';

    return (
        <div className="space-y-6">
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[var(--label)] flex items-center gap-2">
                        <Package className="h-6 w-6 text-[var(--apple-blue)]" />
                        {title}
                    </h2>
                    <GlassButton onClick={() => setIsCreating(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {createPackageText}
                    </GlassButton>
                </div>

                {/* Package List */}
                <div className="space-y-4">
                    {packages.map((pkg) => (
                        <LiquidGlassCard key={pkg.id} blurIntensity="lg" interactive={true} className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-[var(--label)]">
                                            {language === 'ar' ? pkg.nameAr : pkg.name}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            pkg.tier === 'Platinum' ? 'bg-[var(--apple-purple)]/10 text-[var(--apple-purple)]' :
                                            pkg.tier === 'Gold' ? 'bg-[var(--apple-yellow)]/10 text-[var(--apple-yellow)]' :
                                            pkg.tier === 'Silver' ? 'bg-[var(--secondary-label)]/10 text-[var(--secondary-label)]' :
                                            'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]'
                                        }`}>
                                            {pkg.tier}
                                        </span>
                                    </div>
                                    <p className="text-[var(--secondary-label)] mb-3">
                                        {language === 'ar' ? pkg.descriptionAr : pkg.description}
                                    </p>
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Award className="h-4 w-4 text-[var(--apple-blue)]" />
                                            <span className="text-[var(--label)] font-semibold">
                                                {pkg.price.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {t('currency.sar')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-[var(--apple-green)]" />
                                            <span className="text-[var(--secondary-label)]">
                                                {maxEventsText}: {pkg.maxEvents}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Megaphone className="h-4 w-4 text-[var(--apple-orange)]" />
                                            <span className="text-[var(--secondary-label)]">
                                                {durationText}: {pkg.duration}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <GlassButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingPackage(pkg)}
                                    >
                                        {language === 'ar' ? 'تعديل' : 'Edit'}
                                    </GlassButton>
                                    <GlassButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeletePackage(pkg.id)}
                                        className="text-[var(--apple-red)]"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </GlassButton>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="mt-4 pt-4 border-t border-[var(--separator)]">
                                <h4 className="text-sm font-semibold text-[var(--label)] mb-3">{featuresText}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {pkg.features.map((feature) => (
                                        <div key={feature.id} className="flex items-center gap-2">
                                            <Checkbox checked={feature.included} disabled />
                                            <span className={`text-sm ${feature.included ? 'text-[var(--label)]' : 'text-[var(--tertiary-label)] line-through'}`}>
                                                {feature.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </LiquidGlassCard>
                    ))}
                </div>
            </LiquidGlassCard>

            {/* Create/Edit Modal */}
            {(isCreating || editingPackage) && (
                <PackageEditor
                    package={editingPackage || undefined}
                    onSave={handleSavePackage}
                    onCancel={() => {
                        setEditingPackage(null);
                        setIsCreating(false);
                    }}
                />
            )}
        </div>
    );
}

interface PackageEditorProps {
    package?: SponsorshipPackage;
    onSave: (pkg: SponsorshipPackage) => void;
    onCancel: () => void;
}

function PackageEditor({ package: pkg, onSave, onCancel }: PackageEditorProps) {
    const { language } = useLanguage();
    const [formData, setFormData] = useState<Partial<SponsorshipPackage>>({
        name: pkg?.name || '',
        nameAr: pkg?.nameAr || '',
        tier: pkg?.tier || 'Gold',
        price: pkg?.price || 0,
        description: pkg?.description || '',
        descriptionAr: pkg?.descriptionAr || '',
        features: pkg?.features || [],
        maxEvents: pkg?.maxEvents || 1,
        duration: pkg?.duration || 12,
        active: pkg?.active ?? true,
    });

    const handleSave = () => {
        if (!formData.name || !formData.tier || !formData.price) {
            alert(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
            return;
        }
        onSave(formData as SponsorshipPackage);
    };

    const addFeature = () => {
        setFormData({
            ...formData,
            features: [...(formData.features || []), { id: `f-${Date.now()}`, name: '', included: true }],
        });
    };

    const updateFeature = (index: number, field: string, value: string | boolean) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFormData({ ...formData, features: newFeatures });
    };

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features?.filter((_, i) => i !== index) || [],
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <LiquidGlassCard blurIntensity="xl" interactive={false} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                    <h3 className="text-xl font-bold text-[var(--label)]">
                        {pkg ? (language === 'ar' ? 'تعديل الحزمة' : 'Edit Package') : (language === 'ar' ? 'حزمة جديدة' : 'New Package')}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <Label>{language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>{language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</Label>
                            <Input
                                value={formData.nameAr}
                                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>{language === 'ar' ? 'المستوى' : 'Tier'}</Label>
                                <Select value={formData.tier} onValueChange={(val) => setFormData({ ...formData, tier: val as SponsorshipPackage['tier'] })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent glass={true}>
                                        <SelectItem value="Bronze">Bronze</SelectItem>
                                        <SelectItem value="Silver">Silver</SelectItem>
                                        <SelectItem value="Gold">Gold</SelectItem>
                                        <SelectItem value="Platinum">Platinum</SelectItem>
                                        <SelectItem value="Custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>{language === 'ar' ? 'السعر' : 'Price'}</Label>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>{language === 'ar' ? 'الوصف' : 'Description'}</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>{language === 'ar' ? 'الحد الأقصى للفعاليات' : 'Max Events'}</Label>
                                <Input
                                    type="number"
                                    value={formData.maxEvents}
                                    onChange={(e) => setFormData({ ...formData, maxEvents: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <Label>{language === 'ar' ? 'المدة (شهور)' : 'Duration (Months)'}</Label>
                                <Input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label>{language === 'ar' ? 'المميزات' : 'Features'}</Label>
                                <GlassButton variant="outline" size="sm" onClick={addFeature} className="flex items-center justify-center gap-2">
                                    <Plus className="h-4 w-4" />
                                </GlassButton>
                            </div>
                            <div className="space-y-2">
                                {formData.features?.map((feature, index) => (
                                    <div key={feature.id} className="flex gap-2">
                                        <Input
                                            value={feature.name}
                                            onChange={(e) => updateFeature(index, 'name', e.target.value)}
                                            placeholder={language === 'ar' ? 'اسم الميزة' : 'Feature name'}
                                        />
                                        <Checkbox
                                            checked={feature.included}
                                            onCheckedChange={(checked) => updateFeature(index, 'included', checked)}
                                        />
                                        <GlassButton
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeFeature(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </GlassButton>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <GlassButton variant="outline" onClick={onCancel} className="flex items-center justify-center gap-2">
                            {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </GlassButton>
                        <GlassButton onClick={handleSave} className="gap-2 flex items-center justify-center">
                            <Save className="h-4 w-4" />
                            {language === 'ar' ? 'حفظ' : 'Save'}
                        </GlassButton>
                    </div>
                </div>
            </LiquidGlassCard>
        </div>
    );
}

