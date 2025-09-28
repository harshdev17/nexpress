"use client";
import Link from "next/link";
import AccountTabs from "@/components/common/AccountTabs";
import ProductCard from "@/components/common/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";

export default function FavouritesPage() {
  const { wishlist, clearWishlist, getWishlistCount } = useWishlist();

  const getStockColor = (stock) => {
    switch (stock) {
      case "In Stock":
        return "bg-green-100 text-green-800 border-green-200";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Out of Stock":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <main className="w-full bg-gray-50 min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  My Favourites
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1">Your saved products and wishlist items</p>
              </div>
            </div>
            <Link
              href="/customer/account"
              className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm font-medium text-[#368899] bg-white border-2 border-[#368899] rounded-xl hover:bg-[#368899] hover:text-white transition-all duration-200 transform hover:scale-105 shadow-lg w-full sm:w-auto justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Account Tabs */}
        <div className="mb-8">
          <AccountTabs />
        </div>

        {/* Favourites Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Favourite Products</h2>
              <p className="text-sm sm:text-base text-gray-600">You have {getWishlistCount()} items in your favourites</p>
            </div>
            {wishlist.length > 0 && (
              <button 
                onClick={clearWishlist}
                className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors border border-red-200 w-full sm:w-auto justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            )}
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No favourites yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start adding products to your favourites to see them here. We'll keep them safe for you.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-8 py-4 bg-[#368899] text-white font-medium rounded-xl hover:bg-[#2d7a8a] transition-all duration-200 shadow-lg"
              >
                Browse Products
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.ItemName || product.name}
                  description={product.ItemShortDesc || product.description || 'Product description'}
                  originalPrice={`£${parseFloat(product.ItemPrice || product.price || 0).toFixed(2)}`}
                  discountedPrice={`£${parseFloat(product.ItemPrice || product.price || 0).toFixed(2)}`}
                  isOnSale={product.ItemIsOnSale || false}
                  salePrice={product.ItemSalePrice || 0}
                  imageSrc={product.ItemMainImage || product.image || '/products/1.jpg'}
                  brand={product.Brand || product.brand}
                  isSoldOut={false}
                  category={product.Category || product.category}
                  href={`/products/${encodeURIComponent(product.PageName || product.slug || 'product')}`}
                  product={product}
                />
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {wishlist.length > 0 && (
            <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gray-100 rounded-2xl border border-gray-200">
              <div className="flex flex-col space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Actions</h3>
                  <p className="text-sm sm:text-base text-gray-600">Manage your favourites and shopping experience</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <button className="inline-flex items-center px-4 py-2 bg-white text-[#368899] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors border border-[#368899] w-full sm:w-auto justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export List
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-[#368899] text-white text-sm font-medium rounded-lg hover:bg-[#2d7a8a] transition-colors w-full sm:w-auto justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    Add All to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}