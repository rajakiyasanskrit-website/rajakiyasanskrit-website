-- CMS Database Schema for Gurukul Website
-- All collections needed for content management

-- Homepage Settings
CREATE TABLE homepage_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title_np TEXT NOT NULL DEFAULT 'उज्ज्वल भविष्यका लागि प्राचीन गुरुकुल शिक्षा',
  hero_title_en TEXT DEFAULT 'Ancient Gurukul Education for a Bright Future',
  hero_subtitle_np TEXT,
  hero_subtitle_en TEXT,
  hero_image_url TEXT,
  hero_show_admission_cta BOOLEAN DEFAULT true,
  principal_name_np TEXT,
  principal_name_en TEXT,
  principal_message_np TEXT,
  principal_message_en TEXT,
  principal_image_url TEXT,
  about_title_np TEXT,
  about_content_np TEXT,
  about_image_url TEXT,
  welcome_title_np TEXT,
  welcome_content_np TEXT,
  footer_quote TEXT DEFAULT 'सा विद्या या विमुक्तये',
  footer_address_np TEXT DEFAULT 'मटिहानी नगरपालिका–७, मधेश प्रदेश',
  contact_phone TEXT DEFAULT '९८४४०३१६२४',
  contact_email TEXT,
  social_facebook TEXT,
  social_youtube TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO homepage_settings (hero_subtitle_np, hero_subtitle_en) VALUES 
('वि.सं. १७७५ सालमा स्थापित, ३०८ वर्ष पुरानो राजकीय संस्कृत गुरुकुल — मधेश प्रदेशको गौरव।', 'Established in 1775 BS, 308 years old Royal Sanskrit Gurukul - Pride of Madhesh Province.');

-- Notices Table (Enhanced)
CREATE TABLE cms_notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_np TEXT NOT NULL,
  title_en TEXT,
  content_np TEXT NOT NULL,
  content_en TEXT,
  slug TEXT UNIQUE,
  category TEXT DEFAULT 'general',
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_pinned BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  publish_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  pdf_url TEXT,
  thumbnail_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Events Table (Enhanced)
CREATE TABLE cms_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_np TEXT NOT NULL,
  title_en TEXT,
  description_np TEXT,
  description_en TEXT,
  slug TEXT UNIQUE,
  event_date DATE NOT NULL,
  event_time TIME,
  end_date DATE,
  end_time TIME,
  location_np TEXT,
  location_en TEXT,
  venue TEXT,
  category TEXT DEFAULT 'ceremony' CHECK (category IN ('ceremony', 'academic', 'festival', 'workshop', 'sports', 'other')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
  is_featured BOOLEAN DEFAULT false,
  poster_url TEXT,
  registration_required BOOLEAN DEFAULT false,
  registration_link TEXT,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Event Images Gallery
CREATE TABLE cms_event_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES cms_events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption_np TEXT,
  caption_en TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Albums
CREATE TABLE cms_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_np TEXT NOT NULL,
  title_en TEXT,
  description_np TEXT,
  description_en TEXT,
  slug TEXT UNIQUE,
  cover_image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  event_date DATE,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  photos_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Gallery Images
CREATE TABLE cms_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES cms_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption_np TEXT,
  caption_en TEXT,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos
CREATE TABLE cms_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_np TEXT NOT NULL,
  title_en TEXT,
  description_np TEXT,
  description_en TEXT,
  video_type TEXT DEFAULT 'youtube' CHECK (video_type IN ('youtube', 'vimeo', 'upload')),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'general',
  is_featured BOOLEAN DEFAULT false,
  duration_seconds INTEGER,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Downloads
CREATE TABLE cms_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_np TEXT NOT NULL,
  title_en TEXT,
  description_np TEXT,
  description_en TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  category TEXT DEFAULT 'general' CHECK (category IN ('admission', 'prospectus', 'brochure', 'syllabus', 'form', 'other')),
  download_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Faculty
CREATE TABLE cms_faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_np TEXT NOT NULL,
  name_en TEXT,
  designation_np TEXT NOT NULL,
  designation_en TEXT,
  qualification_np TEXT,
  qualification_en TEXT,
  bio_np TEXT,
  bio_en TEXT,
  photo_url TEXT,
  department TEXT DEFAULT 'general',
  email TEXT,
  phone TEXT,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Contact Messages
CREATE TABLE cms_contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  replied BOOLEAN DEFAULT false,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log
CREATE TABLE cms_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  resource_title TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Website Settings
CREATE TABLE website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name_np TEXT DEFAULT 'राजकीय संस्कृत गुरुकुल मटिहानी',
  site_name_en TEXT DEFAULT 'Royal Sanskrit Gurukul Matihani',
  site_tagline_np TEXT,
  site_tagline_en TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#ff7a11',
  secondary_color TEXT DEFAULT '#c12727',
  show_dark_mode_toggle BOOLEAN DEFAULT true,
  default_dark_mode BOOLEAN DEFAULT false,
  maintenance_mode BOOLEAN DEFAULT false,
  google_analytics_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default website settings
INSERT INTO website_settings DEFAULT VALUES;

-- Admin Sessions (for tracking)
CREATE TABLE cms_admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  login_at TIMESTAMPTZ DEFAULT NOW(),
  logout_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on all CMS tables
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_event_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_admin_sessions ENABLE ROW LEVEL SECURITY;