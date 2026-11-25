import { useTranslation } from 'react-i18next';
import { getLocalized } from '@/lib/utils';

export function useLocalized() {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const isRTL = lang === 'ar';

  const formatText = <T extends Record<string, any>>(obj: T | null | undefined, field: string): string => {
    return getLocalized(obj, field, lang);
  };

  return {
    lang,
    isRTL,
    formatText,
    changeLanguage: (newLang: string) => i18n.changeLanguage(newLang),
  };
}
