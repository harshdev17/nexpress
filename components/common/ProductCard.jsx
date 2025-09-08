"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProductCard({ 
  id,
  title = "Actiph 750ml Alkaline Ionised pH9", 
  description = "12 x 750ml glass bottles", 
  originalPrice = "£29.99",
  discountedPrice = "£22.49", 
  imageSrc = "/products/1.jpg",
  discountPercentage = null,
  brand = null,
  isSoldOut = false,
  category = null
}) {
  const [imageError, setImageError] = useState(false);
  
  // Calculate discount percentage if both prices are provided
  const hasDiscount = originalPrice !== discountedPrice && originalPrice && discountedPrice;
  const discountPercent = hasDiscount ? 
    Math.round(((parseFloat(originalPrice.replace('£', '')) - parseFloat(discountedPrice.replace('£', ''))) / parseFloat(originalPrice.replace('£', ''))) * 100) : null;

  // Check if we have a valid image source
  const hasValidImage = imageSrc && 
    imageSrc !== "/products/1.jpg" ;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col p-3 md:p-5 w-full mx-auto group relative h-[400px]">
      {/* Discount Badge - Show if there's a discount or if discountPercentage is provided */}
      {(discountPercent || discountPercentage) && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-[#368899] text-white text-xs font-bold px-3 py-1 transform rotate-45 translate-x-2 -translate-y-1 shadow-lg">
            {discountPercent ? `${discountPercent}% OFF` : discountPercentage}
          </div>
        </div>
      )}

      {/* Out of Stock Badge */}
      {/* {isSoldOut && (
        <div className="absolute top-0 left-0 z-10">
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-lg">
            OUT OF STOCK
          </div>
        </div>
      )} */}

      {/* Product Image */}
      <div className="w-full flex justify-center mb-3 md:mb-4">
        <div className="relative h-28 w-20 md:h-36 md:w-28 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
          {hasValidImage ? (
            <Image
              src={"/products/1.jpg"}
              alt={title}
              fill
              style={{ objectFit: "contain" }}
              priority={true}
              className="transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Brand */}
      {brand != null ? (
        <div className="text-center mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {brand}
          </span>
        </div>
      ) : 
      <div className="text-center mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
           {"Featured"}
          </span>
        </div> }

      {/* Title */}
      <h3 className="text-sm md:text-base font-semibold text-[#368899] mb-2 hover:underline cursor-pointer transition-colors duration-200 text-center line-clamp-2 min-h-[40px] flex items-center justify-center">
        {title}
      </h3>

      {/* Description - Limited to 1 line */}
      <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 border-b border-gray-100 pb-2 md:pb-3 text-center line-clamp-1 min-h-[20px] flex items-center justify-center pb-5">
        {description}
      </p>

      {/* Price and Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-auto pt-2 gap-2">
        <div className="flex items-center gap-1 md:gap-2">
          <span className="text-base md:text-lg font-bold text-gray-800">{discountedPrice}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">{originalPrice}</span>
          )}
        </div>
        <button 
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-md shadow transition-all duration-200 ${
            isSoldOut 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-[#368899] hover:bg-[#2d7a8a] text-white'
          }`}
          disabled={isSoldOut}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {isSoldOut ? 'OUT OF STOCK' : 'BUY NOW'}
        </button>
      </div>

      {/* Wishlist and Share Buttons */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <button className="flex items-center gap-1 text-gray-500 hover:text-[#368899] transition-colors duration-300 text-xs">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a2 2 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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