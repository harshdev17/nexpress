"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { categories } from "../categories";

export default function CategorySection() {
  const sliderRef = useRef(null);

  // Get categories for display and duplicate for infinite loop
  const displayCategories = categories.slice(0, 10);
  const duplicatedCategories = [...displayCategories, ...displayCategories, ...displayCategories];

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Auto slide functionality
  useEffect(() => {
    const autoSlide = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        
        // Reset to beginning when reaching end
        if (sliderRef.current.scrollLeft >= sliderRef.current.scrollWidth - sliderRef.current.clientWidth - 100) {
          setTimeout(() => {
            sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          }, 500);
        }
      }
    }, 3000); // Auto slide every 3 seconds

    return () => clearInterval(autoSlide);
  }, []);

  return (
    <div className="py-8 md:py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2  text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
            <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Browse Categories
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
            Shop by Category
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Auto-scrolling categories • Use arrows to navigate
          </p>
        </div>

        {/* Category Slider with Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200 hover:border-[#368899]"
          >
            <svg className="w-5 h-5 md:w-7 md:h-7 text-[#368899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200 hover:border-[#368899]"
          >
            <svg className="w-5 h-5 md:w-7 md:h-7 text-[#368899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slider Container */}
          <div
            ref={sliderRef}
            className="flex gap-3 md:gap-6 overflow-x-auto scrollbar-hide px-12 md:px-20"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {duplicatedCategories.map((category, index) => (
              <Link 
                href={category.url} 
                key={`${category.name}-${index}`}
                className="group flex-shrink-0"
              >
                <div className="bg-white rounded-xl md:rounded-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 hover:-translate-y-2 w-48 md:w-64 h-32 md:h-48">
                  {/* Category Header */}
                  <div className="bg-gradient-to-r from-[#368899] to-[#2d7a8a] h-full p-3 md:p-6 text-white text-center flex flex-col items-center justify-center">
                    <div className="w-10 h-10 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 md:mb-4">
                      <svg className="w-5 h-5 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-sm md:text-lg font-bold">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Gradient Overlays */}
        </div>

        {/* Instructions */}
        <div className="text-center mt-6 md:mt-8">
          <p className="text-xs md:text-sm text-gray-500">
            💡 Auto-scrolling • Use arrows • Click to explore
          </p>
        </div>
      </div>
    </div>
  );
}

// Custom CSS to hide scrollbar
const styles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;