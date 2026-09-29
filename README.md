# 🎵 Pixel Music Player

A full-stack, retro-futuristic music platform built with Next.js, React, TypeScript and Supabase.

## What is working

- Modern Pixel/neon music dashboard
- HTML5 audio player
- Local audio import for instant demo playback
- Search API
- Responsive navigation
- Shuffle, repeat, seek and volume
- Supabase authentication foundation
- Persistent likes API
- Listening-history API
- Playlist API
- Postgres schema for users, tracks, playlists, likes and history
- Row Level Security policies
- Demo mode when Supabase variables are not configured

## Stack

- Next.js App Router
- React
- TypeScript
- Supabase Auth
- Supabase Postgres
- Supabase SSR
- HTML5 Audio API
- Lucide React

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The app still has a usable demo/local mode without a Supabase project.

## Enable accounts and cloud data

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Add your Supabase project URL and publishable key.
4. Run `supabase/schema.sql` in the Supabase SQL editor.
5. Run the app with `npm run dev`.
6. Open `/auth` to create an account.

### Environment

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Do not commit real credentials.

## Architecture

```text
Pixel Music Player
│
├── Next.js App Router
│   ├── Music UI
│   ├── Audio engine
│   └── API routes
│
├── Supabase
│   ├── Auth
│   ├── PostgreSQL
│   └── Row Level Security
│
└── Music storage/catalog
    ├── Track metadata
    ├── Cover artwork
    └── Authorized audio URLs
```

## API

### Search

`GET /api/search?q=...`

### Likes

`POST /api/likes`

Body:

```json
{ "trackId": "UUID", "liked": true }
```

### History

`POST /api/history`

Body:

```json
{ "trackId": "UUID", "progressSeconds": 42 }
```

### Playlists

`GET /api/playlists`

`POST /api/playlists`

Body:

```json
{ "name": "Late Night", "description": "Night drive tracks", "isPublic": false }
```

## Music catalog

The database is designed so Pixel can eventually support a real cloud catalog. Add only audio you own, have licensed, or are otherwise authorized to distribute.

## Roadmap

- [x] Player UI
- [x] Local playback
- [x] Search foundation
- [x] Authentication foundation
- [x] Likes API
- [x] History API
- [x] Playlist API
- [x] Database + RLS
- [ ] Full playlist UI
- [ ] Cloud music uploads
- [ ] Album and artist pages
- [ ] Home recommendations
- [ ] Persistent queue
- [ ] Recently played page
- [ ] Lyrics
- [ ] PWA/install support
- [ ] Offline playback for authorized media
- [ ] Admin catalog dashboard

## Design

The visual direction combines Pixel's retro identity with modern streaming-player interaction patterns. The Dribbble reference supplied for the project is used as design inspiration, not as copied assets.

## Author

**Jay Mistry**

GitHub: https://github.com/jaymit1603
