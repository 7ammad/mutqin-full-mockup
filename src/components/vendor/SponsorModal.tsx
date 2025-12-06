"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePersona } from "@/context/PersonaContext";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast-context";
import { useLanguage } from "@/context/LanguageContext";

interface SponsorModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: string | null;
}

export default function SponsorModal({ isOpen, onClose, eventId }: SponsorModalProps) {
    const { language } = useLanguage();
    const { showToast } = useToast();
    const [license, setLicense] = useState("");
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!license.trim()) {
            setError(language === 'ar' ? "   " : "SFDA license number is required");
            return;
        }
        if (!license.startsWith("MDS-REQ")) {
            setError(language === 'ar' ? "    (    MDS-REQ)" : "Invalid license format (must start with MDS-REQ)");
            return;
        }

        if (!eventId) {
            setError(language === 'ar' ? "  " : "Event ID is required");
            return;
        }

        try {
            const res = await api.purchaseSponsorship({
                eventId,
                vendorId: 'vendor-1',
                package: 'Gold'
            });

            if (res.ok) {
                setIsSuccess(true);
                showToast(
                    language === 'ar' ? '   ' : 'Sponsorship purchased successfully',
                    'success'
                );

                // Delay to show success state
                setTimeout(() => {
                    setIsSuccess(false);
                    setLicense("");
                    onClose();
                }, 1500);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : (language === 'ar' ? ' ' : 'An error occurred');
            setError(message);
            showToast(message, 'info');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isSuccess ? "   " : "  "}
        >
            {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center animate-in zoom-in">
                    <div className="h-16 w-16 bg-[var(--apple-green)]/20 rounded-full flex items-center justify-center text-[var(--apple-green)] backdrop-blur-sm">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[var(--apple-green)]">  !</h3>
                        <p className="text-[var(--secondary-label)] mt-2">     ...</p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-4 bg-[var(--apple-blue)]/10 rounded-ios flex gap-3 items-start backdrop-blur-sm border border-[var(--apple-blue)]/20">
                        <ShieldCheck className="h-5 w-5 text-[var(--apple-blue)] mt-0.5" />
                        <div className="text-sm text-[var(--label)]">
                            <p className="font-semibold mb-1">  </p>
                            <p className="text-[var(--secondary-label)]">        (SFDA) .</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--label)]">  (SFDA License)</label>
                        <Input
                            placeholder="MDS-REQ-XXXX-XXX"
                            value={license}
                            onChange={(e) => {
                                setLicense(e.target.value);
                                setError("");
                            }}
                            className={error ? "border-[var(--apple-red)]" : ""}
                        />
                        {error && <p className="text-sm text-[var(--apple-red)]">{error}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} className="flex items-center justify-center gap-2">
                            
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                             
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
