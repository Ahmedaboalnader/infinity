import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Project } from '@/types/database';
import { getLocalized } from '@/lib/utils';
import { GlassCard } from '@/components/effects/GlassCard';

export function ProjectCard({ project }: { project: Project }) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('ar')?'ar':'en';
  const title=getLocalized(project,'title',lang); const desc=getLocalized(project,'description',lang);
  const [open,setOpen]=useState(false);
  return <><GlassCard onClick={()=>setOpen(true)} className="group p-0"><div className="aspect-[4/3] overflow-hidden"><img src={project.cover_url} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/></div><div className="p-5"><h3 className="font-bold">{title}</h3><p className="mt-2 line-clamp-2 text-sm text-text-muted">{desc}</p><div className="mt-4 flex flex-wrap gap-2">{project.tags.slice(0,3).map(tag=><span key={tag} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs">{tag}</span>)}</div></div></GlassCard>
  <Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"/><Dialog.Content className="fixed inset-5 z-50 m-auto max-h-[90vh] max-w-5xl overflow-y-auto rounded-2xl border border-border bg-bg p-4 sm:p-6"><div className="flex items-center justify-between"><Dialog.Title className="text-xl font-bold">{title}</Dialog.Title><Dialog.Close asChild><button className="grid h-10 w-10 place-items-center rounded-full border border-border"><X/></button></Dialog.Close></div><img src={project.cover_url} alt={title} className="mt-5 max-h-[55vh] w-full rounded-xl object-cover"/><p className="mt-5 leading-7 text-text-muted">{desc}</p>{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-text px-5 py-3 text-sm font-bold text-bg"><ExternalLink size={16}/>Visit live</a>}</Dialog.Content></Dialog.Portal></Dialog.Root></>;
}
