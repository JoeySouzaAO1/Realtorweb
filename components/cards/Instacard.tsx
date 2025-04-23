'use client';
import { useEffect, useState } from "react";

interface InstagramPost {
  id: string;
  caption?: string;
  image_url: string;
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
  const filteredPosts = posts.filter(
    post =>
      (post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM") &&
      post.caption &&
      post.caption.toLowerCase().includes("#realestate")
  );

  // Carousel state
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!filteredPosts || filteredPosts.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % filteredPosts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [filteredPosts]);

  if (!filteredPosts || filteredPosts.length === 0)
    return <div>No posts found.</div>;

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
                <img
                  src={post.image_url}
                  alt={post.caption?.slice(0, 100) || "Instagram post"}
                  className="absolute inset-0 w-full h-full object-cover"
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
