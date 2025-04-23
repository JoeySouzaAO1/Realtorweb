// app/api/instagram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getInstagramToken() {
  const { data, error } = await supabase
    .from('instagram_tokens')
    .select('access_token')
    .limit(1)
    .single();

  if (error || !data) throw new Error('Instagram token not found');
  return data.access_token;
}

async function fetchInstagramPosts(accessToken: string) {
  let allPosts: any[] = [];
  let nextUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp,media_type,thumbnail_url&limit=100&access_token=${accessToken}`;

  while (nextUrl) {
    const res = await fetch(nextUrl);
    const data = await res.json();
    if (data.data) {
      allPosts = allPosts.concat(data.data);
    }
    nextUrl = data.paging?.next || null;
  }

  return allPosts;
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getInstagramToken();
    const posts = await fetchInstagramPosts(accessToken);

    // Optionally filter/sanitize here
    const filteredPosts = posts.filter(
      (post: any) =>
        (post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM') &&
        post.caption &&
        post.caption.toLowerCase().includes('#realestate')
    );

    return NextResponse.json(filteredPosts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

