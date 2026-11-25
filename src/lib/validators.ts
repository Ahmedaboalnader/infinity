import { z } from 'zod';

export const serviceRequestSchema = z.object({
  client_name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  client_email: z.string().email({ message: 'Invalid email address' }),
  client_phone: z.string().optional(),
  category_id: z.string().optional().nullable(),
  member_id: z.string().optional().nullable(),
  budget: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
  honeypot: z.string().max(0, { message: 'Bot detected' }),
});

export type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;

export const profileSchema = z.object({
  full_name_en: z.string().min(2),
  full_name_ar: z.string().min(2),
  title_en: z.string().min(2),
  title_ar: z.string().min(2),
  bio_en: z.string().optional(),
  bio_ar: z.string().optional(),
  avatar_url: z.string().optional(),
  cover_url: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email(),
  location_en: z.string().optional(),
  location_ar: z.string().optional(),
  years_experience: z.number().min(0),
  skills: z.array(z.string()),
  socials: z.object({
    behance: z.string().optional(),
    dribbble: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
    website: z.string().optional(),
  }),
  is_available: z.boolean(),
  category_ids: z.array(z.string()),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const projectSchema = z.object({
  title_en: z.string().min(2),
  title_ar: z.string().min(2),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  category_id: z.string().nullable().optional(),
  cover_url: z.string().min(1, { message: 'Cover image is required' }),
  images: z.array(z.string()),
  tags: z.array(z.string()),
  live_url: z.string().optional(),
  is_featured: z.boolean(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  full_name: z.string().optional(),
});

export type AuthFormData = z.infer<typeof authSchema>;
