import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Event = {
  id: string;
  title_np: string;
  title_en: string | null;
  description_np: string | null;
  description_en: string | null;
  event_date: string;
  event_time: string | null;
  location_np: string | null;
  location_en: string | null;
  poster_url: string | null;
  category: string;
  is_featured: boolean;
  status: string;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  album_id: string | null;
  caption_np: string | null;
  caption_en: string | null;
  image_url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  display_order: number;
  created_at: string;
  
  // For UI convenience when joining with albums
  title_np?: string;
  category?: string;
};

export type Album = {
  id: string;
  title_np: string;
  title_en: string | null;
  description_np: string | null;
  cover_image_url: string | null;
  photos_count: number;
  created_at: string;
};

export interface WebsiteSettings {
  id: string;
  site_name_np: string;
  site_name_en: string;
  site_tagline_np: string;
  site_tagline_en: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  show_dark_mode_toggle: boolean;
  default_dark_mode: boolean;
  maintenance_mode: boolean;
  google_analytics_id: string;
  home_hero_bg: string;
  home_about_img: string;
  about_hero_bg: string;
  about_heritage_img: string;
  gallery_hero_bg: string;
};

export type Notice = {
  id: string;
  title_np: string;
  title_en: string | null;
  content_np: string;
  content_en: string | null;
  priority: string;
  is_active: boolean;
  publish_date: string;
  expiry_date: string | null;
  created_at: string;
};
