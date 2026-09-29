# 🎵 Pixel Music Player

A retro-futuristic **local music player for the web**, built with Next.js, React, TypeScript and Lucide icons.

The UI combines a pixel-inspired visual identity with the cleaner dark, card-based patterns commonly used in modern music-player interfaces. The referenced Dribbble shot was used as visual inspiration rather than copied as an asset.

## ✨ Features

- 🎧 Modern dark music-player dashboard
- 🟣 Pixel / neon visual identity
- ▶️ Play, pause, previous and next controls
- 🔀 Shuffle and repeat controls
- 🔊 Volume control
- ⏱️ Real audio progress + seeking
- ❤️ Like / favorite interaction
- 🔍 Instant track search
- 📂 Import local audio files directly in the browser
- 📱 Responsive mobile layout
- ⌨️ **Ctrl/Cmd + K** focuses search
- ␣ **Space** toggles playback
- 🔒 Local-first: imported audio is handled in the browser and no account is required

## 🛠️ Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Lucide React**
- CSS
- HTML5 Audio API

## 🚀 Getting Started

### 1. Clone

```bash
git clone https://github.com/jaymit1603/Pixel-Music-Player.git
cd Pixel-Music-Player
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Open **http://localhost:3000**.

### 4. Production build

```bash
npm run build
npm start
```

## 🎼 How to Use

1. Open Pixel Music Player.
2. Click **Import Music**.
3. Select one or multiple audio files from your computer.
4. Select an imported track.
5. Use the player controls to play, pause, seek, change volume, shuffle or repeat.

Imported tracks use browser-generated object URLs, so the app does not upload your music to a server.

## 🎨 Design Direction

Pixel Music Player uses:

- Dark charcoal surfaces
- Neon pink and cyan accents
- Pixel/monospace typography
- Grid-based album artwork
- Strong compact controls
- Modern music dashboard spacing
- Responsive mobile navigation

The visual direction is inspired by modern music-player UI references on Dribbble while keeping the Pixel Music Player identity original.

Reference: https://dribbble.com/shots/27469726-Modern-Music-Player-UI-Design

## 📁 Project Structure

```text
Pixel-Music-Player/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── .gitignore
├── next-env.d.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🔮 Roadmap

- [ ] Persistent playlists with localStorage / IndexedDB
- [ ] Album artwork extraction
- [ ] Drag-and-drop music importing
- [ ] Queue management
- [ ] Recently played persistence
- [ ] Audio visualizer driven by Web Audio API
- [ ] PWA / installable desktop experience
- [ ] Optional cloud sync

## 👨‍💻 Author

**Jay Mistry**

GitHub: https://github.com/jaymit1603

## 📄 License

This project is available for personal and educational use. Add a formal open-source license if you intend to accept external contributions.
