import ar from './ar.json';
import en from './en.json';

export type Locale = 'ar' | 'en';

export const locales = {
  ar,
  en,
} as const;

export type LocaleKeys = keyof typeof ar;

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = locales[locale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k as keyof typeof value];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}

export function getNestedTranslation(locale: Locale, ...keys: string[]): any {
  let value: any = locales[locale];
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key as keyof typeof value];
    } else {
      return undefined;
    }
  }
  
  return value;
}

