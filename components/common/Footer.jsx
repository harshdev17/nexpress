"use client";
import Link from "next/link";
import {
  HomeIcon,
  FacebookIcon,
  TwitterIcon,
  PhoneIcon,
  ShoppingCartIcon,
  SearchIcon,
} from "../icons";
import { useState, useEffect } from "react";
import { categories } from "../categories";
import "./footer.css";
export default function Footer() {
  const [email, setEmail] = useState("");
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Focus search function
  const focusSearch = () => {
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
      searchInput.focus();
      setIsSearchFocused(true);
      setTimeout(() => setIsSearchFocused(false), 2000);
    }
  };

  const footerLinksLeft = [
    { name: "Home", href: "/" },
    { name: "My Account", href: "/customer/account" },
    { name: "About", href: "/about-us" },
    { name: "Contact Us", href: "mailto:info@nexpressdelivery.co.uk" },
    { name: "Delivery Areas", href: "/delivery-areas" },
  ];

  const footerLinksRight = [
    { name: "Sitemap", href: "/" },
    { name: "FAQ", href: "/faq" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
  ];

  return (
    <>
      <footer
        className="w-full font-sans bg-gradient-to-b from-[#1e5b67] to-[#0f3a43] text-white py-12 overflow-hidden"
        role="contentinfo"
        style={{paddingBottom: "70px",
          marginBottom: "25px"}}
      >
      <div className="max-w-7xl mx-auto px-6">
        {/* Compact Hero Section */}
        <div className="relative bg-gradient-to-r from-[#368899]/30 to-[#2d7a8a]/30 rounded-xl py-8 mb-10 text-center backdrop-blur-md border border-white/15 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Nexpress Delivery
          </h2>
          <p className="text-gray-100">
            Fast, reliable delivery across London for home and office
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Explore Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Explore</h3>
            <ul className="space-y-3">
              {footerLinksLeft.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-gray-200 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information Links */}
          <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Information
              </h3>
            <ul className="space-y-3">
              {footerLinksRight.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-gray-200 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Contact Us
              </h3>
            <div className="space-y-3 text-sm text-gray-200">
              <p>53 Mahlon Avenue, Ruislip HA4 6SZ, UK</p>
              <p>020 8445 0589 / 020 8445 0680</p>
              <p>Mon-Thu: 9am-7pm</p>
              <p>Fri: 9am-5pm</p>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Newsletter
              </h3>
              <p className="text-sm text-gray-200 mb-4">
                Stay updated with our latest offers!
              </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-gray-900 bg-white/90 border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#368899] transition-all duration-300 text-sm"
                aria-label="Email for newsletter subscription"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#368899] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#2d7a8a] transition-all duration-300 text-sm"
                aria-label="Subscribe to newsletter"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Connect & Payment Methods Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Connect - Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Connect</h3>
            <div className="flex space-x-3">
              <Link
                href="https://www.facebook.com/NexpressDeliveryUK/"
                target="_blank"
                aria-label="Facebook"
                className="group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110">
                  <FacebookIcon className="w-5 h-5 text-white" />
                </div>
              </Link>
              <Link
                href="https://twitter.com/nexpressuk"
                target="_blank"
                aria-label="Twitter"
                className="group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110">
                  <TwitterIcon className="w-5 h-5 text-white" />
                </div>
              </Link>
              <Link
                href="https://www.linkedin.com/in/angela-hart-11937223"
                target="_blank"
                aria-label="LinkedIn"
                className="group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
              </Link>
              <Link
                href="mailto:info@nexpressdelivery.co.uk"
                aria-label="Email"
                className="group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          {/* We Accept - Payment Methods */}
          <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                We Accept
              </h3>
            <div className="flex space-x-3">
              <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                <svg className="w-10 h-6 text-[#1a3c8b]" viewBox="0 0 38 24">
                    <path
                      fill="currentColor"
                      d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3zM15.2 7h7.6v10h-7.6V7zm8.6 0h2.3v10h-2.3V7zm-17.2 0H9v10H6.6V7zm11.5 0h2.3v10h-2.3V7z"
                    />
                </svg>
              </div>
              <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                <svg className="w-10 h-6 text-[#003087]" viewBox="0 0 38 24">
                    <path
                      fill="currentColor"
                      d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3zm-9.3 7.7c1.4-.1 2.7.3 3.8 1.1.7.5 1.2 1.2 1.5 2 .3.8.4 1.7.3 2.6-.1 1-.5 1.9-1.2 2.6-.7.7-1.6 1.2-2.6 1.4-1 .2-2 .1-3-.3v2.9h-2.3V7h2.3c.2 0 .3 0 .5.1zm-7.2 0h2.3v10h-2.3V7zm-7.2 0h2.3v10H9.6V7zm-5 0h2.3v10H4.6V7z"
                    />
                </svg>
              </div>
              <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                <svg className="w-10 h-6 text-[#009cde]" viewBox="0 0 38 24">
                    <path
                      fill="currentColor"
                      d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3zm-17 7h2.3c2 0 3.7 1.6 3.7 3.6s-1.7 3.6-3.7 3.6h-2.3V7zm-7.2 0h2.3v10H10.8V7zm-5 0h2.3v10H5.8V7z"
                    />
                </svg>
              </div>
              <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                <svg className="w-10 h-6 text-[#b00039]" viewBox="0 0 38 24">
                    <path
                      fill="currentColor"
                      d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3zm-9.3 7c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5-4.5-2-4.5-4.5 2-4.5 4.5-4.5zm-7.2 0h2.3v10h-2.3V7zm-7.2 0h2.3v10H10.8V7z"
                    />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/20 text-center">
          <p className="text-sm font-medium text-gray-200 hover:text-white transition-colors duration-300">
            © 2025 Nexpress Delivery. All rights reserved.
          </p>
            <p className="text-xs text-gray-300 mt-1">
              Fast & Reliable Delivery Across London
            </p>
        </div>
      </div>
    </footer>

      {/* Mobile Bottom Navigation Bar */}
      {/* <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
      <div className="flex items-center justify-around px-2 py-2">
      
        <button
          onClick={scrollToTop}
          className={`flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 ${
            currentPath === "/" 
              ? "text-[#368899]" 
              : "text-gray-600 hover:text-[#368899]"
          }`}
        >
          <HomeIcon className={`w-6 h-6 transition-all duration-300 ${
            currentPath === "/" ? "text-[#368899]" : "text-gray-600"
          }`} />
          <span className={`text-xs font-medium transition-colors duration-300 mt-1 ${
            currentPath === "/" ? "text-[#368899]" : "text-gray-600"
          }`}>
            Home
          </span>
        </button>

   
            <Link
          href="/products"
          className="flex flex-col items-center justify-center w-14 h-14 text-gray-600 hover:text-[#368899] transition-all duration-300"
        >
          <ShoppingCartIcon className="w-6 h-6 transition-all duration-300" />
          <span className="text-xs font-medium mt-1">
            Shop
          </span>
            </Link>
<div class="qaf__left_blank_div_wrap"></div>
      
          <img src="https://static.99acres.com/universalhp/img/m_hp_bottomNavBar_svg.svg" />
      

       
        <div className="relative">
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="flex flex-col items-center justify-center w-14 h-14 text-gray-600 hover:text-[#368899] transition-all duration-300"
          >
            <svg className="w-6 h-6 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium mt-1">
              Categories
            </span>
          </button>

      
          {isCategoriesOpen && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
              <div className="p-4">
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0 pb-2 last:pb-0">
                      <Link 
                        href={category.url === "#" ? `/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}` : category.url}
                        className="block text-sm font-semibold text-gray-800 hover:text-[#368899] transition-colors duration-200 py-1"
                      >
                        {category.name}
            </Link>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="ml-3 mt-1 space-y-1">
                          {category.subcategories.slice(0, 3).map((sub, subIndex) => (
                            <Link 
                              key={subIndex}
                              href={sub.url}
                              className="block text-xs text-gray-600 hover:text-[#368899] transition-colors duration-200 py-0.5"
                            >
                              {sub.name}
            </Link>
                          ))}
                          {category.subcategories.length > 3 && (
                            <span className="text-xs text-gray-400 italic">
                              +{category.subcategories.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
             
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
            </div>
          )}
        </div>

       
        <Link
          href="/account"
          className="flex flex-col items-center justify-center w-14 h-14 text-gray-600 hover:text-[#368899] transition-all duration-300"
        >
          <svg className="w-6 h-6 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium mt-1">
            Account
          </span>
            </Link>
      </div>
      </div> */}
      <div className="bottom_navbar">
        <div class="qaf__bottom_bar_container">
          <div class="qaf__left_blank_div"></div>
          <div class="qaf__left_blank_div_wrap"></div>

          <img
            class="qaf__bottomNavBar_img"
            src="https://static.99acres.com/universalhp/img/m_hp_bottomNavBar_svg.svg"
          />
       
          <div class="qaf__right_blank_div"></div>
          <div class="qaf__right_blank_div_wrap"></div>
        </div>

          <button className="search-icon" onClick={focusSearch}>
           <SearchIcon className="w-6 h-6 " />
         </button>

        <div className="qaf__bottomNavBar_items_container">
          <div className="flex items-center justify-around w-full h-full">
            <div>
              <Link
                href="/"
                className={`flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 ${
                  currentPath === "/"
                    ? "text-[#368899]"
                    : "text-gray-600 hover:text-[#368899]"
                }`}
              >
                <HomeIcon
                  className={`w-6 h-6 transition-all duration-300 ${
                    currentPath === "/" ? "text-[#368899]" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-xs font-medium transition-colors duration-300 mt-1 ${
                    currentPath === "/" ? "text-[#368899]" : "text-gray-600"
                  }`}
                >
                  Home
                </span>
              </Link>
            </div>
            <div>
              <Link
                href="/products"
                className="flex flex-col items-center justify-center w-14 h-14 text-gray-600 hover:text-[#368899] transition-all duration-300"
              >
                <ShoppingCartIcon className="w-6 h-6 transition-all duration-300" />
                <span className="text-xs font-medium mt-1">Shop</span>
              </Link>
            </div>
            <div>
              <button
                onClick={focusSearch}
                className="flex flex-col items-center justify-center w-14 h-14 text-gray-600 hover:text-[#368899] transition-all duration-300"
              >
                <span className="text-xs font-medium mt-1" style={{marginTop: "32px"}}>Search</span>
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  console.log('Categories button clicked, current state:', isCategoriesOpen);
                  setIsCategoriesOpen(!isCategoriesOpen);
                }}
                className="flex flex-col items-center justify-center w-14 h-14 text-gray-600 hover:text-[#368899] transition-all duration-300"
              >
                <svg
                  className="w-6 h-6 transition-all duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs font-medium mt-1">
                  Categories
                </span>
              </button>

              {/* Categories Dropdown Menu */}
              {isCategoriesOpen && (
                <div className="categories-dropdown">
                  {categories.map((category, index) => (
                    <div key={index} className="category-block">
                      <Link
                        href={category.url === "#" ? `/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}` : category.url}
                        className="main-link"
                      >
                        {category.name}
                      </Link>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="sub-list">
                          {category.subcategories.map((sub, subIndex) => (
                            <Link
                              key={subIndex}
                              href={sub.url}
                              className="sub-link"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Arrow pointer */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                </div>
              )}
            </div>
            <div>
              <Link
              href="/customer/account"
                className="flex flex-col items-center justify-center w-14 h-14 text-gray-600 hover:text-[#368899] transition-all duration-300"
              >
                <svg
                  className="w-6 h-6 transition-all duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs font-medium mt-1">Account</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
