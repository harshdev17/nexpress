import Link from "next/link";
import NeedHelpCTA from "@/components/common/NeedHelpCTA";
import BrandLogo from "@/components/common/BrandLogo";

export const metadata = {
  title: "Cookie Policy | Nexpress Delivery",
  description: "Learn about how Nexpress Delivery uses cookies on our website. Understand what cookies are, how we use them, and how to manage your cookie preferences.",
};

export default function CookiePolicyPage() {
  return (
    <main className="w-full bg-white">
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Cookie Policy</h1>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Last updated: January 2024. This policy explains how we use cookies and similar technologies on our website.
          </p>
        </header>

        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences and enabling certain functionality.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Cookies can be either "session cookies" (which are deleted when you close your browser) or "persistent cookies" 
                  (which remain on your device for a set period of time or until you delete them).
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies for the following purposes:
                </p>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly and cannot be disabled. They include cookies for security, shopping cart functionality, and basic site operations.</li>
                  <li><strong>Performance Cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
                  <li><strong>Functionality Cookies:</strong> These allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, more personal features.</li>
                  <li><strong>Analytics Cookies:</strong> These help us understand how our website is being used and how we can improve it.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">3.1 Essential Cookies</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      These cookies are essential for the website to function properly:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1 ml-4">
                      <li>Authentication and security cookies</li>
                      <li>Shopping cart and checkout functionality</li>
                      <li>Session management</li>
                      <li>Load balancing and performance</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">3.2 Analytics Cookies</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      We use Google Analytics to understand how visitors use our website:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1 ml-4">
                      <li>Page views and visitor behavior</li>
                      <li>Traffic sources and demographics</li>
                      <li>Website performance metrics</li>
                      <li>User journey analysis</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">3.3 Marketing Cookies</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      These cookies help us deliver relevant advertising:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1 ml-4">
                      <li>Retargeting and remarketing</li>
                      <li>Social media integration</li>
                      <li>Advertising campaign tracking</li>
                      <li>Conversion optimization</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Some cookies on our website are set by third-party services that we use:
                </p>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
                  <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li><strong>Payment Processors:</strong> For secure payment processing and fraud prevention</li>
                  <li><strong>Social Media Platforms:</strong> For social media integration and sharing functionality</li>
                  <li><strong>Advertising Networks:</strong> For relevant advertising and marketing campaigns</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Managing Your Cookie Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1 Browser Settings</h3>
                    <p className="text-gray-700 leading-relaxed">
                      You can control and manage cookies through your browser settings. Most browsers allow you to:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1 ml-4 mt-2">
                      <li>View and delete existing cookies</li>
                      <li>Block cookies from specific websites</li>
                      <li>Block all cookies</li>
                      <li>Set preferences for different types of cookies</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">5.2 Cookie Consent</h3>
                    <p className="text-gray-700 leading-relaxed">
                      When you first visit our website, you will see a cookie consent banner. You can:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1 ml-4 mt-2">
                      <li>Accept all cookies</li>
                      <li>Reject non-essential cookies</li>
                      <li>Customize your cookie preferences</li>
                      <li>Change your preferences at any time</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Impact of Disabling Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you choose to disable cookies, please be aware that:
                </p>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
                  <li>Some website features may not work properly</li>
                  <li>Your shopping cart may not function correctly</li>
                  <li>You may need to re-enter information more frequently</li>
                  <li>Some personalized content may not be available</li>
                  <li>Website performance may be affected</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Updates to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, 
                  legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on our website 
                  and updating the "Last updated" date at the top of this policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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
