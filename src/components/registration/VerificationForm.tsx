"use client";

import { useState, useRef, useEffect } from 'react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';

interface VerificationFormProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading?: boolean;
}

export function VerificationForm({
  email,
  onVerify,
  onResend,
  isLoading = false,
}: VerificationFormProps) {
  const { language, t } = useLanguage();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only last character
    setCode(newCode);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setCode(newCode);
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError(t('registration.validation.required'));
      return;
    }

    try {
      await onVerify(verificationCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    
    try {
      await onResend();
      setResendCountdown(60); // 60 seconds countdown
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    }
  };

  return (
    <LiquidGlassCard blurIntensity="lg" className="p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--label)] mb-4">
          {t('verification.title')}
        </h2>
        <p className="text-[var(--secondary-label)] mb-2">
          {t('verification.subtitle')} <span className="font-medium">{email}</span>
        </p>
        <p className="text-sm text-[var(--tertiary-label)]">
          {t('verification.instructions')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="sr-only">{t('verification.instructions')}</Label>
          <div className="flex gap-3 justify-center" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold"
                aria-label={`Digit ${index + 1}`}
                autoFocus={index === 0}
              />
            ))}
          </div>
          {error && (
            <p className="mt-2 text-sm text-[var(--apple-red)] text-center">{error}</p>
          )}
        </div>

        <GlassButton
          type="submit"
          className="w-full flex items-center justify-center gap-2"
          disabled={isLoading || code.join('').length !== 6}
        >
          {isLoading ? t('common.loading') : t('verification.verify')}
        </GlassButton>

        <div className="text-center">
          <p className="text-sm text-[var(--secondary-label)] mb-2">
            {t('verification.resend')}
          </p>
          {resendCountdown > 0 ? (
            <p className="text-sm text-[var(--tertiary-label)]">
              {t('verification.resendCountdown')} {resendCountdown}s
            </p>
          ) : (
            <button type="button"
              onClick={handleResend}
              className="text-sm text-[var(--apple-blue)] hover:underline font-medium inline-flex items-center justify-center"
            >
              {t('verification.resend')}
            </button>
          )}
        </div>
      </form>
    </LiquidGlassCard>
  );
}

