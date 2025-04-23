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

  useEffect(() => {
    function handleScroll() {
      if (!ref.current || hasAnimated) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setHasAnimated(true);
      }
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    let start = 0;
    const startTime = performance.now();
    function animate(currentTime: number) {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const value = start + (end - start) * progress;
      setCount(value);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }
    requestAnimationFrame(animate);
  }, [hasAnimated, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
      <span style={{ fontSize: '25px', color: '#000', marginLeft: '2px' }}>+</span>
    </span>
  );
}
