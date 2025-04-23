// components/TypingText.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 80, className }) => {
  const [displayedText, setDisplayedText] = useState("");
  const currentIndex = useRef(0);

  useEffect(() => {
    setDisplayedText("");
    currentIndex.current = 0;

    const interval = setInterval(() => {
      if (currentIndex.current < text.length) {
        setDisplayedText((prev) => {
          const next = prev + text[currentIndex.current];
          console.log("Adding char:", text[currentIndex.current], "Result:", next);
          return next;
        });
        currentIndex.current++;
      } else {
        clearInterval(interval);
        console.log("Typing complete!"); // Add this line
      }
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [text, speed]);

  useEffect(() => {
    console.log("Current displayedText:", displayedText);
  }, [displayedText]);

  return <p className={className}>{displayedText}</p>;
};

export default TypingText;
