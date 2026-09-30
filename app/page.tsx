'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Disc3, Heart, Home, Library, ListMusic, MoreHorizontal, Pause, Play,
  Repeat2, Search, Shuffle, SkipBack, SkipForward, Upload, Volume2, VolumeX,
  X, Music2, Sparkles
} from 'lucide-react';

type Track = {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  accent: string;
  src?: string;
  file?: File;
};

const demoTracks: Track[] = [
  { id: 1, title: 'Neon Dreams', artist: 'Pixel Avenue', album: 'Midnight Arcade', duration: '3:42', accent: '#ff4d8d' },
  { id: 2, title: 'Digital Rain', artist: 'Nova.exe', album: 'Afterglow', duration: '4:08', accent: '#8b6cff' },
  { id: 3, title: 'Night Drive', artist: 'Synth Runner', album: 'Chrome Hearts', duration: '3:26', accent: '#00d9ff' },
  { id: 4, title: 'Static Hearts', artist: 'Lunar FM', album: 'Signal Lost', duration: '2:58', accent: '#ffd166' },
  { id: 5, title: '8-Bit Sunset', artist: 'Pixel Avenue', album: 'Midnight Arcade', duration: '3:51', accent: '#56e39f' },
  { id: 6, title: 'After Midnight', artist: 'Nova.exe', album: 'Afterglow', duration: '4:31', accent: '#ff7b54' },
];

function Cover({ track, size = 'large', playing = false }: { track: Track; size?: 'large' | 'small'; playing?: boolean }) {
  return (
    <div className={`cover ${size} ${playing ? 'is-playing' : ''}`} style={{ '--accent': track.accent } as React.CSSProperties}>
      <div className="cover-glow" />
      <div className="cover-grid" />
      <div className="cover-ring ring-a" />
      <div className="cover-ring ring-b" />
      <Disc3 className="cover-disc" />
      <span>{track.id.toString().padStart(2, '0')}</span>
    </div>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
}

export default function HomePage() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [tracks, setTracks] = useState<Track[]>(demoTracks);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(72);
  const [liked, setLiked] = useState(false);
  const [query, setQuery] = useState('');
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [toast, setToast] = useState('');
  const [mobileLibrary, setMobileLibrary] = useState(false);
  const [visualizerSeed, setVisualizerSeed] = useState(0);

  const track = tracks[current];

  const filtered = useMemo(
    () => tracks.filter(t => `${t.title} ${t.artist} ${t.album}`.toLowerCase().includes(query.toLowerCase())),
    [tracks, query]
  );

  useEffect(() => {
    if (audio.current) audio.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setVisualizerSeed(v => v + 1), 150);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const onTime = () => setProgress(el.currentTime);
    const onLoaded = () => setDuration(el.duration);
    const onEnded = () => {
      if (repeat) {
        el.currentTime = 0;
        void el.play();
      } else {
        next();
      }
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onLoaded);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => { setPlaying(false); showToast('This audio file could not be played'); };
    el.addEventListener('ended', onEnded);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('error', onError);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onLoaded);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('error', onError);
    };
  }, [repeat, current]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('.search input')?.focus();
      }
      if (event.code === 'Space' && document.activeElement?.tagName !== 'INPUT') {
        event.preventDefault();
        togglePlay();
      }
      if (event.altKey && event.key === 'ArrowRight') next();
      if (event.altKey && event.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const select = (index: number) => {
    setCurrent(index);
    setProgress(0);
    setDuration(0);
    window.setTimeout(() => void playTrack(index), 0);
  };

  const playTrack = async (index = current) => {
    const selected = tracks[index];
    setCurrent(index);
    if (!selected?.src || !audio.current) {
      showToast('Import an audio file to start playback');
      setPlaying(false);
      return;
    }
    try {
      if (audio.current.src !== selected.src) {
        audio.current.src = selected.src;
        audio.current.load();
      }
      await audio.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
      showToast('Playback was blocked by the browser');
    }
  };

  const togglePlay = async () => {
    if (!audio.current || !track.src) {
      showToast('Use Import Music to add a playable track');
      return;
    }
    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else {
      await playTrack(current);
    }
  };

  const next = () => {
    if (!tracks.length) return;
    const index = shuffle ? Math.floor(Math.random() * tracks.length) : (current + 1) % tracks.length;
    setCurrent(index);
    setProgress(0);
    window.setTimeout(() => void playTrack(index), 0);
  };

  const prev = () => {
    if (!audio.current) return;
    if (audio.current.currentTime > 3) {
      audio.current.currentTime = 0;
      return;
    }
    const index = (current - 1 + tracks.length) % tracks.length;
    setCurrent(index);
    setProgress(0);
    window.setTimeout(() => void playTrack(index), 0);
  };

  const seek = (value: number) => {
    setProgress(value);
    if (audio.current && duration) audio.current.currentTime = value;
  };

  const importMusic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    const imported = files.map((file, index) => ({
      id: demoTracks.length + index + 1,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Local File',
      album: 'Your Library',
      duration: '—',
      accent: ['#ff4d8d', '#00d9ff', '#8b6cff', '#ffd166'][index % 4],
      src: URL.createObjectURL(file),
      file,
    }));
    setTracks(prev => [...imported, ...prev]);
    setCurrent(0);
    setPlaying(false);
    showToast(`${files.length} track${files.length > 1 ? 's' : ''} imported`);
    event.target.value = '';
  };

  return (
    <main>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand"><div className="logo">PX</div><div><h1>PIXEL<span>_</span></h1><p>MUSIC PLAYER</p></div></div>
          <div className="top-status"><i /> SYSTEM ONLINE <b>v1.1</b></div>
          <button className="mobile-menu" onClick={() => setMobileLibrary(!mobileLibrary)}><Library /></button>
        </header>

        <div className="layout">
          <aside className={`sidebar ${mobileLibrary ? 'open' : ''}`}>
            <button className="close-mobile" onClick={() => setMobileLibrary(false)}><X /></button>
            <nav><button className="active"><Home /> Home</button><button><Library /> Your Library</button><button><ListMusic /> Playlists</button></nav>
            <div className="side-title">YOUR LIBRARY</div>
            <div className="side-item"><span className="dot pink" /> Liked Songs <b>{liked ? 1 : 0}</b></div>
            <div className="side-item"><span className="dot cyan" /> Recently Played <b>{tracks.length}</b></div>
            <div className="side-item"><span className="dot yellow" /> Local Tracks <b>{tracks.filter(t => t.file).length}</b></div>
            <div className="side-bottom"><button className="upload" onClick={() => fileInput.current?.click()}><Upload /> Import Music</button><small>LOCAL MODE<br />No account required</small></div>
          </aside>

          <section className="content">
            <div className="topbar-content">
              <div><p className="eyebrow">YOUR SPACE</p><h2>Good evening<span>.</span></h2></div>
              <label className="search"><Search /><input placeholder="Search your music..." value={query} onChange={e => setQuery(e.target.value)} /><kbd>⌘ K</kbd></label>
            </div>

            <div className={`hero ${playing ? 'playing' : ''}`}>
              <div className="hero-scanline" />
              <div className="now"><div className="eq">{Array.from({ length: 5 }, (_, i) => <i key={i} />)}</div><span>{playing ? 'PLAYING NOW' : 'READY TO PLAY'}</span>{playing && <Sparkles className="now-spark" />}</div>
              <div className="hero-main">
                <div className="art-wrap"><Cover track={track} playing={playing} /></div>
                <div className="meta">
                  <div className="tag"># {track.album.toUpperCase()}</div><h3>{track.title}</h3><p>{track.artist}</p>
                  <div className="hero-actions"><button className={`icon ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)} aria-label="Like"><Heart fill={liked ? 'currentColor' : 'none'} /></button><button className="pixel-btn" onClick={togglePlay}>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />} {playing ? 'PAUSE' : 'PLAY'}</button><button className="icon" aria-label="More"><MoreHorizontal /></button></div>
                </div>
              </div>
              <div className={`wave ${playing ? 'wave-playing' : ''}`}>
                {Array.from({ length: 72 }, (_, i) => {
                  const base = 14 + ((i * 19) % 34);
                  const motion = playing ? 12 * Math.abs(Math.sin((i + visualizerSeed) * 0.52)) : 0;
                  return <i key={i} style={{ height: Math.round(base + motion) }} />;
                })}
              </div>
            </div>

            <div className="section-head"><h3>UP NEXT</h3><span>{filtered.length} TRACKS</span></div>
            <div className="track-list">
              {filtered.map((t, row) => {
                const index = tracks.findIndex(x => x.id === t.id);
                return <button className={`track ${t.id === track.id ? 'selected' : ''}`} style={{ '--row': row } as React.CSSProperties} key={t.id} onClick={() => select(index)}><Cover track={t} size="small" playing={t.id === track.id && playing} /><div className="track-info"><strong>{t.title}</strong><span>{t.artist}</span></div><span className="album">{t.album}</span><span className="time">{t.duration}</span><span className="more">•••</span></button>;
              })}
              {!filtered.length && <div className="empty"><Music2 /> No tracks found</div>}
            </div>
          </section>
        </div>

        <footer>
          <div className="footer-track"><Cover track={track} size="small" playing={playing} /><div><strong>{track.title}</strong><span>{track.artist}</span></div><button onClick={() => setLiked(!liked)} className={liked ? 'liked' : ''}><Heart fill={liked ? 'currentColor' : 'none'} /></button></div>
          <div className="controls"><div className="control-buttons"><button className={shuffle ? 'active-control' : ''} onClick={() => setShuffle(!shuffle)}><Shuffle /></button><button onClick={prev}><SkipBack fill="currentColor" /></button><button className="play" onClick={togglePlay}>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button><button onClick={next}><SkipForward fill="currentColor" /></button><button className={repeat ? 'active-control' : ''} onClick={() => setRepeat(!repeat)}><Repeat2 /></button></div><div className="progress"><span>{formatTime(progress)}</span><input type="range" min="0" max={duration || 100} value={Math.min(progress, duration || 100)} onChange={e => seek(+e.target.value)} /><span>{duration ? formatTime(duration) : track.duration}</span></div></div>
          <div className="volume"><button onClick={() => setVolume(volume ? 0 : 72)}>{volume ? <Volume2 /> : <VolumeX />}</button><input type="range" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)} /></div>
        </footer>

        <input ref={fileInput} className="hidden-input" type="file" accept="audio/*" multiple onChange={importMusic} />
        {toast && <div className="toast">{toast}</div>}
        <audio ref={audio} />
      </div>
    </main>
  );
}
