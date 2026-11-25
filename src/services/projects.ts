import { supabase, isSupabaseConfigured } from './supabase';
import { MOCK_PROJECTS, MOCK_MEMBERS, MOCK_CATEGORIES } from '@/data/mock';
import { Project } from '@/types/database';

export async function getProjects(options?: {
  categorySlug?: string;
  memberId?: string;
  featuredOnly?: boolean;
  search?: string;
}): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('projects').select('*, member:profiles(*), category:categories(*)');

    if (options?.memberId) {
      query = query.eq('member_id', options.memberId);
    }
    if (options?.featuredOnly) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query.order('sort_order', { ascending: true });
    if (!error && data) {
      let result: Project[] = data;

      if (options?.categorySlug) {
        result = result.filter((p) => p.category?.slug === options.categorySlug);
      }
      if (options?.search) {
        const q = options.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.title_en?.toLowerCase().includes(q) ||
            p.title_ar?.toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      return result;
    }
  }

  // Demo fallback
  let list = [...MOCK_PROJECTS];

  if (options?.memberId) {
    list = list.filter((p) => p.member_id === options.memberId);
  }
  if (options?.featuredOnly) {
    list = list.filter((p) => p.is_featured);
  }
  if (options?.categorySlug) {
    list = list.filter((p) => p.category?.slug === options.categorySlug);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title_en?.toLowerCase().includes(q) ||
        p.title_ar?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  return list;
}

export async function upsertProject(project: Partial<Project>): Promise<Project> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .upsert(project)
      .select('*, member:profiles(*), category:categories(*)')
      .single();
    if (error) throw error;
    return data;
  }

  // Demo fallback
  const existingIdx = MOCK_PROJECTS.findIndex((p) => p.id === project.id);
  const member = MOCK_MEMBERS.find((m) => m.id === project.member_id) || MOCK_MEMBERS[0];
  const category = MOCK_CATEGORIES.find((c) => c.id === project.category_id) || MOCK_CATEGORIES[0];

  const updated: Project = {
    id: project.id || `p-${Date.now()}`,
    member_id: project.member_id || member.id,
    category_id: project.category_id || category.id,
    title_en: project.title_en || 'New Project',
    title_ar: project.title_ar || 'مشروع جديد',
    description_en: project.description_en || '',
    description_ar: project.description_ar || '',
    cover_url: project.cover_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    images: project.images || [],
    tags: project.tags || [],
    live_url: project.live_url || '',
    is_featured: project.is_featured ?? false,
    sort_order: project.sort_order || MOCK_PROJECTS.length + 1,
    member,
    category,
  };

  if (existingIdx >= 0) {
    MOCK_PROJECTS[existingIdx] = updated;
  } else {
    MOCK_PROJECTS.push(updated);
  }
  return updated;
}

export async function deleteProject(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('projects').delete().eq('id', id);
    return;
  }
  const idx = MOCK_PROJECTS.findIndex((p) => p.id === id);
  if (idx >= 0) MOCK_PROJECTS.splice(idx, 1);
}
