"use client"
import ProductCard from "../common/ProductCard";
import NoSearchResults from "../common/NoSearchResults";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Products() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const slugify = (p, name) => {
    const s = (p && String(p).trim()) || '';
    if (s) return s.toLowerCase();
    return String(name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

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

  // Filter products based on active tab and search query
  const getFilteredProducts = () => {
    let filtered = products;

    // Apply search filter if search query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        (product.ItemName && product.ItemName.toLowerCase().includes(query)) ||
        (product.ItemShortDesc && product.ItemShortDesc.toLowerCase().includes(query)) ||
        (product.Brand && product.Brand.toLowerCase().includes(query)) ||
        (product.Category && product.Category.toLowerCase().includes(query))
      );
    } else {
      // Show only featured products when no search query
      filtered = filtered.filter(product => product.Featured === 1);
    }

    return filtered;
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
          {searchQuery ? (
            <>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#368899] to-[#2d7a8a] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Results
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-[#368899] to-[#2d7a8a] bg-clip-text text-transparent mb-4 md:mb-6">
                Search Results for "{searchQuery}"
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching your search.
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>


        {/* Product Count Display */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            {searchQuery ? (
              `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} for "${searchQuery}"`
            ) : (
              `Showing ${filteredProducts.length} featured product${filteredProducts.length !== 1 ? 's' : ''}`
            )}
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
                  originalPrice={product.isOnSale && product.salePrice > 0 ? `£${product.ItemPrice.toFixed(2)}` : `£${product.ItemPrice.toFixed(2)}`}
                  discountedPrice={product.isOnSale && product.salePrice > 0 ? `£${product.salePrice.toFixed(2)}` : `£${product.ItemPrice.toFixed(2)}`}
                  imageSrc={product.ItemMainImage || "/products/1.jpg"}
                  brand={product.Brand}
                  isSoldOut={product.IsSoldOut === 1}
                  category={product.Category}
                  isOnSale={product.isOnSale && product.salePrice > 0}
                  salePrice={product.salePrice}
                  href={`/products/${encodeURIComponent(slugify(product.CategoryPageName, product.Category))}/${encodeURIComponent(slugify(product.PageName, product.ItemName))}`}
                  product={product}
                />
              </div>
            ))}
          </div>
        ) : (
          searchQuery ? (
            <NoSearchResults searchQuery={searchQuery} />
          ) : (
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
                  No Products Available
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  No products are currently available in this category. Please check back later or explore other categories.
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/products"
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#368899] text-white font-medium rounded-lg hover:bg-[#2d7a8a] transition-colors duration-200 shadow-sm hover:shadow-md"
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
                    <li>• Check other product categories</li>
                    <li>• Try different filter combinations</li>
                    <li>• Contact us for specific requests</li>
                  </ul>
                </div>
              </div>
            </div>
          )
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