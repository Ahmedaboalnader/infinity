import { supabase, isSupabaseConfigured } from './supabase';
import { MOCK_MEMBERS } from '@/data/mock';
import { Profile } from '@/types/database';

const MOCK_AUTH_STORAGE_KEY = 'infinity_demo_user';

export async function getCurrentUser(): Promise<Profile | null> {
  if (isSupabaseConfigured && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    return profile || null;
  }

  // Demo fallback
  const stored = localStorage.getItem(MOCK_AUTH_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

export async function signInWithEmail(email: string, password: string): Promise<Profile> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    if (!profile) throw new Error('Profile not found');
    return profile;
  }

  // Demo Mode sign-in logic
  const matched = MOCK_MEMBERS.find((m) => m.email.toLowerCase() === email.toLowerCase()) || {
    ...MOCK_MEMBERS[1],
    email,
    full_name_en: email.split('@')[0],
  };
  localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(matched));
  return matched;
}

export async function signUpWithEmail(email: string, password: string, fullName: string): Promise<Profile> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
    if (!data.user) throw new Error('Signup failed');

    // Wait briefly for trigger to create profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    return profile || {
      id: data.user.id,
      role: 'member',
      slug: email.split('@')[0],
      full_name_en: fullName,
      full_name_ar: fullName,
      title_en: 'Talent Member',
      title_ar: 'عضو مبدع',
      bio_en: '',
      bio_ar: '',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      cover_url: '',
      whatsapp: '',
      email,
      location_en: '',
      location_ar: '',
      years_experience: 0,
      skills: [],
      socials: {},
      is_available: true,
      is_published: false,
      is_featured: false,
      sort_order: 0,
    };
  }

  // Demo Mode signup logic
  const newMember: Profile = {
    id: `m-demo-${Date.now()}`,
    role: 'member',
    slug: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-'),
    full_name_en: fullName,
    full_name_ar: fullName,
    title_en: 'New Freelancer',
    title_ar: 'عضو جديد',
    bio_en: 'Welcome to my portfolio.',
    bio_ar: 'أهلاً بك في ملفي الشخصي.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    cover_url: '',
    whatsapp: '201000000000',
    email,
    location_en: 'Global',
    location_ar: 'عالمي',
    years_experience: 1,
    skills: ['React', 'Design'],
    socials: {},
    is_available: true,
    is_published: false, // Starts pending
    is_featured: false,
    sort_order: 99,
  };
  localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(newMember));
  return newMember;
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
}
