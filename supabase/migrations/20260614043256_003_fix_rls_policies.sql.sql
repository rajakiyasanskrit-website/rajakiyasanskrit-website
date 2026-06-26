-- Fix RLS policies by removing overly permissive policies
-- and implementing proper access control

-- Drop ALL existing policies first
DROP POLICY IF EXISTS events_select_public ON events;
DROP POLICY IF EXISTS events_all_authenticated ON events;
DROP POLICY IF EXISTS gallery_select_public ON gallery;
DROP POLICY IF EXISTS gallery_all_authenticated ON gallery;
DROP POLICY IF EXISTS notices_select_public ON notices;
DROP POLICY IF EXISTS notices_all_authenticated ON notices;

-- Events: Proper RLS policies
-- Public can read all events
CREATE POLICY "events_select_public" ON events
  FOR SELECT TO anon, authenticated
  USING (true);

-- Only service role can modify events (backend operations via service_role key)
-- For authenticated users without service_role, no modifications allowed
CREATE POLICY "events_manage_service" ON events
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Gallery: Proper RLS policies
-- Public can read all gallery images
CREATE POLICY "gallery_select_public" ON gallery
  FOR SELECT TO anon, authenticated
  USING (true);

-- Only service role can modify gallery
CREATE POLICY "gallery_manage_service" ON gallery
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Notices: Proper RLS policies
-- Public can only read active notices
CREATE POLICY "notices_select_public" ON notices
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Only service role can modify notices
CREATE POLICY "notices_manage_service" ON notices
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');