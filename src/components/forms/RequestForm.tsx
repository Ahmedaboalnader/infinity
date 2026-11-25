import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { type ServiceRequestFormData } from '@/lib/validators';
import { submitServiceRequest } from '@/services/requests';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import type { Category, Profile } from '@/types/database';

export function RequestForm({ categories, member, siteWhatsapp }: { categories: Category[]; member?: Profile; siteWhatsapp?: string }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const [submitted, setSubmitted] = useState(false);
  const [waUrl, setWaUrl] = useState('');
  const { register, handleSubmit, formState:{errors,isSubmitting}, reset } = useForm<ServiceRequestFormData>({defaultValues:{member_id:member?.id || null, category_id:member?.categories?.[0]?.id || null, honeypot:''}});
  const onSubmit = async (data: ServiceRequestFormData) => {
    const last = Number(localStorage.getItem('infinity_request_time') || 0);
    if (Date.now() - last < 30000) throw new Error(t('form.rate_limited'));
    await submitServiceRequest(data);
    localStorage.setItem('infinity_request_time', String(Date.now()));
    setWaUrl(getWhatsAppUrl(member?.whatsapp || siteWhatsapp || '201000000000',{name:member ? (lang==='ar'?member.full_name_ar:member.full_name_en):undefined,lang,customMessage:data.message}));
    setSubmitted(true); reset({honeypot:''});
  };
  if (submitted) return <div className="rounded-2xl border border-status-available/30 bg-status-available/5 p-7 text-center"><CheckCircle2 className="mx-auto text-status-available"/><h3 className="mt-3 text-xl font-bold">{t('form.success_title')}</h3><p className="mt-2 text-sm text-text-muted">{t('form.success_msg')}</p>{waUrl && <a href={waUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white"><MessageCircle size={16}/>{t('form.also_whatsapp')}</a>}</div>;
  return <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
    <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register('honeypot')}/>
    <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm">{t('form.name')}<input required className="rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:ring-2 focus:ring-text/20" placeholder={t('form.name_placeholder')} {...register('client_name')}/>{errors.client_name && <span className="text-xs text-red-500">{errors.client_name.message}</span>}</label><label className="grid gap-2 text-sm">{t('form.email')}<input required type="email" className="rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:ring-2 focus:ring-text/20" placeholder={t('form.email_placeholder')} {...register('client_email')}/>{errors.client_email && <span className="text-xs text-red-500">{errors.client_email.message}</span>}</label></div>
    <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm">{t('form.phone')}<input className="rounded-xl border border-border bg-surface px-4 py-3 outline-none" placeholder={t('form.phone_placeholder')} {...register('client_phone')}/></label><label className="grid gap-2 text-sm">{t('form.budget')}<select className="rounded-xl border border-border bg-surface px-4 py-3" {...register('budget')}><option value="">{t('form.select_budget')}</option><option>Under $500</option><option>$500 - $1,500</option><option>$1,500 - $5,000</option><option>$5,000+</option></select></label></div>
    <label className="grid gap-2 text-sm">{t('form.service')}<select className="rounded-xl border border-border bg-surface px-4 py-3" {...register('category_id')}><option value="">{t('form.select_service')}</option>{categories.map(c => <option key={c.id} value={c.id}>{lang==='ar'?c.name_ar:c.name_en}</option>)}</select></label>
    <label className="grid gap-2 text-sm">{t('form.message')}<textarea required rows={5} className="rounded-xl border border-border bg-surface px-4 py-3 outline-none" placeholder={t('form.message_placeholder')} {...register('message')}/>{errors.message && <span className="text-xs text-red-500">{errors.message.message}</span>}</label>
    <button disabled={isSubmitting} className="rounded-xl bg-text px-5 py-3.5 text-sm font-bold text-bg disabled:opacity-50">{isSubmitting?t('form.submitting'):t('form.submit')}</button>
  </form>;
}
