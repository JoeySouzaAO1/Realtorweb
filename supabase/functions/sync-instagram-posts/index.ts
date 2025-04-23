import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.4";

console.log("SUPABASE_URL:", Deno.env.get("SUPABASE_URL"));
console.log("SUPABASE_SERVICE_ROLE_KEY:", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

serve(async (req) => { // Removed the unused 'req'
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // 1. Get the access token from your instagram_tokens table
  const { data: tokenRow, error: tokenError } = await supabase
    .from("instagram_tokens")
    .select("access_token, realtor_profile_id")
    .limit(1)
    .single();

  if (tokenError || !tokenRow) {
    console.error("Error fetching Instagram token:", tokenError); // Added error logging
    return new Response("No Instagram token found", { status: 500 });
  }

  const accessToken = tokenRow.access_token;
  const realtor_profile_id = tokenRow.realtor_profile_id;

  // 2. Fetch posts from Instagram API
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

  // 3. Upsert posts into instagram_posts table
  let upsertCount = 0;
  for (const post of allPosts) {
    console.log("Fetched post:", post);
    try {
      await supabase.from("instagram_posts").upsert({
        id: post.id,
        realtor_profile_id,
        caption: post.caption || null, // Handle null captions
        image_url: post.media_url,
        permalink: post.permalink,
        timestamp: post.timestamp,
        media_type: post.media_type,
      });
      upsertCount++;
    } catch (upsertError) {
      console.error("Error upserting post:", post.id, upsertError);
    }
  }

  return new Response(`Upserted ${upsertCount} posts`, { status: 200 });
});

