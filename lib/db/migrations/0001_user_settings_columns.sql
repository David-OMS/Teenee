ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "silence_timeout_seconds" integer DEFAULT 5 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "trigger_phrases" jsonb DEFAULT '["Your turn.","Go ahead.","That''s all."]'::jsonb NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "transcript_visible" boolean DEFAULT false NOT NULL;
