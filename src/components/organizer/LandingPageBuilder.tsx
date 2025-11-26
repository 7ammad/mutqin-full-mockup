"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/shared/FileUpload';
import { Image, Palette, Type, Layout, Eye, Save } from 'lucide-react';

interface LandingPageConfig {
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
    heroImage?: string;
    primaryColor: string;
    secondaryColor: string;
    layout: 'centered' | 'left' | 'right';
    showRegistrationForm: boolean;
}

export default function LandingPageBuilder() {
    const { language } = useLanguage();
    const [config, setConfig] = useState<LandingPageConfig>({
        title: '',
        titleAr: '',
        description: '',
        descriptionAr: '',
        primaryColor: '#007AFF',
        secondaryColor: '#34C759',
        layout: 'centered',
        showRegistrationForm: true,
    });
    const [previewMode, setPreviewMode] = useState(false);

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setConfig({ ...config, heroImage: e.target?.result as string });
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const title = language === 'ar' ? 'بناء صفحة الهبوط' : 'Landing Page Builder';
    const pageTitleText = language === 'ar' ? 'عنوان الصفحة' : 'Page Title';
    const descriptionText = language === 'ar' ? 'الوصف' : 'Description';
    const heroImageText = language === 'ar' ? 'صورة البطل' : 'Hero Image';
    const colorsText = language === 'ar' ? 'الألوان' : 'Colors';
    const primaryColorText = language === 'ar' ? 'اللون الأساسي' : 'Primary Color';
    const secondaryColorText = language === 'ar' ? 'اللون الثانوي' : 'Secondary Color';
    const layoutText = language === 'ar' ? 'التخطيط' : 'Layout';
    const showRegistrationText = language === 'ar' ? 'إظهار نموذج التسجيل' : 'Show Registration Form';
    const previewText = language === 'ar' ? 'معاينة' : 'Preview';
    const saveText = language === 'ar' ? 'حفظ' : 'Save';
    const backText = language === 'ar' ? 'رجوع' : 'Back';
    const editText = language === 'ar' ? 'تعديل' : 'Edit';

    if (previewMode) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[var(--label)]">{previewText}</h2>
                    <GlassButton variant="outline" onClick={() => setPreviewMode(false)}>
                        {editText}
                    </GlassButton>
                </div>

                {/* Preview */}
                <div className="border-2 border-[var(--separator)] rounded-lg overflow-hidden">
                    <div
                        className="relative min-h-[400px] flex items-center justify-center p-8"
                        style={{
                            backgroundImage: config.heroImage ? `url(${config.heroImage})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: config.heroImage ? undefined : config.primaryColor + '20',
                        }}
                    >
                        <div
                            className={`max-w-4xl w-full ${
                                config.layout === 'centered' ? 'text-center mx-auto' :
                                config.layout === 'left' ? 'text-left' : 'text-right'
                            }`}
                        >
                            <h1
                                className="text-4xl md:text-5xl font-bold mb-4"
                                style={{ color: config.primaryColor }}
                            >
                                {language === 'ar' && config.titleAr ? config.titleAr : config.title}
                            </h1>
                            <p className="text-lg text-[var(--label)] mb-6">
                                {language === 'ar' && config.descriptionAr ? config.descriptionAr : config.description}
                            </p>
                            {config.showRegistrationForm && (
                                <div className="mt-8">
                                    <LiquidGlassCard blurIntensity="lg" className="p-6 max-w-md mx-auto">
                                        <h3 className="text-xl font-semibold text-[var(--label)] mb-4">
                                            {language === 'ar' ? 'سجل الآن' : 'Register Now'}
                                        </h3>
                                        <div className="space-y-3">
                                            <Input placeholder={language === 'ar' ? 'الاسم' : 'Name'} />
                                            <Input type="email" placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'} />
                                            <GlassButton variant="default" className="w-full" style={{ backgroundColor: config.primaryColor }}>
                                                {language === 'ar' ? 'تسجيل' : 'Register'}
                                            </GlassButton>
                                        </div>
                                    </LiquidGlassCard>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
                <GlassButton variant="default" onClick={() => setPreviewMode(true)}>
                    <Eye className="w-4 h-4 mr-2" />
                    {previewText}
                </GlassButton>
            </div>

            {/* Content */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {pageTitleText} ({language === 'ar' ? 'عربي' : 'English'})
                        </label>
                        <Input
                            value={language === 'ar' ? (config.titleAr || '') : config.title}
                            onChange={(e) =>
                                setConfig({
                                    ...config,
                                    [language === 'ar' ? 'titleAr' : 'title']: e.target.value,
                                })
                            }
                            placeholder={language === 'ar' ? 'أدخل العنوان بالعربية' : 'Enter title in English'}
                        />
                    </div>

                    {language === 'en' && (
                        <div>
                            <label className="block text-sm font-medium text-[var(--label)] mb-2">
                                {pageTitleText} (Arabic)
                            </label>
                            <Input
                                value={config.titleAr || ''}
                                onChange={(e) => setConfig({ ...config, titleAr: e.target.value })}
                                placeholder="أدخل العنوان بالعربية"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {descriptionText} ({language === 'ar' ? 'عربي' : 'English'})
                        </label>
                        <Textarea
                            value={language === 'ar' ? (config.descriptionAr || '') : config.description}
                            onChange={(e) =>
                                setConfig({
                                    ...config,
                                    [language === 'ar' ? 'descriptionAr' : 'description']: e.target.value,
                                })
                            }
                            placeholder={language === 'ar' ? 'أدخل الوصف بالعربية' : 'Enter description in English'}
                            className="min-h-[100px]"
                        />
                    </div>

                    {language === 'en' && (
                        <div>
                            <label className="block text-sm font-medium text-[var(--label)] mb-2">
                                {descriptionText} (Arabic)
                            </label>
                            <Textarea
                                value={config.descriptionAr || ''}
                                onChange={(e) => setConfig({ ...config, descriptionAr: e.target.value })}
                                placeholder="أدخل الوصف بالعربية"
                                className="min-h-[100px]"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {heroImageText}
                        </label>
                        <FileUpload
                            accept="image/*"
                            maxSize={5}
                            onFilesSelected={handleFilesSelected}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-4">
                            {colorsText}
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-[var(--secondary-label)] mb-2">
                                    {primaryColorText}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={config.primaryColor}
                                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                                        className="w-16 h-10 rounded-lg border border-[var(--separator)] cursor-pointer"
                                    />
                                    <Input
                                        value={config.primaryColor}
                                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-[var(--secondary-label)] mb-2">
                                    {secondaryColorText}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={config.secondaryColor}
                                        onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                                        className="w-16 h-10 rounded-lg border border-[var(--separator)] cursor-pointer"
                                    />
                                    <Input
                                        value={config.secondaryColor}
                                        onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {layoutText}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['centered', 'left', 'right'] as const).map((layout) => (
                                <button
                                    key={layout}
                                    onClick={() => setConfig({ ...config, layout })}
                                    className={`p-4 rounded-2xl border-2 transition-all ${
                                        config.layout === layout
                                            ? 'border-[var(--apple-blue)] bg-[var(--apple-blue)]/10'
                                            : 'border-[var(--separator)] hover:border-[var(--apple-blue)]/50'
                                    }`}
                                >
                                    <Layout className={`w-6 h-6 mx-auto mb-2 ${config.layout === layout ? 'text-[var(--apple-blue)]' : 'text-[var(--secondary-label)]'}`} />
                                    <p className={`text-sm font-medium ${config.layout === layout ? 'text-[var(--apple-blue)]' : 'text-[var(--label)]'}`}>
                                        {layout.charAt(0).toUpperCase() + layout.slice(1)}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--system-fill)]/30">
                        <div>
                            <p className="font-medium text-[var(--label)]">{showRegistrationText}</p>
                            <p className="text-sm text-[var(--secondary-label)]">
                                {language === 'ar' ? 'إظهار نموذج التسجيل في الصفحة' : 'Show registration form on the page'}
                            </p>
                        </div>
                        <button
                            onClick={() => setConfig({ ...config, showRegistrationForm: !config.showRegistrationForm })}
                            className={`relative w-14 h-8 rounded-full transition-colors ${
                                config.showRegistrationForm ? 'bg-[var(--apple-green)]' : 'bg-[var(--system-fill)]'
                            }`}
                        >
                            <div
                                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                                    config.showRegistrationForm ? 'translate-x-6' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>

                    <GlassButton variant="default" className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        {saveText}
                    </GlassButton>
                </div>
            </LiquidGlassCard>
        </div>
    );
}

