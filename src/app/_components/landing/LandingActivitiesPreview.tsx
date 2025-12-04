"use client";

import { Badge } from '@/components/ui/badge';
import { Calendar, Building2, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getNestedTranslation } from '@/locales';
import { getSpecialtyLabel } from '@/lib/i18n/specialties';
import { useState, useEffect } from 'react';
import { getLandingEvents } from '@/lib/dataSource';
import { motion } from 'framer-motion';

// Extended event type for landing page display
type LandingEvent = {
  id: string;
  name: string;
  nameEn: string;
  provider: string;
  providerEn: string;
  specialty: string;
  specialtyAr: string;
  format: string;
  formatEn: string;
  dateRange: string;
  dateRangeEn: string;
  hours: number;
  city: string;
  cityEn: string;
  location: string;
  locationEn: string;
};

// Mock activity data with enhanced fields (fallback)
const mockActivities: LandingEvent[] = [
  {
    id: '1',
    name: 'مؤتمر أمراض القلب المتقدم 2025',
    nameEn: 'Advanced Cardiology Conference 2025',
    provider: 'الجمعية السعودية لأمراض القلب',
    providerEn: 'Saudi Heart Association',
    specialty: 'cardiology',
    specialtyAr: 'أمراض القلب',
    format: 'حضوري',
    formatEn: 'In-Person',
    dateRange: '15-17 مارس 2025',
    dateRangeEn: 'Mar 15-17, 2025',
    hours: 18,
    city: 'الرياض',
    cityEn: 'Riyadh',
    location: 'فندق الفيصلية',
    locationEn: 'Faisaliah Hotel',
  },
  {
    id: '2',
    name: 'ورشة طب الطوارئ للأطفال',
    nameEn: 'Pediatric Emergency Medicine Workshop',
    provider: 'مدينة الملك فهد الطبية',
    providerEn: 'King Fahd Medical City',
    specialty: 'pediatrics',
    specialtyAr: 'طب الأطفال',
    format: 'هجين',
    formatEn: 'Hybrid',
    dateRange: '8-10 أبريل 2025',
    dateRangeEn: 'Apr 8-10, 2025',
    hours: 12,
    city: 'الرياض',
    cityEn: 'Riyadh',
    location: 'مدينة الملك فهد الطبية',
    locationEn: 'King Fahd Medical City',
  },
  {
    id: '3',
    name: 'ندوة تحديث طب الأسرة',
    nameEn: 'Family Medicine Update Seminar',
    provider: 'معهد الرعاية الأولية',
    providerEn: 'Primary Care Institute',
    specialty: 'family_medicine',
    specialtyAr: 'طب الأسرة',
    format: 'افتراضي',
    formatEn: 'Virtual',
    dateRange: '5 مايو 2025',
    dateRangeEn: 'May 5, 2025',
    hours: 6,
    city: 'افتراضي',
    cityEn: 'Virtual',
    location: 'منصة متقن',
    locationEn: 'Mutqin Platform',
  },
  {
    id: '4',
    name: 'ندوة تقنيات الجراحة',
    nameEn: 'Surgical Techniques Symposium',
    provider: 'الجمعية السعودية للجراحة',
    providerEn: 'Saudi Surgical Society',
    specialty: 'general_surgery',
    specialtyAr: 'الجراحة العامة',
    format: 'حضوري',
    formatEn: 'In-Person',
    dateRange: '12-14 يونيو 2025',
    dateRangeEn: 'Jun 12-14, 2025',
    hours: 24,
    city: 'جدة',
    cityEn: 'Jeddah',
    location: 'مركز الملك فهد الثقافي',
    locationEn: 'King Fahd Cultural Center',
  },
  {
    id: '5',
    name: 'الصحة النفسية في الرعاية الأولية',
    nameEn: 'Mental Health in Primary Care',
    provider: 'الهيئة الوطنية للصحة النفسية',
    providerEn: 'Mental Health Authority',
    specialty: 'psychiatry',
    specialtyAr: 'الطب النفسي',
    format: 'افتراضي',
    formatEn: 'Virtual',
    dateRange: '20 يوليو 2025',
    dateRangeEn: 'Jul 20, 2025',
    hours: 8,
    city: 'افتراضي',
    cityEn: 'Virtual',
    location: 'منصة متقن',
    locationEn: 'Mutqin Platform',
  },
  {
    id: '6',
    name: 'مؤتمر تطورات الأورام',
    nameEn: 'Oncology Advances Conference',
    provider: 'الجمعية السعودية للأورام',
    providerEn: 'Saudi Oncology Society',
    specialty: 'oncology',
    specialtyAr: 'الأورام',
    format: 'هجين',
    formatEn: 'Hybrid',
    dateRange: '25-27 أغسطس 2025',
    dateRangeEn: 'Aug 25-27, 2025',
    hours: 20,
    city: 'الدمام',
    cityEn: 'Dammam',
    location: 'مستشفى الملك فهد التخصصي',
    locationEn: 'King Fahd Specialist Hospital',
  },
];

// Helper function to format date ranges
const formatDateRange = (start: string, end: string, isRTL: boolean): string => {
  if (!start) return '';
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isRTL) {
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const startDay = startDate.getDate();
      const startMonth = months[startDate.getMonth()];
      const startYear = startDate.getFullYear();
      
      if (start === end) {
        return `${startDay} ${startMonth} ${startYear}`;
      }
      const endDay = endDate.getDate();
      const endMonth = months[endDate.getMonth()];
      return `${startDay}-${endDay} ${endMonth} ${startYear}`;
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const startDay = startDate.getDate();
      const startMonth = months[startDate.getMonth()];
      const startYear = startDate.getFullYear();
      
      if (start === end) {
        return `${startMonth} ${startDay}, ${startYear}`;
      }
      const endDay = endDate.getDate();
      const endMonth = months[endDate.getMonth()];
      return `${startMonth} ${startDay}-${endDay}, ${startYear}`;
    }
  } catch {
    return '';
  }
};

export function LandingActivitiesPreview() {
  const { language } = useLanguage();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [activities, setActivities] = useState<LandingEvent[]>(mockActivities); // Keep the original 6 mock activities
  
  const title = getNestedTranslation(language, 'landing', 'activitiesPreview', 'title');
  const subtitle = getNestedTranslation(language, 'landing', 'activitiesPreview', 'description');
  const filters = getNestedTranslation(language, 'landing', 'activitiesPreview', 'filters');
  const cardLabels = getNestedTranslation(language, 'landing', 'activitiesPreview', 'card');
  const demoLabel = getNestedTranslation(language, 'landing', 'activitiesPreview', 'demoLabel');

  const isRTL = language === 'ar';

  // Map Arabic specialty text to specialty codes for translation
  const specialtyCodeMap: Record<string, string> = {
    'طب الأسرة': 'family_medicine',
    'طب الأطفال': 'pediatrics',
    'أمراض القلب': 'cardiology',
    'الجراحة العامة': 'general_surgery',
    'الطب النفسي': 'psychiatry',
    'الأورام': 'oncology',
  };

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    // Map activity specialty to code for comparison
    const activitySpecialtyCode = specialtyCodeMap[activity.specialty] || activity.specialty;
    if (selectedSpecialty && activitySpecialtyCode !== selectedSpecialty) return false;
    if (selectedFormat) {
      const formatMatch = isRTL ? activity.format === selectedFormat : activity.formatEn === selectedFormat;
      if (!formatMatch) return false;
    }
    if (selectedCity) {
      const cityMatch = isRTL ? activity.city === selectedCity : activity.cityEn === selectedCity;
      if (!cityMatch) return false;
    }
    return true;
  });

  // Get unique values for filters
  // For specialties, use the code (not the Arabic text) for filtering
  const specialties = Array.from(new Set(activities.map(a => {
    const code = specialtyCodeMap[a.specialty] || a.specialty;
    return code;
  })));
  const formats = Array.from(new Set(activities.map(a => isRTL ? a.format : a.formatEn)));
  const cities = Array.from(new Set(activities.map(a => isRTL ? a.city : a.cityEn)));

  const getSpecialtyName = (specialty: string) => {
    // First, try to map Arabic text to code
    const specialtyCode = specialtyCodeMap[specialty] || specialty;
    // Use the i18n specialty label function for proper translation
    return getSpecialtyLabel(specialtyCode, language);
  };

  return (
    <section id="activities" className="border-t border-[var(--separator)] bg-[var(--system-background-elevated)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Header Row: Title + Subtitle + Demo Chip */}
            <header className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-10`} dir={isRTL ? 'rtl' : 'ltr'}>
              {/* Left: Title + Subtitle */}
              <div className={`md:max-w-xl space-y-2`}>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[var(--label)]">
                  {title || (isRTL ? 'أنشطة تطوير مهني بساعات معتمدة' : 'Accredited CME/CPD activities')}
                </h2>
                {subtitle && (
                  <p className="text-sm md:text-base text-[var(--secondary-label)] leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Right: Demo Chip */}
              {demoLabel && (
                <Badge variant="outline" className="text-xs font-medium border border-[var(--border)]/60 bg-[var(--system-fill)]/50 text-[var(--secondary-label)] px-3 py-1.5">
                  {demoLabel}
                </Badge>
              )}
            </header>

            {/* Panel wrapper with background accent and panel */}
            <div className="relative mt-4">
              {/* Background accent - radial gradient */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.20),transparent_60%)]"
              />

              {/* Main panel */}
              <div className="relative rounded-[32px] border border-[var(--border)] bg-[var(--system-background)]/80 backdrop-blur-sm shadow-[0_24px_60px_rgba(15,23,42,0.06)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)] px-4 py-6 md:px-6 md:py-8 space-y-6">
                {/* Filter Card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
                >
                  <div className="rounded-ios-lg border border-[var(--border)] bg-[var(--system-background)]/60 backdrop-blur-sm px-3 py-3 md:px-4 md:py-4">
                    <div className={`flex flex-wrap gap-2 text-xs md:text-sm ${isRTL ? 'justify-end' : 'justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Specialty Filter */}
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--system-background)] text-[var(--label)] text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]/20"
                >
                  <option value="">{filters?.specialty || (isRTL ? 'التخصّص' : 'Specialty')}</option>
                  {specialties.map((specialty, index) => (
                    <option key={`specialty-${specialty}-${index}`} value={specialty}>
                      {getSpecialtyName(specialty)}
                    </option>
                  ))}
                </select>

                {/* Format Filter */}
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--system-background)] text-[var(--label)] text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]/20"
                >
                  <option value="">{filters?.format || (isRTL ? 'نوع الحضور' : 'Format')}</option>
                  {formats.map((format, index) => (
                    <option key={`format-${format}-${index}`} value={format}>
                      {format}
                    </option>
                  ))}
                </select>

                {/* City Filter */}
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--system-background)] text-[var(--label)] text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]/20"
                >
                  <option value="">{filters?.city || (isRTL ? 'المدينة' : 'City')}</option>
                  {cities.map((city, index) => (
                    <option key={`city-${city}-${index}`} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                      {/* More Filters Button (placeholder) */}
                      <button dir={isRTL ? 'rtl' : 'ltr'}
                        className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--system-background)] text-[var(--label)] text-xs md:text-sm hover:bg-[var(--system-fill)] transition-colors inline-flex items-center justify-center"
                      >
                        {filters?.moreFilters || (isRTL ? 'فلاتر إضافية' : 'More filters')}
                      </button>
                    </div>
                  </div>
                </motion.div>

                    {/* Activities Grid */}
                {filteredActivities.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.2,
                    },
                  },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="transition-transform transition-opacity"
                  >
                    <div
                      className="group relative rounded-ios-lg border border-[var(--separator)] bg-[var(--system-background)] shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] cursor-pointer"
                    >
              {/* Card content */}
              <div className="relative z-10 p-4 md:p-5 space-y-3">
                {/* Top Row: Tags (نوع الحضور + التخصص) */}
                <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  {/* Format Badge */}
                  <Badge variant="outline" className="text-xs font-medium border border-[var(--border)]/60 dark:border-[var(--border)]/40">
                    {isRTL ? activity.format : activity.formatEn}
                    </Badge>
                  
                  {/* Specialty Badge */}
                  <Badge variant="outline" className="text-xs font-medium border border-[var(--border)]/60 dark:border-[var(--border)]/40">
                    {getSpecialtyName(activity.specialty)}
                    </Badge>
                  </div>

                {/* Main Content: Activity Name + Provider */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[var(--label)] line-clamp-2 leading-tight">
                    {isRTL ? activity.name : activity.nameEn}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-[var(--secondary-label)]">
                      <Building2 className="h-3.5 w-3.5 text-[var(--tertiary-label)] flex-shrink-0" />
                    <span className="truncate">{isRTL ? activity.provider : activity.providerEn}</span>
                  </div>
                </div>

                {/* Highlight Strip: Accredited Hours (Smaller Pill) */}
                <div className="py-2 -mx-4 md:-mx-5 px-4 md:px-5">
                  <div className="relative overflow-hidden rounded-lg border border-[var(--apple-green)]/40 bg-gradient-to-br from-[var(--apple-green)]/12 via-[var(--apple-green)]/8 to-[var(--apple-green)]/12 backdrop-blur-sm">
                    <div className="relative px-3 py-2 flex items-center justify-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[var(--apple-green)] flex-shrink-0" />
                      <span className="text-sm font-semibold text-[var(--label)]">
                        {cardLabels?.accredited || (isRTL ? 'معتمد' : 'Accredited')} {activity.hours} {activity.hours === 1 ? (cardLabels?.hours || (isRTL ? 'ساعة' : 'hour')) : (cardLabels?.hoursPlural || (isRTL ? 'ساعات' : 'hours'))}
                        </span>
                      </div>
                    </div>
                  </div>

                {/* Footer: Date + City/Location */}
                <div className="space-y-2 pt-2 border-t border-[var(--separator)]">
                    <div className="flex items-center gap-2 text-sm text-[var(--secondary-label)]">
                      <Calendar className="h-4 w-4 text-[var(--tertiary-label)] flex-shrink-0" />
                    <span>{isRTL ? activity.dateRange : activity.dateRangeEn}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--secondary-label)]">
                    <MapPin className="h-4 w-4 text-[var(--tertiary-label)] flex-shrink-0" />
                    <span className="truncate">{isRTL ? `${activity.city} - ${activity.location}` : `${activity.cityEn} - ${activity.locationEn}`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                  ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-[var(--secondary-label)]">
                      {isRTL ? 'لا توجد أنشطة متاحة' : 'No activities found'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
