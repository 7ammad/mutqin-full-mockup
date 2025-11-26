import { z } from 'zod';

export enum Persona {
  HCP = 'HCP',
  Organizer = 'ORGANIZER',
  EventManager = 'EVENT_MANAGER',
  Sponsor = 'SPONSOR',
  Regulator = 'REGULATOR',
}

export interface RoleInfo {
  id: Persona;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  route: string;
}

// Common validation patterns
const phoneRegex = /^(\+966|0)?5\d{8}$/; // Saudi phone number
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// HCP Registration Form Schema
export const hcpRegistrationSchema = z.object({
  fullName: z.string().min(2, 'registration.validation.required'),
  email: z.string().email('registration.validation.email').regex(emailRegex, 'registration.validation.email'),
  phone: z.string().regex(phoneRegex, 'registration.validation.phone'),
  password: z.string().min(8, 'registration.validation.passwordMin'),
  confirmPassword: z.string(),
  specialty: z.string().min(1, 'registration.validation.required'),
  scfhsNumber: z.string().optional(),
  organization: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'registration.validation.passwordMatch',
  path: ['confirmPassword'],
});

export type HCPRegistrationForm = z.infer<typeof hcpRegistrationSchema>;

// Organizer Registration Form Schema
export const organizerRegistrationSchema = z.object({
  organizationName: z.string().min(2, 'registration.validation.required'),
  contactPersonName: z.string().min(2, 'registration.validation.required'),
  email: z.string().email('registration.validation.email').regex(emailRegex, 'registration.validation.email'),
  phone: z.string().regex(phoneRegex, 'registration.validation.phone'),
  password: z.string().min(8, 'registration.validation.passwordMin'),
  confirmPassword: z.string(),
  organizationType: z.string().min(1, 'registration.validation.required'),
  scfhsProviderId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'registration.validation.passwordMatch',
  path: ['confirmPassword'],
});

export type OrganizerRegistrationForm = z.infer<typeof organizerRegistrationSchema>;

// Event Manager Registration Form Schema
export const eventManagerRegistrationSchema = z.object({
  fullName: z.string().min(2, 'registration.validation.required'),
  email: z.string().email('registration.validation.email').regex(emailRegex, 'registration.validation.email'),
  phone: z.string().regex(phoneRegex, 'registration.validation.phone'),
  password: z.string().min(8, 'registration.validation.passwordMin'),
  confirmPassword: z.string(),
  associatedOrganization: z.string().min(2, 'registration.validation.required'),
  role: z.string().min(2, 'registration.validation.required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'registration.validation.passwordMatch',
  path: ['confirmPassword'],
});

export type EventManagerRegistrationForm = z.infer<typeof eventManagerRegistrationSchema>;

// Sponsor Registration Form Schema
export const sponsorRegistrationSchema = z.object({
  companyName: z.string().min(2, 'registration.validation.required'),
  contactPersonName: z.string().min(2, 'registration.validation.required'),
  email: z.string().email('registration.validation.email').regex(emailRegex, 'registration.validation.email'),
  phone: z.string().regex(phoneRegex, 'registration.validation.phone'),
  password: z.string().min(8, 'registration.validation.passwordMin'),
  confirmPassword: z.string(),
  industry: z.string().min(1, 'registration.validation.required'),
  sponsorshipInterest: z.string().min(2, 'registration.validation.required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'registration.validation.passwordMatch',
  path: ['confirmPassword'],
});

export type SponsorRegistrationForm = z.infer<typeof sponsorRegistrationSchema>;

// Regulator Registration Form Schema
export const regulatorRegistrationSchema = z.object({
  organizationName: z.string().min(2, 'registration.validation.required'),
  contactPersonName: z.string().min(2, 'registration.validation.required'),
  officialEmail: z.string().email('registration.validation.email').regex(emailRegex, 'registration.validation.email'),
  phone: z.string().regex(phoneRegex, 'registration.validation.phone'),
  password: z.string().min(8, 'registration.validation.passwordMin'),
  confirmPassword: z.string(),
  roleTitle: z.string().min(2, 'registration.validation.required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'registration.validation.passwordMatch',
  path: ['confirmPassword'],
});

export type RegulatorRegistrationForm = z.infer<typeof regulatorRegistrationSchema>;

// Specialty options for HCP
export const specialties = [
  'Cardiology',
  'Pediatrics',
  'General Surgery',
  'Family Medicine',
  'Emergency Medicine',
  'Internal Medicine',
  'Orthopedics',
  'Dermatology',
  'Ophthalmology',
  'Neurology',
  'Psychiatry',
  'Radiology',
  'Anesthesiology',
  'Obstetrics & Gynecology',
  'Urology',
  'Other',
];

// Organization types for Organizer
export const organizationTypes = [
  'Hospital',
  'Medical Center',
  'University',
  'Professional Association',
  'Private Clinic',
  'Government Institution',
  'Other',
];

// Industries for Sponsor
export const industries = [
  'Pharmaceutical',
  'Medical Devices',
  'Healthcare Technology',
  'Healthcare Services',
  'Education',
  'Other',
];
