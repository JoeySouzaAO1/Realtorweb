'use client';
import { useEffect, useState, useCallback, useMemo } from "react";
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

export default function InstaCard({ posts }: InstaCardProps) {
  // Filter posts for images/carousels with #realestate in the caption
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const isValidType = post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM";
      const hasRealEstateTag = post.caption?.toLowerCase().includes("#realestate");
      return isValidType && hasRealEstateTag;
    });
  }, [posts]);

  const [current, setCurrent] = useState(0);
  const [failedStorageUrls, setFailedStorageUrls] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Optimized image URL selection
  const getImageUrl = useCallback((post: InstagramPost) => {
    // If storage URL failed, use Instagram URL
    if (post.storage_url && !failedStorageUrls.has(post.id)) {
      return post.storage_url;
    }
    
    // Fallback to Instagram URL
    return post.original_image_url || post.image_url || '/instagram-placeholder.jpg';
  }, [failedStorageUrls]);

  // Optimized error handling
  const handleImageError = useCallback((postId: string) => {
    setFailedStorageUrls(prev => new Set(prev).add(postId));
  }, []);

  // Optimized carousel rotation
  useEffect(() => {
    if (filteredPosts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % filteredPosts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [filteredPosts.length]);

  // Loading state
  if (!posts || posts.length === 0) {
    return (
      <div className="max-w-[15rem] mx-auto">
        <div className="rounded-[2.5rem] shadow-xl overflow-hidden bg-gray-200 p-1 animate-pulse">
          <div className="rounded-[2.3rem] overflow-hidden bg-gray-300 h-80"></div>
        </div>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="max-w-[15rem] mx-auto">
        <div className="text-gray-500 text-center p-4 text-sm">
          No real estate posts found.
        </div>
      </div>
    );
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                className="w-6 h-6"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
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
              <div className="relative w-full aspect-[4/5] bg-gray-100">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                )}
                <Image
                  src={getImageUrl(post)}
                  alt={post.caption?.slice(0, 100) || "Instagram post"}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onError={() => handleImageError(post.id)}
                  onLoad={() => setIsLoading(false)}
                  onLoadStart={() => setIsLoading(true)}
                  sizes="(max-width: 240px) 100vw, 240px"
                  loading="lazy"
                />
              </div>

              {/* Caption and date */}
              <div className="px-4 py-3 bg-white">
                <p className="text-gray-800 text-sm mb-2 line-clamp-2">
                  {post.caption}
                </p>
                <time className="text-xs text-gray-500">
                  {new Date(post.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
              </div>
            </a>

            {/* Carousel indicators */}
            {filteredPosts.length > 1 && (
              <div className="flex justify-center py-2 space-x-1">
                {filteredPosts.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === current ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
