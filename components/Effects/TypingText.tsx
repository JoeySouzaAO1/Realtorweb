// components/TypingText.tsx
"use client";

import React, { useEffect, useState } from 'react';

interface TypingTextProps {
  text: string;
  className?: string;
  speed?: number;
}

const TypingText: React.FC<TypingTextProps> = ({ text, className = '', speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex += 1;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      "{displayedText}"
    </span>
  );
};

export default TypingText;
