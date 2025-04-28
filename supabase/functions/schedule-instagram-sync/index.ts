/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";


serve(async (req: Request) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables');
    }

    let nextCursor = null;
    let totalProcessed = 0;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    do {
      try {
        const functionUrl = `${supabaseUrl}/functions/v1/sync-instagram-posts`;
        const url = new URL(functionUrl);
        
        if (nextCursor && nextCursor.startsWith('http')) {
          url.searchParams.set('cursor', nextCursor);
        }

        console.log(`Starting sync batch${nextCursor ? ' (continuation)' : ''}`);

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error(`Sync function failed with status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }

        totalProcessed += result.results.length;
        nextCursor = result.next_cursor;

        console.log(`Processed batch of ${result.results.length} posts. Running total: ${totalProcessed}. ${nextCursor ? 'More posts available.' : 'No more posts.'}`);

        // Reset retry count on successful request
        retryCount = 0;

        if (nextCursor) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Error processing batch: ${error.message}`);
        retryCount++;
        
        if (retryCount >= MAX_RETRIES) {
          throw new Error(`Failed after ${MAX_RETRIES} retries: ${error.message}`);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay before retry
        continue; // Try the same cursor again
      }
    } while (nextCursor); // Continue while we have a next cursor

    return new Response(JSON.stringify({
      message: `Completed full sync. Processed ${totalProcessed} posts.`,
      total_processed: totalProcessed
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Scheduler error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});