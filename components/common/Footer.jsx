"use client";
import Link from "next/link";
import { HomeIcon, FacebookIcon, TwitterIcon, PhoneIcon } from "../icons";
import { useState, useEffect } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  const footerLinksLeft = [
    { name: "Home", href: "/" },
    { name: "My Account", href: "/account" },
    { name: "About", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Delivery", href: "/delivery" },
  ];

  const footerLinksRight = [
    { name: "Sitemap", href: "/sitemap" },
    { name: "FAQ", href: "/faqs" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "Terms & Conditions", href: "/terms" },
  ];

  return (
    <footer className="w-full font-sans bg-gradient-to-b from-[#1e5b67] to-[#0f3a43] text-white py-12 overflow-hidden" role="contentinfo">
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
            <h3 className="text-lg font-semibold mb-4 text-white">Information</h3>
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
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-200">
              <p>53 Mahlon Avenue, Ruislip HA4 6SZ, UK</p>
              <p>020 8445 0589 / 020 8445 0680</p>
              <p>Mon-Thu: 9am-7pm</p>
              <p>Fri: 9am-5pm</p>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Newsletter</h3>
            <p className="text-sm text-gray-200 mb-4">Stay updated with our latest offers!</p>
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
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
              </Link>
              <Link
                href="mailto:info@nexpressdelivery.co.uk"
                aria-label="Email"
                className="group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          {/* We Accept - Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">We Accept</h3>
            <div className="flex space-x-3">
              <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                <svg className="w-10 h-6 text-[#1a3c8b]" viewBox="0 0 38 24">
                  <path fill="currentColor" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3zM15.2 7h7.6v10h-7.6V7zm8.6 0h2.3v10h-2.3V7zm-17.2 0H9v10H6.6V7zm11.5 0h2.3v10h-2.3V7z" />
                </svg>
              </div>
              <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                <svg className="w-10 h-6 text-[#003087]" viewBox="0 0 38 24">
                  <path fill="currentColor" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3zm-9.3 7.7c1.4-.1 2.7.3 3.8 1.1.7.5 1.2 1.2 1.5 2 .3.8.4 1.7.3 2.6-.1 1-.5 1.9-1.2 2.6-.7.7-1.6 1.2-2.6 1.4-1 .2-2 .1-3-.3v2.9h-2.3V7h2.3c.2 0 .3 0 .5.1zm-7.2 0h2.3v10h-2.3V7zm-7.2 0h2.3v10H9.6V7zm-5 0h2.3v10H4.6V7z" />
                </svg>
              </div>
              <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                <svg className="w-10 h-6 text-[#009cde]" viewBox="0 0 38 24">
                  <path fill="currentColor" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3zm-17 7h2.3c2 0 3.7 1.6 3.7 3.6s-1.7 3.6-3.7 3.6h-2.3V7zm-7.2 0h2.3v10H10.8V7zm-5 0h2.3v10H5.8V7z" />
                </svg>
              </div>
              <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md">
                <svg className="w-10 h-6 text-[#b00039]" viewBox="0 0 38 24">
                  <path fill="currentColor" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3zm-9.3 7c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5-4.5-2-4.5-4.5 2-4.5 4.5-4.5zm-7.2 0h2.3v10h-2.3V7zm-7.2 0h2.3v10H10.8V7z" />
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
          <p className="text-xs text-gray-300 mt-1">Fast & Reliable Delivery Across London</p>
        </div>
      </div>
    </footer>
  );
}