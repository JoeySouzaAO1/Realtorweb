'use client';
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    id: 1,
    name: "Samantha Johnson",
    title: "First-Time Home Buyer",
    testimonial: "Joey made buying my first home such a smooth and enjoyable experience. His expertise and patience were invaluable!",
    image: null // Set to null for now
  },
  {
    id: 2,
    name: "Michael and Jessica Davis",
    title: "Relocating Family",
    testimonial: "We relocated from out of state and Joey was incredibly helpful in finding the perfect neighborhood for our family. Highly recommend!",
    image: null
  },
  {
    id: 3,
    name: "Robert Smith",
    title: "Experienced Investor",
    testimonial: "Joey's market knowledge is unmatched. He helped me find a fantastic investment property that exceeded my expectations.",
    image: null
  }
];

// Single Testimonial Card
const Testimonial = ({ testimonial }) => (
  <div className="flex justify-center">
    <div className="relative bg-gradient-to-br from-pink-50 to-yellow-50 rounded-2xl shadow-lg p-8 max-w-xl w-full border border-red-100">
      <div className="absolute -top-8 left-8">
        {/* Decorative quote icon */}
        <svg className="w-10 h-10 text-red-200 opacity-60" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.17 6A5.002 5.002 0 002 11c0 2.76 2.24 5 5 5v2c-3.87 0-7-3.13-7-7a7 7 0 017-7v2zm10 0A5.002 5.002 0 0012 11c0 2.76 2.24 5 5 5v2c-3.87 0-7-3.13-7-7a7 7 0 017-7v2z"/>
        </svg>
      </div>
      <p className="text-gray-800 italic text-lg md:text-xl mb-6 mt-2">
        “{testimonial.testimonial}”
      </p>
      <div className="flex items-center mt-4">
        {testimonial.image && (
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-14 h-14 rounded-full object-cover border-4 border-red-200 shadow mr-4"
          />
        )}
        <div>
          <p className="font-bold text-red-500 text-lg">{testimonial.name}</p>
          <p className="text-gray-600 text-sm">{testimonial.title}</p>
        </div>
      </div>
    </div>
  </div>
);

// Slider component
export const TestimonialSlider = () => {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,         // Enable autoplay
    autoplaySpeed: 6000,    // Slide changes every 6 seconds
    cssEase: "cubic-bezier(0.4,0,0.2,1)",
    arrows: false,
    appendDots: dots => (
      <div>
        <ul className="flex justify-center mt-6 space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-3 h-3 bg-red-300 rounded-full opacity-70 hover:opacity-100 transition" />
    )
  };

  return (
    <div className="w-full px-2">
      {!isSSR && (
        <Slider {...settings}>
          {testimonials.map(testimonial => (
            <div key={testimonial.id}>
              <Testimonial testimonial={testimonial} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};