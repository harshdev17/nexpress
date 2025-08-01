"use client";

import { useState } from "react";

export default function Reviews() {
  const testimonials = [
    {
      text: "I just want to say how wonderful your delivery guys are; they are efficient and thoughtful and ensure heavy boxes make it over the threshold and are stacked safely. This is enormously appreciated, especially in Covid times.",
      name: "Zora",
      location: "SW1"
    },
    {
      text: "A big 'thank you' to your team for the swift delivery today - and for taking such good care in placing the boxes away from the wall to avoid any scratches. This is great service and much appreciated!",
      name: "Sebastian",
      location: "SE1"
    },
    {
      text: "Thank you very much for the fast and efficient delivery",
      name: "Susan",
      location: "NW3"
    },
    {
      text: "Excellent service! The delivery was on time and the staff was very professional. Highly recommend!",
      name: "Michael",
      location: "W1"
    },
    {
      text: "Great experience with Nexpress. Fast delivery and excellent customer service. Will definitely use again.",
      name: "Emma",
      location: "E1"
    },
    {
      text: "Very reliable service. The delivery team was courteous and careful with our packages.",
      name: "David",
      location: "N1"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Responsive slides per view
  const getSlidesPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1; // mobile
      if (window.innerWidth < 1024) return 2; // tablet
      return 3; // desktop
    }
    return 3; // default
  };

  const slidesPerView = getSlidesPerView();
  const maxSlides = testimonials.length - slidesPerView + 1;

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlides - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#368899] mb-8 md:mb-12 text-center">
          What Our Customers Say
        </h2>
        
        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="absolute left-0 md:-left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6 text-[#368899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide >= maxSlides - 1}
            className="absolute right-0 md:-right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6 text-[#368899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Testimonials Slider */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 md:px-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                    {/* Quote Icon */}
                    <div className="mb-3 md:mb-4">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-[#368899]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                      </svg>
                    </div>
                    
                    {/* Testimonial Text */}
                    <p className="text-gray-700 leading-relaxed mb-4 md:mb-6 text-xs md:text-sm">
                      "{testimonial.text}"
                    </p>
                    
                    {/* Customer Info */}
                    <div className="flex justify-between items-center mt-auto">
                      <span className="font-semibold text-gray-900 text-sm md:text-base">{testimonial.name}</span>
                      <span className="text-[#368899] font-medium text-xs md:text-sm">{testimonial.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center space-x-1 md:space-x-2 mt-6 md:mt-8">
          {Array.from({ length: maxSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-[#368899] scale-110' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
