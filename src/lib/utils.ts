import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns localized string property based on language (en/ar) with fallback.
 */
export function getLocalized<T extends Record<string, any>>(
  obj: T | null | undefined,
  field: string,
  lang: string
): string {
  if (!obj) return '';
  const currentKey = `${field}_${lang}`;
  const fallbackKey = field === 'name' || field === 'title' || field === 'bio' || field === 'description' || field === 'location' || field === 'hero_title' || field === 'hero_subtitle' || field === 'about'
    ? `${field}_${lang === 'ar' ? 'en' : 'ar'}`
    : field;

  if (obj[currentKey]) return String(obj[currentKey]);
  if (obj[fallbackKey]) return String(obj[fallbackKey]);
  if (obj[field]) return String(obj[field]);
  return '';
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatDate(dateString: string, lang: string = 'en'): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}
