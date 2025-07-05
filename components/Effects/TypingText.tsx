// components/TypingText.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';

interface TypingTextProps {
  text: string;
  className?: string;
  speed?: number;
}

const TypingText: React.FC<TypingTextProps> = ({ text, className = '', speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    lastTimeRef.current = 0;

    const animate = (currentTime: number) => {
      if (currentTime - lastTimeRef.current >= speed) {
        setCurrentIndex(prevIndex => {
          const newIndex = prevIndex + 1;
          if (newIndex <= text.length) {
            setDisplayedText(text.slice(0, newIndex));
            lastTimeRef.current = currentTime;
            return newIndex;
          }
          return prevIndex;
        });
      }

      if (currentIndex < text.length) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, speed]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <span className={`${className} inline-block`}>
      "{displayedText}"
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default TypingText;
