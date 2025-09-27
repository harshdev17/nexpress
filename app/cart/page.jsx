"use client";
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotals } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const totals = getCartTotals();
  const baseUrlImg = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8010').replace(/\/+$/, '');

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handlePromoCode = () => {
    // Placeholder for promo code logic
    setAlertMessage('Promo code applied successfully!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getImageSrc = (imageName) => {
    if (!imageName) return '/products/1.jpg';
    if (/^https?:\/\//i.test(imageName)) return imageName;
    return `${baseUrlImg}/product/${String(imageName).replace(/^\/+/, '')}`;
  };

  const getItemPrice = (item) => {
    return item.isOnSale && item.salePrice > 0 ? item.salePrice : item.price;
  };

  const getVatRate = (item) => {
    // Simple VAT logic - you can make this more sophisticated
    return item.brand?.toLowerCase().includes('sugar') ? 0 : 20;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-[#368899]">Home</Link> / Cart
          </nav>
        </div>
      </div>

      {/* Alert Messages */}
      {showAlert && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mx-4 mt-4 rounded relative">
          <span className="block sm:inline">{alertMessage}</span>
          <button 
            onClick={() => setShowAlert(false)}
            className="absolute top-0 right-0 px-4 py-3"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Delivery Notice */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mx-4 mt-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm">
              <strong>BEFORE PAYING FOR YOUR ORDER PLEASE CHECK ON THE LINK </strong>
              <a href="#" className="underline font-medium">HERE</a>
              <strong> TO CHECK WE DELIVER IN YOUR AREA. PLEASE DO NOT PLACE YOUR ORDER IF YOUR POSTCODE IS NOT ON THIS LIST</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Cart Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cart Details</h1>
          <div className="flex gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              CONTINUE SHOPPING
            </Link>
            <Link 
              href="/checkout"
              className="flex items-center gap-2 bg-[#368899] text-white px-6 py-3 rounded-lg hover:bg-[#2d7a8a] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              CHECKOUT
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-[#368899] text-white px-6 py-3 rounded-lg hover:bg-[#2d7a8a] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items ({totals.itemCount})</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <Image
                            src={getImageSrc(item.image)}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="h-20 w-20 object-contain rounded-lg border border-gray-200"
                            unoptimized
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">ID: {item.id}</p>
                          
                          {/* Price Display */}
                          <div className="mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold text-gray-900">
                                £{getItemPrice(item).toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500">
                                (inc {getVatRate(item)}% VAT)
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              £{(getItemPrice(item) / (1 + getVatRate(item) / 100)).toFixed(2)} (ex VAT)
                            </div>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="w-12 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <div className="w-16 h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center">
                                <span className="text-xl font-bold text-gray-900">
                                  {item.quantity}
                                </span>
                              </div>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="w-12 h-12 bg-[#368899] hover:bg-[#2d7a8a] text-white rounded-xl flex items-center justify-center transition-colors shadow-lg"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Subtotal and Actions */}
                        <div className="flex flex-col items-end gap-3">
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              £{(getItemPrice(item) * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">Subtotal</div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm text-red-600 hover:text-red-800 underline transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sticky top-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
                
                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Promo Code</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#368899] focus:border-[#368899] transition-colors"
                    />
                    <button
                      onClick={handlePromoCode}
                      className="px-6 py-3 bg-[#368899] text-white rounded-xl hover:bg-[#2d7a8a] transition-colors font-semibold shadow-lg"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Summary Details */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-700 py-2">
                    <span className="text-lg">Subtotal ({totals.itemCount} items)</span>
                    <span className="font-bold text-lg">£{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 py-2">
                    <span className="text-lg">VAT (20%)</span>
                    <span className="font-bold text-lg">£{totals.vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 py-2">
                    <span className="text-lg">Shipping</span>
                    <span className="font-bold text-lg text-green-600">
                      {totals.shipping === 0 ? 'FREE' : `£${totals.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-4">
                    <div className="flex justify-between text-2xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>£{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Minimum Order Notice */}
                {totals.subtotal < 40 && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <p className="text-base font-semibold text-yellow-800">
                        Add £{(40 - totals.subtotal).toFixed(2)} more for free shipping
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Link 
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#368899] to-[#2d7a8a] text-white py-4 rounded-xl hover:from-[#2d7a8a] hover:to-[#1e5b67] transition-all duration-300 font-bold text-lg shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Proceed to Checkout
                  </Link>
                  <Link 
                    href="/"
                    className="w-full flex items-center justify-center gap-3 border-2 border-[#368899] text-[#368899] py-3 rounded-xl hover:bg-[#368899] hover:text-white transition-all duration-300 font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>

                {/* Delivery Information */}
                <div className="mt-8 pt-6 border-t-2 border-gray-300">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Delivery Information</h4>
                  <div className="text-base text-gray-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#368899] rounded-full"></div>
                      <p>Free delivery on orders over £40</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#368899] rounded-full"></div>
                      <p>Standard delivery: £5.99</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#368899] rounded-full"></div>
                      <p>Delivery within 2-3 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Notice */}
        <div className="mt-8 text-center text-sm text-red-600">
          <p>Please note our minimum delivery amount is £40 plus delivery</p>
          <p>* Item with a red star is not included in the calculation</p>
        </div>
      </div>
    </div>
  );
}
