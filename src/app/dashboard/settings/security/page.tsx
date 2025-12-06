"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, Smartphone } from 'lucide-react';

export default function SecuritySettingsPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Security Settings
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Manage your account security and password
                </p>
            </div>

            <div className="space-y-6">
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-[var(--apple-blue)]/10">
                            <Lock className="h-5 w-5 text-[var(--apple-blue)]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--label)]">
                                Change Password
                            </h2>
                            <p className="text-sm text-[var(--secondary-label)]">
                                Update your account password
                            </p>
                        </div>
                    </div>

                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1"
                                minLength={6}
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1"
                                minLength={6}
                            />
                        </div>
                        <Button type="submit" className="flex items-center justify-center gap-2">Update Password</Button>
                    </form>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-[var(--apple-blue)]/10">
                            <Smartphone className="h-5 w-5 text-[var(--apple-blue)]" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-[var(--label)]">
                                Two-Factor Authentication
                            </h2>
                            <p className="text-sm text-[var(--secondary-label)]">
                                Add an extra layer of security to your account
                            </p>
                        </div>
                        <Button
                            variant={twoFactorEnabled ? 'destructive' : 'default'}
                            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        >
                            {twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                        </Button>
                    </div>
                    {twoFactorEnabled && (
                        <div className="p-4 bg-[var(--apple-green)]/10 border border-[var(--apple-green)]/20 rounded-lg">
                            <div className="flex items-center gap-2 text-[var(--apple-green)] mb-2">
                                <Shield className="h-4 w-4" />
                                <span className="text-sm font-medium">2FA is enabled</span>
                            </div>
                            <p className="text-sm text-[var(--secondary-label)]">
                                Your account is protected with two-factor authentication
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}








