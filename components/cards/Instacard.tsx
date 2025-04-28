'use client';
import { useEffect, useState } from "react";
import Image from 'next/image';

interface InstagramPost {
  id: string;
  caption?: string;
  image_url: string;
  storage_url?: string;
  original_image_url?: string;
  permalink: string;
  timestamp: string;
  media_type: string;
}

interface InstaCardProps {
  posts: InstagramPost[];
}

const INSTAGRAM_HANDLE = "@Joeysouza96";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default function InstaCard({ posts }: InstaCardProps) {
  console.log('InstaCard received posts:', posts?.length || 0);
  
  // Filter posts for images/carousels with #realestate in the caption
  const filteredPosts = posts.filter(post => {
    const isValidType = post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM";
    const hasRealEstateTag = post.caption?.toLowerCase().includes("#realestate");
    console.log(`Post ${post.id}: type=${post.media_type}, hasTag=${hasRealEstateTag}`);
    return isValidType && hasRealEstateTag;
  });

  console.log('Filtered posts count:', filteredPosts.length);

  // Carousel state
  const [current, setCurrent] = useState(0);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!filteredPosts || filteredPosts.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % filteredPosts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [filteredPosts]);

  // Reset error state when post changes
  useEffect(() => {
    if (filteredPosts && filteredPosts.length > 0) {
      const post = filteredPosts[current];
      setImageError(prev => ({ ...prev, [post.id]: false }));
      setRetryCount(prev => ({ ...prev, [post.id]: 0 }));
    }
  }, [current, filteredPosts]);

  if (!posts || posts.length === 0) {
    return <div className="text-gray-500 text-center p-4">Loading posts...</div>;
  }

  if (!filteredPosts || filteredPosts.length === 0) {
    return <div className="text-gray-500 text-center p-4">No real estate posts found.</div>;
  }

  const post = filteredPosts[current];

  // Get the best available image URL
  const getImageUrl = (post: InstagramPost) => {
    console.log(`Getting URL for post ${post.id}:`, {
      storage_url: post.storage_url,
      image_url: post.image_url,
      hasError: imageError[post.id]
    });
    
    // Try storage URL first if available
    if (!imageError[post.id] && post.storage_url) {
      return post.storage_url;
    }
    
    // Fallback to original URL
    if (!imageError[post.id]) {
      return post.image_url;
    }
    
    // If both failed, try original URL again
    if (retryCount[post.id] < MAX_RETRIES) {
      return post.image_url;
    }
    
    // If all retries failed, show a placeholder
    return '/instagram-placeholder.jpg';
  };

  const handleImageError = async (postId: string) => {
    console.log('Image error for post:', postId);
    
    const currentRetries = (retryCount[postId] || 0) + 1;
    setRetryCount(prev => ({
      ...prev,
      [postId]: currentRetries
    }));
    
    if (currentRetries <= MAX_RETRIES) {
      console.log(`Retry ${currentRetries}/${MAX_RETRIES} for post ${postId}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      setImageError(prev => ({
        ...prev,
        [postId]: false
      }));
    } else {
      setImageError(prev => ({
        ...prev,
        [postId]: true
      }));
      console.log(`Max retries exceeded for post ${postId}`);
    }
  };

  return (
    <div className="max-w-[15rem] mx-auto">
      {/* Phone-like container */}
      <div className="rounded-[2.5rem] shadow-xl overflow-hidden bg-black p-1 relative transform transition-all duration-300 hover:scale-105">
        {/* Screen container */}
        <div className="rounded-[2.3rem] overflow-hidden bg-white relative">
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-black z-10">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full"></div>
          </div>

          {/* Content area */}
          <div className="mt-6">
            {/* Instagram header */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
              <img
                src="/Instagram-logo.svg"
                alt="Instagram"
                className="w-6 h-6 invert"
              />
              <span className="text-white font-mono font-semibold tracking-wide text-sm">
                {INSTAGRAM_HANDLE}
              </span>
            </div>

            {/* Image container */}
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
                <Image
                  src={getImageUrl(post)}
                  alt={post.caption?.slice(0, 100) || "Instagram post"}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(post.id)}
                  priority
                  sizes="(max-width: 15rem) 100vw, 15rem"
                />
              </div>

              {/* Caption and date */}
              <div className="px-4 py-3 bg-white">
                <p className="text-gray-800 text-sm mb-2 line-clamp-2">
                  {post.caption}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(post.timestamp).toLocaleDateString()}
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
