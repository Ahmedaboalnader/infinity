import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, MessageCircle, X, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';
import { Logo } from '@/components/effects/Logo';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { getSiteSettings } from '@/services/settings';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import type { SiteSettings } from '@/types/database';

export function Layout() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [menu, setMenu] = useState(false);
  const isAr = i18n.language.startsWith('ar');

  useEffect(() => { getSiteSettings().then(setSettings); }, []);

  const links = [
    ['/', 'nav.home'], ['/services', 'nav.services'], ['/work', 'nav.work'], ['/about', 'nav.about'], ['/contact', 'nav.contact'],
  ];

  return <div className="min-h-screen bg-bg text-text">
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link to="/" aria-label="Home"><Logo /></Link>
        <div className="hidden items-center gap-7 lg:flex">
          {links.map(([to, label]) => <NavLink key={to} to={to} className={({isActive}) => `text-sm transition ${isActive ? 'text-text' : 'text-text-muted hover:text-text'}`}>{t(label)}</NavLink>)}
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 rounded-full border border-border px-3 text-xs font-bold" onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')} aria-label="Toggle language">{isAr ? 'EN' : 'AR'}</button>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-border" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}</button>
          {user ? <button onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')} className="hidden rounded-full bg-text px-4 py-2.5 text-sm font-semibold text-bg md:block">{t('nav.dashboard')}</button> : <button onClick={() => navigate('/login')} className="hidden rounded-full bg-text px-4 py-2.5 text-sm font-semibold text-bg md:block">{t('nav.login')}</button>}
          <button className="grid h-10 w-10 place-items-center rounded-full border border-border lg:hidden" onClick={() => setMenu(true)} aria-label="Menu"><Menu size={18}/></button>
        </div>
      </nav>
    </header>

    <Dialog.Root open={menu} onOpenChange={setMenu}>
      <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"/><Dialog.Content className="fixed inset-y-0 start-0 z-50 w-[min(88vw,380px)] border-e border-border bg-bg p-6">
        <div className="flex items-center justify-between"><Logo/><Dialog.Close asChild><button aria-label="Close"><X/></button></Dialog.Close></div>
        <div className="mt-10 space-y-2">{links.map(([to,label]) => <Dialog.Close asChild key={to}><Link to={to} className="flex items-center justify-between rounded-xl px-4 py-3 text-text-muted hover:bg-surface"><span>{t(label)}</span><ChevronRight size={16} className="rtl:rotate-180"/></Link></Dialog.Close>)}</div>
      </Dialog.Content></Dialog.Portal>
    </Dialog.Root>

    <main className="pt-20"><Outlet/></main>
    {settings && <a href={getWhatsAppUrl(settings.whatsapp)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="fixed bottom-5 end-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-105"><MessageCircle/></a>}
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:flex-row md:justify-between md:px-8">
        <div className="max-w-sm"><Logo/><p className="mt-4 text-sm leading-7 text-text-muted">{isAr ? settings?.about_ar : settings?.about_en}</p></div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-text-muted">{links.map(([to,label]) => <Link key={to} to={to} className="hover:text-text">{t(label)}</Link>)}</div>
      </div>
      <div className="border-t border-border px-5 py-5 text-center text-xs text-text-muted">© {new Date().getFullYear()} Infinity</div>
    </footer>
  </div>;
}
