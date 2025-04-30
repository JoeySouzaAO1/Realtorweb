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
  // Only log initial posts count
  console.log('InstaCard received posts:', posts?.length || 0);
  
  // Filter posts for images/carousels with #realestate in the caption
  const filteredPosts = posts.filter(post => {
    const isValidType = post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM";
    const hasRealEstateTag = post.caption?.toLowerCase().includes("#realestate");
    // Remove individual post logging
    return isValidType && hasRealEstateTag;
  });

  // Only log filtered count once
  console.log('Filtered posts count:', filteredPosts.length);

  // Carousel state
  const [current, setCurrent] = useState(0);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});
  const [failedStorageUrls, setFailedStorageUrls] = useState<Record<string, boolean>>({});

  // Add state to track if we've switched to Instagram URLs
  const [useInstagramUrls, setUseInstagramUrls] = useState(false);

  const getImageUrl = (post: InstagramPost) => {
    // Always use Instagram URLs if storage failed
    if (useInstagramUrls) {
      return post.original_image_url || post.image_url || '/instagram-placeholder.jpg';
    }

    // Try storage URL first
    if (post.storage_url && !failedStorageUrls[post.id]) {
      return post.storage_url;
    }

    // Fallback to Instagram URL
    return post.original_image_url || post.image_url || '/instagram-placeholder.jpg';
  };

  const handleImageError = async (postId: string) => {
    console.log('Image error for post:', postId);
    
    // Switch to Instagram URLs globally after first storage error
    setUseInstagramUrls(true);
    
    setFailedStorageUrls(prev => ({
      ...prev,
      [postId]: true
    }));
  };

  // Modify the rotation effect logging
  useEffect(() => {
    if (!filteredPosts || filteredPosts.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrent(prev => {
        const next = (prev + 1) % filteredPosts.length;
        // Optional: keep rotation logging if helpful for debugging
        console.log(`Rotating from post ${prev} to ${next}`);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [filteredPosts.length]);

  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  if (!posts || posts.length === 0) {
    return <div className="text-gray-500 text-center p-4">Loading posts...</div>;
  }

  if (!filteredPosts || filteredPosts.length === 0) {
    return <div className="text-gray-500 text-center p-4">No real estate posts found.</div>;
  }

  const post = filteredPosts[current];

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
                  className={`object-cover transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onError={() => handleImageError(post.id)}
                  onLoadingComplete={() => setIsLoading(false)}
                  onLoadStart={() => setIsLoading(true)}
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
