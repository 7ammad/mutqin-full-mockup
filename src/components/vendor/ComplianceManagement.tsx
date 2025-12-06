"use client";

import { useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/FileUpload";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, FileText, Upload, Plus } from "lucide-react";

interface ComplianceRecord {
    id: string;
    licenseNumber: string;
    licenseType: 'SFDA' | 'MOH' | 'Other';
    issueDate: string;
    expiryDate: string;
    status: 'active' | 'expiring' | 'expired' | 'pending';
    documentUrl?: string;
    notes?: string;
}

export default function ComplianceManagement() {
    const { t, language } = useLanguage();
    const [licenses, setLicenses] = useState<ComplianceRecord[]>([
        {
            id: 'lic1',
            licenseNumber: 'MDS-REQ-2024-001',
            licenseType: 'SFDA',
            issueDate: '2024-01-15',
            expiryDate: '2025-01-15',
            status: 'active',
            notes: 'Main pharmaceutical license',
        },
        {
            id: 'lic2',
            licenseNumber: 'MOH-LIC-2024-045',
            licenseType: 'MOH',
            issueDate: '2024-03-20',
            expiryDate: '2025-03-20',
            status: 'active',
        },
    ]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingLicense, setEditingLicense] = useState<ComplianceRecord | null>(null);

    const handleSaveLicense = (license: ComplianceRecord) => {
        if (license.id && licenses.find(l => l.id === license.id)) {
            setLicenses(licenses.map(l => l.id === license.id ? license : l));
        } else {
            setLicenses([...licenses, { ...license, id: `lic-${Date.now()}` }]);
        }
        setEditingLicense(null);
        setIsAdding(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]';
            case 'expiring':
                return 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]';
            case 'expired':
                return 'bg-[var(--apple-red)]/10 text-[var(--apple-red)]';
            default:
                return 'bg-[var(--secondary-label)]/10 text-[var(--secondary-label)]';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle2 className="h-4 w-4" />;
            case 'expiring':
                return <Clock className="h-4 w-4" />;
            case 'expired':
                return <AlertTriangle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const title = language === 'ar' ? ' ' : 'Compliance Management';
    const addLicenseText = language === 'ar' ? ' ' : 'Add License';
    const licenseNumberText = language === 'ar' ? ' ' : 'License Number';
    const licenseTypeText = language === 'ar' ? ' ' : 'License Type';
    const issueDateText = language === 'ar' ? ' ' : 'Issue Date';
    const expiryDateText = language === 'ar' ? ' ' : 'Expiry Date';
    const statusText = language === 'ar' ? '' : 'Status';
    const notesText = language === 'ar' ? '' : 'Notes';
    const documentText = language === 'ar' ? '' : 'Document';

    return (
        <div className="space-y-6">
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[var(--label)] flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-[var(--apple-blue)]" />
                        {title}
                    </h2>
                    <GlassButton onClick={() => setIsAdding(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {addLicenseText}
                    </GlassButton>
                </div>

                {/* License List */}
                <div className="space-y-4">
                    {licenses.map((license) => {
                        const daysUntilExpiry = Math.floor(
                            (new Date(license.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                        );
                        const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                        const isExpired = daysUntilExpiry < 0;

                        return (
                            <LiquidGlassCard key={license.id} blurIntensity="lg" interactive={true} className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-[var(--label)]">
                                                {license.licenseNumber}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                                                isExpired ? 'expired' : isExpiringSoon ? 'expiring' : license.status
                                            )}`}>
                                                {getStatusIcon(isExpired ? 'expired' : isExpiringSoon ? 'expiring' : license.status)}
                                                {isExpired 
                                                    ? (language === 'ar' ? '' : 'Expired')
                                                    : isExpiringSoon
                                                    ? (language === 'ar' ? ' ' : 'Expiring Soon')
                                                    : (language === 'ar' ? '' : 'Active')
                                                }
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-[var(--secondary-label)] mb-1">{licenseTypeText}</p>
                                                <p className="text-[var(--label)] font-medium">{license.licenseType}</p>
                                            </div>
                                            <div>
                                                <p className="text-[var(--secondary-label)] mb-1">{issueDateText}</p>
                                                <p className="text-[var(--label)] font-medium">
                                                    {new Date(license.issueDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[var(--secondary-label)] mb-1">{expiryDateText}</p>
                                                <p className="text-[var(--label)] font-medium">
                                                    {new Date(license.expiryDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[var(--secondary-label)] mb-1">
                                                    {language === 'ar' ? ' ' : 'Days Remaining'}
                                                </p>
                                                <p className={`font-medium ${
                                                    isExpired 
                                                        ? 'text-[var(--apple-red)]'
                                                        : isExpiringSoon
                                                        ? 'text-[var(--apple-orange)]'
                                                        : 'text-[var(--apple-green)]'
                                                }`}>
                                                    {isExpired ? '0' : daysUntilExpiry} {language === 'ar' ? '' : 'days'}
                                                </p>
                                            </div>
                                        </div>
                                        {license.notes && (
                                            <div className="mt-3 pt-3 border-t border-[var(--separator)]">
                                                <p className="text-sm text-[var(--secondary-label)]">{license.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <GlassButton
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingLicense(license)}
                                        >
                                            {language === 'ar' ? '' : 'Edit'}
                                        </GlassButton>
                                    </div>
                                </div>
                            </LiquidGlassCard>
                        );
                    })}
                </div>
            </LiquidGlassCard>

            {/* Add/Edit Modal */}
            {(isAdding || editingLicense) && (
                <LicenseEditor
                    license={editingLicense || undefined}
                    onSave={handleSaveLicense}
                    onCancel={() => {
                        setEditingLicense(null);
                        setIsAdding(false);
                    }}
                />
            )}
        </div>
    );
}

interface LicenseEditorProps {
    license?: ComplianceRecord;
    onSave: (license: ComplianceRecord) => void;
    onCancel: () => void;
}

function LicenseEditor({ license, onSave, onCancel }: LicenseEditorProps) {
    const { language } = useLanguage();
    const [formData, setFormData] = useState<Partial<ComplianceRecord>>({
        licenseNumber: license?.licenseNumber || '',
        licenseType: license?.licenseType || 'SFDA',
        issueDate: license?.issueDate || '',
        expiryDate: license?.expiryDate || '',
        status: license?.status || 'pending',
        notes: license?.notes || '',
    });
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleSave = () => {
        if (!formData.licenseNumber || !formData.licenseType || !formData.issueDate || !formData.expiryDate) {
            alert(language === 'ar' ? '    ' : 'Please fill all required fields');
            return;
        }
        onSave(formData as ComplianceRecord);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <LiquidGlassCard blurIntensity="xl" interactive={false} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                    <h3 className="text-xl font-bold text-[var(--label)]">
                        {license ? (language === 'ar' ? ' ' : 'Edit License') : (language === 'ar' ? ' ' : 'New License')}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <Label>{language === 'ar' ? ' ' : 'License Number'}</Label>
                            <Input
                                value={formData.licenseNumber}
                                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                placeholder="MDS-REQ-XXXX-XXX"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>{language === 'ar' ? ' ' : 'License Type'}</Label>
                                <Select value={formData.licenseType} onValueChange={(val) => setFormData({ ...formData, licenseType: val as ComplianceRecord['licenseType'] })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent glass={true}>
                                        <SelectItem value="SFDA">SFDA</SelectItem>
                                        <SelectItem value="MOH">MOH</SelectItem>
                                        <SelectItem value="Other">{language === 'ar' ? '' : 'Other'}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>{language === 'ar' ? '' : 'Status'}</Label>
                                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as ComplianceRecord['status'] })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent glass={true}>
                                        <SelectItem value="active">{language === 'ar' ? '' : 'Active'}</SelectItem>
                                        <SelectItem value="pending">{language === 'ar' ? ' ' : 'Pending'}</SelectItem>
                                        <SelectItem value="expired">{language === 'ar' ? '' : 'Expired'}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>{language === 'ar' ? ' ' : 'Issue Date'}</Label>
                                <Input
                                    type="date"
                                    value={formData.issueDate}
                                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>{language === 'ar' ? ' ' : 'Expiry Date'}</Label>
                                <Input
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>{language === 'ar' ? '' : 'Notes'}</Label>
                            <Input
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder={language === 'ar' ? ' ...' : 'Additional notes...'}
                            />
                        </div>
                        <div>
                            <Label>{language === 'ar' ? ' ' : 'Upload Document'}</Label>
                            <FileUpload
                                accept=".pdf,.jpg,.jpeg,.png"
                                onFilesSelected={(files) => {
                                    if (files && files.length > 0) {
                                        setUploadedFile(files[0]);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <GlassButton variant="outline" onClick={onCancel} className="flex items-center justify-center gap-2">
                            {language === 'ar' ? '' : 'Cancel'}
                        </GlassButton>
                        <GlassButton onClick={handleSave} className="gap-2 flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4" />
                            {language === 'ar' ? '' : 'Save'}
                        </GlassButton>
                    </div>
                </div>
            </LiquidGlassCard>
        </div>
    );
}

