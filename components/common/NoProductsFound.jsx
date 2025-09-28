"use client";

import Link from 'next/link';

export default function NoProductsFound({ type = 'filter' }) {
  const handleClearFilters = () => {
    // Clear all URL parameters except the base path
    const url = new URL(window.location);
    const pathname = url.pathname;
    window.location.href = pathname;
  };

  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        
        {/* Message */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          No Products Found
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          We couldn't find any products matching your current filters. Try adjusting your search criteria or browse our other categories.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={handleClearFilters}
            className="inline-flex items-center justify-center px-6 py-3 bg-[#368899] text-white font-medium rounded-lg hover:bg-[#2d7a8a] transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear Filters
          </button>
          <Link 
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#368899] font-medium rounded-lg border-2 border-[#368899] hover:bg-[#368899] hover:text-white transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
            Browse All Products
          </Link>
        </div>
        
        {/* Helpful Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Helpful Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• Try removing some filters to see more products</li>
            <li>• Check if you have any price range restrictions</li>
            <li>• Browse different categories for more options</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
