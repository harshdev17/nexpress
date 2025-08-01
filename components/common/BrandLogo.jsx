"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function BrandLogo() {
  const brands = [
    {
      name: "Coca Cola",
      image: "/brand-logo-webp/main_10_cocacolalogo6jpeg.webp"
    },
    {
      name: "Fentimans",
      image: "/brand-logo-webp/main_11_fentimanslogo6jpg.webp"
    },
    {
      name: "7UP",
      image: "/brand-logo-webp/main_13_7uppng.webp"
    },
    {
      name: "Harrogate",
      image: "/brand-logo-webp/main_14_harrogatelogojpg.webp"
    },
    {
      name: "Badoit",
      image: "/brand-logo-webp/main_15_badoitlogopng.webp"
    },
    {
      name: "Hildon",
      image: "/brand-logo-webp/main_16_hildonlogopng.webp"
    },
    {
      name: "Panna",
      image: "/brand-logo-webp/main_17_pannalogopng.webp"
    },
    {
      name: "Perrier",
      image: "/brand-logo-webp/main_18_perrierlogopng.webp"
    },
    {
      name: "Cawston",
      image: "/brand-logo-webp/main_19_cawstonlogojpg.webp"
    },
    {
      name: "Pago",
      image: "/brand-logo-webp/main_20_pagologojpg.webp"
    },
    {
      name: "Schweppes",
      image: "/brand-logo-webp/main_21_schweppeslogopng.webp"
    },
    {
      name: "Evian",
      image: "/brand-logo-webp/main_3_evianlogo3png.webp"
    },
    {
      name: "Highland Spring",
      image: "/brand-logo-webp/main_4_highlandspringlogo2jpg.webp"
    },
    {
      name: "Volvic",
      image: "/brand-logo-webp/main_6_volviclogo3jpg.webp"
    },
    {
      name: "Fiji Water",
      image: "/brand-logo-webp/main_7_fijiwaterlogo3jpg.webp"
    },
    {
      name: "Buxton",
      image: "/brand-logo-webp/main_9_buxtonlogo2gif.webp"
    }
  ];

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands];

  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const newPosition = prev + 2; // Increased from 1 to 2 for faster movement
        // Reset to start when reaching the end of first set
        if (newPosition >= brands.length * 100) {
          return 0;
        }
        return newPosition;
      });
    }, 30); // Reduced from 50ms to 30ms for faster speed

    return () => clearInterval(interval);
  }, [brands.length]);

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-9xl mx-auto px-6">
        {/* Section Title */}
        {/* <h2 className="text-3xl md:text-4xl font-bold text-[#368899] mb-12 text-center">
          Trusted Brands We Work With
        </h2> */}
        
        {/* Logo Slider Container */}
        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
          
          {/* Logo Slider */}
          <div 
            className="flex transition-transform duration-1000 ease-linear"
            style={{ transform: `translateX(-${scrollPosition}px)` }}
          >
            {duplicatedBrands.map((brand, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-48 h-24 mx-8 flex items-center justify-center group"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={120}
                    height={60}
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
