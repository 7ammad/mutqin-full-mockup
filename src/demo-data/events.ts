// src/demo-data/events.ts
export type DemoEvent = {
  id: string;
  title: string;
  specialty: string;
  format: 'حضوري' | 'افتراضي' | 'هجين';
  city: string;
  venue: string;
  hours: number;
  accreditedBy: string;
  startDate: string; // ISO
  endDate: string;   // ISO
};

export const demoEvents: DemoEvent[] = [
  {
    id: 'event-1',
    title: 'ندوة تحديث طب الأسرة',
    specialty: 'طب الأسرة',
    format: 'افتراضي',
    city: 'الرياض',
    venue: 'منصة متقن',
    hours: 6,
    accreditedBy: 'SCFHS',
    startDate: '2025-05-05',
    endDate: '2025-05-05',
  },
  {
    id: 'event-2',
    title: 'ورشة طب الطوارئ للأطفال',
    specialty: 'طب الأطفال',
    format: 'هجين',
    city: 'الرياض',
    venue: 'مدينة الملك فهد الطبية',
    hours: 12,
    accreditedBy: 'SCFHS',
    startDate: '2025-04-08',
    endDate: '2025-04-10',
  },
  {
    id: 'event-3',
    title: 'مؤتمر أمراض القلب المتقدم 2025',
    specialty: 'أمراض القلب',
    format: 'حضوري',
    city: 'الرياض',
    venue: 'فندق الفيصلية',
    hours: 18,
    accreditedBy: 'SCFHS',
    startDate: '2025-03-15',
    endDate: '2025-03-17',
  },
];
