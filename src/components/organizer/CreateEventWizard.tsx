"use client";

import { useState } from "react";
import { usePersona } from "@/context/PersonaContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Event } from "@/lib/mockData";

interface CreateEventWizardProps {
    onCancel: () => void;
}

export default function CreateEventWizard({ onCancel }: CreateEventWizardProps) {
    const { addEvent, switchPersona, userSession } = usePersona();
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        location: "",
        specialty: "",
        cme_hours: "",
        needs_sponsorship: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newEvent: Event = {
            id: Math.random().toString(36).substr(2, 9),
            titleAr: formData.title,
            titleEn: formData.title, // For demo, using same value
            organizerAr: userSession.name,
            organizerEn: userSession.name, // For demo, using same value
            specialty: formData.specialty,
            cme_hours: Number(formData.cme_hours),
            date: formData.date,
            locationAr: formData.location,
            locationEn: formData.location, // For demo, using same value
            status: formData.needs_sponsorship ? 'Draft' : 'Published',
            is_sponsored: false,
            needs_sponsorship: formData.needs_sponsorship,
            descriptionAr: "  ",
            descriptionEn: "New medical event", // For demo
        };

        addEvent(newEvent);

        // Switch to Vendor view to show the flow
        switchPersona('VENDOR');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card glass={true} interactive={false}>
                <CardHeader>
                    <CardTitle className="text-[var(--label)]">  </CardTitle>
                    <CardDescription className="text-[var(--secondary-label)]">     </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--label)]"> </label>
                            <Input
                                required
                                placeholder=":   "
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium"></label>
                                <Input
                                    required
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium"></label>
                                <Input
                                    required
                                    placeholder=" "
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium"></label>
                                <Input
                                    required
                                    placeholder=": Cardiology"
                                    value={formData.specialty}
                                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">   (CME)</label>
                                <Input
                                    required
                                    type="number"
                                    placeholder="12"
                                    value={formData.cme_hours}
                                    onChange={(e) => setFormData({ ...formData, cme_hours: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <label className="flex items-center gap-3 p-4 border border-[var(--border)] rounded-ios cursor-pointer hover:bg-[var(--system-fill)] transition-colors">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-[var(--apple-green)] rounded-ios-sm focus:ring-[var(--apple-green)]"
                                    checked={formData.needs_sponsorship}
                                    onChange={(e) => setFormData({ ...formData, needs_sponsorship: e.target.checked })}
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-[var(--label)]">  (Sponsorship)</div>
                                    <div className="text-sm text-[var(--secondary-label)]">     </div>
                                </div>
                                {formData.needs_sponsorship && (
                                    <Badge variant="emerald" className="animate-in fade-in zoom-in">
                                         : 50,000 .
                                    </Badge>
                                )}
                            </label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="ghost" onClick={onCancel} className="flex items-center justify-center gap-2">
                            
                        </Button>
                        <Button type="submit" className="gap-2 flex items-center justify-center">
                             
                            <ArrowRight className="h-4 w-4 rotate-180" />
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
