-- ========================================================
-- INFINITY - SUPABASE SEED DATA
-- ========================================================

-- Insert Initial Categories
insert into public.categories (id, slug, name_en, name_ar, description_en, description_ar, icon, sort_order, is_active)
values
  ('c1000000-0000-0000-0000-000000000001', 'ui-ux-design', 'UI/UX Design', 'تصميم واجهات وتجربة المستخدم', 'User research, wireframing, high-fidelity UI design, and interactive prototyping.', 'أبحاث المستخدم، التخطيط السلكي، تصميم الواجهات عالي الدقة، والأنظمة التفاعلية.', 'PenTool', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'web-development', 'Web Development', 'تطوير المواقع', 'Full-stack web applications, React, Next.js, performance optimization, and APIs.', 'تطبيقات ويب متكاملة، ريأكت، تحسين الأداء، وربط الواجهات البرمجية.', 'Code2', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'mobile-apps', 'Mobile Apps', 'تطبيقات الموبايل', 'Native and cross-platform iOS and Android mobile app development with Flutter & React Native.', 'تطوير تطبيقات الموبايل لنظامي iOS وأندرويد باستخدام فلاتر وريأكت نيتف.', 'Smartphone', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'devops-cloud', 'DevOps & Cloud', 'ديف أوبس والسحابة', 'Cloud infrastructure setup, CI/CD pipelines, Docker, Kubernetes, and AWS management.', 'بناء البنية التحتية السحابية، أنابيب الإطلاق التلقائي، وإدارة السيرفرات.', 'Server', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'digital-marketing', 'Digital Marketing', 'التسويق الرقمي', 'Growth hacking, paid ads campaign management, SEO strategies, and conversion rate optimization.', 'إدارة الحملات الإعلانية المدفوعة، استراتيجيات النمو، وتحسين معدلات التحويل.', 'Megaphone', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'graphic-branding', 'Graphic Design & Branding', 'التصميم الجرافيكي والهوية البصرية', 'Visual brand identity system design, typography, brand guidelines, and collateral.', 'بناء الهوية البصرية الشاملة، الشعارات، ودليل إرشادات العلامات التجارية.', 'Palette', 6, true),
  ('c1000000-0000-0000-0000-000000000007', 'video-motion', 'Video Editing & Motion', 'المونتاج والموشن جرافيك', '2D/3D motion graphics animation, promotional video editing, and sound design.', 'رسوم متحركة موشن جرافيك 2D/3D، مونتاج الفيديو الإعلاني، وهندسة الصوت.', 'Clapperboard', 7, true),
  ('c1000000-0000-0000-0000-000000000008', 'content-seo', 'Content Writing & SEO', 'كتابة المحتوى وتحسين محركات البحث', 'Copywriting, technical SEO, content strategy, and multilingual blog posts.', 'صياغة المحتوى التسويقي، تحسين محركات البحث، واستراتيجيات المقالات.', 'FileText', 8, true)
on conflict (id) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  description_en = excluded.description_en,
  description_ar = excluded.description_ar,
  icon = excluded.icon;

-- Insert Site Settings
insert into public.site_settings (id, site_name, hero_title_en, hero_title_ar, hero_subtitle_en, hero_subtitle_ar, about_en, about_ar, whatsapp, email, socials)
values (
  1,
  'Infinity',
  'Infinity — Endless talent, one place',
  'إنفينيتي — مواهب بلا حدود في مكان واحد',
  'An elite collective of independent designers, developers, and creative strategists delivering world-class digital products.',
  'نخبة من المصممين والمطورين واستراتيجي التسويق المستقلين يقدّمون تجارب ومنتجات رقمية فاخرة.',
  'Infinity is a curated collective of top-tier freelancers collaborating under a single unified brand. We eliminate middle-man agency overhead while delivering agency-level craftsmanship and dedication.',
  'إنفينيتي هي تجمع إبداعي من نخبة الفريلانسرز المحترفين يعملون معاً تحت مظلة علامة واحدة، لنقدم أعلى مستويات الجودة البرمجية والتصميمية بمرونة وسرعة فائقة.',
  '201000000000',
  'contact@infinity-talent.com',
  '{"github": "https://github.com", "linkedin": "https://linkedin.com", "twitter": "https://twitter.com", "instagram": "https://instagram.com"}'::jsonb
)
on conflict (id) do update set
  site_name = excluded.site_name,
  hero_title_en = excluded.hero_title_en,
  hero_title_ar = excluded.hero_title_ar;
