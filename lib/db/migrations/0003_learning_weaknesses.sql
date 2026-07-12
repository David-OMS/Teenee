-- Run in Supabase SQL editor after 0002.
-- Tracks recurring mistakes linked to knowledge concepts.

CREATE TABLE IF NOT EXISTS learning_weaknesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  concept_id uuid REFERENCES knowledge_items(id) ON DELETE SET NULL,
  category text NOT NULL,
  description text NOT NULL,
  occurrence_count integer NOT NULL DEFAULT 1,
  last_seen_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE learning_weaknesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "teenee_all_learning_weaknesses" ON learning_weaknesses;
CREATE POLICY "teenee_all_learning_weaknesses" ON learning_weaknesses
  FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON learning_weaknesses TO anon, authenticated, service_role;
