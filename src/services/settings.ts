import { supabase, isSupabaseConfigured } from './supabase';
import { MOCK_SITE_SETTINGS } from '@/data/mock';
import { SiteSettings } from '@/types/database';

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (!error && data) return data;
  }
  return MOCK_SITE_SETTINGS;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('site_settings')
      .update(settings)
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Demo fallback
  Object.assign(MOCK_SITE_SETTINGS, settings);
  return MOCK_SITE_SETTINGS;
}
