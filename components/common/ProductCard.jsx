"use client";
import Image from "next/image";

export default function ProductCard({ 
  title = "Actiph 750ml Alkaline Ionised pH9", 
  description = "12 x 750ml glass bottles", 
  originalPrice = "$29.99",
  discountedPrice = "$22.49", 
  imageSrc = "/products/1.jpg",
  discountPercentage = null
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col p-3 md:p-5 w-full mx-auto group relative">
      {/* Discount Badge - Only show if discountPercentage is provided */}
      {discountPercentage && discountPercentage.trim() !== "" && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-[#368899] text-white text-xs font-bold px-3 py-1 transform rotate-45 translate-x-2 -translate-y-1 shadow-lg">
            {discountPercentage}
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="w-full flex justify-center mb-3 md:mb-4">
        <div className="relative h-28 w-20 md:h-36 md:w-28 flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={title}
            fill
            style={{ objectFit: "contain" }}
            priority={true}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm md:text-base font-semibold text-[#368899] mb-2 hover:underline cursor-pointer transition-colors duration-200 text-center line-clamp-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 border-b border-gray-100 pb-2 md:pb-3 min-h-[28px] md:min-h-[36px] text-center">
        {description}
      </p>

      {/* Price and Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-auto pt-2 gap-2">
        <div className="flex items-center gap-1 md:gap-2">
          <span className="text-base md:text-lg font-bold text-gray-800">{discountedPrice}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">{originalPrice}</span>
          )}
        </div>
        <button className="flex items-center gap-2 bg-[#368899] hover:bg-[#2d7a8a] text-white text-xs font-semibold px-4 py-2 rounded-md shadow transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          BUY NOW
        </button>
      </div>

      {/* Wishlist and Share Buttons */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <button className="flex items-center gap-1 text-gray-500 hover:text-[#368899] transition-colors duration-300 text-xs">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Wishlist</span>
        </button>
        
        <button className="flex items-center gap-1 text-gray-500 hover:text-[#368899] transition-colors duration-300 text-xs">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}