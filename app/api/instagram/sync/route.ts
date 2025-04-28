import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { Readable } from 'stream';
import { Buffer } from 'buffer';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'instagram-images';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function downloadImage(url: string): Promise<Buffer> {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return Buffer.from(response.data);
  } catch (error: any) {
    console.error(`Error downloading image from ${url}:`, error.message);
    throw new Error(`Failed to download image: ${error.message}`);
  }
}

async function uploadToStorage(buffer: Buffer, fileName: string, retryCount = 0): Promise<string> {
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
  } catch (error: any) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return uploadToStorage(buffer, fileName, retryCount + 1);
    }
    throw new Error(`Failed to upload image after ${MAX_RETRIES} attempts: ${error.message}`);
  }
}

export async function POST(req: Request) {
  try {
    const { posts } = await req.json();

    const results = await Promise.allSettled(
      posts.map(async (post: any) => {
        try {
          // Download image from Instagram
          const imageBuffer = await downloadImage(post.image_url);
          
          // Generate unique filename
          const fileName = `${post.id}.jpg`;
          
          // Upload to Supabase Storage
          const storageUrl = await uploadToStorage(imageBuffer, fileName);
          
          // Update database record
          const { error: updateError } = await supabase
            .from('instagram_posts')
            .update({
              storage_url: storageUrl,
              original_image_url: post.image_url
            })
            .eq('id', post.id);

          if (updateError) throw updateError;

          return {
            id: post.id,
            status: 'success',
            storage_url: storageUrl
          };
        } catch (error: any) {
          return {
            id: post.id,
            status: 'error',
            error: error.message
          };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to process Instagram posts: ${error.message}` },
      { status: 500 }
    );
  }
} 