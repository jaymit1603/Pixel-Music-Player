import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pixel Music Player',
  description: 'A retro-futuristic local music player with a modern dark UI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
