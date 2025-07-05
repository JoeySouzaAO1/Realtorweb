'use client';
import React, { useState, useEffect, useCallback } from 'react';

interface SliderProps {
  children: React.ReactNode[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  showDots?: boolean;
  className?: string;
}

export const LightweightSlider: React.FC<SliderProps> = ({
  children,
  autoplay = true,
  autoplaySpeed = 6000,
  showDots = true,
  className = '',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % children.length);
  }, [children.length, isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
  }, [isTransitioning]);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(nextSlide, autoplaySpeed);
    return () => clearInterval(interval);
  }, [autoplay, autoplaySpeed, nextSlide]);

  // Reset transition state after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 600); // Match CSS transition duration

    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Slider container */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0"
            style={{ minWidth: '100%' }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      {showDots && children.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-red-500 opacity-100'
                  : 'bg-red-300 opacity-70 hover:opacity-100'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};