"use client";

import { useAuth } from '@/context/AuthContext';
import { usePersona } from '@/context/PersonaContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, Mail, Building2 } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();
    const { userSession } = usePersona();

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                
                <p className="text-[var(--secondary-label)]">
                    Manage your account information
                </p>
            </div>

            <Card className="p-6">
                <form className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-20 w-20 rounded-full bg-[var(--apple-blue)] flex items-center justify-center">
                            <User className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--label)] mb-4">
                                {userSession.name}
                            </h2>
                            <p className="text-[var(--secondary-label)]">
                                {userSession.role_label}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                defaultValue={userSession.name}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--secondary-label)]" />
                                <Input
                                    id="email"
                                    type="email"
                                    defaultValue={user?.email || ''}
                                    className="pl-10"
                                    disabled
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="role">Role</Label>
                            <div className="relative mt-1">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--secondary-label)]" />
                                <Input
                                    id="role"
                                    defaultValue={userSession.role_label}
                                    className="pl-10"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--separator)]">
                        <Button type="submit" className="flex items-center justify-center gap-2">Save Changes</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}








