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

  const defaultImageSrc = "/products/1.jpg";
  const getSafeImageSrc = (src) => {
    if (typeof src !== "string") return defaultImageSrc;
    const trimmed = src.trim();
    if (!trimmed) return defaultImageSrc;
    const normalized = trimmed.replace(/\\\\/g, "/").replace(/\\/g, "/");
    if (normalized.startsWith("http://") || normalized.startsWith("https://") || normalized.startsWith("/")) {
      return normalized;
    }
    return `/${normalized}`;
  };
  const safeImageSrc = getSafeImageSrc(imageSrc);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) addToCart(product, 1);
  };
  const handleIncreaseQuantity = (e) => { e.preventDefault(); e.stopPropagation(); if (product) updateQuantity(id, cartQuantity + 1); };
  const handleDecreaseQuantity = (e) => { e.preventDefault(); e.stopPropagation(); if (cartQuantity > 1) updateQuantity(id, cartQuantity - 1); else removeFromCart(id); };
  const handleWishlistToggle = (e) => { e.preventDefault(); e.stopPropagation(); if (product) { isInWishlist(id) ? removeFromWishlist(id) : addToWishlist(product); } };
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const url = typeof window !== 'undefined' ? window.location.origin + (href || '/') : '';
      if (navigator.share) navigator.share({ title, text: description, url }).catch(() => {});
      else if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
    } catch {}
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-full h-full mx-auto group relative overflow-hidden">
      {/* Mobile row layout / Desktop column */}
      <div className="flex p-3 md:p-5 gap-3 md:gap-4 items-stretch h-full md:flex-col">
        {/* Image + discount badge */}
        <div className="relative shrink-0 w-28 h-32 md:w-full md:h-60 rounded-lg overflow-hidden flex items-center justify-center">
          {href ? (
            <Link href={href} className="block w-full h-full relative">
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
            </Link>
          ) : (
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
          )}

          {(discountPercent || discountPercentage) && (
            <div className="absolute top-2 left-2 z-10">
              <div className="bg-green-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-sm shadow">
                {discountPercent ? `${discountPercent}% off` : discountPercentage}
              </div>
            </div>
          )}

          {/* Wishlist heart */}
          <button 
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center hover:scale-105 transition"
            aria-label="wishlist"
          >
            <svg className="h-4 w-4 text-pink-600" fill={isInWishlist(id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a2 2 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col h-full">
          {/* Brand chip */}
          <div className="mb-1 md:mb-2">
            <span className="inline-block text-[10px] md:text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
              {brand || 'Featured'}
            </span>
          </div>

          {/* Title */}
          {href ? (
            <Link href={href} className="block">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-[#368899]">
                {title}
              </h3>
            </Link>
          ) : (
            <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-snug line-clamp-2">
              {title}
            </h3>
          )}

          {/* Description */}
          <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-1 md:line-clamp-2">
            {description}
          </p>

          {/* Price + CTA */}
          <div className="mt-auto pt-2 md:pt-3 flex items-end justify-between gap-2">
            <div className="flex items-baseline gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-base md:text-xl font-bold text-gray-900">{discountedPrice}</span>
                  <span className="text-xs md:text-sm text-gray-400 line-through">{originalPrice}</span>
                </>
              ) : (
                <span className="text-base md:text-xl font-bold text-gray-900">{discountedPrice}</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isInCart ? (
                <div className="flex items-center gap-2">
                  <button onClick={handleDecreaseQuantity} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="min-w-[1.5rem] text-center font-semibold text-gray-700">{cartQuantity}</span>
                  <button onClick={handleIncreaseQuantity} className="w-8 h-8 bg-[#368899] hover:bg-[#2d7a8a] text-white rounded-md flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button onClick={handleAddToCart} className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-md shadow-sm transition-all duration-200 ${isSoldOut ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#368899] hover:bg-[#2d7a8a] text-white'}`} disabled={isSoldOut}>
                  {isSoldOut ? 'OUT OF STOCK' : 'ADD TO CART'}
                </button>
              )}
            </div>
          </div>

          {/* Bottom actions row */}
          <div className="mt-2 md:mt-3 flex items-center justify-between text-[11px] md:text-xs text-gray-600">
            <button onClick={handleWishlistToggle} className="flex items-center gap-1 hover:text-[#368899]">
              <svg className="h-4 w-4" fill={isInWishlist(id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a2 2 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{isInWishlist(id) ? 'In Wishlist' : 'Wishlist'}</span>
            </button>

            <div className="flex items-center gap-4">
              {isInCart && (
                <Link href="/cart" className="text-[#368899] hover:text-[#2d7a8a] underline font-medium">View Cart</Link>
              )}
              <button onClick={handleShare} className="flex items-center gap-1 hover:text-[#368899]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}