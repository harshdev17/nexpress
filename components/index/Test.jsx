"use client";
import { useEffect } from "react";
import Image from "next/image";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSection() {
  useEffect(() => {
    new Swiper(".swiper", {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      grabCursor: true,
    });
  }, []);

  return (
    <section className="hero-section">
      <div className="swiper">
        <div className="swiper-wrapper">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="swiper-slide">
              <Image
                src={`/hero-section/banner-${i + 1}.jpg`}
                alt={`Banner ${i + 1}`}
                fill
                style={{ objectFit: "cover" }}
                priority={i === 0}
                className="carousel-image"
              />
            </div>
          ))}
        </div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-pagination"></div>
      </div>
      <style>
        {`
          .hero-section {
            width: 100%;
            overflow: hidden;
            background: linear-gradient(to bottom, #1e5b67, #0f3a43);
            position: relative;
          }

          .swiper {
            width: 100%;
            height: 320px;
            overflow: hidden;
            margin: 0 auto;
          }

          .swiper-slide {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 8px;
            overflow: hidden;
          }

          .carousel-image {
            border-radius: 8px;
          }

          .swiper-button-prev,
          .swiper-button-next {
            width: 40px;
            height: 40px;
            background-color: rgba(255, 255, 255, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            cursor: pointer;
            transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
          }

          .swiper-button-prev {
            left: 10px;
          }

          .swiper-button-next {
            right: 10px;
          }

          .swiper-button-prev::after,
          .swiper-button-next::after {
            content: '';
            width: 0;
            height: 0;
            background: none;
          }

          .swiper-button-prev:hover,
          .swiper-button-next:hover {
            background-color: rgba(255, 255, 255, 0.6);
            border-color: rgba(255, 255, 255, 0.8);
            transform: translateY(-50%) scale(1.1);
          }

          .swiper-pagination {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
          }

          .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transition: background-color 0.3s ease, transform 0.3s ease;
          }

          .swiper-pagination-bullet-active {
            background-color: white;
            transform: scale(1.2);
          }
        `}
      </style>
    </section>
  );
}