"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const totalSlides = 8;
  const images = Array.from({ length: totalSlides }, (_, i) => `/hero-section/banner-${i + 1}.jpg`);

  useEffect(() => {
    let interval = setInterval(() => {
      if (!isDragging) {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides, isDragging]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    console.log("Mouse down at:", e.pageX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    console.log("Mouse moving at:", e.pageX);
    const dragDistance = e.pageX - startX;
    const slideThreshold = 100; // Adjust this threshold as needed
    if (Math.abs(dragDistance) > slideThreshold) {
      if (dragDistance < 0) {
        nextSlide(); // Drag right to next
      } else {
        prevSlide(); // Drag left to previous
      }
      setStartX(e.pageX); // Reset startX to continue dragging
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    console.log("Mouse up or left");
  };

  return (
    <section className="hero-section">
      <div
        className="carousel-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {images.map((src, index) => (
          <div
            key={src}
            className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
          >
            <Image
              src={src}
              alt={`Banner ${index + 1}`}
              fill
              style={{ objectFit: "cover" }}
              priority={index === 0}
              className="carousel-image"
            />
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="carousel-button prev"
          aria-label="Previous slide"
        >
          <svg className="arrow-icon" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="carousel-button next"
          aria-label="Next slide"
        >
          <svg className="arrow-icon" viewBox="0 0 24 24">
            <path d="M10 6l-1.41 1.41L13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>

        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
      <style>
        {`
          .hero-section {
            width: 100%;
            overflow: hidden;
            background: linear-gradient(to bottom, #1e5b67, #0f3a43);
            position: relative;
          }

          .carousel-container {
            position: relative;
            width: 100%;
            height: 320px;
            overflow: hidden;
            margin: 0 auto;
            user-select: none;
          }

          .carousel-slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            z-index: 0;
          }

          .carousel-slide.active {
            opacity: 1;
            z-index: 10;
          }

          .carousel-image {
            border-radius: 8px;
          }

          .carousel-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background-color: rgba(255, 255, 255, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 20;
            transition: background-color 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
          }

          .carousel-button.prev {
            left: 10px;
          }

          .carousel-button.next {
            right: 10px;
          }

          .carousel-button:hover {
            background-color: rgba(255, 255, 255, 0.6);
            border-color: rgba(255, 255, 255, 0.8);
            transform: translateY(-50%) scale(1.1);
          }

          .arrow-icon {
            width: 24px;
            height: 24px;
            fill: white;
          }

          .carousel-dots {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 20;
          }

          .dot {
            width: 8px;
            height: 8px;
            background-color: rgba(255, 255, 255, 0.3);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease;
          }

          .dot.active,
          .dot:hover {
            background-color: white;
            transform: scale(1.2);
          }
        `}
      </style>
    </section>
  );
}