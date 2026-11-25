import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, PenTool } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getCategories } from '@/services/categories';
import { getMembers, getMemberBySlug } from '@/services/members';
import { getProjects } from '@/services/projects';
import { getSiteSettings } from '@/services/settings';
import type { Category, Profile, Project, SiteSettings } from '@/types/database';
import { getLocalized } from '@/lib/utils';
import { MemberCard } from '@/components/members/MemberCard';
import { MemberDrawer } from '@/components/members/MemberDrawer';
import { ProjectCard } from '@/components/projects/ProjectCard';

export default function Home() {
  const { t,i18n }=useTranslation(); const lang=i18n.language.startsWith('ar')?'ar':'en';
  const [categories,setCategories]=useState<Category[]>([]); const [members,setMembers]=useState<Profile[]>([]); const [projects,setProjects]=useState<Project[]>([]); const [settings,setSettings]=useState<SiteSettings|null>(null);
  const [params,setParams]=useSearchParams(); const [drawer,setDrawer]=useState<Profile|null>(null);
  useEffect(()=>{Promise.all([getCategories(),getMembers({featuredOnly:true}),getProjects({featuredOnly:true}),getSiteSettings()]).then(([c,m,p,s])=>{setCategories(c.filter(x=>x.is_active));setMembers(m);setProjects(p);setSettings(s);});},[]);
  useEffect(()=>{const slug=params.get('member');if(slug)getMemberBySlug(slug).then(setDrawer)},[params]);
  const close=()=>{setDrawer(null);const p=new URLSearchParams(params);p.delete('member');setParams(p);};
  const open=(member:Profile)=>{setDrawer(member);const p=new URLSearchParams(params);p.set('member',member.slug);setParams(p)};
  const hero=settings?getLocalized(settings,'hero_title',lang):t('hero.title'); const sub=settings?getLocalized(settings,'hero_subtitle',lang):t('hero.subtitle');
  return <><Helmet><title>{settings?.site_name||'Infinity'} — {hero}</title><meta name="description" content={sub}/></Helmet>
    <section className="relative min-h-[680px] overflow-hidden"><div className="absolute -start-32 top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl"/><div className="absolute inset-0 bg-infinity-pattern opacity-60"/><div className="relative mx-auto flex max-w-7xl items-center px-5 py-24 md:px-8 md:py-36"><div className="max-w-4xl"><motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}><span className="rounded-full border border-border bg-surface/60 px-4 py-2 text-xs font-bold tracking-widest text-text-muted">COLLECTIVE TALENT PLATFORM</span><h1 className="text-shimmer mt-8 text-5xl font-bold leading-[1.02] md:text-[82px]">{hero}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-text-muted">{sub}</p><div className="mt-9 flex flex-wrap gap-3"><Link to="/services" className="flex items-center gap-2 rounded-full bg-text px-6 py-3.5 text-sm font-bold text-bg">{t('hero.cta_explore')}<ArrowRight size={17} className="rtl:rotate-180"/></Link><Link to="/contact" className="rounded-full border border-border bg-surface/60 px-6 py-3.5 text-sm font-bold">{t('hero.cta_contact')}</Link></div></motion.div></div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8"><div className="mb-10"><p className="text-xs font-bold tracking-widest text-text-muted">{t('nav.services').toUpperCase()}</p><h2 className="mt-3 text-4xl font-bold">{t('home.categories_title')}</h2></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{categories.slice(0,8).map((c)=>{const names=lang==='ar'?c.name_ar:c.name_en;return <Link key={c.id} to={`/services/${c.slug}`} className="glass-card min-h-52 rounded-2xl p-6 transition hover:-translate-y-1"><div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-surface"><PenTool size={20}/></div><h3 className="mt-14 font-bold">{names}</h3><p className="mt-2 text-sm text-text-muted">{c.members_count||1} {t('services.members_count',{count:c.members_count||1})}</p></Link>})}</div></section>
    <section className="border-y border-border bg-surface/30 py-20"><div className="mx-auto max-w-7xl px-5 md:px-8"><h2 className="text-4xl font-bold">{t('home.members_title')}</h2><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{members.slice(0,6).map(m=><MemberCard key={m.id} member={m} onOpen={()=>open(m)}/>)}</div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8"><h2 className="text-4xl font-bold">{t('home.projects_title')}</h2><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{projects.slice(0,6).map(p=><ProjectCard key={p.id} project={p}/>)}</div></section>
    <section className="border-t border-border py-20"><div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-3 md:px-8">{[1,2,3].map(n=><div key={n} className="glass-card rounded-2xl p-6"><span className="text-xs text-text-muted">0{n}</span><h3 className="mt-6 text-xl font-bold">{t(`home.how_it_works.step${n}_title`)}</h3><p className="mt-3 text-sm leading-7 text-text-muted">{t(`home.how_it_works.step${n}_desc`)}</p></div>)}</div></section>
    <section className="px-5 pb-20 md:px-8"><div className="mx-auto max-w-7xl rounded-3xl border border-border bg-surface px-6 py-16 text-center"><h2 className="text-4xl font-bold">{t('home.cta.title')}</h2><p className="mt-4 text-text-muted">{t('home.cta.subtitle')}</p><Link to="/contact" className="mt-7 inline-block rounded-full bg-text px-7 py-3.5 text-sm font-bold text-bg">{t('home.cta.button')}</Link></div></section>
    <MemberDrawer member={drawer} open={Boolean(drawer)} onClose={close}/>
  </>;
}
