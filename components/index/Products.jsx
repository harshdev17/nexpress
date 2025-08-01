"use client"
import ProductCard from "../common/ProductCard";
import { useState } from "react";

export default function Products() {
  const [activeTab, setActiveTab] = useState("featured");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#368899] to-[#2d7a8a] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Premium Collection
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-[#368899] to-[#2d7a8a] bg-clip-text text-transparent mb-4 md:mb-6">
            Discover Amazing Products
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Explore our carefully curated collection of premium products designed to enhance your lifestyle with quality and style.
          </p>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center mb-12 md:mb-16 px-4">
          <div className="inline-flex rounded-2xl bg-white/80 backdrop-blur-sm p-1 md:p-2 shadow-xl border border-gray-200 w-full max-w-md md:max-w-none md:w-auto">
            <button
              className={`px-4 md:px-8 py-3 md:py-4 text-xs md:text-sm font-semibold rounded-xl transition-all duration-500 flex-1 md:flex-none ${
                activeTab === "featured"
                  ? "bg-gradient-to-r from-[#368899] to-[#2d7a8a] text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("featured")}
            >
              <div className="flex items-center gap-1 md:gap-2 justify-center">
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="hidden sm:inline">Featured Products</span>
                <span className="sm:hidden">Featured</span>
              </div>
            </button>
            
            <button
              className={`px-4 md:px-8 py-3 md:py-4 text-xs md:text-sm font-semibold rounded-xl transition-all duration-500 flex-1 md:flex-none ${
                activeTab === "hotDeals"
                  ? "bg-gradient-to-r from-[#368899] to-[#2d7a8a] text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("hotDeals")}
            >
              <div className="flex items-center gap-1 md:gap-2 justify-center">
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="hidden sm:inline">Hot Deals</span>
                <span className="sm:hidden">Deals</span>
              </div>
            </button>
          </div>
        </div>

        {/* Product Grid with Enhanced Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 px-4">
          {activeTab === "featured" &&
            Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard />
              </div>
            ))}
          
          {activeTab === "hotDeals" &&
            Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard 
                  title="Limited Time Deal" 
                  discountedPrice="$19.99"
                  originalPrice="$39.99"
                />
              </div>
            ))}
        </div>

        {/* Enhanced View More Button */}
        <div className="mt-20 text-center">
          <button className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#368899] to-[#2d7a8a] hover:from-[#2d7a8a] hover:to-[#1e5b67] text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
            <span>View All Products</span>
            <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          
          {/* Stats Section */}
          {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#368899] mb-2">500+</div>
              <div className="text-gray-600">Products Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#368899] mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#368899] mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}