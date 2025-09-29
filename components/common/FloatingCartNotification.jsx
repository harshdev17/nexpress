"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function FloatingCartNotification() {
  const { getCartTotals } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [animationClass, setAnimationClass] = useState('');
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);

  const totals = getCartTotals();
  const lastCountRef = useRef(totals.itemCount || 0);
  const dismissTimerRef = useRef(null);

  useEffect(() => {
    const current = totals.itemCount || 0;
    const prev = lastCountRef.current;

    if (current > prev) {
      setMessage(`${current} ${current === 1 ? 'item' : 'items'} in cart`);
      setAnimationClass('animate-slide-in-right');
      setIsVisible(true);
      setIsManuallyClosed(false);

      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }

      const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
      if (isMobile) {
        dismissTimerRef.current = setTimeout(() => handleClose(), 2500);
      }
    }

    lastCountRef.current = current;

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
    };
  }, [totals.itemCount]);

  const handleClose = () => {
    setIsManuallyClosed(true);
    setAnimationClass('animate-slide-out-right');
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setTimeout(() => {
      setIsVisible(false);
      setAnimationClass('');
    }, 250);
  };

  if (!isVisible || isManuallyClosed) return null;

  return (
    <>
      <style jsx>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        .animate-slide-in-right { animation: slideInRight 0.35s ease; }
        .animate-slide-out-right { animation: slideOutRight 0.25s ease; }
      `}</style>

      {/* Center on mobile, bottom-right on desktop */}
      <div className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:bottom-6 sm:right-6 z-50 ${animationClass}`}>
        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 w-[92vw] max-w-[380px] sm:max-w-[420px] backdrop-blur-sm bg-white/95">
          <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-[#368899] to-[#2d7a8a] rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{message}</p>
                {/* Show total price */}
                <p className="text-xs sm:text-sm font-medium text-[#368899] mt-1">Total: £{totals.total.toFixed(2)}</p>
              </div>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Link href="/cart" className="block">
            <button className="w-full bg-gradient-to-r from-[#368899] to-[#2d7a8a] hover:from-[#2d7a8a] hover:to-[#1e5b67] text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300">
              View Cart
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
