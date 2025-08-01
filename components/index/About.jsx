"use client";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#368899] to-[#2d7a8a] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            About Our Service
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-gray-900 via-[#368899] to-[#2d7a8a] bg-clip-text text-transparent mb-6">
            Welcome To London's Longest Trading Home Delivery Service
          </h1>
          
          {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our commitment to excellence and reliability in home delivery services since 1985.
          </p> */}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6 text-gray-800 leading-relaxed">
            {/* Paragraph 1 */}
            <p className="text-base">
              We have been delivering to homes and offices in London since 1985 and were the original home delivery service. We deliver to most London areas using our own vehicles and driver teams. We do not outsource our deliveries to third parties. Our offices are staffed every day Monday to Thursday between 9am and 7pm and on Fridays between 9am and 3pm - if your call is not answered promptly, please leave a message and we will return it as soon as we can.
            </p>
            
            {/* Paragraph 2 */}
            <p className="text-base">
              We aim to deliver within two working days of placing your order (according to our delivery areas and provided you have placed your order before 3pm on a working day). Please call our office if you need a next day delivery - we always try to accommodate you if we can.
            </p>
            
            {/* Paragraph 3 */}
            <p className="text-base">
              We stock a large range of products at competitive prices. Everyday names such as Evian, Perrier, Highland Spring, Belu, San Pellegrino, Coca Cola, Schweppes, Belvoir, Persil, Ariel, Comfort, Lenor, Kleenex, Andrex, Nescafe, Twinings, Tate and Lyle and a great deal more. We also stock premium brands such as Voss and Fiji waters and offer a selection of premium wines from small, independent Italian vineyards. Our delivery charge is £3.99 for any size order and our minimum delivery spend is £40. All prices on our website INCLUDE VAT.
            </p>
            
            {/* Paragraph 4 */}
            <p className="text-base">
              If there is a product you would like us to stock that is not on our website, please contact us as we can normally source most brands from our extensive supplier base.
            </p>
          </div>
          
          {/* Closing Statement */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-lg font-semibold text-[#368899] text-center">
              Thank you for using our service - The Nexpress Team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
