# 🎵 Pixel Music Player

A full-stack, retro-futuristic music platform inspired by the interaction patterns of modern streaming players.

## Current build

- Modern Pixel/neon music dashboard
- Real HTML5 audio engine
- Local audio import for instant demo playback
- Search and responsive navigation
- Shuffle, repeat, seek and volume
- Likes, playlists and listening history database schema
- Supabase authentication foundation
- Server-side session handling
- Search API
- Row Level Security policies
- Demo mode when Supabase variables are not configured

## Stack

Next.js App Router + React + TypeScript + Supabase Postgres/Auth.

Next.js is used as the full-stack application framework. citeturn0search2 Supabase provides Postgres, Auth and row-level access control; its current Next.js guidance uses cookie-based SSR sessions with `@supabase/ssr`. citeturn0search0turn0search3

## Run locally

```bash
npm install
npm run dev
```

Without Supabase environment variables, the UI remains in demo mode.

## Enable cloud accounts + library

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Run `supabase/schema.sql` in the Supabase SQL editor.
5. Start the app.

Supabase's current Next.js quickstart uses these environment variables and the App Router. citeturn0search4

## Architecture

```text
Browser
  │
  ├── Next.js UI + Audio API
  │
  ├── /api/search
  │
  └── Supabase SSR client
          │
          ├── Auth
          ├── Postgres
          └── Row Level Security
```

## Music rights

Pixel Music Player should only stream audio that you own, have licensed, or are otherwise authorized to distribute. Do not scrape or proxy copyrighted catalogs without permission.

## Roadmap

- [ ] Full playlist CRUD UI
- [ ] Cloud music upload/storage
- [ ] Album/artist pages
- [ ] Home recommendations
- [ ] Persistent queue
- [ ] Listening-history UI
- [ ] Lyrics integration
- [ ] PWA/install support
- [ ] Offline caching for authorized media
- [ ] Admin catalog management
