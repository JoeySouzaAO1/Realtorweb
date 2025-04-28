import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('instagram_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filter out posts without storage URLs and use fallback to original URL
    const processedPosts = posts.map(post => ({
      ...post,
      image_url: post.storage_url || post.original_image_url
    }));

    return NextResponse.json({ posts: processedPosts });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to fetch Instagram posts: ${error.message}` },
      { status: 500 }
    );
  }
} 