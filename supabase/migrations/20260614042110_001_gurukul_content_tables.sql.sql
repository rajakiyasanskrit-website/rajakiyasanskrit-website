-- Events table for gurukul events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_np TEXT NOT NULL,
  title_en TEXT,
  description_np TEXT,
  description_en TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'ceremony',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery table for photos
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_np TEXT NOT NULL,
  title_en TEXT,
  description_np TEXT,
  description_en TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  event_id UUID REFERENCES events(id),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notices table for notice board
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_np TEXT NOT NULL,
  title_en TEXT,
  content_np TEXT NOT NULL,
  content_en TEXT,
  priority TEXT DEFAULT 'normal',
  is_active BOOLEAN DEFAULT true,
  publish_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events (public read)
CREATE POLICY "events_select_public" ON events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "events_all_authenticated" ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for gallery (public read)
CREATE POLICY "gallery_select_public" ON gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "gallery_all_authenticated" ON gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for notices (public read, but only active ones)
CREATE POLICY "notices_select_public" ON notices FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "notices_all_authenticated" ON notices FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert sample events
INSERT INTO events (title_np, title_en, description_np, description_en, event_date, event_time, location, category, is_featured) VALUES
('गुरु पूर्णिमा', 'Guru Pournima', 'गुरु वन्दना तथा विशेष पूजा', 'Special Guru Worship Ceremony', '2026-07-21', '09:00', 'गुरुकुल मन्दिर प्राङ्गण', 'ceremony', true),
('विद्यारम्भ समारोह', 'Vidyarambh Ceremony', 'नयाँ विद्यार्थी स्वागत समारोह', 'New Student Welcome Ceremony', '2026-07-15', '10:00', 'गुरुकुल हल', 'ceremony', true),
('संस्कृत सप्ताह', 'Sanskrit Week', 'संस्कृत भाषा प्रवर्द्धन सप्ताह', 'Sanskrit Language Promotion Week', '2026-08-01', NULL, 'गुरुकुल परिसर', 'academic', true),
('शारदीय नवरात्रि', 'Sharadiya Navratri', 'नौ दिने दुर्गा पूजा उत्सव', 'Nine-day Durga Puja Festival', '2026-09-26', '06:00', 'दुर्गा मन्दिर', 'ceremony', true);

-- Insert sample notices
INSERT INTO notices (title_np, title_en, content_np, content_en, priority, is_active) VALUES
('भर्ना सूचना', 'Admission Notice', 'कक्षा ८ र ९ मा भर्ना प्रक्रिया सुरु भएको छ। अन्तिम मिति: आश्विन ३० गते।', 'Admission process for Class 8 and 9 has started. Last date: Ashwin 30.', 'high', true),
('विशेष अवकाश', 'Special Holiday', 'दशैंको अवसरमा गुरुकुलमा आश्विन १५ देखि कार्तिक ५ गते सम्म अवकाश रहनेछ।', 'The Gurukul will remain closed from Ashwin 15 to Kartik 5 for Dashain.', 'normal', true),
('परीक्षा सम्बन्धी सूचना', 'Examination Notice', 'त्रैमासिक परीक्षा कार्तिक २० गतेबाट सुरु हुनेछ। कृपया तयारी गर्नुहोस्।', 'Quarterly examination will start from Kartik 20. Please prepare accordingly.', 'normal', true),
('सम्पर्क अपडेट', 'Contact Update', 'नयाँ सम्पर्क नम्बर: ९८४४०३१६२४ (ईश्वरीप्रसाद पौडेल)', 'New contact number: 9844031624 (Ishwori Prasad Poudel)', 'normal', true);

-- Insert sample gallery items
INSERT INTO gallery (title_np, title_en, description_np, image_url, category, is_featured) VALUES
('गुरुकुल मन्दिर', 'Gurukul Temple', 'प्राचीन गुरुकुल मन्दिरको सौन्दर्य', 'https://images.pexels.com/photos/2382306/pexels-photo-2382306.jpeg?auto=compress&cs=tinysrgb&w=800', 'temple', true),
('विद्यार्थीहरू', 'Students', 'संस्कृत अध्ययनरत विद्यार्थीहरू', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=800', 'students', true),
('होम कुण्ड', 'Homa Kund', 'वैदिक यज्ञ समारोह', 'https://images.pexels.com/photos/789555/pexels-photo-789555.jpeg?auto=compress&cs=tinysrgb&w=800', 'ceremony', true),
('गुरु आशीर्वाद', 'Guru Blessings', 'गुरुद्वारा विद्यार्थीलाई आशीर्वाद', 'https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg?auto=compress&cs=tinysrgb&w=800', 'ceremony', true);