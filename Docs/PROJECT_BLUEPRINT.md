# Project Blueprint: Unified CME Event Marketplace Platform
## Saudi Arabia Medical Education Ecosystem

**Version:** 1.0  
**Date:** 2025  
**Based on:** CME Event Lifecycle & Market Landscape Research

---

## Executive Summary

This blueprint transforms the current **event-med** simulation into a **production-ready, three-sided marketplace** connecting:
- **Healthcare Practitioners (HCPs)** - 350,000+ users seeking CME hours
- **Event Organizers** - 396 accredited providers managing 10,500+ annual events
- **Pharmaceutical/MedTech Sponsors** - $160M+ annual sponsorship market
- **SCFHS Regulators** - Accreditation and compliance oversight

**Vision:** Become the "Operating System" of Saudi healthcare education—the single platform where every CME interaction happens.

---

## Table of Contents

1. [Current State Assessment](#current-state-assessment)
2. [Target Architecture](#target-architecture)
3. [Core Modules & Features](#core-modules--features)
4. [Data Models & Schema](#data-models--schema)
5. [API Design & Integrations](#api-design--integrations)
6. [User Experience Flows](#user-experience-flows)
7. [Implementation Phases](#implementation-phases)
8. [Technical Stack](#technical-stack)
9. [Security & Compliance](#security--compliance)
10. [Success Metrics](#success-metrics)

---

## 1. Current State Assessment

### What Exists (Demo/Simulation)

✅ **Implemented:**
- Basic persona switching (Organizer, Vendor, Regulator, HCP)
- Event creation wizard (Organizer)
- Event discovery grid (HCP)
- Sponsorship marketplace (Vendor)
- Approval workflow (Regulator)
- Basic state management (React Context)
- UI components (shadcn/ui, Tailwind CSS)
- Mock data structure

### What's Missing (Production Requirements)

❌ **Critical Gaps:**
- Authentication & authorization
- Real data persistence (database)
- SCFHS/CPD Platform integration
- Mumaris Plus API integration
- Payment processing (SADAD, credit cards)
- QR code attendance system
- Certificate generation & blockchain verification
- Email/SMS notifications
- Mobile apps (iOS/Android)
- Analytics & reporting
- Multi-language support (Arabic/English)
- File upload/document management
- Search & filtering (advanced)
- Real-time notifications
- Admin dashboard
- API layer
- Testing infrastructure

---

## 2. Target Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                            │
├─────────────────────────────────────────────────────────────┤
│  Web App (Next.js)  │  Mobile Apps (React Native)           │
│  - HCP Portal       │  - iOS App                            │
│  - Organizer Portal │  - Android App                        │
│  - Vendor Portal    │  - QR Scanner                         │
│  - Regulator Portal │                                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Next.js API Routes │  REST API │  GraphQL (Future)          │
│  - Authentication   │  - Rate Limiting                     │
│  - Authorization     │  - Request Validation                │
│  - Request Routing   │  - Caching Layer                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
├─────────────────────────────────────────────────────────────┤
│  Services:                                                  │
│  - Event Service      │  - Notification Service             │
│  - User Service       │  - Payment Service                 │
│  - Accreditation Service│ - Certificate Service             │
│  - Attendance Service  │  - Analytics Service                │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data & Integration Layer                  │
├─────────────────────────────────────────────────────────────┤
│  Database (PostgreSQL) │  External APIs:                     │
│  - Events              │  - SCFHS CPD Platform API          │
│  - Users               │  - Mumaris Plus API                │
│  - Transactions        │  - SADAD Payment Gateway          │
│  - Certificates        │  - SMS Gateway (Twilio)            │
│                        │  - Email Service (SendGrid)         │
│  Redis Cache           │  - Blockchain Network              │
│  - Session Storage     │                                     │
│  - Rate Limiting       │                                     │
│  - Real-time Data      │                                     │
└─────────────────────────────────────────────────────────────┘
```

### Microservices Architecture (Future Scale)

For Phase 3+, consider splitting into:
- **Event Service** - Event CRUD, search, filtering
- **User Service** - Authentication, profiles, preferences
- **Accreditation Service** - SCFHS workflow, compliance
- **Payment Service** - Transactions, invoicing
- **Notification Service** - Email, SMS, push
- **Analytics Service** - Reporting, insights
- **Certificate Service** - Generation, blockchain

---

## 3. Core Modules & Features

### Module 1: HCP (Healthcare Practitioner) Portal

#### 1.1 Event Discovery & Search
**Current:** Basic grid view with mock data  
**Target:** Full-featured marketplace

**Features:**
- **Advanced Search & Filters:**
  - Specialty (90+ SCFHS specialties)
  - Sub-specialty (e.g., "Interventional Cardiology")
  - Date range
  - Location (city, region)
  - Format (in-person, virtual, hybrid, on-demand)
  - CME hours range
  - Cost (free, paid, price range)
  - Accreditation status (SCFHS verified badge)
  - Speaker reputation
  - Organizer rating
  - Language (Arabic, English, bilingual)

- **AI-Powered Recommendations:**
  - "Based on your profile (Cardiologist, Riyadh, Consultant)"
  - "You need 12 more hours for license renewal"
  - "Events matching your past attendance patterns"
  - "Trending in your specialty this month"

- **Event Details Page:**
  - Full description (Arabic/English)
  - Scientific program (session-by-session)
  - Speaker profiles with CVs
  - Accreditation certificate preview
  - CME hours breakdown
  - Venue information & map
  - Registration count & capacity
  - Reviews & ratings from past attendees
  - Related events suggestions

- **Calendar Integration:**
  - Export to Google Calendar, Outlook, iCal
  - Personal CME calendar view
  - Reminder notifications (7 days, 1 day before)

#### 1.2 Registration & Ticketing
**Current:** Simple registration button  
**Target:** Full registration flow

**Features:**
- **One-Click Registration:**
  - Auto-fill from profile (name, classification number, specialty)
  - Payment integration (credit card, bank transfer)
  - Instant confirmation email/SMS
  - QR code ticket generation
  - Add to calendar

- **Registration Management:**
  - View all registered events
  - Cancel registration (with refund policy)
  - Transfer ticket (if allowed)
  - Download ticket PDF
  - Share event with colleagues

#### 1.3 CME Hour Tracking
**Current:** Not implemented  
**Target:** Automated tracking dashboard

**Features:**
- **Real-Time Hour Dashboard:**
  - Total hours accumulated (current year)
  - Hours by category (in-person, virtual, self-learning)
  - Hours by specialty
  - Progress toward license renewal requirement
  - Countdown to renewal deadline
  - Deficit alerts ("You need 12 more hours by March 2026")

- **Mumaris Plus Integration:**
  - Auto-sync hours after event completion
  - Manual upload fallback (if auto-sync fails)
  - Certificate verification
  - Status tracking (pending, approved, rejected)

- **Digital Certificate Portfolio:**
  - Cloud storage of all certificates
  - Searchable by event, date, specialty
  - Download/print anytime
  - Share with employers
  - Blockchain verification QR code

- **License Renewal Assistant:**
  - Auto-populate renewal application
  - Export CME record for SCFHS submission
  - Compliance checklist

#### 1.4 Social Features
**Current:** Not implemented  
**Target:** Community engagement

**Features:**
- **Event Reviews & Ratings:**
  - 5-star rating system
  - Written reviews (moderated)
  - Helpful votes
  - Organizer responses

- **Learning Profile:**
  - Public profile showing CME achievements
  - "Attended 14 CME events in 2024" badge
  - Specialty leaderboards (optional)
  - Learning streak tracking

- **Networking:**
  - Connect with colleagues
  - See who's attending same events
  - Post-event discussion forums

### Module 2: Organizer Portal

#### 2.1 Event Management
**Current:** Basic creation wizard  
**Target:** Full event lifecycle management

**Features:**
- **Event Creation Wizard (Enhanced):**
  - Step 1: Basic Information
    - Title (Arabic/English)
    - Event type (conference, workshop, webinar, internal)
    - Dates & times
    - Location/venue
    - Expected capacity
    - Event format (in-person, virtual, hybrid)
  
  - Step 2: Accreditation Application
    - Auto-populate from previous events (if recurring)
    - SCFHS form integration
    - Scientific Committee Chair selection (verify classification number)
    - Learning objectives (SMART format template)
    - Target audience selection (multi-select specialties)
    - Educational methodology
    - Disclosure of commercial bias
  
  - Step 3: Scientific Program
    - Session-by-session builder
    - Speaker assignment
    - Duration per session
    - CME hours auto-calculation
    - Agenda export (PDF, Word)
  
  - Step 4: Speakers
    - Add speaker profiles
    - Upload CVs
    - Speaker credentials verification
    - Disclosure forms
  
  - Step 5: Marketing & Promotion
    - Event landing page builder
    - Social media preview
    - Email campaign templates
    - Target audience selection for promotion
  
  - Step 6: Pricing & Registration
    - Set registration fees (free, paid, tiered)
    - Early bird pricing
    - Discount codes
    - Group registration options
  
  - Step 7: Review & Submit
    - Comprehensive review
    - Validation checks
    - Submit to SCFHS (if new accreditation needed)
    - Save as draft

- **Event Dashboard:**
  - Overview metrics (registrations, revenue, attendance rate)
  - Registration timeline chart
  - Attendee demographics (specialties, regions, seniorities)
  - Revenue tracking
  - Sponsorship status
  - Accreditation status
  - Real-time notifications

- **Recurring Events:**
  - Clone previous event
  - Update dates/location only
  - Fast-track approval (7-10 days vs 21 days)

#### 2.2 Marketing & Audience Targeting
**Current:** Not implemented  
**Target:** Automated marketing engine

**Features:**
- **Smart Audience Targeting:**
  - Select target specialties
  - Geographic targeting (regions, cities)
  - Seniority level (residents, specialists, consultants)
  - Past event attendance patterns
  - Estimated reach (e.g., "15,000 cardiologists in Riyadh/Jeddah")

- **Automated Marketing:**
  - Email campaigns to matched practitioners
  - Push notifications (mobile app)
  - SMS reminders (opt-in)
  - Social media integration
  - WhatsApp Business API (future)

- **Landing Page Builder:**
  - Drag-and-drop page builder
  - Custom branding
  - Registration form embedded
  - Payment integration
  - SEO optimization

- **Analytics:**
  - Email open rates
  - Click-through rates
  - Registration conversion funnel
  - Traffic sources
  - A/B testing for campaigns

#### 2.3 Attendance Management
**Current:** Not implemented  
**Target:** QR code-based system

**Features:**
- **QR Code Check-In:**
  - Generate unique QR codes per attendee
  - Mobile app scanner for organizers
  - Real-time verification against Mumaris Plus
  - Instant eligibility alerts (specialty mismatch, date conflict)
  - Bulk check-in (for large events)

- **Attendance Dashboard:**
  - Live attendance count
  - Check-in timeline
  - Missing attendees list
  - Attendance reports

- **Post-Event CME Registration:**
  - Auto-populate attendee list from check-ins
  - Export to SCFHS format (Excel template)
  - One-click submission to CPD Platform
  - Status tracking (approved, declined, pending)
  - Resubmission for declined entries

#### 2.4 Certificate Generation
**Current:** Not implemented  
**Target:** Automated bulk generation

**Features:**
- **Bulk Certificate Creation:**
  - Auto-generate from attendee list
  - SCFHS-compliant template
  - Digital signatures
  - Blockchain hash generation
  - PDF download per attendee
  - Bulk email distribution

- **Certificate Templates:**
  - Customizable design
  - Organizer branding
  - SCFHS accreditation number
  - Event details
  - CME hours
  - QR code for verification

#### 2.5 Sponsorship Management
**Current:** Basic sponsorship request  
**Target:** Full sponsorship marketplace

**Features:**
- **Sponsorship Packages:**
  - Create tiered packages (Bronze, Silver, Gold)
  - Define benefits per tier
  - Pricing
  - Availability (limited slots)

- **Sponsor Matching:**
  - Browse available sponsors
  - Send sponsorship requests
  - Negotiate terms
  - Contract management
  - Payment tracking

- **Sponsor Analytics:**
  - Reach metrics (impressions, clicks)
  - Engagement data
  - ROI reporting for sponsors

### Module 3: Vendor/Sponsor Portal

#### 3.1 Event Marketplace
**Current:** Basic feed of events needing sponsorship  
**Target:** Full marketplace with targeting

**Features:**
- **Event Discovery:**
  - Browse all events seeking sponsorship
  - Filter by:
    - Specialty
    - Expected attendance
    - Date range
    - Location
    - Organizer reputation
    - Sponsorship tier availability

- **Event Details:**
  - Full event information
  - Target audience demographics
  - Past event performance (if recurring)
  - Organizer rating
  - Competitive sponsors (if any)

- **Sponsorship Packages:**
  - View available tiers
  - Compare benefits
  - Pricing transparency
  - Reserve sponsorship slot

#### 3.2 Targeting & Campaign Management
**Current:** Not implemented  
**Target:** Precision targeting engine

**Features:**
- **HCP Targeting:**
  - Select target specialties
  - Geographic targeting
  - Seniority levels
  - Past engagement history
  - Estimated reach & cost

- **Sponsored Content:**
  - Create educational content
  - Distribute to target HCPs
  - Compliance checks (editorial independence)
  - Engagement tracking

- **Event Promotion:**
  - Boost event visibility
  - Featured placement
  - Email campaign sponsorship
  - Social media promotion

#### 3.3 Analytics & ROI
**Current:** Not implemented  
**Target:** Comprehensive analytics

**Features:**
- **Campaign Performance:**
  - Reach metrics (impressions, unique HCPs)
  - Engagement (clicks, registrations)
  - Attendance attribution
  - Cost per engagement
  - ROI calculation

- **HCP Insights:**
  - Specialty engagement trends
  - Geographic performance
  - Content preferences
  - Long-term engagement tracking

- **Reporting:**
  - Automated monthly reports
  - Custom date ranges
  - Export to PDF/Excel
  - Share with stakeholders

#### 3.4 Compliance Management
**Current:** Not implemented  
**Target:** Built-in compliance

**Features:**
- **Transparency Reporting:**
  - Auto-generate spend reports
  - HCP payment disclosures (if required)
  - Export for regulatory submission

- **Compliance Checks:**
  - Editorial independence validation
  - Content review (no promotional material)
  - SCFHS accreditation verification
  - Audit trail logging

### Module 4: Regulator (SCFHS) Portal

#### 4.1 Accreditation Review
**Current:** Basic approval workflow  
**Target:** Full accreditation management

**Features:**
- **Application Queue:**
  - New applications dashboard
  - Filter by status, date, provider
  - Priority sorting (conferences, recurring events)
  - Bulk actions

- **Review Workflow:**
  - 20 Standards checklist (for provider accreditation)
  - Activity application review
  - Document verification
  - Learning objectives validation
  - Speaker credentials check
  - Conflict checking (date, specialty)

- **Decision Management:**
  - Approve with comments
  - Return for modification (with specific feedback)
  - Decline with reason
  - Fast-track approval (for high performers)

- **Accreditation Certificate:**
  - Auto-generate upon approval
  - Unique accreditation number
  - Download/email to provider
  - Blockchain hash storage

#### 4.2 Compliance Monitoring
**Current:** Not implemented  
**Target:** Automated compliance tracking

**Features:**
- **Hour Registration Monitoring:**
  - Track 21-day registration deadline
  - Alert if organizer misses deadline
  - Extension request management
  - Compliance scoring

- **Provider Performance:**
  - On-time registration rate
  - Quality ratings from HCPs
  - Complaint tracking
  - Accreditation renewal status

- **National Analytics:**
  - Total events by specialty
  - CME hours awarded
  - Practitioner engagement rates
  - Geographic distribution
  - Trends & insights

#### 4.3 Audit & Quality Assurance
**Current:** Not implemented  
**Target:** Quality control system

**Features:**
- **Random Audits:**
  - Select events for audit
  - Verify attendance records
  - Check certificate accuracy
  - Validate CME hour calculations

- **Fraud Detection:**
  - Suspicious patterns (e.g., same practitioner at overlapping events)
  - Unusual attendance numbers
  - Certificate duplication
  - AI-powered anomaly detection

- **Quality Metrics:**
  - HCP satisfaction scores
  - Event completion rates
  - Certificate accuracy
  - Provider reliability scores

### Module 5: Admin & Platform Management

#### 5.1 User Management
- User accounts (HCPs, Organizers, Vendors, Regulators)
- Role-based access control (RBAC)
- Account verification
- Suspension/ban management
- User analytics

#### 5.2 Content Moderation
- Event content review
- Review/rating moderation
- Spam detection
- Inappropriate content flagging

#### 5.3 System Configuration
- Platform settings
- Fee structures
- Email templates
- Notification preferences
- Feature flags

#### 5.4 Analytics & Reporting
- Platform-wide metrics
- Revenue tracking
- User growth
- Event statistics
- Custom reports

---

## 4. Data Models & Schema

### Core Entities

#### User Model
```typescript
interface User {
  id: string; // UUID
  email: string;
  phone?: string;
  passwordHash: string;
  role: 'HCP' | 'ORGANIZER' | 'VENDOR' | 'REGULATOR' | 'ADMIN';
  
  // Profile
  firstName: string;
  lastName: string;
  arabicName?: string;
  avatar?: string;
  
  // HCP-specific
  classificationNumber?: string; // SCFHS classification
  specialty?: string;
  subSpecialty?: string;
  seniority?: 'Resident' | 'Specialist' | 'Consultant';
  mumarisPlusId?: string;
  
  // Organizer-specific
  organizationName?: string;
  organizationType?: 'Hospital' | 'University' | 'Society' | 'Training Company';
  cpdProviderId?: string; // SCFHS CPD Provider ID
  accreditationStatus?: 'Pending' | 'Accredited' | 'Expired';
  
  // Vendor-specific
  companyName?: string;
  companyType?: 'Pharma' | 'MedTech' | 'Other';
  licenseNumber?: string;
  
  // Common
  language: 'ar' | 'en' | 'both';
  timezone: string;
  notifications: NotificationPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  verified: boolean;
}
```

#### Event Model
```typescript
interface Event {
  id: string; // UUID
  organizerId: string; // User ID
  
  // Basic Info
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  eventType: 'Conference' | 'Workshop' | 'Webinar' | 'Internal' | 'E-Learning';
  format: 'InPerson' | 'Virtual' | 'Hybrid';
  
  // Dates & Location
  startDate: Date;
  endDate: Date;
  registrationDeadline?: Date;
  timezone: string;
  location?: {
    venue: string;
    address: string;
    city: string;
    region: string;
    coordinates?: { lat: number; lng: number };
  };
  virtualLink?: string;
  platform?: string;
  
  // Accreditation
  accreditationStatus: 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Expired';
  accreditationNumber?: string;
  accreditationDate?: Date;
  accreditationExpiry?: Date;
  scfhsApplicationId?: string;
  
  // Educational Details
  targetAudience: string[]; // Specialties
  learningObjectives: string[]; // SMART format
  totalCMEHours: number;
  sessions: Session[];
  speakers: Speaker[];
  scientificCommitteeChair?: string; // Classification number
  
  // Registration
  capacity: number;
  currentRegistrations: number;
  registrationFee: number;
  currency: 'SAR' | 'USD';
  earlyBirdPrice?: number;
  earlyBirdDeadline?: Date;
  isPublic: boolean;
  registrationOpen: boolean;
  
  // Sponsorship
  needsSponsorship: boolean;
  isSponsored: boolean;
  sponsors: Sponsor[];
  sponsorshipPackages: SponsorshipPackage[];
  
  // Marketing
  featured: boolean;
  tags: string[];
  seoKeywords: string[];
  
  // Status
  status: 'Draft' | 'Pending Approval' | 'Published' | 'Completed' | 'Cancelled';
  publishedAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

#### Session Model
```typescript
interface Session {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  cmeHours: number;
  speakerIds: string[];
  topic: string;
  format: 'Lecture' | 'Workshop' | 'Panel' | 'Case Study';
  order: number;
}
```

#### Speaker Model
```typescript
interface Speaker {
  id: string;
  name: string;
  title: string; // Dr., Prof., etc.
  specialty: string;
  organization: string;
  bio: string;
  cvUrl?: string;
  photoUrl?: string;
  email?: string;
  classificationNumber?: string;
  disclosure?: string; // Commercial relationships
}
```

#### Registration Model
```typescript
interface Registration {
  id: string;
  eventId: string;
  userId: string; // HCP ID
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Attended' | 'NoShow';
  registrationDate: Date;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  paymentMethod?: 'CreditCard' | 'BankTransfer' | 'SADAD';
  transactionId?: string;
  ticketQRCode: string;
  checkedIn: boolean;
  checkedInAt?: Date;
  cmeHoursAwarded?: number;
  certificateId?: string;
  notes?: string;
}
```

#### Certificate Model
```typescript
interface Certificate {
  id: string;
  eventId: string;
  userId: string;
  registrationId: string;
  accreditationNumber: string;
  eventTitle: string;
  eventDate: Date;
  cmeHours: number;
  specialty: string;
  certificateNumber: string; // Unique
  pdfUrl: string;
  blockchainHash: string; // For verification
  issuedAt: Date;
  verified: boolean;
  mumarisPlusSyncStatus: 'Pending' | 'Synced' | 'Failed';
  mumarisPlusSyncDate?: Date;
}
```

#### Sponsorship Model
```typescript
interface Sponsorship {
  id: string;
  eventId: string;
  vendorId: string;
  packageId: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  amount: number;
  currency: 'SAR' | 'USD';
  status: 'Pending' | 'Approved' | 'Paid' | 'Cancelled';
  contractUrl?: string;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  benefits: string[];
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}
```

#### Attendance Model
```typescript
interface Attendance {
  id: string;
  eventId: string;
  registrationId: string;
  userId: string;
  sessionId?: string; // If session-specific
  checkInTime: Date;
  checkOutTime?: Date;
  verified: boolean; // Verified against Mumaris Plus
  verificationStatus: 'Valid' | 'Invalid' | 'Pending';
  rejectionReason?: string; // If invalid
  cmeHours: number;
  syncedToMumaris: boolean;
  syncedAt?: Date;
}
```

### Database Schema (PostgreSQL)

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  arabic_name VARCHAR(200),
  avatar_url TEXT,
  classification_number VARCHAR(50),
  specialty VARCHAR(100),
  sub_specialty VARCHAR(100),
  seniority VARCHAR(20),
  mumaris_plus_id VARCHAR(50),
  organization_name VARCHAR(200),
  organization_type VARCHAR(50),
  cpd_provider_id VARCHAR(50),
  company_name VARCHAR(200),
  language VARCHAR(10) DEFAULT 'ar',
  timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES users(id),
  title_ar VARCHAR(500) NOT NULL,
  title_en VARCHAR(500),
  description_ar TEXT,
  description_en TEXT,
  event_type VARCHAR(50) NOT NULL,
  format VARCHAR(20) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  registration_deadline TIMESTAMP,
  venue_name VARCHAR(200),
  venue_address TEXT,
  city VARCHAR(100),
  region VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  virtual_link TEXT,
  accreditation_status VARCHAR(20) DEFAULT 'Draft',
  accreditation_number VARCHAR(100),
  accreditation_date DATE,
  accreditation_expiry DATE,
  scfhs_application_id VARCHAR(100),
  target_audience TEXT[], -- Array of specialties
  total_cme_hours DECIMAL(5, 2) NOT NULL,
  capacity INTEGER NOT NULL,
  current_registrations INTEGER DEFAULT 0,
  registration_fee DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'SAR',
  needs_sponsorship BOOLEAN DEFAULT FALSE,
  is_sponsored BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'Draft',
  featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Registrations Table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'Pending',
  registration_date TIMESTAMP DEFAULT NOW(),
  payment_status VARCHAR(20) DEFAULT 'Pending',
  payment_method VARCHAR(20),
  transaction_id VARCHAR(100),
  ticket_qr_code VARCHAR(255) UNIQUE,
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMP,
  cme_hours_awarded DECIMAL(5, 2),
  certificate_id UUID,
  UNIQUE(event_id, user_id) -- Prevent duplicate registrations
);

-- Certificates Table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES users(id),
  registration_id UUID REFERENCES registrations(id),
  accreditation_number VARCHAR(100) NOT NULL,
  event_title VARCHAR(500) NOT NULL,
  event_date DATE NOT NULL,
  cme_hours DECIMAL(5, 2) NOT NULL,
  specialty VARCHAR(100),
  certificate_number VARCHAR(100) UNIQUE NOT NULL,
  pdf_url TEXT NOT NULL,
  blockchain_hash VARCHAR(255),
  issued_at TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  mumaris_plus_sync_status VARCHAR(20) DEFAULT 'Pending',
  mumaris_plus_sync_date TIMESTAMP
);

-- Indexes
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_users_classification ON users(classification_number);
CREATE INDEX idx_users_specialty ON users(specialty);
```

---

## 5. API Design & Integrations

### Internal API Endpoints

#### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
PUT    /api/auth/profile
```

#### Events
```
GET    /api/events                    # List events (with filters)
GET    /api/events/:id                 # Get event details
POST   /api/events                     # Create event (Organizer)
PUT    /api/events/:id                 # Update event
DELETE /api/events/:id                 # Delete event
POST   /api/events/:id/publish         # Publish event
GET    /api/events/:id/registrations   # Get registrations (Organizer)
GET    /api/events/search              # Advanced search
GET    /api/events/recommendations     # AI recommendations
```

#### Registrations
```
POST   /api/registrations              # Register for event
GET    /api/registrations              # Get user's registrations
GET    /api/registrations/:id          # Get registration details
PUT    /api/registrations/:id/cancel   # Cancel registration
POST   /api/registrations/:id/checkin  # Check-in (QR scan)
```

#### Certificates
```
GET    /api/certificates               # Get user's certificates
GET    /api/certificates/:id           # Get certificate details
GET    /api/certificates/:id/download  # Download PDF
POST   /api/certificates/:id/sync      # Sync to Mumaris Plus
GET    /api/certificates/:id/verify    # Verify blockchain hash
```

#### Sponsorships
```
GET    /api/sponsorships               # List sponsorships
POST   /api/sponsorships                # Create sponsorship
GET    /api/sponsorships/:id            # Get sponsorship details
PUT    /api/sponsorships/:id            # Update sponsorship
POST   /api/sponsorships/:id/approve   # Approve sponsorship
```

#### Accreditation (SCFHS)
```
POST   /api/accreditation/apply        # Submit accreditation application
GET    /api/accreditation/status/:id   # Check application status
GET    /api/accreditation/applications # List applications (Regulator)
PUT    /api/accreditation/:id/review   # Review application
POST   /api/accreditation/:id/approve   # Approve application
POST   /api/accreditation/:id/reject    # Reject application
```

### External API Integrations

#### SCFHS CPD Platform API
```typescript
// Provider Accreditation
POST /scfhs/api/provider/register
GET  /scfhs/api/provider/status/:providerId

// Activity Accreditation
POST /scfhs/api/activity/apply
GET  /scfhs/api/activity/status/:applicationId
PUT  /scfhs/api/activity/update/:applicationId

// CME Hour Registration
POST /scfhs/api/hours/register
GET  /scfhs/api/hours/status/:registrationId
```

#### Mumaris Plus API
```typescript
// Practitioner Verification
GET  /mumaris/api/practitioner/verify/:classificationNumber
GET  /mumaris/api/practitioner/:id/profile

// CME Hour Sync
POST /mumaris/api/hours/sync
GET  /mumaris/api/hours/:userId/balance
GET  /mumaris/api/hours/:userId/history
```

#### Payment Gateways

**SADAD (Government)**
```typescript
POST /sadad/api/payment/initiate
GET  /sadad/api/payment/status/:transactionId
POST /sadad/api/payment/callback
```

**Credit Card (Stripe/Moyasar)**
```typescript
POST /payment/api/charge
GET  /payment/api/transaction/:id
POST /payment/api/webhook
```

#### Notification Services

**Email (SendGrid)**
```typescript
POST /notifications/email/send
POST /notifications/email/template/:templateId
```

**SMS (Twilio/SMS Gateway)**
```typescript
POST /notifications/sms/send
POST /notifications/sms/bulk
```

**Push Notifications (Firebase)**
```typescript
POST /notifications/push/send
POST /notifications/push/topic/:topic
```

#### Blockchain (Certificate Verification)
```typescript
POST /blockchain/certificate/hash
GET  /blockchain/certificate/verify/:hash
```

---

## 6. User Experience Flows

### Flow 1: HCP Discovers and Registers for Event

```
1. HCP logs in → Dashboard shows personalized recommendations
2. Clicks "Browse All Events" → Advanced search page
3. Applies filters (Specialty: Cardiology, Date: Next 3 months, Location: Riyadh)
4. Views event card → Clicks to see details
5. Event details page:
   - Reads description, agenda, speakers
   - Checks reviews from past attendees
   - Verifies SCFHS accreditation badge
   - Sees available spots (45/100 registered)
6. Clicks "Register Now"
7. Registration form (auto-filled from profile):
   - Name, classification number, specialty
   - Payment method selection
   - Terms & conditions acceptance
8. Payment processing (credit card or SADAD)
9. Confirmation:
   - Success message
   - Email confirmation
   - SMS confirmation
   - QR code ticket generated
   - Added to "My Events" calendar
   - Calendar export option
10. Pre-event reminders (7 days, 1 day before)
```

### Flow 2: Organizer Creates and Publishes Event

```
1. Organizer logs in → Dashboard
2. Clicks "Create New Event"
3. Event Creation Wizard:
   
   Step 1: Basic Information
   - Title (Arabic/English)
   - Event type, format, dates, location
   - Expected capacity
   
   Step 2: Accreditation
   - Select "New Accreditation" or "Recurring Event"
   - If recurring: Select previous event to clone
   - If new: Fill SCFHS application form
     - Scientific Committee Chair (verify classification)
     - Learning objectives (SMART template)
     - Target audience (multi-select specialties)
   
   Step 3: Scientific Program
   - Add sessions (title, time, duration, CME hours)
   - Assign speakers
   - Total hours auto-calculated
   
   Step 4: Speakers
   - Add speaker profiles
   - Upload CVs
   - Disclosure forms
   
   Step 5: Marketing
   - Create landing page
   - Set target audience for promotion
   - Preview email campaign
   
   Step 6: Pricing
   - Set registration fee
   - Early bird pricing (optional)
   
   Step 7: Review
   - Review all information
   - Validation checks
   - Submit for SCFHS approval (if new)
   
4. Event saved as "Draft" or "Pending Approval"
5. SCFHS review process (21 days):
   - Status updates via notifications
   - If returned: Review feedback, make changes, resubmit
6. Upon approval:
   - Accreditation certificate received
   - Event status changes to "Published"
   - Auto-promoted to target audience
   - Email campaign sent
7. Registration opens
8. Real-time dashboard shows registrations
```

### Flow 3: Event Day - QR Check-In

```
1. HCP arrives at event venue
2. Opens mobile app → "My Events" → Selects event
3. Shows QR code ticket to organizer
4. Organizer scans QR code with mobile app
5. System verifies:
   - Registration exists
   - Classification number valid
   - Specialty matches target audience
   - No date conflicts with other events
   - Not already checked in
6. If valid:
   - Check-in confirmed (green checkmark)
   - Attendance recorded
   - SMS confirmation to HCP
   - Name added to live attendance list
7. If invalid:
   - Error message displayed
   - Reason shown (e.g., "Specialty mismatch")
   - Organizer can override (with reason logged)
8. Throughout event:
   - Session-specific check-ins (optional)
   - Check-out when leaving (optional)
9. Post-event:
   - Attendance list auto-generated
   - CME hours calculated
   - Certificates auto-generated
   - Hours synced to Mumaris Plus (within 24 hours)
```

### Flow 4: Vendor Sponsors Event

```
1. Vendor logs in → Marketplace
2. Browses events seeking sponsorship
3. Filters by:
   - Specialty (Cardiology)
   - Expected attendance (500+)
   - Date range (Q1 2026)
   - Location (Riyadh)
4. Views event details:
   - Target audience demographics
   - Past event performance (if recurring)
   - Available sponsorship tiers
5. Selects "Gold Sponsorship Package":
   - Benefits listed
   - Pricing: SAR 50,000
   - Availability: 1 slot remaining
6. Clicks "Reserve Sponsorship"
7. Sponsorship request sent to organizer
8. Organizer receives notification
9. Organizer reviews request:
   - Vendor profile
   - Compliance check (editorial independence)
   - Approves or declines
10. If approved:
    - Contract generated
    - Payment link sent to vendor
    - Vendor pays (credit card or bank transfer)
11. Sponsorship activated:
    - Vendor logo on event page
    - Speaking slot assigned
    - Booth space reserved
    - Branded materials included
12. Post-event analytics:
    - Reach metrics
    - Engagement data
    - ROI report
```

### Flow 5: Regulator Reviews Accreditation

```
1. Regulator logs in → Accreditation Queue
2. Views pending applications:
   - Sorted by priority (conferences first)
   - Filter by provider, date, status
3. Selects application to review
4. Review dashboard shows:
   - Application details
   - 20 Standards checklist (for provider)
   - Activity information
   - Documents uploaded
   - Learning objectives
   - Scientific program
5. Regulator reviews:
   - Checks compliance with standards
   - Validates learning objectives (SMART format)
   - Verifies speaker credentials
   - Checks for conflicts (date, specialty)
6. Decision:
   - Approve: Generate accreditation certificate
   - Return for Modification: Add specific feedback
   - Decline: Provide reason
7. Notification sent to organizer
8. If approved:
   - Accreditation number generated
   - Certificate issued
   - Event can be published
9. Compliance monitoring:
   - Track 21-day hour registration deadline
   - Alert if missed
   - Monitor provider performance
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Months 1-6)
**Goal:** MVP with core HCP and Organizer features

**Deliverables:**
- ✅ Authentication & authorization
- ✅ User profiles (HCP, Organizer)
- ✅ Event creation (basic)
- ✅ Event discovery & search (basic filters)
- ✅ Registration flow
- ✅ Payment integration (one gateway)
- ✅ Basic dashboard
- ✅ Email notifications
- ✅ Database setup
- ✅ API structure

**Success Metrics:**
- 1,000 registered HCPs
- 50 registered organizers
- 100 events listed
- 500 registrations

### Phase 2: Enhanced Features (Months 7-12)
**Goal:** Full organizer tools and HCP experience

**Deliverables:**
- ✅ Advanced event creation wizard
- ✅ SCFHS accreditation workflow (manual integration)
- ✅ QR code check-in system
- ✅ Certificate generation
- ✅ CME hour tracking dashboard
- ✅ Mobile web app (responsive)
- ✅ Advanced search & filters
- ✅ Reviews & ratings
- ✅ Sponsorship marketplace (basic)
- ✅ Analytics dashboards

**Success Metrics:**
- 10,000 registered HCPs
- 150 registered organizers
- 500 events listed
- 5,000 registrations
- 1,000 certificates issued

### Phase 3: Integration & Scale (Months 13-18)
**Goal:** Full ecosystem integration

**Deliverables:**
- ✅ SCFHS CPD Platform API integration
- ✅ Mumaris Plus API integration
- ✅ Automated hour syncing
- ✅ Blockchain certificate verification
- ✅ Native mobile apps (iOS/Android)
- ✅ Advanced sponsorship marketplace
- ✅ AI recommendations
- ✅ Real-time notifications (push)
- ✅ Admin portal
- ✅ Compliance monitoring

**Success Metrics:**
- 50,000 registered HCPs
- 200 registered organizers
- 2,000 events listed
- 25,000 registrations
- 10,000 certificates issued
- 50 active sponsors

### Phase 4: Optimization & Growth (Months 19-24)
**Goal:** Scale to market leadership

**Deliverables:**
- ✅ Performance optimization
- ✅ Advanced analytics
- ✅ Machine learning features
- ✅ International CME recognition
- ✅ White-label solutions
- ✅ API for third-party integrations
- ✅ Enterprise features

**Success Metrics:**
- 100,000 registered HCPs (29% of workforce)
- 300 registered organizers (76% of providers)
- 5,000 events listed
- 100,000 registrations
- 50,000 certificates issued
- 100 active sponsors

---

## 8. Technical Stack

### Frontend
- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (Radix UI)
- **State Management:** Zustand (or React Query for server state)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Internationalization:** next-intl

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Next.js API Routes (Phase 1-2), Express.js microservices (Phase 3+)
- **Language:** TypeScript
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Cache:** Redis
- **Queue:** Bull (Redis-based)
- **File Storage:** AWS S3 / DigitalOcean Spaces
- **Search:** PostgreSQL Full-Text Search (Phase 1-2), Elasticsearch (Phase 3+)

### Mobile
- **Framework:** React Native / Expo
- **Navigation:** React Navigation
- **State:** Zustand / Redux Toolkit
- **Camera:** react-native-camera (QR scanning)
- **Push Notifications:** Firebase Cloud Messaging

### Infrastructure
- **Hosting:** Vercel (frontend), Railway / AWS (backend)
- **Database Hosting:** AWS RDS / DigitalOcean Managed Databases
- **CDN:** Cloudflare
- **Monitoring:** Sentry (errors), Vercel Analytics
- **CI/CD:** GitHub Actions
- **Containerization:** Docker (for microservices)

### Third-Party Services
- **Email:** SendGrid / Resend
- **SMS:** Twilio / Saudi SMS Gateway
- **Payments:** Moyasar (SADAD + credit cards) / Stripe
- **Blockchain:** Ethereum / Polygon (for certificates)
- **Analytics:** Google Analytics, Mixpanel
- **Authentication:** NextAuth.js / Auth0

---

## 9. Security & Compliance

### Security Measures
- **Authentication:** JWT tokens with refresh tokens
- **Authorization:** Role-based access control (RBAC)
- **Password:** bcrypt hashing, minimum complexity
- **API Security:** Rate limiting, CORS, input validation
- **Data Encryption:** TLS/SSL for transit, encryption at rest
- **SQL Injection:** Parameterized queries (Prisma)
- **XSS Protection:** React's built-in escaping, Content Security Policy
- **CSRF Protection:** SameSite cookies, CSRF tokens

### Compliance Requirements
- **SCFHS Regulations:** Adhere to CME accreditation standards
- **Data Privacy:** Saudi Personal Data Protection Law (PDPL)
- **Pharmaceutical Compliance:** Editorial independence, transparency reporting
- **Payment Security:** PCI DSS compliance
- **Medical Data:** HIPAA-like standards (if handling patient data)

### Data Residency
- All data stored in Saudi Arabia (compliance with data localization)
- Use Saudi-based cloud providers or on-premise infrastructure

---

## 10. Success Metrics

### Key Performance Indicators (KPIs)

#### User Growth
- **HCP Registrations:** Target 100K by Month 24 (29% of workforce)
- **Organizer Adoption:** Target 300 by Month 24 (76% of providers)
- **Vendor Sign-ups:** Target 100 by Month 24
- **Monthly Active Users (MAU):** Target 30K by Month 24

#### Engagement
- **Event Listings:** Target 5,000 by Month 24
- **Registrations:** Target 100K by Month 24
- **Certificates Issued:** Target 50K by Month 24
- **Average Events per HCP:** Target 3 per year

#### Business Metrics
- **Revenue (Year 3):** Target $9.17M
  - Organizer fees: $1.875M
  - Sponsorship commissions: $6M
  - HCP subscriptions: $495K
  - Other: $800K
- **Customer Acquisition Cost (CAC):**
  - HCP: $5
  - Organizer: $500
  - Vendor: $10,000
- **Lifetime Value (LTV):**
  - HCP Premium: $297
  - Organizer: $10,000
  - Vendor: $150,000

#### Quality Metrics
- **HCP Satisfaction (NPS):** Target 70+
- **Event Rating Average:** Target 4.5/5
- **Certificate Accuracy:** Target 99.9%
- **Hour Sync Success Rate:** Target 95%
- **Platform Uptime:** Target 99.9%

#### Operational Metrics
- **Average Accreditation Time:** Target 7 days (from 30 days)
- **Hour Posting Time:** Target instant (from 20-30 days)
- **Registration Conversion Rate:** Target 15%
- **Check-in Success Rate:** Target 98%

---

## Next Steps

1. **Review & Approve Blueprint** - Stakeholder sign-off
2. **Technical Architecture Deep Dive** - Detailed system design
3. **Database Schema Finalization** - Complete ERD
4. **API Specification** - OpenAPI/Swagger documentation
5. **UI/UX Design** - Figma mockups for all flows
6. **Development Sprint Planning** - Break down Phase 1 into sprints
7. **Team Assembly** - Hire/assign developers, designers, QA
8. **Infrastructure Setup** - Dev, staging, production environments
9. **Kickoff** - Begin Phase 1 development

---

**Document Status:** Draft v1.0  
**Last Updated:** 2025  
**Next Review:** After stakeholder feedback

