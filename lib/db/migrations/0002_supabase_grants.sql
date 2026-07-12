-- Run in Supabase SQL editor after 0000 + 0001.
-- Fixes "permission denied for table users" when API roles lack access.

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_graphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "teenee_all_users" ON users;
CREATE POLICY "teenee_all_users" ON users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "teenee_all_lessons" ON lessons;
CREATE POLICY "teenee_all_lessons" ON lessons FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "teenee_all_knowledge" ON knowledge_items;
CREATE POLICY "teenee_all_knowledge" ON knowledge_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "teenee_all_practice_graphs" ON practice_graphs;
CREATE POLICY "teenee_all_practice_graphs" ON practice_graphs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "teenee_all_sessions" ON sessions;
CREATE POLICY "teenee_all_sessions" ON sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "teenee_all_reviews" ON reviews;
CREATE POLICY "teenee_all_reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
