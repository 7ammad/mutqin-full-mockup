// src/demo-data/events.ts
export type DemoEvent = {
  id: string;
  title: string;
  specialty: string;
  format: '' | '' | '';
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
    title: '   ',
    specialty: ' ',
    format: '',
    city: '',
    venue: ' ',
    hours: 6,
    accreditedBy: 'SCFHS',
    startDate: '2025-05-05',
    endDate: '2025-05-05',
  },
  {
    id: 'event-2',
    title: '   ',
    specialty: ' ',
    format: '',
    city: '',
    venue: '   ',
    hours: 12,
    accreditedBy: 'SCFHS',
    startDate: '2025-04-08',
    endDate: '2025-04-10',
  },
  {
    id: 'event-3',
    title: '    2025',
    specialty: ' ',
    format: '',
    city: '',
    venue: ' ',
    hours: 18,
    accreditedBy: 'SCFHS',
    startDate: '2025-03-15',
    endDate: '2025-03-17',
  },
];
