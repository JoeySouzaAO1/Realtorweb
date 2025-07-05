'use client';
import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end: number;
  decimals?: number;
  duration?: number; // seconds
  prefix?: string;
  suffix?: string;
}

export function CountUp({ end, decimals = 0, duration = 1.5, prefix = "", suffix = "" }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Use Intersection Observer for better performance
  useEffect(() => {
    if (!ref.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '50px' // Start animation 50px before entering viewport
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Optimized animation using requestAnimationFrame
  useEffect(() => {
    if (!hasAnimated) return;

    let startTime: number | null = null;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = end * easeOutQuart;
      
      setCount(value);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [hasAnimated, end, duration]);

  return (
    <span ref={ref} className="inline-block">
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
      <span className="text-2xl text-black ml-1">+</span>
    </span>
  );
}
