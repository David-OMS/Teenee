ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profile_setup_complete" boolean DEFAULT false NOT NULL;

CREATE TABLE IF NOT EXISTS "word_of_the_day_history" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "public"."users"("id") ON DELETE cascade,
  "shown_on" date NOT NULL,
  "french" text NOT NULL,
  "english" text NOT NULL,
  "example" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "word_of_the_day_user_day" UNIQUE("user_id", "shown_on"),
  CONSTRAINT "word_of_the_day_user_french" UNIQUE("user_id", "french")
);

ALTER TABLE "word_of_the_day_history" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "teenee_all_word_of_the_day" ON "word_of_the_day_history";
CREATE POLICY "teenee_all_word_of_the_day" ON "word_of_the_day_history" FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON "word_of_the_day_history" TO anon, authenticated, service_role;
