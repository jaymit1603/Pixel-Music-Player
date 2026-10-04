import { NextRequest, NextResponse } from 'next/server';

function parseDuration(value: string | undefined) {
  if (!value) return '—';
  const match = value.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return '—';

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (!totalSeconds) return '0:00';
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

type VideoDetails = {
  duration: string;
  embeddable: boolean;
};

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

  const musicQuery = `${q} official audio`;
  const params = new URLSearchParams({
    part: 'snippet',
    q: musicQuery,
    type: 'video',
    videoCategoryId: '10',
    videoEmbeddable: 'true',
    videoSyndicated: 'true',
    maxResults: '12',
    regionCode: 'IN',
    relevanceLanguage: 'en',
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

    const searchItems = (data.items ?? []).filter((item: any) => item?.id?.videoId);
    const videoIds = searchItems.map((item: any) => item.id.videoId).join(',');

    const videoResponse = videoIds
      ? await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status&id=${encodeURIComponent(videoIds)}&key=${encodeURIComponent(key)}`,
          { cache: 'no-store' }
        )
      : null;

    const videoData = videoResponse ? await videoResponse.json() : { items: [] };

    if (videoResponse && !videoResponse.ok) {
      return NextResponse.json(
        { error: videoData?.error?.message ?? 'YouTube video details failed.' },
        { status: videoResponse.status }
      );
    }

    const details = new Map<string, VideoDetails>(
      (videoData.items ?? []).map((item: any): [string, VideoDetails] => [
        item.id as string,
        {
          duration: parseDuration(item.contentDetails?.duration),
          embeddable: item.status?.embeddable !== false,
        },
      ])
    );

    const tracks = searchItems
      .filter((item: any) => details.get(item.id.videoId)?.embeddable !== false)
      .map((item: any, index: number) => ({
        id: `yt:${item.id.videoId}`,
        videoId: item.id.videoId,
        youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        title: item.snippet?.title ?? 'Untitled',
        artist: item.snippet?.channelTitle ?? 'YouTube',
        album: 'YouTube Search',
        duration: details.get(item.id.videoId)?.duration ?? '—',
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