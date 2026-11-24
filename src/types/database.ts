export type UserRole = 'admin' | 'member';
export type RequestStatus = 'new' | 'in_progress' | 'done';

export interface SocialLinks {
  behance?: string;
  dribbble?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
  twitter?: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  slug: string;
  full_name_en: string;
  full_name_ar: string;
  title_en: string;
  title_ar: string;
  bio_en: string;
  bio_ar: string;
  avatar_url: string;
  cover_url: string;
  whatsapp: string;
  email: string;
  location_en: string;
  location_ar: string;
  years_experience: number;
  skills: string[];
  socials: SocialLinks;
  is_available: boolean;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  categories?: Category[];
  projects?: Project[];
}

export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  members_count?: number;
}

export interface MemberCategory {
  member_id: string;
  category_id: string;
}

export interface Project {
  id: string;
  member_id: string;
  category_id: string | null;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  cover_url: string;
  images: string[];
  tags: string[];
  live_url: string;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  member?: Profile;
  category?: Category;
}

export interface ServiceRequest {
  id: string;
  member_id: string | null;
  category_id: string | null;
  client_name: string;
  client_email: string;
  client_phone: string;
  budget: string;
  message: string;
  status: RequestStatus;
  created_at: string;
  member?: Profile;
  category?: Category;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  hero_title_en: string;
  hero_title_ar: string;
  hero_subtitle_en: string;
  hero_subtitle_ar: string;
  about_en: string;
  about_ar: string;
  whatsapp: string;
  email: string;
  socials: SocialLinks;
  logo_url: string;
}
