import { useTranslation } from 'react-i18next';

export function useDirection() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language.startsWith('ar');
  return {
    dir: isRTL ? 'rtl' : 'ltr',
    isRTL,
    side: isRTL ? 'left' : 'right',
  };
}
