import Link from "next/link";
import AccountTabs from "@/components/common/AccountTabs";

export const metadata = {
  title: "My Favourites | Nexpress Delivery",
  description: "View and manage your favourite products.",
};

export default function FavouritesPage() {
  const favourites = [
    {
      id: 1,
      name: "Heineken Lager 330ml",
      price: "£2.99",
      category: "Lager",
      stock: "In Stock",
      image: "/product-placeholder.jpg"
    },
    {
      id: 2,
      name: "Corona Extra 330ml",
      price: "£3.49",
      category: "Lager",
      stock: "In Stock",
      image: "/product-placeholder.jpg"
    },
    {
      id: 3,
      name: "Stella Artois 330ml",
      price: "£2.99",
      category: "Lager",
      stock: "Low Stock",
      image: "/product-placeholder.jpg"
    },
    {
      id: 4,
      name: "Budweiser 330ml",
      price: "£2.50",
      category: "Lager",
      stock: "In Stock",
      image: "/product-placeholder.jpg"
    },
    {
      id: 5,
      name: "Peroni Nastro Azzurro 330ml",
      price: "£1.75",
      category: "Lager",
      stock: "In Stock",
      image: "/product-placeholder.jpg"
    },
    {
      id: 6,
      name: "Guinness Draught 440ml",
      price: "£2.25",
      category: "Stout",
      stock: "Out of Stock",
      image: "/product-placeholder.jpg"
    }
  ];

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
    <main className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  My Favourites
                </h1>
                <p className="text-lg text-gray-600 mt-1">Your saved products and wishlist items</p>
              </div>
            </div>
            <Link
              href="/customer/account"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-[#368899] bg-white border-2 border-[#368899] rounded-xl hover:bg-[#368899] hover:text-white transition-all duration-200 transform hover:scale-105 shadow-lg"
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Favourite Products</h2>
              <p className="text-gray-600">You have {favourites.length} items in your favourites</p>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors border border-red-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>

          {favourites.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.map((item) => (
                <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  {/* Product Image Placeholder */}
                  <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>

                  {/* Product Info */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-[#368899] transition-colors">
                        {item.name}
                      </h3>
                      <button className="text-red-500 hover:text-red-700 transition-colors p-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-[#368899]">{item.price}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStockColor(item.stock)}`}>
                        {item.stock}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Category: {item.category}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button className="w-full bg-[#368899] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#2d7a8a] transition-all duration-200 shadow-lg">
                      Add to Cart
                    </button>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors border border-red-200">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {favourites.length > 0 && (
            <div className="mt-12 p-6 bg-gray-100 rounded-2xl border border-gray-200">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Actions</h3>
                  <p className="text-gray-600">Manage your favourites and shopping experience</p>
                </div>
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <button className="inline-flex items-center px-4 py-2 bg-white text-[#368899] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors border border-[#368899]">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export List
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-[#368899] text-white text-sm font-medium rounded-lg hover:bg-[#2d7a8a] transition-colors">
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
