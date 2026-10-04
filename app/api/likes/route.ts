import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export async function GET(req: NextRequest) {
  const s = await createClient();
  if (!s) return NextResponse.json({ liked: false, demo: true });

  const { data: { user } } = await s.auth.getUser();
  if (!user) return NextResponse.json({ liked: false, authenticated: false });

  const trackId = req.nextUrl.searchParams.get('trackId');
  if (!trackId) return NextResponse.json({ error: 'trackId is required' }, { status: 400 });

  const { data, error } = await s
    .from('likes')
    .select('track_id')
    .eq('user_id', user.id)
    .eq('track_id', trackId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ liked: Boolean(data), authenticated: true });
}

export async function POST(req: NextRequest) {
  const s = await createClient();
  if (!s) return NextResponse.json({ demo: true, liked: false });

  const { data: { user } } = await s.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  const { trackId, liked } = await req.json();
  if (!trackId) return NextResponse.json({ error: 'trackId is required' }, { status: 400 });

  if (liked) {
    const { error } = await s.from('likes').insert({ user_id: user.id, track_id: trackId });
    if (error && error.code !== '23505') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await s.from('likes').delete().eq('user_id', user.id).eq('track_id', trackId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ liked: Boolean(liked) });
}
