"use client";

import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, ShieldCheck, FileText, CheckCircle, QrCode, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getNestedTranslation } from '@/locales';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { getSpecialtyLabel } from "@/lib/i18n/specialties";
import { AnimatePresence, motion } from 'framer-motion';
import { GlassButton } from '@/components/ui/glass-button';

type ActivityJourneyCardProps = {
  locale: 'ar' | 'en';
  activeStepIndex: number;
};

export function ActivityJourneyCard({ locale, activeStepIndex }: ActivityJourneyCardProps) {
  const { language } = useLanguage();
  
  // Get i18n labels
  const cardTitle = getNestedTranslation(language, 'landing', 'howItWorks', 'card', 'title');
  const cardLocation = getNestedTranslation(language, 'landing', 'howItWorks', 'card', 'location');
  const cardDate = getNestedTranslation(language, 'landing', 'howItWorks', 'card', 'date');
  const cardHours = getNestedTranslation(language, 'landing', 'howItWorks', 'card', 'hours');
  const scfhsLabel = getNestedTranslation(language, 'landing', 'howItWorks', 'card', 'scfhs');
  const draftLabel = getNestedTranslation(language, 'landing', 'howItWorks', 'card', 'draft');
  const registerLabel = getNestedTranslation(language, 'landing', 'howItWorks', 'card', 'register');
  const attendanceLabel = getNestedTranslation(language, 'landing', 'howItWorks', 'card', 'attendance');
  const certificateLabel = getNestedTranslation(language, 'landing', 'howItWorks', 'card', 'certificate');
  
  // Persona labels
  const personaHcp = getNestedTranslation(language, 'landing', 'howItWorks', 'personas', 'hcp');
  const personaProvider = getNestedTranslation(language, 'landing', 'howItWorks', 'personas', 'provider');
  const personaRegulator = getNestedTranslation(language, 'landing', 'howItWorks', 'personas', 'regulator');
  const personaEventManager = getNestedTranslation(language, 'landing', 'howItWorks', 'personas', 'eventManager');

  const isRTL = language === 'ar';

  const cardContent = (
    <>
      {/* Badges Row */}
      <div className={`flex items-center gap-2 flex-wrap mb-4 ${isRTL ? 'justify-end' : 'justify-start'}`}>
        <Badge variant="outline" className="text-xs font-medium border border-[var(--border)]/60">
          {getSpecialtyLabel('cardiology', language)}
        </Badge>
        
        <AnimatePresence>
          {activeStepIndex === 0 && (
            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}>
              <Badge variant="outline" className="text-xs font-medium border-dashed border-[var(--tertiary-label)] text-[var(--secondary-label)] flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {draftLabel || (isRTL ? 'مسودة' : 'Draft')}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeStepIndex >= 1 && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <Badge className="bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30 text-xs font-medium flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                {scfhsLabel || (isRTL ? 'معتمد' : 'SCFHS Accredited')}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-[var(--label)] mb-4">
        {cardTitle || (isRTL ? 'مؤتمر تحديثات أمراض القلب 2025' : 'Cardiology Update Conference 2025')}
      </h3>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-[var(--secondary-label)]">
          <Calendar className="h-4 w-4 text-[var(--tertiary-label)] flex-shrink-0" />
          <span>{cardDate || (isRTL ? '15-17 مارس 2025' : 'Mar 15-17, 2025')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--secondary-label)]">
          <MapPin className="h-4 w-4 text-[var(--tertiary-label)] flex-shrink-0" />
          <span>{cardLocation || (isRTL ? 'الرياض، فندق الفيصلية' : 'Riyadh, Faisaliah Hotel')}</span>
        </div>
        <div className="pt-3 border-t border-[var(--separator)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--label)]">
            <Clock className="h-4 w-4 text-[var(--apple-green)] flex-shrink-0" />
            <span>{cardHours || (isRTL ? '18 ساعة معتمدة' : '18 Accredited Hours')}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeStepIndex >= 3 && (
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.3 } }}
            exit={{ opacity: 0, y: 10 }}
          >
            <GlassButton className="w-full">
              {registerLabel || (isRTL ? 'سجل الآن' : 'Register Now')}
            </GlassButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  const attendanceContent = (
    <div className="text-center flex flex-col items-center justify-center h-full p-4">
      <QrCode className="w-24 h-24 text-[var(--label)] mb-4" />
      <h3 className="text-lg font-bold text-[var(--label)] mb-1">{attendanceLabel || (isRTL ? 'تسجيل الحضور' : 'Record Attendance')}</h3>
      <p className="text-sm text-[var(--secondary-label)]">{isRTL ? 'امسح الكود لتسجيل حضورك' : 'Scan the code to check-in'}</p>
    </div>
  );

  const certificateContent = (
    <div className="text-center flex flex-col items-center justify-center h-full p-4">
      <Award className="w-20 h-20 text-[var(--apple-green)] mb-4" />
      <h3 className="text-lg font-bold text-[var(--label)] mb-1">{certificateLabel || (isRTL ? 'شهادة إتمام' : 'Certificate of Completion')}</h3>
      <p className="text-sm text-[var(--secondary-label)]">{isRTL ? 'تم إضافة 18 ساعة إلى سجلك' : '18 hours added to your record'}</p>
    </div>
  );

  const renderContent = () => {
    if (activeStepIndex === 4) return attendanceContent;
    if (activeStepIndex === 5) return certificateContent;
    return cardContent;
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Activity Card */}
      <div className="relative">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--apple-blue)]/5 via-transparent to-[var(--apple-purple)]/5 blur-xl" />
        <LiquidGlassCard 
          className={`relative rounded-3xl border bg-[var(--system-background)]/60 backdrop-blur-md p-6 min-h-[380px] flex flex-col justify-center transition-all duration-300 ${
            activeStepIndex >= 2 ? 'border-[var(--apple-green)]/50' : 'border-[var(--border)]/60'
          }`}
          blurIntensity="md"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </LiquidGlassCard>
      </div>

      {/* Persona Chips */}
      <div className={`flex flex-wrap gap-2 justify-center lg:${isRTL ? 'justify-end' : 'justify-start'}`}>
        <Badge variant="outline" className="text-xs font-medium border border-[var(--border)]/60 px-3 py-1.5">
          {personaHcp || (isRTL ? 'ممارس صحي' : 'HCP')}
        </Badge>
        <Badge variant="outline" className="text-xs font-medium border border-[var(--border)]/60 px-3 py-1.5">
          {personaProvider || (isRTL ? 'جهة التطوير' : 'Provider')}
        </Badge>
        <Badge variant="outline" className="text-xs font-medium border border-[var(--border)]/60 px-3 py-1.5">
          {personaRegulator || (isRTL ? 'جهة اعتمادية' : 'Regulator')}
        </Badge>
        <Badge variant="outline" className="text-xs font-medium border border-[var(--border)]/60 px-3 py-1.5">
          {personaEventManager || (isRTL ? 'مدير فعاليات' : 'Event Manager')}
        </Badge>
      </div>
    </div>
  );
}
