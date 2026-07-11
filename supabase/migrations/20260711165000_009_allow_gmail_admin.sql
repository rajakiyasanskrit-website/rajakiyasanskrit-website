-- Allow rajakiyasanskrit@gmail.com as admin in RLS policies

-- homepage_settings
DROP POLICY IF EXISTS "homepage_all_admin" ON homepage_settings;
CREATE POLICY "homepage_all_admin" ON homepage_settings
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com');

-- cms_notices
DROP POLICY IF EXISTS "cms_notices_select_admin" ON cms_notices;
CREATE POLICY "cms_notices_select_admin" ON cms_notices
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com');

DROP POLICY IF EXISTS "cms_notices_all_admin" ON cms_notices;
CREATE POLICY "cms_notices_all_admin" ON cms_notices
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com');

-- cms_events
DROP POLICY IF EXISTS "cms_events_select_admin" ON cms_events;
CREATE POLICY "cms_events_select_admin" ON cms_events
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com');

DROP POLICY IF EXISTS "cms_events_all_admin" ON cms_events;
CREATE POLICY "cms_events_all_admin" ON cms_events
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com');

-- cms_event_images
DROP POLICY IF EXISTS "cms_event_images_all_admin" ON cms_event_images;
CREATE POLICY "cms_event_images_all_admin" ON cms_event_images
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com');

-- cms_albums
DROP POLICY IF EXISTS "cms_albums_select_admin" ON cms_albums;
CREATE POLICY "cms_albums_select_admin" ON cms_albums
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com');

DROP POLICY IF EXISTS "cms_albums_all_admin" ON cms_albums;
CREATE POLICY "cms_albums_all_admin" ON cms_albums
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com');

-- cms_photos
DROP POLICY IF EXISTS "cms_photos_select_admin" ON cms_photos;
CREATE POLICY "cms_photos_select_admin" ON cms_photos
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com');

DROP POLICY IF EXISTS "cms_photos_all_admin" ON cms_photos;
CREATE POLICY "cms_photos_all_admin" ON cms_photos
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com');

-- cms_videos
DROP POLICY IF EXISTS "cms_videos_select_admin" ON cms_videos;
CREATE POLICY "cms_videos_select_admin" ON cms_videos
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com');

DROP POLICY IF EXISTS "cms_videos_all_admin" ON cms_videos;
CREATE POLICY "cms_videos_all_admin" ON cms_videos
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' LIKE '%@gurukul.edu.np' OR auth.jwt() ->> 'email' = 'rajakiyasanskrit@gmail.com');

-- For simplicity, let's also just ensure anyone authenticated can insert for now if we want to be safe, but let's stick to the specific emails.

