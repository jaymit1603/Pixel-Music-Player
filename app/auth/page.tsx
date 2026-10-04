'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { Disc3, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const supabase = createClient();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setMessage('Supabase is not configured. Add the Supabase environment variables in Vercel.');
      return;
    }
    setMessage('');
    const r = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (r.error) setMessage(r.error.message);
    else setMessage(mode === 'login' ? 'Signed in. Return to the player.' : 'Account created. Check your email if confirmation is enabled.');
  }

  async function signInWithGoogle() {
    if (!supabase) {
      setMessage('Supabase is not configured. Add the Supabase environment variables in Vercel.');
      return;
    }
    setMessage('Redirecting to Google...');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setMessage(error.message);
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link className="auth-back" href="/"><ArrowLeft /> Back to player</Link>
        <div className="auth-logo"><Disc3 /></div>
        <p className="eyebrow">PIXEL MUSIC PLAYER</p>
        <h1>{mode === 'login' ? 'Welcome back.' : 'Create your space.'}</h1>
        <p className="auth-copy">Sync likes, playlists and listening history across devices.</p>

        <button className="auth-google" type="button" onClick={signInWithGoogle}>
          <span aria-hidden="true" style={{ fontWeight: 800, fontSize: 18 }}>G</span> Continue with Google
        </button>
        <div className="auth-divider"><span>OR</span></div>

        <form onSubmit={submit}>
          <label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label>Password<input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} /></label>
          <button className="auth-submit" type="submit">{mode === 'login' ? <LogIn /> : <UserPlus />}{mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</button>
        </form>
        {message && <p className="auth-message">{message}</p>}
        <button className="auth-switch" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
        </button>
      </div>
    </main>
  );
}