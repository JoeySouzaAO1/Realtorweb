/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

// @deno-types="https://raw.githubusercontent.com/denoland/deno/v1.x/cli/dts/lib.deno.ns.d.ts"
// @deno-types="https://raw.githubusercontent.com/denoland/deno/v1.x/cli/dts/lib.deno.unstable.d.ts"

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
const BUCKET_NAME = 'instagram-images';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const BATCH_SIZE = 5; // Process posts in batches
const POST_LIMIT = 50; // Maximum posts to fetch per realtor

interface InstagramPost {
  id: string;
  media_url: string;
  caption?: string;
  permalink: string;
  timestamp: string;
  media_type: string;
  thumbnail_url?: string;
}

async function downloadImage(url: string, retryCount = 0): Promise<Uint8Array> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    
    return new Uint8Array(await response.arrayBuffer());
  } catch (error) {
    console.error(`Error downloading image from ${url} (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return downloadImage(url, retryCount + 1);
    }
    
    throw error;
  }
}

async function uploadToStorage(
  supabase: any, 
  buffer: Uint8Array, 
  postId: string, 
  realtor_profile_user_id: string,
  retryCount = 0
): Promise<string> {
  try {
    const fileName = `${realtor_profile_user_id}/${postId}-${Date.now()}.jpg`;
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicUrl.publicUrl;
  } catch (error) {
    console.error(`Upload error (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return uploadToStorage(supabase, buffer, postId, realtor_profile_user_id, retryCount + 1);
    }
    
    throw error;
  }
}

async function ensureBucketExists(supabaseClient: any) {
  try {
    const { data: bucket, error: bucketError } = await supabaseClient.storage.getBucket(BUCKET_NAME);
    if (bucketError && bucketError.message.includes('does not exist')) {
      const { error: createError } = await supabaseClient.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png'],
        fileSizeLimit: 1024 * 1024 * 5 // 5MB
      });
      if (createError) throw createError;
    }
  } catch (error) {
    throw new Error(`Failed to initialize storage bucket: ${error.message}`);
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Required environment variables are not set');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Ensure bucket exists with proper configuration
    await ensureBucketExists(supabaseClient);

    // Get Instagram token
    const { data: tokenRow, error: tokenError } = await supabaseClient
      .from("instagram_tokens")
      .select("access_token, realtor_profile_user_id")
      .limit(1)
      .single();

    if (tokenError || !tokenRow) {
      console.error("Error fetching Instagram token:", tokenError);
      return new Response("No Instagram token found", { status: 500 });
    }

    const accessToken = tokenRow.access_token;
    const realtor_profile_user_id = tokenRow.realtor_profile_user_id;

    // Get cursor from query params for pagination
    const url = new URL(req.url);
    const cursor = url.searchParams.get('cursor');
    
    // Fetch posts from Instagram API with pagination
    let allPosts: InstagramPost[] = [];
    let nextUrl = cursor || `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp,media_type,thumbnail_url&limit=25&access_token=${accessToken}`;

    // Only fetch until we reach POST_LIMIT
    while (nextUrl && allPosts.length < POST_LIMIT) {
      try {
        const res = await fetch(nextUrl);
        const data = await res.json();
        
        if (data.error) {
          console.error(`Instagram API error:`, data.error);
          throw new Error(data.error.message);
        }
        
        if (data.data) {
          // Only add posts up to our limit
          const remainingSlots = POST_LIMIT - allPosts.length;
          const newPosts = data.data.slice(0, remainingSlots);
          allPosts = allPosts.concat(newPosts);
          
          // If we've reached our limit, stop pagination
          if (allPosts.length >= POST_LIMIT) {
            nextUrl = null;
            break;
          }
        }
        
        nextUrl = data.paging?.next || null;
      } catch (error) {
        console.error(`Error fetching Instagram posts:`, error);
        throw error;
      }
    }

    console.log(`Fetched ${allPosts.length} posts out of ${POST_LIMIT} limit`);

    // Process posts in smaller batches
    const results = [];
    for (let i = 0; i < allPosts.length; i += BATCH_SIZE) {
      const batch = allPosts.slice(i, i + BATCH_SIZE);
      
      // Process each post in the batch
      for (const post of batch) {
        try {
          if (post.media_type !== 'IMAGE' && post.media_type !== 'CAROUSEL_ALBUM') {
            continue;
          }

          let storageUrl = null;
          try {
            const imageBuffer = await downloadImage(post.media_url);
            storageUrl = await uploadToStorage(supabaseClient, imageBuffer, post.id, realtor_profile_user_id);
          } catch (imageError) {
            console.error(`Failed to process image for post ${post.id}:`, imageError);
          }

          await supabaseClient.from("instagram_posts").upsert({
            id: post.id,
            realtor_profile_user_id,
            caption: post.caption || null,
            image_url: post.media_url,
            storage_url: storageUrl,
            original_image_url: post.media_url,
            permalink: post.permalink,
            timestamp: post.timestamp,
            media_type: post.media_type
          });

          results.push({
            id: post.id,
            status: storageUrl ? 'success' : 'original',
            url: storageUrl || post.media_url
          });
        } catch (error) {
          console.error(`Error processing post ${post.id}:`, error);
          results.push({
            id: post.id,
            status: 'error',
            error: error.message
          });
        }
      }
    }

    return new Response(JSON.stringify({
      message: `Processed ${results.length} posts`,
      results: results,
      next_cursor: nextUrl // Include the next cursor in response
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

