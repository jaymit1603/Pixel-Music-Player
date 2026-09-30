import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!q) return NextResponse.json({ tracks: [] });

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: 'YouTube API is not configured on the server.' },
      { status: 503 }
    );
  }

  const params = new URLSearchParams({
    part: 'snippet',
    q,
    type: 'video',
    maxResults: '12',
    regionCode: 'IN',
    relevanceLanguage: 'en',
    videoEmbeddable: 'true',
    videoSyndicated: 'true',
    key,
  });

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
      { cache: 'no-store' }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? 'YouTube search failed.' },
        { status: response.status }
      );
    }

    const tracks = (data.items ?? [])
      .filter((item: any) => item?.id?.videoId)
      .map((item: any, index: number) => ({
        id: `yt:${item.id.videoId}`,
        videoId: item.id.videoId,
        youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        title: item.snippet?.title ?? 'Untitled',
        artist: item.snippet?.channelTitle ?? 'YouTube',
        album: 'YouTube Search',
        duration: '—',
        accent: ['#ff4d8d', '#8b6cff', '#00d9ff', '#ffd166', '#56e39f', '#ff7b54'][index % 6],
        thumbnail:
          item.snippet?.thumbnails?.medium?.url ??
          item.snippet?.thumbnails?.default?.url ??
          '',
      }));

    return NextResponse.json({ tracks });
  } catch {
    return NextResponse.json(
      { error: 'Unable to reach YouTube right now.' },
      { status: 502 }
    );
  }
}
