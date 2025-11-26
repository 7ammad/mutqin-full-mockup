export type Persona = 'ORGANIZER' | 'VENDOR' | 'REGULATOR' | 'HCP' | 'EVENT_MANAGER';

export type EventStatus = 'Draft' | 'Pending Approval' | 'Published' | 'Completed';

export interface Event {
    id: string;
    titleAr: string;
    titleEn: string;
    organizerAr: string;
    organizerEn: string;
    specialty: string;
    cme_hours: number;
    date: string;
    locationAr: string;
    locationEn: string;

    // Status & Workflow
    status: EventStatus;

    // Sponsorship
    is_sponsored: boolean;
    needs_sponsorship: boolean;
    sfda_license?: string;

    descriptionAr: string;
    descriptionEn: string;

    // Event Manager Assignment
    assignedToEventManager?: boolean;
    eventManagerId?: string;
    eventManagerAssignmentId?: string;
    executionStatus?: 'Unassigned' | 'Assigned' | 'InProgress' | 'Completed';
}

export interface EventManager {
    id: string;
    email: string;
    phone: string;
    role: 'EVENT_MANAGER';
    companyName: string;
    companyNameAr?: string;
    contactPerson: string;
    licenseNumber?: string;
    businessRegistration?: string;
    specialties: string[];
    maxEventCapacity: number;
    serviceAreas: string[];
    languages: ('ar' | 'en')[];
    rating: number;
    totalEventsManaged: number;
    completionRate: number;
    averageCheckInTime: number;
    pricingModel: 'Fixed' | 'PerAttendee' | 'Custom';
    baseFee?: number;
    perAttendeeFee?: number;
    verified: boolean;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface EventAssignment {
    id: string;
    eventId: string;
    organizerId: string;
    eventManagerId: string;
    status: 'Pending' | 'Accepted' | 'Rejected' | 'Active' | 'Completed' | 'Cancelled';
    assignedAt: Date;
    acceptedAt?: Date;
    contractTerms?: string;
    agreedFee?: number;
    checkInStarted: boolean;
    checkInStartedAt?: Date;
    attendanceFinalized: boolean;
    attendanceFinalizedAt?: Date;
    certificatesGenerated: boolean;
    certificatesGeneratedAt?: Date;
    cmeHoursSubmitted: boolean;
    cmeHoursSubmittedAt?: Date;
    finalAttendanceCount?: number;
    checkInEfficiency?: number;
    certificateGenerationTime?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserSession {
    persona: Persona;
    nameAr: string;
    nameEn: string;
    role_labelAr: string;
    role_labelEn: string;
}

export interface MockUser {
    id: string;
    email: string;
    password: string;
    name: string;
    nameAr?: string;
    nameEn?: string;
    role: Persona;
}

// Demo statistics for dashboard
export interface DemoStats {
    totalEvents: number;
    totalRegistrations: number;
    totalCMEHours: number;
    activeOrganizers: number;
    pendingApprovals: number;
    completedEvents: number;
}

export const DEMO_STATS: DemoStats = {
    totalEvents: 8,
    totalRegistrations: 1247,
    totalCMEHours: 114,
    activeOrganizers: 6,
    pendingApprovals: 2,
    completedEvents: 3,
};

export const INITIAL_EVENTS: Event[] = [
    {
        id: '1',
        titleAr: 'مؤتمر القلب السعودي 2025',
        titleEn: 'Saudi Cardiology Conference 2025',
        organizerAr: 'مستشفى الملك فيصل التخصصي',
        organizerEn: 'King Faisal Specialist Hospital',
        specialty: 'Cardiology',
        cme_hours: 24,
        date: '2025-03-15',
        locationAr: 'الرياض - فندق هيلتون',
        locationEn: 'Riyadh - Hilton Hotel',
        status: 'Published',
        is_sponsored: true,
        needs_sponsorship: false,
        sfda_license: 'MDS-REQ-2024-001',
        descriptionAr: 'أكبر تجمع لأطباء القلب في المملكة لمناقشة أحدث التطورات في جراحة القلب والقسطرة. يضم أكثر من 50 متحدثاً دولياً ومحلياً.',
        descriptionEn: 'The largest gathering of cardiologists in the Kingdom to discuss the latest developments in cardiac surgery and catheterization. Features over 50 international and local speakers.',
        assignedToEventManager: true,
        eventManagerId: 'em1',
        eventManagerAssignmentId: 'ea1',
        executionStatus: 'Assigned',
    },
    {
        id: '2',
        titleAr: 'ورشة عمل التمريض المتقدم',
        titleEn: 'Advanced Nursing Workshop',
        organizerAr: 'مدينة الملك فهد الطبية',
        organizerEn: 'King Fahd Medical City',
        specialty: 'Nursing',
        cme_hours: 12,
        date: '2025-04-10',
        locationAr: 'الرياض - مركز المؤتمرات',
        locationEn: 'Riyadh - Conference Center',
        status: 'Draft',
        is_sponsored: false,
        needs_sponsorship: true,
        descriptionAr: 'ورشة عمل مكثفة تركز على مهارات العناية المركزة والتعامل مع الحالات الحرجة. مخصصة للممرضين والممرضات في وحدات العناية المركزة.',
        descriptionEn: 'Intensive workshop focusing on critical care skills and handling critical cases. Designed for nurses in intensive care units.',
    },
    {
        id: '3',
        titleAr: 'ندوة طب الأطفال والمستقبل',
        titleEn: 'Pediatrics and Future Symposium',
        organizerAr: 'مستشفى الحرس الوطني',
        organizerEn: 'National Guard Hospital',
        specialty: 'Pediatrics',
        cme_hours: 8,
        date: '2025-05-20',
        locationAr: 'جدة - فندق ريتز كارلتون',
        locationEn: 'Jeddah - Ritz Carlton Hotel',
        status: 'Pending Approval',
        is_sponsored: true,
        needs_sponsorship: false,
        sfda_license: 'MDS-REQ-2025-099',
        descriptionAr: 'مناقشة التحديات الحديثة في طب الأطفال وصحة حديثي الولادة. يتضمن جلسات تفاعلية وحالات سريرية.',
        descriptionEn: 'Discussion of modern challenges in pediatrics and neonatal health. Includes interactive sessions and clinical cases.',
    },
    {
        id: '4',
        titleAr: 'مؤتمر الجراحة العامة والتقنيات الحديثة',
        titleEn: 'General Surgery and Modern Techniques Conference',
        organizerAr: 'الجمعية السعودية للجراحة',
        organizerEn: 'Saudi Society of Surgery',
        specialty: 'General Surgery',
        cme_hours: 18,
        date: '2025-06-05',
        locationAr: 'الرياض - مركز الملك فهد الثقافي',
        locationEn: 'Riyadh - King Fahd Cultural Center',
        status: 'Published',
        is_sponsored: true,
        needs_sponsorship: false,
        sfda_license: 'MDS-REQ-2024-045',
        descriptionAr: 'استعراض أحدث التقنيات الجراحية والروبوتية في الجراحة العامة. يتضمن عروضاً حية وتدريبات عملية.',
        descriptionEn: 'Showcase of the latest surgical and robotic techniques in general surgery. Includes live demonstrations and hands-on training.',
        assignedToEventManager: true,
        eventManagerId: 'em1',
        eventManagerAssignmentId: 'ea2',
        executionStatus: 'Assigned',
    },
    {
        id: '5',
        titleAr: 'دورة التخدير المتقدم',
        titleEn: 'Advanced Anesthesia Course',
        organizerAr: 'مستشفى الملك سعود الجامعي',
        organizerEn: 'King Saud University Hospital',
        specialty: 'Anesthesiology',
        cme_hours: 16,
        date: '2025-04-25',
        locationAr: 'الرياض - مستشفى الملك سعود',
        locationEn: 'Riyadh - King Saud Hospital',
        status: 'Published',
        is_sponsored: false,
        needs_sponsorship: false,
        descriptionAr: 'دورة متقدمة في تقنيات التخدير الحديثة وإدارة الألم. تشمل محاضرات وورش عمل عملية.',
        descriptionEn: 'Advanced course in modern anesthesia techniques and pain management. Includes lectures and practical workshops.',
    },
    {
        id: '6',
        titleAr: 'مؤتمر الصيدلة السريرية',
        titleEn: 'Clinical Pharmacy Conference',
        organizerAr: 'الجمعية السعودية للصيدلة السريرية',
        organizerEn: 'Saudi Society of Clinical Pharmacy',
        specialty: 'Pharmacy',
        cme_hours: 14,
        date: '2025-05-12',
        locationAr: 'الدمام - فندق شيراتون',
        locationEn: 'Dammam - Sheraton Hotel',
        status: 'Draft',
        is_sponsored: false,
        needs_sponsorship: true,
        descriptionAr: 'مناقشة دور الصيدلي السريري في تحسين مخرجات العلاج. يتضمن جلسات حول التفاعلات الدوائية والجرعات المثلى.',
        descriptionEn: 'Discussion of the clinical pharmacist\'s role in improving treatment outcomes. Includes sessions on drug interactions and optimal dosing.',
    },
    {
        id: '7',
        titleAr: 'ندوة طب الطوارئ والحوادث',
        titleEn: 'Emergency Medicine and Trauma Symposium',
        organizerAr: 'مستشفى الملك فهد للقوات المسلحة',
        organizerEn: 'King Fahd Armed Forces Hospital',
        specialty: 'Emergency Medicine',
        cme_hours: 10,
        date: '2025-04-18',
        locationAr: 'الرياض - مستشفى الملك فهد',
        locationEn: 'Riyadh - King Fahd Hospital',
        status: 'Published',
        is_sponsored: true,
        needs_sponsorship: false,
        sfda_license: 'MDS-REQ-2025-012',
        descriptionAr: 'تدريب متقدم على إدارة الحالات الطارئة والصدمات. يتضمن محاكاة حالات واقعية.',
        descriptionEn: 'Advanced training on emergency case and trauma management. Includes realistic case simulations.',
    },
    {
        id: '8',
        titleAr: 'ورشة عمل الأشعة التشخيصية',
        titleEn: 'Diagnostic Radiology Workshop',
        organizerAr: 'الجمعية السعودية للأشعة',
        organizerEn: 'Saudi Society of Radiology',
        specialty: 'Radiology',
        cme_hours: 12,
        date: '2025-05-28',
        locationAr: 'جدة - مركز المؤتمرات',
        locationEn: 'Jeddah - Conference Center',
        status: 'Pending Approval',
        is_sponsored: true,
        needs_sponsorship: false,
        sfda_license: 'MDS-REQ-2025-078',
        descriptionAr: 'استعراض أحدث تقنيات التصوير الطبي وتطبيقات الذكاء الاصطناعي في التشخيص الإشعاعي.',
        descriptionEn: 'Showcase of the latest medical imaging techniques and AI applications in radiological diagnosis.',
    },
];

export const PERSONA_DETAILS: Record<Persona, UserSession> = {
    ORGANIZER: {
        persona: 'ORGANIZER',
        nameAr: 'د. أحمد المنصور',
        nameEn: 'Dr. Ahmed Al-Mansour',
        role_labelAr: 'مدير الفعاليات - مستشفى الملك فيصل',
        role_labelEn: 'Events Manager - King Faisal Hospital',
    },
    VENDOR: {
        persona: 'VENDOR',
        nameAr: 'شركة الدواء المتقدمة',
        nameEn: 'Advanced Pharmaceuticals Co.',
        role_labelAr: 'شريك استراتيجي',
        role_labelEn: 'Strategic Partner',
    },
    REGULATOR: {
        persona: 'REGULATOR',
        nameAr: 'د. خالد الفهد',
        nameEn: 'Dr. Khalid Al-Fahd',
        role_labelAr: 'مسؤول الاعتماد - هيئة التخصصات',
        role_labelEn: 'Accreditation Officer - SCFHS',
    },
    HCP: {
        persona: 'HCP',
        nameAr: 'د. سارة العتيبي',
        nameEn: 'Dr. Sarah Al-Otaibi',
        role_labelAr: 'طبيب مقيم - طب أسرة',
        role_labelEn: 'Resident Physician - Family Medicine',
    },
    EVENT_MANAGER: {
        persona: 'EVENT_MANAGER',
        nameAr: 'شركة إدارة الفعاليات المتقدمة',
        nameEn: 'Advanced Event Management Co.',
        role_labelAr: 'مدير فعاليات معتمد',
        role_labelEn: 'Certified Event Manager',
    },
};

// Mock Event Managers
export const MOCK_EVENT_MANAGERS: EventManager[] = [
    {
        id: 'em1',
        email: 'info@advanced-events.com',
        phone: '+966501234567',
        role: 'EVENT_MANAGER',
        companyName: 'Advanced Event Management Co.',
        companyNameAr: 'شركة إدارة الفعاليات المتقدمة',
        contactPerson: 'Mohammed Al-Rashid',
        licenseNumber: 'EM-LIC-2024-001',
        businessRegistration: 'CR-1234567890',
        specialties: ['Cardiology', 'General Surgery', 'Emergency Medicine'],
        maxEventCapacity: 500,
        serviceAreas: ['Riyadh', 'Jeddah', 'Dammam'],
        languages: ['ar', 'en'],
        rating: 4.8,
        totalEventsManaged: 45,
        completionRate: 98,
        averageCheckInTime: 2.5,
        pricingModel: 'PerAttendee',
        baseFee: 5000,
        perAttendeeFee: 50,
        verified: true,
        active: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2025-01-15'),
    },
    {
        id: 'em2',
        email: 'contact@pro-events.sa',
        phone: '+966502345678',
        role: 'EVENT_MANAGER',
        companyName: 'Professional Events Solutions',
        companyNameAr: 'حلول الفعاليات الاحترافية',
        contactPerson: 'Fatima Al-Zahra',
        licenseNumber: 'EM-LIC-2024-002',
        businessRegistration: 'CR-2345678901',
        specialties: ['Pediatrics', 'Nursing', 'Pharmacy'],
        maxEventCapacity: 300,
        serviceAreas: ['Riyadh', 'Jeddah'],
        languages: ['ar', 'en'],
        rating: 4.6,
        totalEventsManaged: 32,
        completionRate: 95,
        averageCheckInTime: 3.0,
        pricingModel: 'Fixed',
        baseFee: 8000,
        verified: true,
        active: true,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2025-01-10'),
    },
];

// Mock Users for Authentication
export const MOCK_USERS: MockUser[] = [
    {
        id: 'hcp1',
        email: 'hcp@demo.com',
        password: 'demo123',
        name: 'Dr. Sarah Al-Otaibi',
        nameAr: 'د. سارة العتيبي',
        nameEn: 'Dr. Sarah Al-Otaibi',
        role: 'HCP',
    },
    {
        id: 'org1',
        email: 'organizer@demo.com',
        password: 'demo123',
        name: 'Dr. Ahmed Al-Mansour',
        nameAr: 'د. أحمد المنصور',
        nameEn: 'Dr. Ahmed Al-Mansour',
        role: 'ORGANIZER',
    },
    {
        id: 'vendor1',
        email: 'vendor@demo.com',
        password: 'demo123',
        name: 'Advanced Pharmaceuticals Co.',
        nameAr: 'شركة الدواء المتقدمة',
        nameEn: 'Advanced Pharmaceuticals Co.',
        role: 'VENDOR',
    },
    {
        id: 'reg1',
        email: 'regulator@demo.com',
        password: 'demo123',
        name: 'Dr. Khalid Al-Fahd',
        nameAr: 'د. خالد الفهد',
        nameEn: 'Dr. Khalid Al-Fahd',
        role: 'REGULATOR',
    },
    {
        id: 'em1',
        email: 'eventmanager@demo.com',
        password: 'demo123',
        name: 'Advanced Event Management Co.',
        nameAr: 'شركة إدارة الفعاليات المتقدمة',
        nameEn: 'Advanced Event Management Co.',
        role: 'EVENT_MANAGER',
    },
];

// Mock Event Assignments
export const MOCK_EVENT_ASSIGNMENTS: EventAssignment[] = [
    {
        id: 'ea1',
        eventId: '1',
        organizerId: 'org1',
        eventManagerId: 'em1',
        status: 'Active',
        assignedAt: new Date('2025-02-01'),
        acceptedAt: new Date('2025-02-02'),
        agreedFee: 15000,
        checkInStarted: false,
        attendanceFinalized: false,
        certificatesGenerated: false,
        cmeHoursSubmitted: false,
        createdAt: new Date('2025-02-01'),
        updatedAt: new Date('2025-02-02'),
    },
    {
        id: 'ea2',
        eventId: '4',
        organizerId: 'org2',
        eventManagerId: 'em1',
        status: 'Pending',
        assignedAt: new Date('2025-03-01'),
        agreedFee: 12000,
        checkInStarted: false,
        attendanceFinalized: false,
        certificatesGenerated: false,
        cmeHoursSubmitted: false,
        createdAt: new Date('2025-03-01'),
        updatedAt: new Date('2025-03-01'),
    },
];
