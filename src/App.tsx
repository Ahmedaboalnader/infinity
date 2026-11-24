import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Code2,
  Instagram,
  Linkedin,
  Menu,
  MessageCircle,
  Moon,
  Palette,
  PenTool,
  Smartphone,
  Sun,
  X,
} from 'lucide-react';

const categories = [
  { icon: PenTool, key: 'ui-ux-design', en: 'UI/UX Design', ar: 'تصميم واجهات وتجربة المستخدم' },
  { icon: Code2, key: 'web-development', en: 'Web Development', ar: 'تطوير المواقع والمنتجات' },
  { icon: Smartphone, key: 'mobile-apps', en: 'Mobile Apps', ar: 'تطبيقات الموبايل' },
  { icon: Palette, key: 'graphic-branding', en: 'Brand & Visual Identity', ar: 'الهوية والتصميم البصري' },
];

const talents = [
  { nameEn: 'Nour El-Din', nameAr: 'نور الدين', roleEn: 'Product Designer', roleAr: 'مصمم منتجات', initials: 'NE', color: 'from-zinc-600 to-zinc-950' },
  { nameEn: 'Maya Hassan', nameAr: 'مايا حسن', roleEn: 'Full-Stack Engineer', roleAr: 'مهندسة برمجيات', initials: 'MH', color: 'from-slate-500 to-slate-950' },
  { nameEn: 'Omar Salem', nameAr: 'عمر سالم', roleEn: 'Brand Strategist', roleAr: 'استراتيجي العلامات', initials: 'OS', color: 'from-neutral-400 to-neutral-900' },
];

export default function App() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const isArabic = i18n.language?.startsWith('ar');
  const toggleLanguage = () => i18n.changeLanguage(isArabic ? 'en' : 'ar');
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <button onClick={() => scrollTo('home')} className="flex items-center gap-3" aria-label="Home">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-lg font-bold">∞</span>
            <span className="font-heading text-xl font-bold tracking-tight">INFINITY</span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {[['home', 'nav.home'], ['services', 'nav.services'], ['work', 'nav.work'], ['about', 'nav.about']].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-sm text-text-muted transition hover:text-text">{t(label)}</button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleLanguage} className="h-10 rounded-full border border-border px-3 text-xs font-bold uppercase transition hover:bg-surface-2">
              {isArabic ? 'EN' : 'AR'}
            </button>
            <button onClick={() => setDark((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full border border-border transition hover:bg-surface-2" aria-label="Toggle theme">
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button onClick={() => scrollTo('contact')} className="hidden rounded-full bg-text px-5 py-2.5 text-sm font-semibold text-bg transition hover:opacity-85 md:block">
              {t('nav.contact')}
            </button>
            <button onClick={() => setMenuOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden" aria-label="Menu">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="border-t border-border bg-bg px-5 py-5 md:hidden">
            {[['home', 'nav.home'], ['services', 'nav.services'], ['work', 'nav.work'], ['about', 'nav.about'], ['contact', 'nav.contact']].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full py-3 text-start text-text-muted">{t(label)}</button>
            ))}
          </div>
        )}
      </header>

      <main>
        <section id="home" className="relative flex min-h-[760px] items-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-infinity-pattern" />
          <div className="absolute -start-32 top-32 h-80 w-80 rounded-full bg-white/[0.035] blur-3xl" />
          <div className="relative mx-auto w-full max-w-7xl px-5 py-24 md:px-8">
            <div className="max-w-4xl">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
                {t('hero.badge')}
              </div>
              <h1 className="text-shimmer max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-[82px]">
                {t('hero.title')}
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-text-muted md:text-xl">
                {t('hero.subtitle')}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <button onClick={() => scrollTo('services')} className="flex items-center gap-2 rounded-full bg-text px-6 py-3.5 text-sm font-bold text-bg transition hover:gap-4">
                  {t('hero.cta_explore')} <ArrowRight size={17} className="rtl:rotate-180" />
                </button>
                <button onClick={() => scrollTo('contact')} className="rounded-full border border-border bg-surface/50 px-6 py-3.5 text-sm font-bold transition hover:bg-surface-2">
                  {t('hero.cta_contact')}
                </button>
              </div>
            </div>

            <div className="mt-20 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
              {[["40+", 'home.stats.members'], ["120+", 'home.stats.projects'], ["8", 'home.stats.categories'], ["98%", 'home.stats.satisfaction']].map(([value, label]) => (
                <div key={label} className="bg-bg/95 px-5 py-5">
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="mt-1 text-xs text-text-muted">{t(label)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="border-t border-border py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-12 max-w-xl">
              <p className="mb-3 text-xs font-bold tracking-[0.18em] text-text-muted">{t('nav.services').toUpperCase()}</p>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">{t('home.categories_title')}</h2>
              <p className="mt-4 leading-7 text-text-muted">{t('home.categories_subtitle')}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <article key={category.key} className="glass-card group min-h-64 rounded-2xl p-6 transition duration-300 hover:-translate-y-1">
                    <div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-surface"><Icon size={21} /></div>
                    <h3 className="mt-16 text-xl font-bold">{isArabic ? category.ar : category.en}</h3>
                    <button onClick={() => scrollTo('contact')} className="mt-5 flex items-center gap-2 text-sm text-text-muted transition group-hover:text-text">
                      {t('hero.cta_contact')} <ArrowRight size={14} className="rtl:rotate-180" />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="work" className="border-t border-border bg-surface/30 py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-xl">
                <p className="mb-3 text-xs font-bold tracking-[0.18em] text-text-muted">{t('nav.work').toUpperCase()}</p>
                <h2 className="text-4xl font-bold tracking-tight md:text-5xl">{t('home.members_title')}</h2>
              </div>
              <p className="max-w-md leading-7 text-text-muted">{t('home.members_subtitle')}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {talents.map((talent, index) => (
                <article key={talent.initials} className="group overflow-hidden rounded-2xl border border-border bg-surface">
                  <div className={`relative h-72 overflow-hidden bg-gradient-to-br ${talent.color}`}>
                    <div className="absolute inset-0 bg-infinity-pattern opacity-50" />
                    <span className="absolute inset-0 grid place-items-center text-7xl font-bold text-white/10">{talent.initials}</span>
                    <span className="absolute bottom-4 end-4 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-white backdrop-blur-md">0{index + 1}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{isArabic ? talent.nameAr : talent.nameEn}</h3>
                    <p className="mt-1 text-sm text-text-muted">{isArabic ? talent.roleAr : talent.roleEn}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="border-t border-border py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.18em] text-text-muted">{t('nav.about').toUpperCase()}</p>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">{t('about.title')}</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-text-muted">{isArabic ? 'إنفينيتي تجمع مستقلين يقدّمون جودة عالمية عبر تعاون مباشر ومرن.' : 'Infinity brings together independent specialists who deliver world-class work through direct, flexible collaboration.'}</p>
            </div>
            <div className="grid gap-4">
              {[['val1_title', 'val1_desc'], ['val2_title', 'val2_desc'], ['val3_title', 'val3_desc']].map(([title, description], index) => (
                <div key={title} className="flex gap-5 rounded-2xl border border-border bg-surface/40 p-5">
                  <span className="text-sm font-bold text-text-muted">0{index + 1}</span>
                  <div><h3 className="font-bold">{t(`about.${title}`)}</h3><p className="mt-2 text-sm leading-6 text-text-muted">{t(`about.${description}`)}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="border-t border-border py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-16 text-center md:px-12 md:py-20">
              <div className="absolute inset-0 bg-infinity-pattern opacity-50" />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-4xl font-bold tracking-tight md:text-5xl">{t('home.cta.title')}</h2>
                <p className="mx-auto mt-5 max-w-xl leading-7 text-text-muted">{t('home.cta.subtitle')}</p>
                <a href="mailto:contact@infinity-talent.com" className="mt-8 inline-flex items-center gap-2 rounded-full bg-text px-7 py-3.5 text-sm font-bold text-bg">
                  <MessageCircle size={17} /> {t('home.cta.button')}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 text-sm text-text-muted md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} Infinity Collective</p>
          <div className="flex items-center gap-4"><a href="#" aria-label="LinkedIn" className="transition hover:text-text"><Linkedin size={18} /></a><a href="#" aria-label="Instagram" className="transition hover:text-text"><Instagram size={18} /></a></div>
        </div>
      </footer>
    </div>
  );
}
