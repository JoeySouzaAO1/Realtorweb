/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />
// @deno-types="https://raw.githubusercontent.com/denoland/deno/v1.x/cli/dts/lib.deno.ns.d.ts"
// @deno-types="https://raw.githubusercontent.com/denoland/deno/v1.x/cli/dts/lib.deno.unstable.d.ts"
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
const POST_LIMIT = 50; // Maximum posts to fetch per realtor
const BATCH_SIZE = 5; // Process posts in batches
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  const url = new URL(req.url);
  const path = url.pathname;
  if (path.includes('/proxy-image')) {
    const imageUrl = url.searchParams.get('url');
    if (!imageUrl) {
      return new Response('Missing image URL', {
        status: 400,
        headers: corsHeaders
      });
    }
    try {
      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://www.instagram.com/',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      const buffer = await response.arrayBuffer();
      return new Response(buffer, {
        headers: {
          'Content-Type': response.headers.get('content-type') || 'image/jpeg',
          'Cache-Control': 'public, max-age=3600',
          ...corsHeaders
        }
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      return new Response('Failed to fetch image', {
        status: 500,
        headers: corsHeaders
      });
    }
  }
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Required environment variables are not set');
    }
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: tokenRows, error: tokenError } = await supabaseClient.from("instagram_tokens").select("access_token, realtor_profile_user_id");
    if (tokenError || !tokenRows) {
      console.error("Error fetching Instagram tokens:", tokenError);
      return new Response("No Instagram tokens found", {
        status: 500,
        headers: corsHeaders
      });
    }
    const results = [];
    let nextUrl = null;
    for (const tokenRow of tokenRows){
      const accessToken = tokenRow.access_token;
      const realtor_profile_user_id = tokenRow.realtor_profile_user_id;
      const cursor = url.searchParams.get('cursor');
      nextUrl = cursor || `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp,media_type,thumbnail_url&limit=25&access_token=${accessToken}`;
      let allPosts = [];
      while(nextUrl && allPosts.length < POST_LIMIT){
        try {
          const res = await fetch(nextUrl);
          const data = await res.json();
          // NEW LOGGING: Log the full API response for this batch
          console.log(`Instagram API response for realtor ${realtor_profile_user_id}:`, JSON.stringify(data, null, 2));
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
      for(let i = 0; i < allPosts.length; i += BATCH_SIZE){
        const batch = allPosts.slice(i, i + BATCH_SIZE);
        for (const post of batch){
          try {
            if (post.media_type !== 'IMAGE' && post.media_type !== 'CAROUSEL_ALBUM') {
              continue;
            }
            
            // NEW LOGGING: Log each post's details before upserting
            console.log(`Post details for id ${post.id}:`, JSON.stringify({
              id: post.id,
              media_url: post.media_url,
              caption: post.caption,
              permalink: post.permalink,
              timestamp: post.timestamp,
              media_type: post.media_type
            }, null, 2));
            
            // FIXED: Remove the non-existent image_url field
            const { data: upsertData, error: upsertError } = await supabaseClient
              .from("instagram_posts")
              .upsert({
                id: post.id,
                realtor_profile_user_id,
                caption: post.caption || null,
                storage_url: null,
                original_image_url: post.media_url,  // This is the correct field
                permalink: post.permalink,
                timestamp: post.timestamp,
                media_type: post.media_type
              });
            
            // NEW: Log the result of the upsert operation
            if (upsertError) {
              console.error(`Database upsert error for post ${post.id}:`, upsertError);
              results.push({
                id: post.id,
                status: 'error',
                error: upsertError.message
              });
            } else {
              console.log(`Successfully upserted post ${post.id} to database`);
              results.push({
                id: post.id,
                status: 'success',
                url: post.media_url
              });
            }
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
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error:', errorMessage);
    return new Response(JSON.stringify({
      error: errorMessage
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
