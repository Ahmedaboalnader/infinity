import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Profile } from '@/types/database';
import { getLocalized } from '@/lib/utils';
import { GlassCard } from '@/components/effects/GlassCard';

export function AvailabilityBadge({ available }: { available: boolean }) {
  const { t } = useTranslation();
  return <span className={`inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs ${available ? 'text-status-available' : 'text-status-busy'}`}><span className="h-2 w-2 rounded-full bg-current"/>{t(available ? 'status.available' : 'status.busy')}</span>;
}

export function MemberCard({ member, onOpen }: { member: Profile; onOpen: () => void }) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const name = getLocalized(member, 'full_name', lang);
  const title = getLocalized(member, 'title', lang);
  const location = getLocalized(member, 'location', lang);
  return <GlassCard onClick={onOpen} className="group p-0">
    <div className="relative aspect-[4/3] overflow-hidden"><img src={member.avatar_url} alt={name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent"/><div className="absolute bottom-4 start-4 end-4 flex items-end justify-between"><AvailabilityBadge available={member.is_available}/></div></div>
    <div className="p-5"><h3 className="text-lg font-bold">{name}</h3><p className="mt-1 text-sm text-text-muted">{title}</p><p className="mt-3 flex items-center gap-1.5 text-xs text-text-muted"><MapPin size={13}/>{location}</p><div className="mt-4 flex flex-wrap gap-2">{member.skills.slice(0,3).map(skill => <span key={skill} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs">{skill}</span>)}</div></div>
  </GlassCard>;
}
