# Teenee — V1 Build Plan

> **Product:** Convert static lessons into dynamic conversations.  
> **Engine:** Lesson → Practice Graph → Session Agenda → Conversation  
> **Supporting layers:** Knowledge Graph (memory), Orchestrator (scheduling), Realtime AI (execution)

---

## Architecture Reference

```
Voice / text / file dump
        ↓
   Extract + Confirm
        ↓
   ┌─────────────────┬─────────────────┐
   │ Knowledge Graph │ Practice Graph  │
   │ (what you know) │ (how to practice)│
   └────────┬────────┴────────┬────────┘
            ↓                 ↓
         Orchestrator → Session Agenda
                           ↓
                    Conversation (Realtime)
                           ↓
              Session Review + SRS update
```

---

## UI Design Direction — Hybrid: 1 + 2 + 4

**Midnight Performance** (dark, metrics) + **Monochrome Studio** (B&W precision) + **Immersion Stage** (voice-first, anti-chat)

Teenee should feel like a training app Apple and Nike would ship — not an AI chatbot.

### Design references

| Source | Borrow |
|--------|--------|
| [Apple Fitness](https://design-sites.botubot.ru/en/project/apple-fitness-ios/) | Dark canvas, grouped cards, rings/metrics, frosted glass |
| [Nike NTC Design System](http://www.oscar-w.com/projects/design-system) | B&W foundation, bold condensed headlines, color only on actions |
| [Things 3](https://gummble.com/apps/things-3-ios) | List hierarchy, checklist confirm screens, zero decoration |
| [Speak (voice flows only)](https://screensdesign.com/showcase/speak-learn-spanish-french) | Voice-first lesson flow — skip chat/tutor UI |
| [Apple Fitness animations](https://60fps.design/shots/apple-fitness-activity-on-phone) | Smooth slide/fade transitions, no bounce |

### Screen modes (two surfaces)

| Surface | Direction | When |
|---------|-----------|------|
| **Light Studio** | Monochrome Studio (#2) | Home, lesson list, confirm, progress, settings |
| **Dark Stage** | Midnight Performance (#1) + Immersion (#4) | Voice dump, Explain, Practice sessions |

Light for structure. Dark for speaking. Never mix chat UI on either surface.

### Design tokens

```
Dark Stage (sessions)
  canvas:       #000000
  card:         #1C1C1E
  text-primary: #FFFFFF
  text-muted:   rgba(255,255,255,0.6)
  accent:       #FA114F          /* single action color — record, start, confirm */
  accent-dim:   rgba(250,17,79,0.15)

Light Studio (everything else)
  canvas:       #FFFFFF
  surface:      #F5F5F7
  text-primary: #000000
  text-muted:   rgba(0,0,0,0.5)
  accent:       #FA114F          /* same accent, used sparingly */
  border:       rgba(0,0,0,0.08)

Typography
  display:      bold condensed sans (NTC-style) — lesson titles, session openers
  body:         system sans — SF Pro / Inter
  french:       display size for hero phrases during practice ("Bonjour." full screen)

Motion
  transitions:  slide + fade, 200–300ms
  haptics:      session start, session end, confirm tap
  never:        bounce, pulse badges, typing indicators, sparkle
```

### Screen mapping

| Screen | Surface | Key UI |
|--------|---------|--------|
| Home | Light | Today's session card (workout-style), speaking streak, last lesson |
| Class Dump | Dark | Red record dot + waveform + timer (Voice Memos familiarity) |
| Confirm Lesson | Light | Things 3 checklist — vocab/grammar/expression rows with ✓ / ✏️ |
| Explain Mode | Dark | One bold prompt, then near-empty stage; AI listens |
| Practice | Dark | Full-screen immersion — French phrase large, optional swipe-up transcript |
| Active Recall | Dark | Intentional empty screen + subtle pulse; no "AI is thinking" |
| Session Review | Light | Editorial recap — mistakes, wins, next session suggestion |
| Progress | Light | Activity-style metrics (minutes spoken, streak, topics) on white |

### Hard rules (anti–generic AI)

- No chat bubbles, avatars, robot icons, or sparkle motifs
- No purple/blue gradients or glowing orbs
- No "Ask me anything" empty states
- No typing indicators or "AI is thinking…"
- Color is for **actions only** (record, start, confirm) — not decoration
- Transcript is **hidden by default** during practice; swipe-up to reveal
- Modes (Hybrid / Beginner / Immersion) change **audio behavior**, not layout clutter
- **No English after every French line** — that's tutoring theater, not how teachers actually teach
- Hybrid = French conversation flow; English only when stuck, correcting, or brief encouragement ("Bien joué! / Good job!")
- Comprehension checks in French: "Compris?", "C'est clair?" — student learns naturally, like in class

---

## Phase 0 — Project Foundation

- [x] **0.1** Initialize Next.js app (App Router, TypeScript, TailwindCSS)
- [x] **0.2** Configure project structure (`app/`, `components/`, `lib/`, `hooks/`, `types/`)
- [x] **0.3** Add ESLint + Prettier aligned with `.cursorrules` (file size, one responsibility)
- [x] **0.4** Set up environment variable schema (`.env.example`) for OpenAI, Postgres, R2
- [x] **0.5** Add base layout: mobile-first shell, Light Studio + Dark Stage theme tokens, nav placeholders (Dump, Practice, Progress)
- [x] **0.6** Configure PWA basics (manifest, icons placeholder, installable shell)

---

## Phase 1 — Core Types & Domain Models

Define the language of the system before any UI or API.

- [x] **1.1** Define `Lesson` types (raw input, parsed summary, confirmed state)
- [x] **1.2** Define Knowledge Graph types (`Concept`, `Vocabulary`, `Grammar`, `Mastery`, `ReviewSchedule`)
- [x] **1.3** Define Practice Graph types (`PracticeNode`, `PracticeEdge`, node kinds: exchange, switch, recall_gap, stretch, anchor)
- [x] **1.4** Define Practice Template types (`Template`, `TemplateSlot`, instantiation rules)
- [x] **1.5** Define Session types (`SessionAgenda`, `AgendaItem`, `Beat`, `PronunciationFocus`)
- [x] **1.6** Define Conversation types (`CorrectionBudget`, `ConversationMode`: beginner | hybrid | immersion)
- [x] **1.7** Define User Profile types (goals, CEFR target, correction style, interests)

---

## Phase 2 — Database & Storage

- [x] **2.1** Set up PostgreSQL (local dev + connection via Drizzle or Prisma — pick one)
- [x] **2.2** Create schema: `users`, `lessons`, `knowledge_items`, `practice_graphs`, `sessions`, `reviews`
- [x] **2.3** Add migrations and seed script (dev user + sample greetings lesson)
- [x] **2.4** Set up Cloudflare R2 client (lesson audio, optional session recordings)
- [x] **2.5** Implement storage helpers: upload raw dump, fetch by lesson ID

---

## Phase 3 — Lesson Ingest (Voice-First)

Primary post-class workflow.

- [x] **3.1** Build "Class Dump" page — record button + timer + waveform (mobile-first)
- [x] **3.2** API: upload audio → R2 → transcribe (OpenAI Whisper or equivalent)
- [x] **3.3** API: accept pasted/typed text dump (same pipeline, skip transcription)
- [x] **3.4** Lesson parser service (OpenAI Responses API): extract vocab, grammar, expressions, title, difficulty
- [x] **3.5** Build Confirm screen — editable chips (vocab ✓/✏️, grammar ✓/✏️, expressions ✓/✏️)
- [x] **3.6** Persist confirmed lesson → DB + trigger downstream compilers (Knowledge + Practice Graph)
- [x] **3.7** Lesson list view — past dumps, date, title, status (draft | confirmed)

---

## Phase 3B — Settings

Tune conversation behavior without touching code.

- [x] **3B.1** Settings page (Light Studio) + nav tab
- [x] **3B.2** Migration: `silence_timeout_seconds`, `trigger_phrases`, `transcript_visible` on `users`
- [x] **3B.3** API `GET/PATCH /api/settings`
- [x] **3B.4** UI: conversation mode, correction style, CEFR target, silence timeout, transcript toggle
- [x] **3B.5** Wire settings into Realtime session (Phase 8)
- [x] **3B.6** Trigger phrase editor (custom phrases list)

---

## Phase 4 — Knowledge Graph

What the student knows.

- [x] **4.1** Knowledge upsert service — merge confirmed lesson concepts into graph (dedupe by normalized form)
- [x] **4.2** Track per-concept: mastery, speaking confidence, recognition confidence, lesson source
- [x] **4.3** Basic SRS model — intervals (1, 3, 7, 14, 30, 60 days), due date, success/fail reset
- [x] **4.4** Weakness tracking — store recurring mistakes (grammar + pronunciation) linked to concepts
- [x] **4.5** API: fetch knowledge snapshot for orchestrator (due reviews, weak items, today's lesson concepts)

---

## Phase 5 — Practice Graph & Templates

How the lesson becomes conversation.

- [x] **5.1** Define initial template library (V1 minimum):
  - `GreetingFlow` — open → respond → ask back → formal/informal switch → variation → close
  - `ClassroomObjectsFlow` — pick object → ask what → student answers → student asks → AI answers → one new object
  - `ExplainLessonFlow` — student explains aloud, AI corrects misunderstandings only
- [x] **5.2** Template detector — given parsed lesson, select primary (+ optional secondary) template
- [x] **5.3** Practice Graph compiler — instantiate template with lesson content → emit nodes + edges
- [x] **5.4** Tag nodes with weights: revision (~85%), stretch (~10%), discovery (~5%)
- [x] **5.5** Inject `recall_gap` nodes (Active Recall Mode) at natural points in each template
- [x] **5.6** Inject `anchor` nodes — soft pull-back phrases when conversation drifts off-topic
- [x] **5.7** Assign pronunciation focus from lesson content (one sound per session, e.g. French R)
- [x] **5.8** Persist Practice Graph per lesson in DB
- [x] **5.9** API: fetch Practice Graph for a given lesson ID

---

## Phase 6 — Orchestrator & Session Agenda

The brain. Runs **before** session, lightly during.

- [x] **6.1** Pre-session agenda builder:
  - Inputs: today's Practice Graph, Knowledge Graph, SRS due items, weaknesses
  - Outputs: Session Agenda (primary, secondary, review list, challenge, pronunciation focus, node queue)
- [x] **6.2** Implement 85/10/5 distribution when ordering agenda nodes
- [x] **6.3** Merge cross-lesson review items into agenda (without breaking today's primary topic)
- [x] **6.4** Lightweight per-turn context builder — pass only: current node, current anchor, weakness hint, correction budget
- [x] **6.5** Node advancement logic — when to move to next graph node vs stay on current
- [x] **6.6** Active Recall executor rules — silence duration, hint-after timeout, expected production target
- [x] **6.7** API: `POST /session/start` → returns Session Agenda
- [x] **6.8** API: `POST /session/advance` → returns next turn context slice

---

## Phase 7 — Explain Mode

Rubber-duck the lesson before practice.

- [x] **7.1** Explain Mode UI — voice session with clear "explain today's lesson" prompt
- [x] **7.2** Explain template (`ExplainLessonFlow`) wired into orchestrator
- [x] **7.3** Correction policy — only genuine misunderstandings, not nitpicks
- [x] **7.4** Transition: Explain complete → Practice Mode with same lesson's Practice Graph

---

## Phase 8 — Voice Conversation Engine

Realtime execution layer.

- [x] **8.1** OpenAI Realtime API integration — WebRTC or WebSocket connection from client
- [x] **8.2** Turn detection — 5s silence OR configurable trigger phrase ("Your turn", "Go ahead", etc.)
- [x] **8.3** Stream audio in / stream audio out — no push-to-talk
- [x] **8.4** Inject Session Agenda context into Realtime system instructions (minimal per-turn slice)
- [x] **8.5** Conversation modes (French-first — see Hard rules):
  - **Hybrid (default)** — AI leads in French. Student replies in French. English only when confused, correcting, or brief praise — then next beat in French. No line-by-line translation.
  - **Beginner** — More English scaffolding on new/tricky material, still French-led conversation
  - **Immersion** — French only unless student asks for English or clearly didn't understand
- [x] **8.6** Correction budget enforcement — max 1 grammar + 1 pronunciation correction per student turn
- [x] **8.7** Anchor execution — orchestrator signals anchor; AI naturally pulls conversation back
- [x] **8.8** Practice session UI — mode selector, live transcript (optional), end session button
- [x] **8.9** Session persistence — duration, transcript summary, nodes covered, corrections made

---

## Phase 9 — Session Review & Progress

Closure after every conversation.

- [x] **9.1** Post-session summarizer (Responses API) — grammar mistakes, vocab used, expressions introduced
- [x] **9.2** Session Review screen — mistakes, improvements, speaking score, suggested revision
- [x] **9.3** Update Knowledge Graph from session outcomes (mastery deltas, new weaknesses)
- [x] **9.4** Update SRS schedules from session outcomes (success → advance interval, fail → reset)
- [x] **9.5** Progress dashboard — speaking time, streak, topics completed, weakest/strongest topics
- [x] **9.6** Next session recommendation — what to dump/practice tomorrow

---

## Phase 10 — Polish & Ship

- [x] **10.1** Error states + offline graceful degradation (PWA)
- [x] **10.2** Auth (single-user V1: simple magic link or local-only dev mode)
- [x] **10.3** Export/backup — knowledge graph + lesson history
- [x] **10.4** End-to-end test: voice dump → confirm → explain → practice → review
- [x] **10.5** Deploy (Vercel + managed Postgres + R2)

---

## Explicitly Deferred (V1.1+)

- OCR for handwritten notebook photos
- PDF parsing
- Full phonetics engine (liaison, nasal vowels, rhythm analysis)
- CEFR estimation algorithm
- Role-play scenarios (restaurant, airport, etc.)
- Shadowing mode
- Mock DELF/TCF exams
- Multi-language support
- Custom AI personalities

---

## Build Order Summary

| Step | Phase | Todo | Why this order |
|------|-------|------|----------------|
| 1 | 0 | 0.1–0.6 | Empty repo → runnable shell |
| 2 | 1 | 1.1–1.7 | Types before code |
| 3 | 2 | 2.1–2.5 | Persistence before features |
| 4 | 3 | 3.1–3.7 | Voice dump is the entry point |
| 5 | 5 | 5.1–5.9 | Practice Graph before conversation |
| 6 | 4 | 4.1–4.5 | Knowledge Graph + SRS |
| 7 | 6 | 6.1–6.8 | Orchestrator connects graphs → agenda |
| 8 | 7 | 7.1–7.4 | Explain Mode (pre-practice) |
| 9 | 8 | 8.1–8.9 | Realtime conversation |
| 10 | 9 | 9.1–9.6 | Review loop closes the learning cycle |
| 11 | 10 | 10.1–10.5 | Ship |

> **Note:** Phase 5 (Practice Graph) comes before Phase 4 (Knowledge Graph) in the build order because the Practice Graph is the product differentiator and can be tested with mock knowledge data. Phase 4 runs in parallel once lesson confirm is working.

---

## Current Task

**V1 build complete.** Run full flow test: dump → confirm → explain → practice → review. See `DEPLOY.md` for production deploy.

---

## Session Log

| Date | Todo | Status | Notes |
|------|------|--------|-------|
| 2026-07-12 | 10.1–10.5, 3B.5–3B.6 | Done | PWA offline, export, e2e, deploy docs, Realtime settings wiring |
| 2026-07-12 | 9.1–9.6 | Done | Session review, progress dashboard, knowledge/SRS updates |
| 2026-07-12 | 7.1–7.4 | Done | Explain UI, ExplainLessonFlow in orchestrator, explain→practice transition |
| 2026-07-12 | 3.4, 3B.1–3B.4 | Done | Lesson parser + Settings page/API |
| 2026-07-12 | 1.1–1.7 | Done | Domain types: lesson, knowledge, practice graph, session, conversation, user |
| 2026-07-12 | 0.1–0.6 | Done | Next.js 16 shell, 1+2+4 UI tokens, 4-tab nav, PWA manifest |
