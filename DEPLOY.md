# Deploying Teenee

## Prerequisites

- [Vercel](https://vercel.com) account
- [Supabase](https://supabase.com) project (Postgres)
- [Cloudflare R2](https://developers.cloudflare.com/r2/) bucket (voice dumps)
- [OpenAI](https://platform.openai.com) API key with Realtime access

## 1. Database

Run migrations in the Supabase SQL editor, in order:

1. `lib/db/migrations/0000_purple_angel.sql`
2. `lib/db/migrations/0001_user_settings_columns.sql`
3. `lib/db/migrations/0002_supabase_grants.sql`
4. `lib/db/migrations/0004_profile_word_of_day.sql`

Optional seed (local):

```bash
npm run db:seed
```

## 2. Environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Notes |
|----------|-------|
| `OPENAI_API_KEY` | Required for parsing, summarizer, Realtime |
| `OPENAI_REALTIME_VOICE` | `coral`, `shimmer`, or `sage recommended |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Anon/publishable key |
| `SUPABASE_SECRET_KEY` | **service_role** key (server only) |
| `R2_*` | Account ID, keys, bucket, public URL |
| `NEXT_PUBLIC_APP_URL` | Production URL (e.g. `https://teenee.vercel.app`) |
| `TEENEE_AUTH_MODE` | `dev` (default) or `supabase` (future) |

## 3. Vercel deploy

```bash
npm i -g vercel
vercel
```

Add all env vars in the Vercel project settings. Deploy:

```bash
vercel --prod
```

## 4. Post-deploy checks

- [ ] Home loads, streak/progress API returns data
- [ ] Text dump → confirm → explain → practice → review
- [ ] Voice session connects (mic permission + Realtime)
- [ ] Settings save (mode, trigger phrases, export backup)
- [ ] PWA installable from mobile browser

## Auth (V1)

Single-user **dev mode**: the app uses the first row in `users`, creating a default profile if empty. Visit `/login` for the continue screen. Full Supabase Auth (magic link) is deferred to V1.1.

## Backup

Settings → **Export backup** downloads JSON with lessons, knowledge graph, weaknesses, and session history.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Settings/API permission errors | Run `0002_supabase_grants.sql` |
| Weakness tracking fails | Run `0003_learning_weaknesses.sql` |
| Realtime won't connect | Check `OPENAI_API_KEY` and Realtime model access |
| R2 upload fails | Verify bucket CORS and `R2_PUBLIC_URL` |
