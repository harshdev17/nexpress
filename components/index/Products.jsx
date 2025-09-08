"use client"
import ProductCard from "../common/ProductCard";
import { useState, useEffect } from "react";

export default function Products() {
  const [activeTab, setActiveTab] = useState("featured");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Error loading products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on active tab
  const getFilteredProducts = () => {
    if (activeTab === "featured") {
      return products.filter(product => product.Featured === 1);
    } else if (activeTab === "hotDeals") {
      // For hot deals, you can implement your own logic
      // For now, showing products with lower stock or specific criteria
      return products.filter(product => product.ItemStock < 50 && product.ItemStock > 0);
    }
    return products;
  };

  const filteredProducts = getFilteredProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#368899] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-[#368899] text-white px-6 py-3 rounded-lg hover:bg-[#2d7a8a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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

        {/* Product Count Display */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Showing {filteredProducts.length} products
            {activeTab === "featured" && " (Featured)"}
            {activeTab === "hotDeals" && " (Hot Deals)"}
          </p>
        </div>

        {/* Product Grid with Enhanced Layout */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 px-4">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard 
                  id={product.id}
                  title={product.ItemName}
                  description={product.ItemShortDesc || "Product description"}
                  originalPrice={`£${parseFloat(product.ItemPrice).toFixed(2)}`}
                  discountedPrice={`£${parseFloat(product.ItemPrice).toFixed(2)}`}
                  imageSrc={product.ItemMainImage || "/products/1.jpg"}
                  brand={product.Brand}
                  isSoldOut={product.IsSoldOut === 1}
                  category={product.Category}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try switching to a different category or check back later.</p>
          </div>
        )}

        {/* Enhanced View More Button */}
        <div className="mt-20 text-center">
          <button className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#368899] to-[#2d7a8a] hover:from-[#2d7a8a] hover:to-[#1e5b67] text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
            <span>View All Products</span>
            <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}