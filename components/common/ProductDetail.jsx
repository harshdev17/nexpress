"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ProductCard from './ProductCard';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetail({ 
  product, 
  category, 
  relatedProducts = [],
  composition = []
}) {
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, removeFromCart, updateQuantity, items } = useCart();
  
  // Check if product is in cart
  const cartItem = items.find(item => item.id === product.id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;
  
  const slugify = (p, name) => {
    const s = (p && String(p).trim()) || '';
    if (s) return s.toLowerCase();
    return String(name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleShare = (platform) => {
    const currentUrl = window.location.href;
    const productName = product.ItemName;
    const productDescription = product.ItemShortDesc || product.ItemDesc || '';
    
    let shareUrl = '';
    let shareText = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case 'twitter':
        shareText = `Check out ${productName} - ${productDescription}`;
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        break;
      case 'pinterest':
        const imageUrl = imgSrc;
        shareText = `${productName} - ${productDescription}`;
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(shareText)}`;
        break;
      case 'email':
        shareText = `Check out this product: ${productName}`;
        shareUrl = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`Check out this product: ${productName}\n\n${productDescription}\n\n${currentUrl}`)}`;
        break;
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Cart will update automatically via context
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(product.id, cartQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (cartQuantity > 1) {
      updateQuantity(product.id, cartQuantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };
  
  const baseUrlImg = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8010').replace(/\/+$/, '');
  const imgSrc = /^https?:\/\//i.test(product.ItemMainImage || '')
    ? product.ItemMainImage
    : `${baseUrlImg}/product/${String(product.ItemMainImage||'').replace(/^\/+/, '')}`;
  
  const original = parseFloat(product.ItemPrice) || 0;
  const sale = parseFloat(product.ItemSalePrice) || 0;
  const onSale = product.ItemIsOnSale === 1 && sale > 0;
  const vatPrice = original * 1.2; // 20% VAT
  const exVatPrice = original;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#368899]">Home</Link>
        {category && (
          <>
            {' / '}
            <Link href={`/categories/${encodeURIComponent(category.PageName)}`} className="text-[#368899] hover:text-[#2d7a8a]">
              {category.CatName}
            </Link>
          </>
        )}
        {' / '}
        <span className="text-gray-700">{product.ItemName}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="relative">
          <div className="relative w-full h-96 lg:h-[500px] bg-gray-50 rounded-xl overflow-hidden group">
            <Image
              src={imageError ? '/products/1.jpg' : imgSrc}
              alt={product.ItemName}
              fill
              style={{ objectFit: 'contain' }}
              className="transition-transform duration-500 group-hover:scale-110"
              unoptimized
              onError={() => setImageError(true)}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand */}
          {product.Brand && (
            <div className="text-sm text-gray-600 font-medium">
              {product.Brand}
            </div>
          )}

          {/* Product Name */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {product.ItemName}
          </h1>

          {/* Pricing */}
          <div className="mb-8">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-4xl font-bold text-gray-900">
                £{vatPrice.toFixed(2)}
              </span>
              <span className="text-xl font-semibold text-gray-600">
                (inc 20% VAT)
              </span>
            </div>
            <div className="text-lg text-gray-500 font-medium">
              £{exVatPrice.toFixed(2)} (ex VAT)
            </div>
            {onSale && (
              <div className="flex items-center gap-3 mt-3">
                <span className="text-2xl font-bold text-[#368899]">£{sale.toFixed(2)}</span>
                <span className="text-lg text-gray-400 line-through">£{original.toFixed(2)}</span>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                  SALE
                </span>
              </div>
            )}
          </div>

          {/* Short Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Short Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.ItemShortDesc || 'Product description not available.'}
            </p>
          </div>

          {/* Cart Controls */}
          <div className="space-y-6">
            {isInCart ? (
              // Quantity controls when item is in cart
              <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-gray-700">Quantity in Cart:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDecreaseQuantity}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="w-16 h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">
                      {cartQuantity}
                    </span>
                  </div>
                  <button
                    onClick={handleIncreaseQuantity}
                    className="w-12 h-12 bg-[#368899] hover:bg-[#2d7a8a] text-white rounded-xl flex items-center justify-center transition-colors shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                <Link href="/cart">
                  <button className="text-[#368899] hover:text-[#2d7a8a] underline font-medium transition-colors">
                    View Cart
                  </button>
                </Link>
              </div>
            ) : (
              // Add to cart when item is not in cart
              <button 
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-3 bg-[#368899] text-white px-8 py-4 rounded-xl hover:bg-[#2d7a8a] transition-colors font-semibold text-lg shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                ADD TO CART
              </button>
            )}
            
            {/* Wishlist Button */}
            <div className="pt-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-xl hover:border-[#368899] hover:text-[#368899] transition-colors font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a2 2 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                ADD TO WISHLIST
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="flex justify-end mb-8">
        <div className="flex gap-3">
          {/* Facebook */}
          <button 
            onClick={() => handleShare('facebook')}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          
          {/* LinkedIn */}
          <button 
            onClick={() => handleShare('linkedin')}
            className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>
          
          {/* Twitter */}
          <button 
            onClick={() => handleShare('twitter')}
            className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </button>
          
          {/* Pinterest */}
          <button 
            onClick={() => handleShare('pinterest')}
            className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
            </svg>
          </button>
          
          {/* Email */}
          <button 
            onClick={() => handleShare('email')}
            className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          
          {/* Copy Link */}
          <button 
            onClick={handleCopyLink}
            className="w-10 h-10 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
            title="Copy Link"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description and Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Description */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {product.ItemDesc ? (
              <div dangerouslySetInnerHTML={{ __html: product.ItemDesc }} />
            ) : (
              <p>No detailed description available for this product.</p>
            )}
          </div>
        </div>

        {/* Information and Composition - Only show if data available */}
        {composition && composition.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Information and Composition in mg/ltr</h3>
            <p className="text-sm text-gray-600 mb-4">
              The information below has been taken directly from the manufacturer.
            </p>
            
            <div className="space-y-2 text-sm">
              {composition.map((item, index) => (
                <div key={index} className="flex justify-between py-1 border-b border-gray-100">
                  <span className="font-medium">{item.DisplayCaption}:</span>
                  <span>{item.Value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                title={relatedProduct.ItemName}
                description={relatedProduct.ItemShortDesc || 'Product description'}
                originalPrice={`£${parseFloat(relatedProduct.ItemPrice || 0).toFixed(2)}`}
                discountedPrice={`£${parseFloat(relatedProduct.ItemPrice || 0).toFixed(2)}`}
                isOnSale={false}
                salePrice={0}
                imageSrc={/^https?:\/\//i.test(relatedProduct.ItemMainImage || '') 
                  ? relatedProduct.ItemMainImage 
                  : `${baseUrlImg}/product/${String(relatedProduct.ItemMainImage||'').replace(/^\/+/, '')}`}
                brand={relatedProduct.Brand}
                isSoldOut={false}
                category={category?.CatName}
                href={`/products/${encodeURIComponent(slugify(relatedProduct.PageName, relatedProduct.ItemName))}`}
                product={relatedProduct}
              />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-12 p-4 bg-red-50 border-l-4 border-red-400">
        <p className="text-sm text-red-700">
          Whilst every care is taken to ensure all our information is correct, products are constantly being reformulated so ingredients, nutrition content, dietary and allergen information may change at any time. Please always double check with the manufacturer or read the product label as Nexpress Delivery accepts no liability or responsibility for any errors or omissions.
        </p>
      </div>
    </div>
  );
}
