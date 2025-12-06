import type { Locale } from '@/locales';
import { getTranslation } from '@/locales';

/**
 * Get the translated label for a specialty code.
 * Falls back to the code itself if translation is not found.
 * 
 * @param code - Specialty code (e.g., 'cardiology', 'emergency_medicine')
 * @param locale - Current locale ('en' | 'ar')
 * @returns Translated specialty label
 */
// Map common specialty display names to translation keys
const specialtyKeyMap: Record<string, string> = {
  'Cardiology': 'cardiology',
  'Pediatrics': 'pediatrics',
  'Emergency Medicine': 'emergency_medicine',
  'Family Medicine': 'family_medicine',
  'General Surgery': 'general_surgery',
  'Anesthesiology': 'anesthesiology',
  'Pharmacy': 'pharmacy',
  'Radiology': 'radiology',
  'Nursing': 'nursing',
  'Oncology': 'oncology',
  'Psychiatry': 'psychiatry',
  'Orthopedics': 'orthopedics',
  'Dermatology': 'dermatology',
  'Endocrinology': 'endocrinology',
  'Gastroenterology': 'gastroenterology',
  'Urology': 'urology',
  'Ophthalmology': 'ophthalmology',
  'Rheumatology': 'rheumatology',
  'Pulmonology': 'pulmonology',
  'Nephrology': 'nephrology',
  'Hematology': 'hematology',
  'Infectious Diseases': 'infectious_diseases',
  'Internal Medicine': 'internal_medicine',
  'Obstetrics': 'obstetrics',
  'Gynecology': 'gynecology',
  'ENT': 'ent',
  'Plastic Surgery': 'plastic_surgery',
  'Neurology': 'neurology',
};

export function getSpecialtyLabel(code: string, locale: Locale): string {
  if (!code) return code;
  
  // Normalize the code: first check if it's a known display name, then lowercase and replace spaces with underscores
  let normalizedCode = specialtyKeyMap[code];
  
  if (!normalizedCode) {
    // Try lowercase with underscores
    normalizedCode = code.toLowerCase().replace(/\s+/g, '_');
  }
  
  // Try to get translation from locale files using the specialty key
  const key = `specialties.${normalizedCode}`;
  const translation = getTranslation(locale, key);
  
  // If translation found (not the key itself), return it
  if (translation !== key) {
    return translation;
  }
  
  // Fallback: return the original code (should not happen once all specialties are in locale files)
  return code;
}
