"use client";

import Link from 'next/link';

export default function NoSearchResults({ searchQuery }) {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Message */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          No Products Found for Your Search
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          We couldn't find any products matching "{searchQuery}". Try different keywords or browse our categories.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center justify-center px-6 py-3 bg-[#368899] text-white font-medium rounded-lg hover:bg-[#2d7a8a] transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
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
            <li>• Try different keywords or spelling</li>
            <li>• Use more general search terms</li>
            <li>• Browse categories for similar products</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
