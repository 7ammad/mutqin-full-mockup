"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Mail, Bell, MessageSquare, Send } from 'lucide-react';

interface Campaign {
    id: string;
    name: string;
    type: 'email' | 'push' | 'sms' | 'social';
    subject?: string;
    content: string;
    scheduledDate?: string;
    status: 'draft' | 'scheduled' | 'sent';
}

export default function CampaignBuilder() {
    const { language } = useLanguage();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [currentCampaign, setCurrentCampaign] = useState<Partial<Campaign>>({
        type: 'email',
        status: 'draft',
    });

    const campaignTypes = [
        { id: 'email', label: language === 'ar' ? ' ' : 'Email', icon: Mail },
        { id: 'push', label: language === 'ar' ? '' : 'Push Notification', icon: Bell },
        { id: 'sms', label: 'SMS', icon: MessageSquare },
        { id: 'social', label: language === 'ar' ? ' ' : 'Social Media', icon: MessageSquare },
    ];

    const handleSave = () => {
        if (!currentCampaign.name || !currentCampaign.content) return;

        const newCampaign: Campaign = {
            id: `campaign-${Date.now()}`,
            name: currentCampaign.name!,
            type: currentCampaign.type!,
            subject: currentCampaign.subject,
            content: currentCampaign.content!,
            scheduledDate: currentCampaign.scheduledDate,
            status: currentCampaign.scheduledDate ? 'scheduled' : 'draft',
        };

        setCampaigns([...campaigns, newCampaign]);
        setCurrentCampaign({ type: 'email', status: 'draft' });
    };

    const handleSend = (campaignId: string) => {
        setCampaigns((prev) =>
            prev.map((c) => (c.id === campaignId ? { ...c, status: 'sent' } : c))
        );
    };

    const title = language === 'ar' ? ' ' : 'Campaign Builder';
    const campaignNameText = language === 'ar' ? ' ' : 'Campaign Name';
    const campaignTypeText = language === 'ar' ? ' ' : 'Campaign Type';
    const subjectText = language === 'ar' ? '' : 'Subject';
    const contentText = language === 'ar' ? '' : 'Content';
    const scheduleText = language === 'ar' ? '' : 'Schedule';
    const scheduledDateText = language === 'ar' ? ' ' : 'Date & Time';
    const saveText = language === 'ar' ? '' : 'Save';
    const sendText = language === 'ar' ? '' : 'Send';
    const myCampaignsText = language === 'ar' ? '' : 'My Campaigns';
    const createNewText = language === 'ar' ? ' ' : 'Create New';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
            </div>

            {/* Campaign Builder Form */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{createNewText}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {campaignNameText}
                        </label>
                        <Input
                            value={currentCampaign.name || ''}
                            onChange={(e) => setCurrentCampaign({ ...currentCampaign, name: e.target.value })}
                            placeholder={language === 'ar' ? '  ' : 'Enter campaign name'}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {campaignTypeText}
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {campaignTypes.map((type) => {
                                const Icon = type.icon;
                                const isSelected = currentCampaign.type === type.id;
                                return (
                                    <button key={type.id}
                                        onClick={() => setCurrentCampaign({ ...currentCampaign, type: type.id as Campaign['type'] })}
                                        className={`p-4 rounded-2xl border-2 transition-all ${
                                            isSelected
                                                ? 'border-[var(--apple-blue)] bg-[var(--apple-blue)]/10'
                                                : 'border-[var(--separator)] hover:border-[var(--apple-blue)]/50'
                                        }`}
                                    >
                                        <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-[var(--apple-blue)]' : 'text-[var(--secondary-label)]'}`} />
                                        <p className={`text-sm font-medium ${isSelected ? 'text-[var(--apple-blue)]' : 'text-[var(--label)]'}`}>
                                            {type.label}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {currentCampaign.type === 'email' && (
                        <div>
                            <label className="block text-sm font-medium text-[var(--label)] mb-2">
                                {subjectText}
                            </label>
                            <Input
                                value={currentCampaign.subject || ''}
                                onChange={(e) => setCurrentCampaign({ ...currentCampaign, subject: e.target.value })}
                                placeholder={language === 'ar' ? '  ' : 'Email subject'}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {contentText}
                        </label>
                        <Textarea
                            value={currentCampaign.content || ''}
                            onChange={(e) => setCurrentCampaign({ ...currentCampaign, content: e.target.value })}
                            placeholder={language === 'ar' ? '   ...' : 'Write campaign content here...'}
                            className="min-h-[150px]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {scheduledDateText}
                        </label>
                        <Input
                            type="datetime-local"
                            value={currentCampaign.scheduledDate || ''}
                            onChange={(e) => setCurrentCampaign({ ...currentCampaign, scheduledDate: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4">
                        <GlassButton
                            variant="default"
                            onClick={handleSave}
                            disabled={!currentCampaign.name || !currentCampaign.content}
                            className="flex-1 items-center justify-center gap-2"
                        >
                            {saveText}
                        </GlassButton>
                        {currentCampaign.scheduledDate && (
                            <GlassButton variant="outline" className="flex-1 items-center justify-center gap-2">
                                <Calendar className="w-4 h-4 mr-2" />
                                {scheduleText}
                            </GlassButton>
                        )}
                    </div>
                </div>
            </LiquidGlassCard>

            {/* My Campaigns */}
            {campaigns.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{myCampaignsText}</h3>
                    <div className="space-y-3">
                        {campaigns.map((campaign) => {
                            const typeInfo = campaignTypes.find((t) => t.id === campaign.type);
                            const Icon = typeInfo?.icon || Mail;
                            return (
                                <LiquidGlassCard key={campaign.id} blurIntensity="md" interactive={false} className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <Icon className="w-5 h-5 text-[var(--apple-blue)]" />
                                            <div className="flex-1">
                                                <p className="font-medium text-[var(--label)]">{campaign.name}</p>
                                                <p className="text-sm text-[var(--secondary-label)]">
                                                    {typeInfo?.label} • {campaign.status}
                                                </p>
                                            </div>
                                        </div>
                                        {campaign.status === 'draft' && (
                                            <GlassButton
                                                variant="default"
                                                size="sm"
                                                onClick={() => handleSend(campaign.id)}
                                            >
                                                <Send className="w-4 h-4 mr-2" />
                                                {sendText}
                                            </GlassButton>
                                        )}
                                    </div>
                                </LiquidGlassCard>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

