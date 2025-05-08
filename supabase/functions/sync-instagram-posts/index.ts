/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

// @deno-types="https://raw.githubusercontent.com/denoland/deno/v1.x/cli/dts/lib.deno.ns.d.ts"
// @deno-types="https://raw.githubusercontent.com/denoland/deno/v1.x/cli/dts/lib.deno.unstable.d.ts"

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const POST_LIMIT = 50; // Maximum posts to fetch per realtor
const BATCH_SIZE = 5; // Process posts in batches

interface InstagramPost {
  id: string;
  media_url: string;
  caption?: string;
  permalink: string;
  timestamp: string;
  media_type: string;
  thumbnail_url?: string;
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

    // Get all Instagram tokens
    const { data: tokenRows, error: tokenError } = await supabaseClient
      .from("instagram_tokens")
      .select("access_token, realtor_profile_user_id");

    if (tokenError || !tokenRows) {
      console.error("Error fetching Instagram tokens:", tokenError);
      return new Response("No Instagram tokens found", { status: 500 });
    }

    const results = [];
    
    // Process each realtor's token
    for (const tokenRow of tokenRows) {
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
            const remainingSlots = POST_LIMIT - allPosts.length;
            const newPosts = data.data.slice(0, remainingSlots);
            allPosts = allPosts.concat(newPosts);
            
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

      console.log(`Fetched ${allPosts.length} posts out of ${POST_LIMIT} limit for realtor ${realtor_profile_user_id}`);

      // Process posts in smaller batches
      for (let i = 0; i < allPosts.length; i += BATCH_SIZE) {
        const batch = allPosts.slice(i, i + BATCH_SIZE);
        
        // Process each post in the batch
        for (const post of batch) {
          try {
            if (post.media_type !== 'IMAGE' && post.media_type !== 'CAROUSEL_ALBUM') {
              continue;
            }

            // Upsert the post data with just the original URLs
            await supabaseClient.from("instagram_posts").upsert({
              id: post.id,
              realtor_profile_user_id,
              caption: post.caption || null,
              image_url: post.media_url,
              storage_url: null,
              original_image_url: post.media_url,
              permalink: post.permalink,
              timestamp: post.timestamp,
              media_type: post.media_type
            });

            results.push({
              id: post.id,
              status: 'success',
              url: post.media_url
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
    }

    return new Response(JSON.stringify({
      message: `Processed ${results.length} posts`,
      results: results,
      next_cursor: nextUrl
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

