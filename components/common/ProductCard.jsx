"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

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
  category = null,
  isOnSale = false,
  salePrice = 0,
  href = null,
  product = null // Full product object for cart functionality
}) {
  const [imageError, setImageError] = useState(false);
  const { addToCart, removeFromCart, updateQuantity, items } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Check if product is in cart
  const cartItem = items.find(item => item.id === id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;
  
  // Calculate discount percentage if both prices are provided
  const hasDiscount = isOnSale || (originalPrice !== discountedPrice && originalPrice && discountedPrice);
  const discountPercent = hasDiscount ? 
    Math.round(((parseFloat(originalPrice.replace('£', '')) - parseFloat(discountedPrice.replace('£', ''))) / parseFloat(originalPrice.replace('£', ''))) * 100) : null;
  
  // Debug logging for discount issues
  if (isOnSale && salePrice > 0) {
    console.log('Discount product:', { title, originalPrice, discountedPrice, isOnSale, salePrice, discountPercent });
  }

  // Build a safe image URL/path to avoid "Invalid URL" errors on Windows paths or malformed strings
  const defaultImageSrc = "/products/1.jpg";
  const getSafeImageSrc = (src) => {
    if (typeof src !== "string") return defaultImageSrc;
    const trimmed = src.trim();
    if (!trimmed) return defaultImageSrc;
    // Normalize backslashes to forward slashes
    const normalized = trimmed.replace(/\\\\/g, "/").replace(/\\/g, "/");
    if (normalized.startsWith("http://") || normalized.startsWith("https://") || normalized.startsWith("/")) {
      return normalized;
    }
    return `/${normalized}`;
  };
  const safeImageSrc = getSafeImageSrc(imageSrc);

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      addToCart(product, 1);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      addToCart(product, 1);
    }
  };

  const handleIncreaseQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      updateQuantity(id, cartQuantity + 1);
    }
  };

  const handleDecreaseQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartQuantity > 1) {
      updateQuantity(id, cartQuantity - 1);
    } else {
      removeFromCart(id);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      if (isInWishlist(id)) {
        removeFromWishlist(id);
      } else {
        addToWishlist(product);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col p-3 md:p-5 w-full mx-auto group relative h-[400px] mb-4">
      {/* Discount Badge - Show if there's a discount or if discountPercentage is provided */}
      {(discountPercent || discountPercentage) && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-[#368899] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white">
            {discountPercent ? `${discountPercent}% OFF` : discountPercentage}
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="w-full flex justify-center mb-3 md:mb-4">
        {href ? (
          <Link href={href} className="block">
            <div className="relative h-28 w-20 md:h-36 md:w-28 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
              <Image
                src={safeImageSrc}
                alt={title}
                fill
                style={{ objectFit: "contain" }}
                priority={true}
                className="transition-transform duration-300 group-hover:scale-105"
                unoptimized
                onError={() => setImageError(true)}
              />
            </div>
          </Link>
        ) : (
          <div className="relative h-28 w-20 md:h-36 md:w-28 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
            <Image
              src={safeImageSrc}
              alt={title}
              fill
              style={{ objectFit: "contain" }}
              priority={true}
              className="transition-transform duration-300 group-hover:scale-105"
              unoptimized
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </div>

      {/* Brand */}
      {brand != null ? (
        <div className="text-center mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {brand}
          </span>
        </div>
      ) : (
        <div className="text-center mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Featured
          </span>
        </div>
      )}

      {/* Title */}
      {href ? (
        <Link href={href} className="block">
          <h3 className="text-sm md:text-base font-semibold text-[#368899] mb-2 transition-colors duration-200 text-center line-clamp-2 min-h-[40px] flex items-center justify-center hover:text-[#2d7a8a]">
            {title}
          </h3>
        </Link>
      ) : (
        <h3 className="text-sm md:text-base font-semibold text-[#368899] mb-2 transition-colors duration-200 text-center line-clamp-2 min-h-[40px] flex items-center justify-center">
          {title}
        </h3>
      )}

      {/* Description - Limited to 1 line */}
      <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 border-b border-gray-100 pb-2 md:pb-3 text-center line-clamp-1 min-h-[20px] flex items-center justify-center pb-5">
        {description}
      </p>

      {/* Price and Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-auto pt-2 gap-2">
        <div className="flex items-center gap-1 md:gap-2">
          {hasDiscount ? (
            <>
              <span className="text-base md:text-lg font-bold text-[#368899]">{discountedPrice}</span>
              <span className="text-sm text-gray-400 line-through">{originalPrice}</span>
            </>
          ) : (
            <span className="text-base md:text-lg font-bold text-gray-800">{discountedPrice}</span>
          )}
        </div>
        <div className="flex gap-2">
          {isInCart ? (
            // Quantity controls when item is in cart
            <div className="flex items-center gap-2 w-full">
              <button 
                onClick={handleDecreaseQuantity}
                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="flex-1 text-center font-semibold text-gray-700">
                {cartQuantity}
              </span>
              <button 
                onClick={handleIncreaseQuantity}
                className="w-8 h-8 bg-[#368899] hover:bg-[#2d7a8a] text-white rounded-md flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <Link href="/cart" className="ml-2">
                <button className="text-xs text-[#368899] hover:text-[#2d7a8a] underline font-medium">
                  View Cart
                </button>
              </Link>
            </div>
          ) : (
            // Add to Cart button when item is not in cart
            <button 
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 rounded-md shadow transition-all duration-200 ${
                isSoldOut 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-[#368899] hover:bg-[#2d7a8a] text-white'
              }`}
              disabled={isSoldOut}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {isSoldOut ? 'OUT OF STOCK' : 'ADD'}
            </button>
          )}
        </div>
      </div>

      {/* Wishlist and Share Buttons */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <button 
          onClick={handleWishlistToggle}
          className="flex items-center gap-1 text-gray-500 hover:text-[#368899] transition-colors duration-300 text-xs"
        >
          <svg className="h-4 w-4" fill={isInWishlist(id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a2 2 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{isInWishlist(id) ? 'In Wishlist' : 'Wishlist'}</span>
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