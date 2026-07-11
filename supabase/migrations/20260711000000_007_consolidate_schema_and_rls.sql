-- Phase 5 & 6: Database Optimization and Row Level Security Consolidation
-- This migration drops the deprecated tables that were replaced by the 'cms_' prefixed tables,
-- eliminating data duplication and resolving the schema fragmentation issue.

-- 1. Drop deprecated legacy tables
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS notices CASCADE;

-- 2. Ensure rigorous RLS on cms_ tables (Double check they are strictly isolated)
-- Just ensuring the default deny for authenticated users without the right email suffix is enforced
ALTER TABLE cms_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_admin_sessions ENABLE ROW LEVEL SECURITY;

-- Note: The specific policies are already defined in 005_cms_rls_policies.sql.
-- This cleanup migration ensures the old overlapping tables (which had overly permissive RLS) are completely removed.
