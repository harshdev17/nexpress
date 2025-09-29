"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { 
  HomeIcon, 
  FAQIcon, 
  FacebookIcon, 
  TwitterIcon, 
  PhoneIcon, 
  DeliveryVanIcon, 
  ShoppingCartIcon, 
  ChevronDownIcon, 
  SearchIcon 
} from '../icons';
// Dynamic categories will be fetched from API
export default function Header() {
  const router = useRouter();
  const { items, getCartTotals } = useCart();
  const { getWishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [menuCategories, setMenuCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [mobileSearchSuggestions, setMobileSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [selectedMobileSuggestionIndex, setSelectedMobileSuggestionIndex] = useState(-1);

  // Get cart totals
  const cartTotals = getCartTotals();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const handleSearch = (e, isMobile = false) => {
    e.preventDefault();
    const query = isMobile ? mobileSearchQuery : searchQuery;
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      if (isMobile) {
        setIsMobileMenuOpen(false);
        setMobileSearchQuery('');
      } else {
        setSearchQuery('');
      }
    }
  };

  const handleSearchInputChange = (e, isMobile = false) => {
    const value = e.target.value;
    if (isMobile) {
      setMobileSearchQuery(value);
      updateSuggestions(value, true);
    } else {
      setSearchQuery(value);
      updateSuggestions(value, false);
    }
  };

  const updateSuggestions = (query, isMobile = false) => {
    if (query.trim().length < 2) {
      if (isMobile) {
        setMobileSearchSuggestions([]);
        setShowMobileSuggestions(false);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
      return;
    }

    const filtered = allProducts.filter(product => 
      (product.ItemName && product.ItemName.toLowerCase().includes(query.toLowerCase())) ||
      (product.Brand && product.Brand.toLowerCase().includes(query.toLowerCase())) ||
      (product.Category && product.Category.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 5); // Limit to 5 suggestions

    if (isMobile) {
      setMobileSearchSuggestions(filtered);
      setShowMobileSuggestions(filtered.length > 0);
    } else {
      setSearchSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  const selectSuggestion = (product, isMobile = false) => {
    const query = product.ItemName || product.Brand || product.Category;
    if (!query) return;
    if (isMobile) {
      setShowMobileSuggestions(false);
      setSelectedMobileSuggestionIndex(-1);
      setIsMobileMenuOpen(false);
      setMobileSearchQuery('');
    } else {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      setSearchQuery('');
    }
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const clearSuggestions = (isMobile = false) => {
    if (isMobile) {
      setShowMobileSuggestions(false);
      setSelectedMobileSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleKeyDown = (e, isMobile = false) => {
    const suggestions = isMobile ? mobileSearchSuggestions : searchSuggestions;
    const selectedIndex = isMobile ? selectedMobileSuggestionIndex : selectedSuggestionIndex;
    const setSelectedIndex = isMobile ? setSelectedMobileSuggestionIndex : setSelectedSuggestionIndex;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[selectedIndex], isMobile);
    } else if (e.key === 'Escape') {
      clearSuggestions(isMobile);
    }
  };

  // Dropdown categories data
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        const data = await res.json();
        if (data?.success && Array.isArray(data.categories)) {
          const slugify = (p, name) => {
            const s = (p && String(p).trim()) || '';
            if (s) return s;
            return String(name || '')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');
          };
          const mapNode = (n) => ({
            name: n.CatName,
            url: `/categories/${encodeURIComponent(slugify(n.PageName, n.CatName))}`,
            subcategories: Array.isArray(n.children) ? n.children.map(mapNode) : []
          });
          setMenuCategories(data.categories.map(mapNode));
        } else {
          setMenuCategories([]);
        }
      } catch {
        setMenuCategories([]);
      }
    })();
  }, []);

  // Fetch products for search suggestions
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        if (data?.success && Array.isArray(data.products)) {
          setAllProducts(data.products);
        }
      } catch {
        setAllProducts([]);
      }
    })();
  }, []);

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const rawUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (!token) {
        setCurrentUser(null);
        setIsAuthChecking(false);
        return;
      }
      (async () => {
        try {
          const res = await fetch('/api/auth/validate-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionToken: token })
          });
          const data = await res.json();
          if (data?.success) {
            const parsed = rawUser ? JSON.parse(rawUser) : null;
            setCurrentUser(parsed);
          } else {
            setCurrentUser(null);
          }
        } catch {
          setCurrentUser(null);
        } finally {
          setIsAuthChecking(false);
        }
      })();
    } catch {
      setCurrentUser(null);
      setIsAuthChecking(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken: token, allDevices: false })
        });
      }
    } catch {}
    finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
      setCurrentUser(null);
      router.replace('/customer/login');
    }
  };

  // Helper to close mobile menu when clicking any link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
  };

  return (
    <header className="w-full font-sans bg-white shadow-lg relative">
      {/* First Row - Teal Blue Navigation */}
      <div className="bg-gradient-to-r from-[#368899] to-[#2d7a8a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Left side - Home and FAQ (hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2 transition-all duration-300 hover:text-gray-200 hover:scale-105 group">
                <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                  <HomeIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Home</span>
              </Link>
              <Link href="/faq" className="flex items-center space-x-2 transition-all duration-300 hover:text-gray-200 hover:scale-105 group">
                <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                  <FAQIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">FAQ</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center space-x-2 text-white hover:text-gray-200 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-sm font-medium">Menu</span>
            </button>

            {/* Right side - Auth, Contact, Social Icons (hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthChecking ? (
                <span className="text-sm opacity-80">Loading...</span>
              ) : currentUser ? (
                <div className="flex items-center space-x-3">
                  <Link href="/customer/account" className="text-sm font-medium hover:text-gray-200 transition-colors">
                    {currentUser.first_name || currentUser.firstName || currentUser.username || currentUser.email}
                  </Link>
                  <button onClick={handleLogout} className="text-sm font-medium transition-all duration-300 hover:text-gray-200 hover:scale-105">Logout</button>
                </div>
              ) : (
                <Link href="/customer/login" className="text-sm font-medium transition-all duration-300 hover:text-gray-200 hover:scale-105">Login</Link>
              )}
              <Link href="mailto:info@nexpressdelivery.co.uk" className="text-sm font-medium transition-all duration-300 hover:text-gray-200 hover:scale-105">Contact</Link>
              
              {/* Social Icons */}
              <div className="flex items-center space-x-3">
                <Link href="#" aria-label="Facebook" className="group">
                  <div className="w-7 h-7 border border-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:scale-110">
                    <FacebookIcon className="w-3 h-3" />
                  </div>
                </Link>
                <Link href="#" aria-label="Twitter" className="group">
                  <div className="w-7 h-7 border border-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:scale-110">
                    <TwitterIcon className="w-3 h-3" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Mobile Cart and WhatsApp */}
            <div className="md:hidden flex items-center space-x-3">
              {/* WhatsApp Button */}
              <Link href="https://wa.me/4402084450589" target="_blank" className="group">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-green-600 hover:scale-110">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
              </Link>
              
              {/* Cart Icon */}
              <Link href="/cart" className="group cursor-pointer" onClick={closeMobileMenu}>
                <div className="relative">
                  <ShoppingCartIcon className="w-6 h-6 text-white transition-colors duration-300 group-hover:text-gray-200" />
                  {cartTotals.itemCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {cartTotals.itemCount}
                    </div>
                  )}
                </div>
              </Link>

              {/* Wishlist Icon */}
              <Link href="/customer/account/favourites" className="group cursor-pointer ml-4" onClick={closeMobileMenu}>
                <div className="relative">
                  <svg className="w-6 h-6 text-white transition-colors duration-300 group-hover:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {getWishlistCount() > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {getWishlistCount()}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Logo, Contact Info, Delivery Info, Cart */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-1">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start">
              <Link href="/" className="group" onClick={closeMobileMenu}>
                <div className="flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 hover:bg-gray-50">
                  <Image 
                    src="/logo.png" 
                    alt="Nexpress Delivery Logo" 
                    width={120} 
                    height={120} 
                    priority 
                    className="w-50 h-20 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>

            {/* Contact Information */}
            <div className="hidden md:flex items-start space-x-3 group">
              <div className="p-2 rounded-full bg-gray-50 group-hover:bg-[#368899]/10 transition-colors duration-300">
                <PhoneIcon className="w-5 h-5 text-[#368899]" />
              </div>
              <div>
                <p className="text-lg font-bold text-[#368899] tracking-tight">020 8445 0589 / 0680</p>
                <p className="text-sm text-gray-600">Monday - Thursday 9am to 7pm</p>
                <p className="text-sm text-gray-600">Friday 9am to 5pm</p>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="hidden md:flex items-start space-x-3 group">
              <div className="p-2 rounded-full bg-gray-50 group-hover:bg-[#368899]/10 transition-colors duration-300">
                <DeliveryVanIcon className="w-5 h-5 text-[#368899]" />
              </div>
              <div>
                <p className="font-bold text-[#368899] uppercase text-sm tracking-wide">Home and Office Delivery</p>
                <p className="text-sm text-gray-600">Reliable, <strong>fast</strong> 1-2 working day</p>
                <p className="text-sm text-gray-600">delivery in most <strong>London</strong> areas.</p>
                <Link href="/delivery-areas" className="text-sm text-[#368899] underline transition-colors duration-300 hover:text-[#2d7a8a] hover:no-underline">
                  Check our delivery schedule
                </Link>
              </div>
            </div>

            {/* Shopping Cart (Desktop) */}
            <div className="hidden md:flex items-center justify-center lg:justify-end">
              <Link href="/cart" className="group cursor-pointer">
                <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 rounded-xl border border-gray-200 hover:border-[#368899] hover:shadow-md transition-all duration-300">
                  <div className="relative">
                    <ShoppingCartIcon className="w-6 h-6 text-gray-700 group-hover:text-[#368899] transition-colors duration-300" />
                    {cartTotals.itemCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#368899] text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {cartTotals.itemCount}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'Item' : 'Items'}
                    </span>
                    <span className="text-sm font-bold text-[#368899]">£{cartTotals.total.toFixed(2)}</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row - Navigation and Search */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Navigation Links (hidden on mobile) */}
            <nav className="hidden lg:flex items-center space-x-8">
              {/* Shop By Category Dropdown */}
              <div className="relative group">
                <button 
                  onClick={toggleCategoryDropdown}
                  className="flex items-center space-x-2 text-gray-700 text-sm font-bold bg-white px-5 py-2.5 rounded-xl shadow-sm transition-all duration-300 hover:text-[#368899] hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#368899] focus:ring-offset-2"
                >
                  <span>Shop By Category</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Desktop Dropdown */}
                {isCategoryDropdownOpen && (
  <div className="absolute left-0 top-full mt-2 min-w-[1100px] bg-white rounded-lg shadow-md border border-gray-100 z-50 p-4 transition-all duration-200 ease-in-out opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
  <div className="grid grid-cols-4 gap-2">
    {menuCategories.map((category, idx) => (
      <Link 
        key={idx} 
        href={category.url}
        className="flex items-center space-x-2 px-3 py-2 hover:bg-[#368899]/5 rounded-md transition-colors duration-200"
      >
        <span className="text-sm font-medium text-gray-800 hover:text-[#368899] transition-colors duration-200">
          {category.name}
        </span>
      </Link>
    ))}
  </div>
</div>
)}
              </div>

              <Link href="/delivery-areas" className="text-gray-700 text-sm font-semibold transition-all duration-300 hover:text-[#368899] hover:scale-105">Delivery Areas</Link>
              <Link href="/events" className="text-gray-700 text-sm font-semibold transition-all duration-300 hover:text-[#368899] hover:scale-105">Corporate/Events</Link>
              <Link href="/about-us" className="text-gray-700 text-sm font-semibold transition-all duration-300 hover:text-[#368899] hover:scale-105">About Us</Link>
              <Link href="/faq" className="text-gray-700 text-sm font-semibold transition-all duration-300 hover:text-[#368899] hover:scale-105">FAQ's</Link>
            </nav>

            {/* Centered Search Bar */}
            <div className="flex items-center justify-center w-full lg:w-auto">
              <div className="relative w-full max-w-md group">
                <form onSubmit={(e) => handleSearch(e, false)} className="relative">
                <input 
                  type="search" 
                  placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e, false)}
                    onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                    onBlur={() => setTimeout(() => clearSuggestions(false), 200)}
                    onKeyDown={(e) => handleKeyDown(e, false)}
                  className="w-full border-2 border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#368899] focus:border-[#368899] transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md"
                  aria-label="Search products"
                  id="search-input"
                    autoComplete="off"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#368899] text-white p-2 rounded-lg hover:bg-[#2d7a8a] focus:outline-none focus:ring-2 focus:ring-[#368899] focus:ring-offset-2 transition-all duration-300 hover:scale-110 group-hover:shadow-lg"
                  aria-label="Search"
                >
                  <SearchIcon className="w-4 h-4" />
                </button>
                {/* Search animation indicator */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#368899]/20 transition-all duration-300 pointer-events-none"></div>
                </form>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 border-b border-gray-100">
                        Suggestions
                      </div>
                      {searchSuggestions.map((product, index) => (
                        <button
                          key={index}
                          onClick={() => selectSuggestion(product, false)}
                          className={`w-full text-left px-3 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-3 ${
                            index === selectedSuggestionIndex 
                              ? 'bg-[#368899]/10 border border-[#368899]/20' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {product.ItemMainImage ? (
                              <img 
                                src={product.ItemMainImage} 
                                alt={product.ItemName}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {product.ItemName}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {product.Brand && `${product.Brand} • `}{product.Category}
                            </div>
                            <div className="text-sm font-bold text-[#368899]">
                              £{parseFloat(product.ItemPrice || 0).toFixed(2)}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={toggleMobileMenu}
          ></div>
          
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Image 
                    src="/logo.png" 
                    alt="Nexpress Delivery Logo" 
                    width={40} 
                    height={40} 
                    className="object-contain w-30 h-10"
                  />
                </div>
                <button 
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search Section */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <form onSubmit={(e) => handleSearch(e, true)} className="relative">
                  <input 
                    type="search" 
                    placeholder="Search products..." 
                      value={mobileSearchQuery}
                      onChange={(e) => handleSearchInputChange(e, true)}
                      onFocus={() => setShowMobileSuggestions(mobileSearchSuggestions.length > 0)}
                      onBlur={() => setTimeout(() => clearSuggestions(true), 200)}
                      onKeyDown={(e) => handleKeyDown(e, true)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#368899] focus:border-[#368899]"
                      autoComplete="off"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#368899]"
                  >
                    <SearchIcon className="w-4 h-4" />
                  </button>
                  </form>

                  {/* Mobile Search Suggestions Dropdown */}
                  {showMobileSuggestions && mobileSearchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
                      <div className="p-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 border-b border-gray-100">
                          Suggestions
                        </div>
                        {mobileSearchSuggestions.map((product, index) => (
                          <button
                            key={index}
                            onClick={() => selectSuggestion(product, true)}
                            className={`w-full text-left px-3 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-3 ${
                              index === selectedMobileSuggestionIndex 
                                ? 'bg-[#368899]/10 border border-[#368899]/20' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              {product.ItemMainImage ? (
                                <img 
                                  src={product.ItemMainImage} 
                                  alt={product.ItemName}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {product.ItemName}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {product.Brand && `${product.Brand} • `}{product.Category}
                              </div>
                              <div className="text-sm font-bold text-[#368899]">
                                £{parseFloat(product.ItemPrice || 0).toFixed(2)}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shop By Category Dropdown */}
              <div className="p-4 border-b border-gray-200">
                <button 
                  onClick={toggleCategoryDropdown}
                  className="flex items-center justify-between w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  <span className="font-semibold text-gray-700">Shop By Category</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCategoryDropdownOpen && (
                  <div className="mt-3 max-h-64 overflow-y-auto">
                    {menuCategories.map((category, index) => (
                      <div key={index} className="mb-3">
                        <Link 
                          href={category.url}
                          onClick={closeMobileMenu}
                          className="block text-sm font-medium text-gray-800 hover:text-[#368899] transition-colors duration-300 mb-2"
                        >
                          {category.name}
                        </Link>
                        {category.subcategories.length > 0 && (
                          <div className="ml-4 space-y-1">
                            {category.subcategories.map((sub, subIndex) => (
                              <Link 
                                key={subIndex}
                                href={sub.url}
                                onClick={closeMobileMenu}
                                className="block text-xs text-gray-600 hover:text-[#368899] transition-colors duration-300 py-1"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  <li>
                    <Link href="/" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-gray-700 hover:text-[#368899]">
                      <HomeIcon className="w-5 h-5" />
                      <span className="font-medium">Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-gray-700 hover:text-[#368899]">
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span className="font-medium">Shop</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-us" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-gray-700 hover:text-[#368899]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">About</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/delivery-areas" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-gray-700 hover:text-[#368899]">
                      <DeliveryVanIcon className="w-5 h-5" />
                      <span className="font-medium">Delivery Areas</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/events" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-gray-700 hover:text-[#368899]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Corporate/Events</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-gray-700 hover:text-[#368899]">
                      <FAQIcon className="w-5 h-5" />
                      <span className="font-medium">FAQ's</span>
                    </Link>
                  </li>
                  
                  {/* Social Links */}
                  <li className="pt-4 border-t border-gray-200">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Social Media</span>
                  </li>
                  <li>
                    <Link href="https://www.facebook.com/NexpressDeliveryUK/" target="_blank" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-gray-700 hover:text-[#368899]">
                      <FacebookIcon className="w-5 h-5" />
                      <span className="font-medium">Facebook</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://twitter.com/nexpressuk" target="_blank" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-gray-700 hover:text-[#368899]">
                      <TwitterIcon className="w-5 h-5" />
                      <span className="font-medium">Twitter</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.linkedin.com/in/angela-hart-11937223" target="_blank" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-gray-700 hover:text-[#368899]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span className="font-medium">LinkedIn</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="mailto:info@nexpressdelivery.co.uk" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-gray-700 hover:text-[#368899]">
                      <PhoneIcon className="w-5 h-5" />
                      <span className="font-medium">Contact Us</span>
                    </Link>
                  </li>
                  <li>
                    {currentUser ? (
                      <button onClick={() => { closeMobileMenu(); handleLogout(); }} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-gray-700 hover:text-[#368899] text-left">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Logout</span>
                      </button>
                    ) : (
                      <Link href="/customer/login" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-gray-700 hover:text-[#368899]">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Login/Register</span>
                      </Link>
                    )}
                  </li>
                </ul>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">© 2024 Nexpress Delivery</p>
                  <p className="text-xs text-gray-500 mt-1">Fast & Reliable Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}