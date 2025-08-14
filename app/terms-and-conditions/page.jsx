import Link from "next/link";
import NeedHelpCTA from "@/components/common/NeedHelpCTA";
import BrandLogo from "@/components/common/BrandLogo";

export const metadata = {
  title: "Terms and Conditions | Nexpress Delivery",
  description: "Terms and conditions for using Nexpress Delivery services. Read our terms of service, delivery policies, and customer agreements.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="w-full bg-white">
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Terms and Conditions</h1>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Last updated: January 2024. These terms and conditions govern your use of our website and services.
          </p>
        </header>

        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to Nexpress Delivery. These terms and conditions govern your use of our website and services. 
                  By using our website and services, you accept these terms and conditions in full. If you disagree with 
                  these terms and conditions or any part of these terms and conditions, you must not use our website or services.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Nexpress Delivery is a delivery service operating in London and surrounding areas, specialising in 
                  beverage and related product delivery to homes and offices.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nexpress Delivery provides delivery services for beverages and related products to residential and 
                  commercial addresses within our designated delivery areas. Our services include:
                </p>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
                  <li>Home and office delivery of beverages and related products</li>
                  <li>Same-day and next-day delivery options (subject to availability)</li>
                  <li>Professional delivery staff and vehicles</li>
                  <li>Order tracking and customer support</li>
                  <li>Corporate and event delivery services</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Ordering and Payment</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">3.1 Minimum Order Value</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Our minimum order value is £40 plus VAT. Orders below this threshold will not be processed.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">3.2 Payment Methods</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      We accept the following payment methods:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1 ml-4">
                      <li>Credit cards (Visa, MasterCard, American Express)</li>
                      <li>Debit cards</li>
                      <li>Bank transfers (for corporate accounts)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">3.3 Delivery Charges</h3>
                    <p className="text-gray-700 leading-relaxed">
                      A flat delivery charge of £3.99 (including VAT) applies to all orders, regardless of order size.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Delivery Terms</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 Delivery Areas</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We deliver to most areas in London. Please check our delivery schedule to confirm if we serve your area. 
                      Delivery areas may be subject to change without prior notice.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 Delivery Times</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Orders placed before 3pm on working days will be delivered within two working days according to our 
                      delivery schedule. We provide a two-hour delivery window and drivers may call when approaching your location.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">4.3 Delivery Instructions</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Drivers will deliver to your specified location within health and safety guidelines. Please ensure 
                      someone is available to receive the delivery during the specified time window.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Returns and Refunds</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1 Return Policy</h3>
                    <p className="text-gray-700 leading-relaxed">
                      If you wish to return a product for any reason, please inform us within 24 hours of delivery. 
                      We will arrange collection and provide a refund or replacement as appropriate.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">5.2 Damaged Products</h3>
                    <p className="text-gray-700 leading-relaxed">
                      In the unlikely event that a product is delivered damaged, please inform us within 24 hours of receipt. 
                      We will replace the damaged item at no additional cost.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Customer Responsibilities</h2>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
                  <li>Provide accurate delivery information and contact details</li>
                  <li>Ensure someone is available to receive deliveries during the specified time window</li>
                  <li>Provide safe and accessible delivery locations</li>
                  <li>Report any issues or damages within 24 hours of delivery</li>
                  <li>Comply with all applicable laws and regulations regarding alcohol consumption</li>
                  <li>Provide valid identification when required for age-restricted products</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Age Restrictions</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You must be 18 years or older to purchase and receive alcoholic beverages. We reserve the right to 
                  request identification to verify your age. We will not deliver alcoholic beverages to anyone under 
                  the age of 18.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By placing an order, you confirm that you are of legal age to purchase the products in your order.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We are committed to protecting your privacy. Your personal information will be used in accordance 
                  with our Privacy Policy and applicable data protection laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We may use your contact information to communicate about your orders, delivery updates, and 
                  customer service matters.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nexpress Delivery shall not be liable for any indirect, incidental, special, consequential, or 
                  punitive damages arising from your use of our services.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our total liability to you for any claims arising from these terms or our services shall not exceed 
                  the amount you paid for the specific order giving rise to the claim.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Force Majeure</h2>
                <p className="text-gray-700 leading-relaxed">
                  We shall not be liable for any failure to perform our obligations due to circumstances beyond our 
                  reasonable control, including but not limited to natural disasters, strikes, government actions, 
                  or other unforeseeable events.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms and conditions at any time. Changes will be effective 
                  immediately upon posting on our website. Your continued use of our services constitutes acceptance 
                  of any changes.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of England and Wales. 
                  Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts 
                  of England and Wales.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these terms and conditions, please contact us:
                </p>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-[#368899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700 font-medium">020 8445 0589 / 0680</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-[#368899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700 font-medium">info@nexpressdelivery.co.uk</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-[#368899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700 font-medium">London, United Kingdom</span>
                    </div>
                  </div>
                </div>
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
