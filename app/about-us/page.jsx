"use client";

import Reviews from "@/components/common/Reviews";
import BrandLogo from "@/components/common/BrandLogo";

export default function AboutUs() {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6 text-gray-800 leading-relaxed">
            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[#368899] mb-8 text-center">
                We are a family run business and have been trading since 1985 offering a friendly, personal and efficient service.
              </h1>
              
              <p className="text-base mb-6">
                Our office team are always available to speak to on the telephone Monday to Thursday between 9am and 7pm and Fridays between 9am and 5pm. On the rare occasion you may be put through to an answer phone we will always call you back as quickly as possible.
              </p>
              
              <p className="text-base mb-6">
                Orders placed before 5pm are delivered next day (as per our delivery schedule). We have a minimum order of £40 and there is no maximum. We charge £3.33 plus VAT per delivery regardless of the size of your order. Our drivers are always happy to deliver large orders for waters, drinks or anything else we stock.
              </p>
              
              <p className="text-base mb-6">
                If you are looking for something that is not listed on our site, please either call or email us and we will do our best to source the item/s for you. We are always grateful for any feedback whether good or bad to improve the service.
              </p>
              
              <div className="mt-8 p-4 bg-gradient-to-r from-[#368899]/5 to-[#2d7a8a]/5 rounded-lg text-center">
                <p className="text-lg font-medium italic text-[#368899] mb-2">
                  We look forward to hearing from you.
                </p>
                <p className="font-semibold text-gray-800">
                  Angela and David
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <Reviews />
      
      {/* Brand Logos Section */}
      <BrandLogo />
    </div>
  );
}