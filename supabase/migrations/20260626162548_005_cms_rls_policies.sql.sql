-- RLS Policies for CMS Tables

-- Homepage Settings: Public read, admin write
CREATE POLICY "homepage_select_public" ON homepage_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "homepage_all_admin" ON homepage_settings
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'))
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

-- CMS Notices: Public reads published, admin manages all
CREATE POLICY "cms_notices_select_public" ON cms_notices
  FOR SELECT TO anon USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "cms_notices_select_admin" ON cms_notices
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

CREATE POLICY "cms_notices_all_admin" ON cms_notices
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'))
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

-- CMS Events: Public reads published, admin manages all
CREATE POLICY "cms_events_select_public" ON cms_events
  FOR SELECT TO anon USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "cms_events_select_admin" ON cms_events
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

CREATE POLICY "cms_events_all_admin" ON cms_events
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'))
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

-- Event Images
CREATE POLICY "cms_event_images_select_public" ON cms_event_images
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "cms_event_images_all_admin" ON cms_event_images
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'))
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

-- CMS Albums: Public reads published, admin manages all
CREATE POLICY "cms_albums_select_public" ON cms_albums
  FOR SELECT TO anon USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "cms_albums_select_admin" ON cms_albums
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

CREATE POLICY "cms_albums_all_admin" ON cms_albums
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'))
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

-- CMS Photos: Public read through published albums
CREATE POLICY "cms_photos_select_public" ON cms_photos
  FOR SELECT TO anon USING (EXISTS (SELECT 1 FROM cms_albums WHERE cms_albums.id = cms_photos.album_id AND cms_albums.status = 'published' AND cms_albums.deleted_at IS NULL));

CREATE POLICY "cms_photos_select_admin" ON cms_photos
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

CREATE POLICY "cms_photos_all_admin" ON cms_photos
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'))
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

-- CMS Videos: Public reads published, admin manages all
CREATE POLICY "cms_videos_select_public" ON cms_videos
  FOR SELECT TO anon USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "cms_videos_select_admin" ON cms_videos
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

CREATE POLICY "cms_videos_all_admin" ON cms_videos
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'))
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

-- CMS Downloads: Public reads published, admin manages all
CREATE POLICY "cms_downloads_select_public" ON cms_downloads
  FOR SELECT TO anon USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "cms_downloads_select_admin" ON cms_downloads
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

CREATE POLICY "cms_downloads_all_admin" ON cms_downloads
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'))
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

-- CMS Faculty: Public reads published, admin manages all
CREATE POLICY "cms_faculty_select_public" ON cms_faculty
  FOR SELECT TO anon USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "cms_faculty_select_admin" ON cms_faculty
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

CREATE POLICY "cms_faculty_all_admin" ON cms_faculty
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'))
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

-- Contact Messages: Only admin can read/manage
CREATE POLICY "cms_contact_messages_select_admin" ON cms_contact_messages
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

CREATE POLICY "cms_contact_messages_insert_public" ON cms_contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "cms_contact_messages_update_admin" ON cms_contact_messages
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'))
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

CREATE POLICY "cms_contact_messages_delete_admin" ON cms_contact_messages
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

-- Activity Log: Only admin can read, system can insert
CREATE POLICY "cms_activity_log_select_admin" ON cms_activity_log
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

CREATE POLICY "cms_activity_log_insert_admin" ON cms_activity_log
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

-- Website Settings: Public read, admin write
CREATE POLICY "website_settings_select_public" ON website_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "website_settings_all_admin" ON website_settings
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'))
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

-- Admin Sessions: Only admin can manage their sessions
CREATE POLICY "cms_admin_sessions_all_admin" ON cms_admin_sessions
  FOR ALL TO authenticated
  USING (user_id = auth.uid() AND EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email LIKE '%@gurukul.edu.np'));

-- Create indexes for better performance
CREATE INDEX idx_cms_notices_status ON cms_notices(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_cms_notices_publish_date ON cms_notices(publish_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_cms_events_status ON cms_events(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_cms_events_date ON cms_events(event_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_cms_albums_status ON cms_albums(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_cms_photos_album ON cms_photos(album_id);
CREATE INDEX idx_cms_contact_messages_created ON cms_contact_messages(created_at DESC);
CREATE INDEX idx_cms_activity_created ON cms_activity_log(created_at DESC);