"use client";

import { useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/FileUpload";
import { useLanguage } from "@/context/LanguageContext";
import { FileText, Image, Video, Link2, Save, Eye, Plus, Trash2 } from "lucide-react";

interface ContentItem {
    id: string;
    type: 'text' | 'image' | 'video' | 'link';
    title: string;
    content: string;
    url?: string;
    thumbnail?: string;
    createdAt: string;
    status: 'draft' | 'published' | 'archived';
}

export default function ContentCreation() {
    const { t, language } = useLanguage();
    const [contentItems, setContentItems] = useState<ContentItem[]>([
        {
            id: 'c1',
            type: 'text',
            title: 'Sample Blog Post',
            content: 'This is a sample content item...',
            createdAt: new Date().toISOString(),
            status: 'draft',
        },
    ]);
    const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleSaveContent = (item: ContentItem) => {
        if (item.id && contentItems.find(c => c.id === item.id)) {
            setContentItems(contentItems.map(c => c.id === item.id ? item : c));
        } else {
            setContentItems([...contentItems, { ...item, id: `c-${Date.now()}`, createdAt: new Date().toISOString() }]);
        }
        setEditingItem(null);
        setIsCreating(false);
    };

    const handleDeleteContent = (id: string) => {
        if (confirm(language === 'ar' ? '    ' : 'Are you sure you want to delete this content?')) {
            setContentItems(contentItems.filter(c => c.id !== id));
        }
    };

    const title = language === 'ar' ? ' ' : 'Content Creation';
    const createContentText = language === 'ar' ? '  ' : 'Create New Content';
    const typeText = language === 'ar' ? '' : 'Type';
    const titleText = language === 'ar' ? '' : 'Title';
    const contentText = language === 'ar' ? '' : 'Content';
    const urlText = language === 'ar' ? '' : 'URL';

    return (
        <div className="space-y-6">
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[var(--label)] flex items-center gap-2">
                        <FileText className="h-6 w-6 text-[var(--apple-blue)]" />
                        {title}
                    </h2>
                    <GlassButton onClick={() => setIsCreating(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {createContentText}
                    </GlassButton>
                </div>

                {/* Content List */}
                <div className="space-y-4">
                    {contentItems.map((item) => (
                        <LiquidGlassCard key={item.id} blurIntensity="lg" interactive={true} className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {item.type === 'text' && <FileText className="h-5 w-5 text-[var(--apple-blue)]" />}
                                        {item.type === 'image' && <Image className="h-5 w-5 text-[var(--apple-green)]" />}
                                        {item.type === 'video' && <Video className="h-5 w-5 text-[var(--apple-red)]" />}
                                        {item.type === 'link' && <Link2 className="h-5 w-5 text-[var(--apple-orange)]" />}
                                        <h3 className="text-lg font-semibold text-[var(--label)]">{item.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            item.status === 'published' ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]' :
                                            item.status === 'draft' ? 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]' :
                                            'bg-[var(--secondary-label)]/10 text-[var(--secondary-label)]'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--secondary-label)] mb-2 line-clamp-2">
                                        {item.content}
                                    </p>
                                    {item.url && (
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--apple-blue)] hover:underline">
                                            {item.url}
                                        </a>
                                    )}
                                    <p className="text-xs text-[var(--tertiary-label)] mt-2">
                                        {new Date(item.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <GlassButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingItem(item)}
                                    >
                                        {language === 'ar' ? '' : 'Edit'}
                                    </GlassButton>
                                    <GlassButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteContent(item.id)}
                                        className="text-[var(--apple-red)]"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </GlassButton>
                                </div>
                            </div>
                        </LiquidGlassCard>
                    ))}
                </div>
            </LiquidGlassCard>

            {/* Create/Edit Modal */}
            {(isCreating || editingItem) && (
                <ContentEditor
                    content={editingItem || undefined}
                    onSave={handleSaveContent}
                    onCancel={() => {
                        setEditingItem(null);
                        setIsCreating(false);
                    }}
                />
            )}
        </div>
    );
}

interface ContentEditorProps {
    content?: ContentItem;
    onSave: (content: ContentItem) => void;
    onCancel: () => void;
}

function ContentEditor({ content, onSave, onCancel }: ContentEditorProps) {
    const { language } = useLanguage();
    const [formData, setFormData] = useState<Partial<ContentItem>>({
        type: content?.type || 'text',
        title: content?.title || '',
        content: content?.content || '',
        url: content?.url || '',
        status: content?.status || 'draft',
    });
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleSave = () => {
        if (!formData.title || !formData.content) {
            alert(language === 'ar' ? '    ' : 'Please fill all required fields');
            return;
        }
        onSave(formData as ContentItem);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <LiquidGlassCard blurIntensity="xl" interactive={false} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                    <h3 className="text-xl font-bold text-[var(--label)]">
                        {content ? (language === 'ar' ? ' ' : 'Edit Content') : (language === 'ar' ? ' ' : 'New Content')}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <Label>{language === 'ar' ? '' : 'Type'}</Label>
                            <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val as ContentItem['type'] })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent glass={true}>
                                    <SelectItem value="text">{language === 'ar' ? '' : 'Text'}</SelectItem>
                                    <SelectItem value="image">{language === 'ar' ? '' : 'Image'}</SelectItem>
                                    <SelectItem value="video">{language === 'ar' ? '' : 'Video'}</SelectItem>
                                    <SelectItem value="link">{language === 'ar' ? '' : 'Link'}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>{language === 'ar' ? '' : 'Title'}</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>{language === 'ar' ? '' : 'Content'}</Label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={6}
                            />
                        </div>
                        {(formData.type === 'image' || formData.type === 'video' || formData.type === 'link') && (
                            <div>
                                <Label>{language === 'ar' ? '' : 'URL'}</Label>
                                <Input
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        )}
                        {(formData.type === 'image' || formData.type === 'video') && (
                            <div>
                                <Label>{language === 'ar' ? ' ' : 'Upload File'}</Label>
                                <FileUpload
                                    accept={formData.type === 'image' ? 'image/*' : 'video/*'}
                                    onFilesSelected={(files) => {
                                        if (files && files.length > 0) {
                                            setUploadedFile(files[0]);
                                        }
                                    }}
                                />
                            </div>
                        )}
                        <div>
                            <Label>{language === 'ar' ? '' : 'Status'}</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as ContentItem['status'] })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent glass={true}>
                                    <SelectItem value="draft">{language === 'ar' ? '' : 'Draft'}</SelectItem>
                                    <SelectItem value="published">{language === 'ar' ? '' : 'Published'}</SelectItem>
                                    <SelectItem value="archived">{language === 'ar' ? '' : 'Archived'}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <GlassButton variant="outline" onClick={onCancel} className="flex items-center justify-center gap-2">
                            {language === 'ar' ? '' : 'Cancel'}
                        </GlassButton>
                        <GlassButton onClick={handleSave} className="gap-2 flex items-center justify-center">
                            <Save className="h-4 w-4" />
                            {language === 'ar' ? '' : 'Save'}
                        </GlassButton>
                    </div>
                </div>
            </LiquidGlassCard>
        </div>
    );
}

