# Teenee

Personal AI French learning — turn today's class into tomorrow's fluency.

## Quick start

```bash
cp .env.example .env
# Fill in OpenAI, Supabase, R2 keys
npm install
npm run dev
```

Run Supabase migrations (see `DEPLOY.md`), then open [http://localhost:3000](http://localhost:3000).

## Full flow

1. **Dump** — voice or text after class (`/dump`)
2. **Confirm** — review parsed vocab/grammar (`/lessons/[id]/confirm`)
3. **Explain** — rubber-duck the lesson (`/explain`)
4. **Practice** — French-first voice conversation (`/practice`)
5. **Review** — session recap + SRS update (`/sessions/[id]/review`)
6. **Progress** — streak, speaking time, weak/strong topics (`/progress`)

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run db:seed` | Seed sample greetings lesson |
| `npm run test:e2e` | Playwright smoke + flow tests |

## Deploy

See [DEPLOY.md](./DEPLOY.md) for Vercel + Supabase + R2 setup.

## V1 scope

Single-user dev auth, OpenAI Realtime voice, Knowledge Graph + SRS, Practice Graph templates, session review. Magic link auth and multi-user are V1.1+.
