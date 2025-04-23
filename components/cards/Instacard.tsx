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
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-[15rem] mx-auto rounded-2xl shadow-lg overflow-hidden border-4 border-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 bg-white transition hover:shadow-xl cursor-pointer"
      style={{ textDecoration: "none", color: "black" }}
    >
      <div className="max-w-xs mx-auto rounded-2xl shadow-lg overflow-hidden border-4 border-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 bg-white relative">
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-t-2xl">
          <img
            src="/instagram-logo.svg"
            alt="Instagram"
            className="w-6 h-6"
          />
          <span className="text-white font-semibold tracking-wide">{INSTAGRAM_HANDLE}</span>
        </div>

        {/* Image area */}
        <div className="relative w-full" style={{ aspectRatio: "4 / 5", background: "#fafafa" }}>
          <img
            src={post.image_url}
            alt={post.caption?.slice(0, 100) || "Instagram post"}
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        </div>

        {/* Caption and date */}
        <div className="px-4 py-2">
          <p className="text-gray-800 text-xs mb-1 line-clamp-2" style={{ maxHeight: '2.5em', overflow: 'hidden' }}>
            {post.caption}
          </p>
          <span className="text-xs text-gray-400">
            {new Date(post.timestamp).toLocaleDateString()}
          </span>
        </div>
      </div>
    </a>
  );
}
