# 🎵 Pixel Music Player

A retro-futuristic music player built with Next.js, React, TypeScript and Supabase. The current web build combines a Pixel-style visual language with motion patterns inspired by the open-source PixelPlayer and PixelMusic projects.

## Current build status

### Player experience
- HTML5 audio playback for user-imported audio
- Play / pause / previous / next
- Shuffle and repeat
- Seek and volume controls
- Keyboard controls: `Space`, `Ctrl/Cmd + K`, `Alt + Left/Right`
- Animated playback state with EQ bars, glow, scanlines and a moving waveform
- Album-art/vinyl rotation while a track is playing
- Animated album glow and micro-interactions
- Animated track-row entrance, hover movement and cover tilt
- Responsive mobile player and library navigation

### Backend foundation
- Supabase Auth foundation
- Supabase PostgreSQL catalog
- Row Level Security
- Likes API
- Listening-history API
- Playlist API
- Search API for the database catalog
- YouTube Data API search route using the server-side `YOUTUBE_API_KEY`
- Server/client Supabase helpers for SSR

> The current player UI is still using the local demo catalog and imported files. The database APIs are present, but the main player has not yet been fully wired to remote catalog results, persistent likes/history or cloud audio playback.

## Inspiration used

The visual implementation is **inspired by behavior and interaction patterns**, not copied source/assets.

### PixelPlayer
Used as inspiration for:
- playing-state EQ motion
- subtle waveform/progress motion
- animated controls and micro-interactions
- smooth selection transitions

### PixelMusic
Used as inspiration for:
- album-art motion while playing
- animated library/track transitions
- marquee/transition-style interaction ideas
- dynamic player presentation

The upstream projects remain credited as inspiration. Their code and assets are not imported wholesale into this web project.

## Stack

- Next.js App Router
- React
- TypeScript
- Supabase Auth
- Supabase PostgreSQL
- Supabase SSR
- HTML5 Audio API
- Lucide React
- CSS animations

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The app can still run in local/demo mode without Supabase.

## Enable accounts and cloud data

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Add your Supabase project URL and publishable key.
4. Run `supabase/schema.sql` in the Supabase SQL editor.
5. Start the app.
6. Open `/auth` to create an account.

### Environment

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Never commit real credentials.

## Architecture

```text
Pixel Music Player
│
├── Next.js App Router
│   ├── Pixel UI
│   ├── HTML5 audio engine
│   └── API routes
│
├── Supabase
│   ├── Auth
│   ├── PostgreSQL
│   └── Row Level Security
│
└── Music catalog
    ├── Track metadata
    ├── Cover artwork
    └── Authorized audio URLs
```

## API

### Search

`GET /api/search?q=...`

Current database search queries the Supabase `tracks` table.

### YouTube Search

`GET /api/youtube/search?q=...`

The production UI sends the search query to this server route. The route uses the server-only `YOUTUBE_API_KEY` environment variable and calls YouTube Data API `search.list` for video results. The key is never sent to the browser. Search results include YouTube video IDs, titles, channel names, thumbnails, and YouTube URLs.

### Likes

`POST /api/likes`

```json
{ "trackId": "UUID", "liked": true }
```

### History

`POST /api/history`

```json
{ "trackId": "UUID", "progressSeconds": 42 }
```

### Playlists

`GET /api/playlists`

`POST /api/playlists`

```json
{ "name": "Late Night", "description": "Night drive tracks", "isPublic": false }
```

## Important catalog / streaming note

The web app is designed to support **authorized** music sources. YouTube search is now connected through the official YouTube Data API, but the current Pixel UI still keeps its existing local HTML5 audio player unchanged. Add audio that you own, have licensed, or are otherwise authorized to distribute.

The PixelMusic project contains a reverse-engineered YouTube Music / InnerTube implementation. That implementation is not the same thing as an official public YouTube Music streaming API, so this project does **not** copy its private client key or stream-extraction code into the web app.

For an official YouTube integration, use the Google/YouTube developer APIs with your own credentials. Search/metadata and playable audio are separate concerns: an official metadata API does not automatically grant the right to proxy or redistribute audio streams.

The requested `share.google` short link could not be resolved to a specific API document from the public web index, so no third-party key was copied from it. `share.google` is a Google-owned URL-shortening/redirect domain. citeturn806417search0turn806417search1

## Known integration gaps

The next backend phase should connect the existing player UI to:

- authenticated user state
- Supabase-backed likes
- play-history writes
- playlist UI
- database/remote search results
- YouTube playback using an official, visible YouTube embedded player if the UI is later extended for that requirement
- authorized cloud audio URLs
- real album artwork from the catalog
- persistent queue

There is also a schema/type mismatch to fix during that phase: the current demo UI uses numeric track IDs while the Supabase `tracks.id` column is UUID-based. Remote track objects should use their real UUID instead of sending demo numeric IDs to the APIs.

## Roadmap

- [x] Pixel-style player UI
- [x] Local playback
- [x] Animated playback visualizer
- [x] Playing album-art motion
- [x] Animated library rows and micro-interactions
- [x] Search foundation
- [x] Authentication foundation
- [x] Likes API
- [x] History API
- [x] Playlist API
- [x] Database + RLS
- [x] Connect search box to YouTube Data API
- [ ] Connect player UI to Supabase catalog
- [ ] Persistent likes in the main UI
- [ ] Persistent recently-played history
- [ ] Full playlist UI
- [ ] Cloud music uploads
- [ ] Album and artist pages
- [ ] Home recommendations
- [ ] Persistent queue
- [ ] Lyrics
- [ ] PWA / install support
- [ ] Offline playback for authorized media
- [ ] Admin catalog dashboard

## Design principles

- Retro pixel identity
- Dark, high-contrast surfaces
- Motion that reflects playback state
- Small, fast interaction feedback
- Responsive layouts
- No copied proprietary artwork

## Author

**Jay Mistry**

GitHub: https://github.com/jaymit1603
