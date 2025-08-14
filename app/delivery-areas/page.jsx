"use client";
import Link from "next/link";
import { useState } from "react";
import NeedHelpCTA from "@/components/common/NeedHelpCTA";
import BrandLogo from "@/components/common/BrandLogo";

// export const metadata = {
//   title: "Delivery Areas | Nexpress Delivery",
//   description: "Find out if we deliver to your area in London. Check our delivery schedule and coverage areas for fast, reliable beverage delivery.",
// };

export default function DeliveryAreasPage() {
  const [searchPostcode, setSearchPostcode] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  
  const deliveryAreas = [
    {
      area: "North London",
      postcodes: ["N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "N10", "N11", "N12", "N13", "N14", "N15", "N16", "N17", "N18", "N19", "N20", "N21", "N22"],
      description: "Comprehensive coverage across all North London postcodes including Islington, Haringey, Enfield, and Barnet."
    },
    {
      area: "East London",
      postcodes: ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10", "E11", "E12", "E13", "E14", "E15", "E16", "E17", "E18", "E20"],
      description: "Full delivery service across East London including Tower Hamlets, Hackney, Newham, Waltham Forest, and Redbridge."
    },
    {
      area: "South London",
      postcodes: ["SE1", "SE2", "SE3", "SE4", "SE5", "SE6", "SE7", "SE8", "SE9", "SE10", "SE11", "SE12", "SE13", "SE14", "SE15", "SE16", "SE17", "SE18", "SE19", "SE20", "SE21", "SE22", "SE23", "SE24", "SE25", "SE26", "SE27", "SE28"],
      description: "Extensive coverage of South London including Southwark, Lambeth, Lewisham, Greenwich, and Bromley."
    },
    {
      area: "West London",
      postcodes: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12", "W13", "W14"],
      description: "Complete service across West London including Westminster, Kensington & Chelsea, Hammersmith & Fulham, and Ealing."
    },
    {
      area: "Central London",
      postcodes: ["WC1", "WC2", "EC1", "EC2", "EC3", "EC4", "SW1", "SW2", "SW3", "SW4", "SW5", "SW6", "SW7", "SW8", "SW9", "SW10", "SW11", "SW12", "SW13", "SW14", "SW15", "SW16", "SW17", "SW18", "SW19", "SW20"],
      description: "Premium delivery service across all Central London areas including the City, Westminster, and surrounding boroughs."
    }
  ];

  const deliverySchedules = {
    "North London": {
      description: "Monday, Tuesday, Thursday, Friday",
      days: ["Monday", "Tuesday", "Thursday", "Friday"],
      time: "9:00 AM - 7:00 PM"
    },
    "East London": {
      description: "Monday, Wednesday, Friday",
      days: ["Monday", "Wednesday", "Friday"],
      time: "9:00 AM - 7:00 PM"
    },
    "South London": {
      description: "Tuesday, Thursday, Saturday",
      days: ["Tuesday", "Thursday", "Saturday"],
      time: "9:00 AM - 7:00 PM"
    },
    "West London": {
      description: "Monday, Wednesday, Friday",
      days: ["Monday", "Wednesday", "Friday"],
      time: "9:00 AM - 7:00 PM"
    },
    "Central London": {
      description: "Monday, Tuesday, Wednesday, Thursday, Friday",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      time: "9:00 AM - 7:00 PM"
    }
  };

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Function to search postcode
  const handlePostcodeSearch = () => {
    if (!searchPostcode.trim()) {
      setSearchResult(null);
      return;
    }

    const postcode = searchPostcode.trim().toUpperCase();
    let foundArea = null;

    for (const area of deliveryAreas) {
      if (area.postcodes.some(pc => pc === postcode)) {
        foundArea = area;
        break;
      }
    }

    // Set result to false if no area found, or the found area
    setSearchResult(foundArea || false);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePostcodeSearch();
    }
  };

  return (
    <main className="w-full bg-white">
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Delivery Areas</h1>
          <p className="mt-3 text-gray-600 max-w-2xl">
            We deliver to most areas across London with fast, reliable service. Check if we cover your postcode and view our delivery schedule.
          </p>
        </header>

        <div className="space-y-12">
          {/* Postcode Search */}
          <div className="bg-gradient-to-br from-[#368899]/5 to-[#2d7a8a]/5 rounded-2xl border border-[#368899]/20 p-6 md:p-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#368899] to-[#2d7a8a] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Check Your Postcode</h2>
                  <p className="text-gray-600 text-sm">Enter your postcode to see if we deliver to your area</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Enter your postcode (e.g., N1, E1, SE1)"
                  value={searchPostcode}
                  onChange={(e) => setSearchPostcode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#368899] focus:border-transparent outline-none transition-all duration-200"
                />
                <button
                  onClick={handlePostcodeSearch}
                  className="px-6 py-3 bg-gradient-to-r from-[#368899] to-[#2d7a8a] text-white font-semibold rounded-xl hover:from-[#2d7a8a] hover:to-[#1e5b67] transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  Search
                </button>
              </div>

              {/* Search Result */}
              {searchResult && (
                <div className="mt-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl border-2 border-green-200 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                  {/* Header with enhanced styling */}
                  <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 p-8 text-white relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white/25 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg border border-white/20">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-1">Great News! 🎉</h3>
                          <p className="text-green-100 text-lg">We deliver to <span className="font-bold text-white">{searchPostcode.toUpperCase()}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold mb-1">{searchResult.area}</div>
                        <div className="text-green-100 text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Service Available</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content with enhanced spacing */}
                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Area Info */}
                      <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center shadow-sm">
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg mb-1">Coverage Area</h4>
                              <p className="text-gray-600 leading-relaxed">{searchResult.description}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg mb-1">Delivery Days</h4>
                              <p className="text-[#368899] font-semibold text-lg">{deliverySchedules[searchResult.area]?.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Delivery Details */}
                      <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center shadow-sm">
                              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg mb-1">Delivery Hours</h4>
                              <p className="text-[#368899] font-semibold text-lg">{deliverySchedules[searchResult.area]?.time}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-5 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center shadow-sm">
                              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg mb-1">Delivery Charge</h4>
                              <p className="text-[#368899] font-semibold text-lg">£3.99 <span className="text-sm text-gray-500">(including VAT)</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Action Button */}
                    <div className="mt-8 pt-6 border-t border-green-200 text-center">
                      <Link
                        href="/products"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-xl transform hover:scale-105 hover:shadow-2xl"
                      >
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Start Shopping Now
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {searchResult === false && (
                <div className="mt-8 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl border-2 border-orange-200 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                  {/* Header with enhanced styling */}
                  <div className="bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-600 p-8 text-white relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-600/20"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white/25 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg border border-white/20">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-1">Not Currently Available</h3>
                          <p className="text-orange-100 text-lg">We don't deliver to <span className="font-bold text-white">{searchPostcode.toUpperCase()}</span> yet</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold mb-1">Out of Area</div>
                        <div className="text-orange-100 text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Expansion Planned</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content with enhanced spacing */}
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-3">We're Expanding Our Network!</h4>
                      <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
                        Don't worry! We're constantly expanding our delivery network. Please contact us to check if we can arrange delivery to your area or if we have plans to expand our coverage soon.
                      </p>
                    </div>
                    
                    {/* Enhanced Contact Options */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center shadow-sm">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg mb-1">Call Us Directly</h4>
                            <p className="text-orange-600 font-semibold text-lg">020 8445 0589</p>
                            <p className="text-gray-500 text-sm">Speak to our team</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl flex items-center justify-center shadow-sm">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg mb-1">Send Us an Email</h4>
                            <p className="text-orange-600 font-semibold text-lg">info@nexpressdelivery.co.uk</p>
                            <p className="text-gray-500 text-sm">We'll respond quickly</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="tel:+442084450589"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-600 text-white font-bold text-lg rounded-2xl hover:from-orange-600 hover:via-amber-700 hover:to-yellow-700 transition-all duration-300 shadow-xl transform hover:scale-105 hover:shadow-2xl"
                      >
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call Now
                      </Link>
                      <Link
                        href="mailto:info@nexpressdelivery.co.uk"
                        className="inline-flex items-center px-8 py-4 bg-white text-orange-600 border-2 border-orange-500 font-bold text-lg rounded-2xl hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-xl transform hover:scale-105 hover:shadow-2xl"
                      >
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send Email
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Areas */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Coverage Areas</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              We provide comprehensive delivery coverage across London and surrounding areas. Our fleet of delivery vehicles ensures fast and reliable service to your doorstep.
            </p>
            
                         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {deliveryAreas.map((area, index) => (
                 <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:border-[#368899]/30 transition-all duration-300 transform hover:-translate-y-1">
                   {/* Area Header with Icon */}
                   <div className="flex items-center space-x-3 mb-4">
                     <div className="w-12 h-12 bg-gradient-to-br from-[#368899] to-[#2d7a8a] rounded-xl flex items-center justify-center shadow-lg">
                       <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                       </svg>
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-gray-900">{area.area}</h3>
                       <div className="flex items-center space-x-1">
                         <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                         <span className="text-sm text-green-600 font-medium">Service Available</span>
                       </div>
                     </div>
                   </div>
                   
                   <p className="text-gray-600 text-sm mb-6 leading-relaxed">{area.description}</p>
                   
                   {/* Delivery Days with Icon */}
                   <div className="mb-6 p-4 bg-gradient-to-r from-[#368899]/5 to-[#2d7a8a]/5 rounded-xl border border-[#368899]/10">
                     <div className="flex items-center space-x-2 mb-2">
                       <svg className="w-4 h-4 text-[#368899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                       <h4 className="text-sm font-semibold text-gray-800">Delivery Days</h4>
                     </div>
                     <p className="text-sm text-[#368899] font-semibold">
                       {deliverySchedules[area.area]?.description || "Contact us for schedule"}
                     </p>
                   </div>
                   
                   {/* Postcodes */}
                   <div className="space-y-3">
                     <div className="flex items-center space-x-2">
                       <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                       </svg>
                       <h4 className="text-sm font-semibold text-gray-800">Coverage Postcodes</h4>
                     </div>
                     <div className="flex flex-wrap gap-2">
                       {area.postcodes.map((postcode, idx) => (
                         <span key={idx} className="text-xs bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 font-medium shadow-sm hover:shadow-md transition-shadow">
                           {postcode}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

                                           {/* Delivery Schedule */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#368899] to-[#2d7a8a] rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Delivery Schedule by Area</h2>
                  <p className="text-gray-600 text-sm">Find your area's specific delivery days</p>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-8">
                Different areas have different delivery days. Orders placed before 3:00 PM on working days will be delivered according to your area's schedule. We provide a two-hour delivery window and drivers may call when approaching your location.
              </p>
              
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#368899] to-[#2d7a8a] text-white">
                      <th className="text-left p-4 font-semibold border-b border-white/20">Area</th>
                      <th className="text-left p-4 font-semibold border-b border-white/20">Delivery Days</th>
                      <th className="text-left p-4 font-semibold border-b border-white/20">Hours</th>
                      <th className="text-left p-4 font-semibold border-b border-white/20">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryAreas.map((area, index) => {
                      const schedule = deliverySchedules[area.area];
                      return (
                        <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                          <td className="p-4 font-semibold text-gray-800">{area.area}</td>
                          <td className="p-4 text-gray-700">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-[#368899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{schedule?.description || "Contact us"}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-700">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-[#368899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{schedule?.time || "TBD"}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              Available
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

                     {/* Delivery Information */}
           <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8">
             <div className="flex items-center space-x-3 mb-8">
               <div className="w-10 h-10 bg-gradient-to-br from-[#368899] to-[#2d7a8a] rounded-xl flex items-center justify-center">
                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-gray-900">Delivery Information</h2>
                 <p className="text-gray-600 text-sm">Everything you need to know about our delivery service</p>
               </div>
             </div>
             
             <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-center space-x-3 mb-3">
                     <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                       <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                       </svg>
                     </div>
                     <h3 className="text-lg font-semibold text-gray-800">Delivery Charges</h3>
                   </div>
                   <p className="text-gray-700 leading-relaxed">
                     A flat delivery charge of <span className="font-semibold text-[#368899]">£3.99</span> (including VAT) applies to all orders, regardless of order size or delivery location within our coverage areas.
                   </p>
                 </div>
                 
                 <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-center space-x-3 mb-3">
                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                       <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                     </div>
                     <h3 className="text-lg font-semibold text-gray-800">Minimum Order</h3>
                   </div>
                   <p className="text-gray-700 leading-relaxed">
                     Our minimum order value is <span className="font-semibold text-[#368899]">£40 plus VAT</span>. Orders below this threshold will not be processed.
                   </p>
                 </div>
                 
                 <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-center space-x-3 mb-3">
                     <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                       <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                       </svg>
                     </div>
                     <h3 className="text-lg font-semibold text-gray-800">Delivery Instructions</h3>
                   </div>
                   <p className="text-gray-700 leading-relaxed">
                     Drivers will deliver to your specified location within health and safety guidelines. Please ensure someone is available to receive the delivery during the specified time window.
                   </p>
                 </div>
               </div>
               
               <div className="space-y-6">
                 <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-center space-x-3 mb-3">
                     <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                       <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                     </div>
                     <h3 className="text-lg font-semibold text-gray-800">Order Cut-off Time</h3>
                   </div>
                   <p className="text-gray-700 leading-relaxed">
                     Orders placed before <span className="font-semibold text-[#368899]">3:00 PM</span> on working days will be delivered within two working days according to our delivery schedule.
                   </p>
                 </div>
                 
                 <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-center space-x-3 mb-3">
                     <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                       <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                     </div>
                     <h3 className="text-lg font-semibold text-gray-800">Delivery Window</h3>
                   </div>
                   <p className="text-gray-700 leading-relaxed">
                     We provide a <span className="font-semibold text-[#368899]">two-hour delivery window</span> and drivers may call when approaching your location to ensure smooth delivery.
                   </p>
                 </div>
                 
                 <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-center space-x-3 mb-3">
                     <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                       <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                       </svg>
                     </div>
                     <h3 className="text-lg font-semibold text-gray-800">Bulk & Pallet Orders</h3>
                   </div>
                   <p className="text-gray-700 leading-relaxed">
                     We can deliver pallet and bulk orders. Please call our office to discuss your requirements and arrange special delivery.
                   </p>
                 </div>
               </div>
             </div>
           </div>

                     {/* Not Sure Section */}
           <div className="bg-gradient-to-br from-[#368899]/5 via-[#2d7a8a]/5 to-[#1e5b67]/5 rounded-2xl p-8 md:p-10 border border-[#368899]/20 shadow-lg">
             <div className="text-center max-w-3xl mx-auto">
               <div className="w-16 h-16 bg-gradient-to-br from-[#368899] to-[#2d7a8a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-4">Not sure if we deliver to your area?</h3>
               <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                 If you don't see your postcode listed or have any questions about delivery to your area, please contact us and we'll be happy to help.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Link
                   href="tel:+442084450589"
                   className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#368899] to-[#2d7a8a] text-white font-semibold rounded-xl hover:from-[#2d7a8a] hover:to-[#1e5b67] transition-all duration-300 shadow-lg transform hover:scale-105"
                 >
                   <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                   </svg>
                   Call 020 8445 0589
                 </Link>
                 <Link
                   href="mailto:info@nexpressdelivery.co.uk"
                   className="inline-flex items-center px-8 py-4 bg-white text-[#368899] border-2 border-[#368899] font-semibold rounded-xl hover:bg-[#368899] hover:text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                 >
                   <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                   </svg>
                   Email Us
                 </Link>
               </div>
             </div>
           </div>
        </div>

        <NeedHelpCTA />
      </section>
      
      {/* Brand Logos Section */}
      <BrandLogo />
    </main>
  );
}
