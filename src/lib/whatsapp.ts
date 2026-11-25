/**
 * Generates direct wa.me link with encoded text message.
 */
export function getWhatsAppUrl(
  phone: string,
  options?: {
    name?: string;
    categoryName?: string;
    lang?: string;
    customMessage?: string;
  }
): string {
  // Clean phone string to contain digits only
  const cleanPhone = (phone || '201000000000').replace(/[^\d]/g, '');
  const lang = options?.lang || 'en';

  if (options?.customMessage) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(options.customMessage)}`;
  }

  let text = '';
  if (lang === 'ar') {
    text = `مرحباً${options?.name ? ` ${options.name}` : ''}، شاهدت ملفك على منصة Infinity وأود الاستفسار عن خدمات${options?.categoryName ? ` ${options.categoryName}` : ''}.`;
  } else {
    text = `Hello${options?.name ? ` ${options.name}` : ''}, I found you on Infinity and I'd like to ask about ${options?.categoryName ? options.categoryName : 'your services'}.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
