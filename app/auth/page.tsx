'use client';
import{FormEvent,useState}from'react';
import{createClient}from'@/lib/supabase/client';
import{Disc3,LogIn,UserPlus,ArrowLeft}from'lucide-react';
import Link from'next/link';

export default function AuthPage(){
 const supabase=createClient();
 const[mode,setMode]=useState<'login'|'signup'>('login');
 const[email,setEmail]=useState('');const[password,setPassword]=useState('');const[message,setMessage]=useState('');
 async function submit(e:FormEvent){e.preventDefault();if(!supabase){setMessage('Demo mode: add Supabase variables to .env.local to enable accounts.');return}setMessage('');
 const r=mode==='login'?await supabase.auth.signInWithPassword({email,password}):await supabase.auth.signUp({email,password});
 if(r.error)setMessage(r.error.message);else setMessage(mode==='login'?'Signed in. Return to the player.':'Account created. Check your email if confirmation is enabled.')}
 return <main className="auth-page"><div className="auth-card"><Link className="auth-back" href="/"><ArrowLeft/> Back to player</Link><div className="auth-logo"><Disc3/></div><p className="eyebrow">PIXEL MUSIC PLAYER</p><h1>{mode==='login'?'Welcome back.':'Create your space.'}</h1><p className="auth-copy">Sync likes, playlists and listening history across devices.</p><form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="auth-submit" type="submit">{mode==='login'?<LogIn/>:<UserPlus/>}{mode==='login'?'SIGN IN':'CREATE ACCOUNT'}</button></form>{message&&<p className="auth-message">{message}</p>}<button className="auth-switch" onClick={()=>setMode(mode==='login'?'signup':'login')}>{mode==='login'?'Need an account? Create one':'Already have an account? Sign in'}</button></div></main>}