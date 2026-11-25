import { supabase, isSupabaseConfigured } from './supabase';
import { MOCK_CATEGORIES, MOCK_MEMBERS } from '@/data/mock';
import { Category } from '@/types/database';

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) return data;
  }

  // Demo mode with calculated member counts
  return MOCK_CATEGORIES.map((cat) => {
    const count = MOCK_MEMBERS.filter(
      (m) => m.is_published && m.categories?.some((c) => c.id === cat.id || c.slug === cat.slug)
    ).length;
    return { ...cat, members_count: count };
  });
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    if (data) return data;
  }
  return MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
}

export async function upsertCategory(category: Partial<Category>): Promise<Category> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('categories')
      .upsert(category)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Demo fallback
  const existingIndex = MOCK_CATEGORIES.findIndex((c) => c.id === category.id);
  const updated: Category = {
    id: category.id || `c-${Date.now()}`,
    slug: category.slug || 'new-category',
    name_en: category.name_en || 'New Category',
    name_ar: category.name_ar || 'قسم جديد',
    description_en: category.description_en || '',
    description_ar: category.description_ar || '',
    icon: category.icon || 'PenTool',
    sort_order: category.sort_order || MOCK_CATEGORIES.length + 1,
    is_active: category.is_active ?? true,
  };

  if (existingIndex >= 0) {
    MOCK_CATEGORIES[existingIndex] = updated;
  } else {
    MOCK_CATEGORIES.push(updated);
  }
  return updated;
}

export async function deleteCategory(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('categories').delete().eq('id', id);
    return;
  }
  const idx = MOCK_CATEGORIES.findIndex((c) => c.id === id);
  if (idx >= 0) MOCK_CATEGORIES.splice(idx, 1);
}
