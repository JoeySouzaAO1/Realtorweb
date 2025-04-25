/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

// @deno-types="https://raw.githubusercontent.com/denoland/deno/v1.x/cli/dts/lib.deno.ns.d.ts"
// @deno-types="https://raw.githubusercontent.com/denoland/deno/v1.x/cli/dts/lib.deno.unstable.d.ts"

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "jsr:@std/http/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = 'instagram-images';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const BATCH_SIZE = 10; // Process posts in batches

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

async function uploadToStorage(supabase: any, buffer: Uint8Array, fileName: string, retryCount = 0): Promise<string> {
  try {
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
      return uploadToStorage(supabase, buffer, fileName, retryCount + 1);
    }
    
    throw error;
  }
}

serve(async (req: Request) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Required environment variables are not set');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Ensure bucket exists with proper configuration
    try {
      const { data: bucket, error } = await supabaseClient.storage.getBucket(BUCKET_NAME);
      if (error && error.message.includes('does not exist')) {
        await supabaseClient.storage.createBucket(BUCKET_NAME, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png'],
          fileSizeLimit: 1024 * 1024 * 5 // 5MB
        });
      }
    } catch (error) {
      console.error("Error checking/creating bucket:", error);
    }

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

    // Fetch posts from Instagram API
    let allPosts: InstagramPost[] = [];
    let nextUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp,media_type,thumbnail_url&limit=100&access_token=${accessToken}`;

    while (nextUrl) {
      try {
        const res = await fetch(nextUrl);
        const data = await res.json();
        
        if (data.error) {
          console.error(`Instagram API error:`, data.error);
          break;
        }
        
        if (data.data) {
          allPosts = allPosts.concat(data.data);
        }
        
        nextUrl = data.paging?.next || null;
      } catch (error) {
        console.error(`Error fetching Instagram posts:`, error);
        break;
      }
    }

    // Process posts in batches
    const results = [];
    for (let i = 0; i < allPosts.length; i += BATCH_SIZE) {
      const batch = allPosts.slice(i, i + BATCH_SIZE);
      
      // Process each post in the batch
      for (const post of batch) {
        try {
          // Only process image or carousel posts
          if (post.media_type !== 'IMAGE' && post.media_type !== 'CAROUSEL_ALBUM') {
            continue;
          }

          // Try to download and store the image
          let storageUrl = null;
          try {
            const imageBuffer = await downloadImage(post.media_url);
            const fileName = `${post.id}.jpg`;
            storageUrl = await uploadToStorage(supabaseClient, imageBuffer, fileName);
            console.log(`Successfully stored image for post ${post.id}`);
          } catch (imageError) {
            console.error(`Failed to process image for post ${post.id}:`, imageError);
          }

          // Update the post in the database
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
      results: results
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

