import * as Dialog from '@radix-ui/react-dialog';
import { X, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Profile } from '@/types/database';
import { getLocalized } from '@/lib/utils';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { AvailabilityBadge } from './MemberCard';

export function MemberDrawer({ member, open, onClose }: { member: Profile | null; open: boolean; onClose: () => void }) {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language.startsWith('ar') ? 'ar' : 'en';
  if (!member) return null;
  const name = getLocalized(member, 'full_name', lang);
  const title = getLocalized(member, 'title', lang);
  const bio = getLocalized(member, 'bio', lang);
  return <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}><Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"/>
    <Dialog.Content className={`fixed inset-y-0 z-50 w-full max-w-[480px] overflow-y-auto border-border bg-bg p-5 shadow-2xl sm:p-7 ${lang === 'ar' ? 'start-0 border-e' : 'end-0 border-s'}`}>
      <div className="flex items-center justify-between"><Dialog.Title className="text-sm font-bold text-text-muted">{name}</Dialog.Title><Dialog.Close asChild><button className="grid h-10 w-10 place-items-center rounded-full border border-border" aria-label="Close"><X size={18}/></button></Dialog.Close></div>
      <div className="mt-6"><img src={member.avatar_url} alt={name} className="h-32 w-32 rounded-2xl object-cover"/><h2 className="mt-5 text-3xl font-bold">{name}</h2><p className="mt-1 text-text-muted">{title}</p><div className="mt-4"><AvailabilityBadge available={member.is_available}/></div></div>
      <p className="mt-6 leading-7 text-text-muted">{bio}</p>
      <div className="mt-6"><h3 className="mb-3 font-bold">{t('drawer.top_skills')}</h3><div className="flex flex-wrap gap-2">{member.skills.slice(0,6).map(s => <span key={s} className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm">{s}</span>)}</div></div>
      {member.projects && member.projects.length > 0 && <div className="mt-7"><h3 className="mb-3 font-bold">{t('drawer.latest_work')}</h3><div className="grid grid-cols-2 gap-3">{member.projects.slice(0,4).map(p => <img key={p.id} src={p.cover_url} alt={getLocalized(p,'title',lang)} className="aspect-[4/3] w-full rounded-xl object-cover"/>)}</div></div>}
      <div className="mt-8 grid gap-3 sm:grid-cols-2"><a href={getWhatsAppUrl(member.whatsapp,{name,lang})} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white"><MessageCircle size={17}/>{t('drawer.whatsapp_chat')}</a><button onClick={() => {onClose(); navigate(`/members/${member.slug}?request=1`)}} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-bold">{t('drawer.send_request')}</button></div>
      <button onClick={() => {onClose(); navigate(`/members/${member.slug}`)}} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-text px-4 py-3 text-sm font-bold text-bg">{t('drawer.view_full_profile')}<ArrowRight size={16} className="rtl:rotate-180"/></button>
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}
