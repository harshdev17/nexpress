"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function FloatingCartNotification() {
  const { items, getCartTotals } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [lastItemCount, setLastItemCount] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);

  const totals = getCartTotals();

  useEffect(() => {
    const currentItemCount = totals.itemCount;
    
    if (currentItemCount > lastItemCount) {
      // Items were added - show notification
      setMessage(`${currentItemCount} ${currentItemCount === 1 ? 'item' : 'items'} in cart`);
      setAnimationClass('animate-slide-in-right');
      setIsVisible(true);
      setIsManuallyClosed(false); // Reset manual close state
    } else if (currentItemCount < lastItemCount) {
      // Items were removed - update notification if visible and not manually closed
      if (isVisible && !isManuallyClosed) {
        setMessage(`${currentItemCount} ${currentItemCount === 1 ? 'item' : 'items'} in cart`);
        // No animation on update, just update the content silently
      }
    }
    
    setLastItemCount(currentItemCount);
  }, [totals.itemCount, lastItemCount, isVisible, isManuallyClosed]);

  const handleClose = () => {
    setIsManuallyClosed(true);
    setAnimationClass('animate-slide-out-right');
    setTimeout(() => {
      setIsVisible(false);
      setAnimationClass('');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .animate-slide-out-right {
          animation: slideOutRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .animate-bounce {
          animation: bounce 0.6s ease-in-out;
        }
      `}</style>
      
      <div className={`fixed bottom-6 right-6 z-50 ${animationClass}`}>
        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-2xl p-6 w-[420px] backdrop-blur-sm bg-white/98">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Cart Icon with bounce animation */}
              <div className="w-16 h-16 bg-gradient-to-br from-[#368899] to-[#2d7a8a] rounded-full flex items-center justify-center animate-bounce shadow-lg flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              
              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xl font-bold text-gray-900 mb-2">{message}</p>
                <p className="text-lg font-semibold text-[#368899] mb-3">Total: £{totals.total.toFixed(2)}</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Added successfully</span>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 flex-shrink-0 ml-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* View Cart Button */}
          <div>
            <Link href="/cart">
              <button className="w-full bg-gradient-to-r from-[#368899] to-[#2d7a8a] hover:from-[#2d7a8a] hover:to-[#1e5b67] text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
                View Cart
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
