import "dotenv/config";

import { insertDevUser } from "@/lib/db/seed/insert-dev-user";
import { insertGreetingsLesson } from "@/lib/db/seed/insert-greetings-lesson";
import { createServerClient } from "@/lib/supabase/create-server-client";

/** Orchestrator — seeds dev user + sample greetings lesson via Supabase. */
async function runSeed() {
  const supabase = createServerClient();

  console.log("Seeding dev user...");
  const user = await insertDevUser(supabase);
  console.log(`  user: ${user.id} (${user.display_name})`);

  console.log("Seeding greetings lesson...");
  const lesson = await insertGreetingsLesson(supabase, user.id);
  console.log(`  lesson: ${lesson.id} (${lesson.confirmed?.title})`);

  console.log("Seed complete.");
}

runSeed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
