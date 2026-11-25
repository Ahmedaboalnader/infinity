import { supabase, isSupabaseConfigured } from './supabase';
import { MOCK_MEMBERS, MOCK_PROJECTS } from '@/data/mock';
import { Profile } from '@/types/database';

export async function getMembers(options?: {
  categorySlug?: string;
  featuredOnly?: boolean;
  includeUnpublished?: boolean;
  search?: string;
}): Promise<Profile[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('profiles').select('*, projects(*), member_categories(categories(*))');

    if (!options?.includeUnpublished) {
      query = query.eq('is_published', true);
    }
    if (options?.featuredOnly) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query.order('sort_order', { ascending: true });
    if (!error && data) {
      let result: Profile[] = data.map((item: any) => ({
        ...item,
        categories: item.member_categories?.map((mc: any) => mc.categories).filter(Boolean) || [],
      }));

      if (options?.categorySlug) {
        result = result.filter((m) =>
          m.categories?.some((c) => c.slug === options.categorySlug)
        );
      }
      if (options?.search) {
        const q = options.search.toLowerCase();
        result = result.filter(
          (m) =>
            m.full_name_en?.toLowerCase().includes(q) ||
            m.full_name_ar?.toLowerCase().includes(q) ||
            m.title_en?.toLowerCase().includes(q) ||
            m.skills?.some((s) => s.toLowerCase().includes(q))
        );
      }
      return result;
    }
  }

  // Demo fallback
  let list = [...MOCK_MEMBERS];

  if (!options?.includeUnpublished) {
    list = list.filter((m) => m.is_published);
  }
  if (options?.featuredOnly) {
    list = list.filter((m) => m.is_featured);
  }
  if (options?.categorySlug) {
    list = list.filter((m) =>
      m.categories?.some((c) => c.slug === options.categorySlug)
    );
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (m) =>
        m.full_name_en?.toLowerCase().includes(q) ||
        m.full_name_ar?.toLowerCase().includes(q) ||
        m.title_en?.toLowerCase().includes(q) ||
        m.skills?.some((s) => s.toLowerCase().includes(q))
    );
  }

  // Attach projects to mock members
  return list.map((m) => ({
    ...m,
    projects: MOCK_PROJECTS.filter((p) => p.member_id === m.id),
  }));
}

export async function getMemberBySlug(slug: string): Promise<Profile | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from('profiles')
      .select('*, projects(*), member_categories(categories(*))')
      .eq('slug', slug)
      .single();

    if (data) {
      return {
        ...data,
        categories: data.member_categories?.map((mc: any) => mc.categories).filter(Boolean) || [],
      };
    }
  }

  const found = MOCK_MEMBERS.find((m) => m.slug === slug);
  if (!found) return null;
  return {
    ...found,
    projects: MOCK_PROJECTS.filter((p) => p.member_id === found.id),
  };
}

export async function updateProfile(
  id: string,
  data: Partial<Profile>,
  categoryIds?: string[]
): Promise<Profile> {
  if (isSupabaseConfigured && supabase) {
    const { data: updated, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (categoryIds) {
      // Refresh member_categories
      await supabase.from('member_categories').delete().eq('member_id', id);
      if (categoryIds.length > 0) {
        await supabase.from('member_categories').insert(
          categoryIds.map((catId) => ({ member_id: id, category_id: catId }))
        );
      }
    }
    return updated;
  }

  // Demo fallback
  const idx = MOCK_MEMBERS.findIndex((m) => m.id === id);
  if (idx >= 0) {
    MOCK_MEMBERS[idx] = { ...MOCK_MEMBERS[idx], ...data };
    return MOCK_MEMBERS[idx];
  }
  throw new Error('Member not found');
}

export async function toggleMemberPublish(id: string, isPublished: boolean): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('profiles').update({ is_published: isPublished }).eq('id', id);
    return;
  }
  const member = MOCK_MEMBERS.find((m) => m.id === id);
  if (member) member.is_published = isPublished;
}

export async function toggleMemberFeatured(id: string, isFeatured: boolean): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('profiles').update({ is_featured: isFeatured }).eq('id', id);
    return;
  }
  const member = MOCK_MEMBERS.find((m) => m.id === id);
  if (member) member.is_featured = isFeatured;
}

export async function updateMemberRole(id: string, role: 'admin' | 'member'): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('profiles').update({ role }).eq('id', id);
    return;
  }
  const member = MOCK_MEMBERS.find((m) => m.id === id);
  if (member) member.role = role;
}

export async function deleteMember(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('profiles').delete().eq('id', id);
    return;
  }
  const idx = MOCK_MEMBERS.findIndex((m) => m.id === id);
  if (idx >= 0) MOCK_MEMBERS.splice(idx, 1);
}
