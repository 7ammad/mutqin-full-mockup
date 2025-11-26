"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { VerificationForm } from '@/components/registration/VerificationForm';
import { useState, Suspense } from 'react';

function VerifyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }

      // Redirect to onboarding
      router.push('/onboarding');
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend code');
      }
    } catch (err) {
      throw err;
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-[var(--system-background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--label)]">Invalid verification link</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--system-background)] py-12 px-4">
      <div className="max-w-md mx-auto">
        <VerificationForm
          email={email}
          onVerify={handleVerify}
          onResend={handleResend}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--system-background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--label)]">Loading...</p>
        </div>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  );
}

