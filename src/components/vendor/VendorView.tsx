"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { GlassButton } from "@/components/ui/glass-button";
import MarketplaceFeed from "./MarketplaceFeed";
import AdvancedMarketplace from "./AdvancedMarketplace";
import SponsorshipPackages from "./SponsorshipPackages";
import HCPTargeting from "./HCPTargeting";
import ContentCreation from "./ContentCreation";
import CampaignAnalytics from "./CampaignAnalytics";
import ROIReporting from "./ROIReporting";
import ComplianceManagement from "./ComplianceManagement";
import SponsorModal from "./SponsorModal";
import { Store, Package, Target, FileText, BarChart3, DollarSign, ShieldCheck } from "lucide-react";

type ViewType = 'MARKETPLACE' | 'ADVANCED_MARKETPLACE' | 'PACKAGES' | 'TARGETING' | 'CONTENT' | 'ANALYTICS' | 'ROI' | 'COMPLIANCE';

export default function VendorView() {
    const { language } = useLanguage();
    const [view, setView] = useState<ViewType>('MARKETPLACE');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    // Defensive: ensure view is valid, default to MARKETPLACE if unknown
    const effectiveView: ViewType = [
        'MARKETPLACE', 'ADVANCED_MARKETPLACE', 'PACKAGES', 'TARGETING', 
        'CONTENT', 'ANALYTICS', 'ROI', 'COMPLIANCE'
    ].includes(view) ? view : 'MARKETPLACE';

    return (
        <>
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                <GlassButton
                    onClick={() => setView('MARKETPLACE')}
                    variant={view === 'MARKETPLACE' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <Store className="h-4 w-4" />
                    {language === 'ar' ? 'السوق' : 'Marketplace'}
                </GlassButton>
                <GlassButton
                    onClick={() => setView('ADVANCED_MARKETPLACE')}
                    variant={view === 'ADVANCED_MARKETPLACE' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <Store className="h-4 w-4" />
                    {language === 'ar' ? 'السوق المتقدم' : 'Advanced Marketplace'}
                </GlassButton>
                <GlassButton
                    onClick={() => setView('PACKAGES')}
                    variant={view === 'PACKAGES' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <Package className="h-4 w-4" />
                    {language === 'ar' ? 'الحزم' : 'Packages'}
                </GlassButton>
                <GlassButton
                    onClick={() => setView('TARGETING')}
                    variant={view === 'TARGETING' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <Target className="h-4 w-4" />
                    {language === 'ar' ? 'الاستهداف' : 'Targeting'}
                </GlassButton>
                <GlassButton
                    onClick={() => setView('CONTENT')}
                    variant={view === 'CONTENT' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <FileText className="h-4 w-4" />
                    {language === 'ar' ? 'المحتوى' : 'Content'}
                </GlassButton>
                <GlassButton
                    onClick={() => setView('ANALYTICS')}
                    variant={view === 'ANALYTICS' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <BarChart3 className="h-4 w-4" />
                    {language === 'ar' ? 'التحليلات' : 'Analytics'}
                </GlassButton>
                <GlassButton
                    onClick={() => setView('ROI')}
                    variant={view === 'ROI' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <DollarSign className="h-4 w-4" />
                    {language === 'ar' ? 'عائد الاستثمار' : 'ROI'}
                </GlassButton>
                <GlassButton
                    onClick={() => setView('COMPLIANCE')}
                    variant={view === 'COMPLIANCE' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <ShieldCheck className="h-4 w-4" />
                    {language === 'ar' ? 'الامتثال' : 'Compliance'}
                </GlassButton>
            </div>

            {/* Content Views - Guarded by effectiveView */}
            {effectiveView === 'MARKETPLACE' && (
                <MarketplaceFeed onSponsorClick={setSelectedEventId} />
            )}
            {effectiveView === 'ADVANCED_MARKETPLACE' && <AdvancedMarketplace />}
            {effectiveView === 'PACKAGES' && <SponsorshipPackages />}
            {effectiveView === 'TARGETING' && <HCPTargeting />}
            {effectiveView === 'CONTENT' && <ContentCreation />}
            {effectiveView === 'ANALYTICS' && <CampaignAnalytics />}
            {effectiveView === 'ROI' && <ROIReporting />}
            {effectiveView === 'COMPLIANCE' && <ComplianceManagement />}

            {/* Sponsor Modal */}
            <SponsorModal
                isOpen={!!selectedEventId}
                onClose={() => setSelectedEventId(null)}
                eventId={selectedEventId}
            />
        </>
    );
}
