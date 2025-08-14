import Link from "next/link";
import NeedHelpCTA from "@/components/common/NeedHelpCTA";
import BrandLogo from "@/components/common/BrandLogo";

export const metadata = {
  title: "FAQ | Nexpress Delivery",
  description: "Frequently asked questions about ordering, delivery, payments and more at Nexpress Delivery.",
};

export default function FAQPage() {
  const faqs = [
    {
      group: "Delivery & Schedule",
      items: [
        {
          q: "What areas do you deliver to:",
          a: (
            <>
              We deliver to most areas in London. Take a look at our {" "}
              <Link href="/delivery-schedule" className="text-[#368899] hover:underline">delivery schedule</Link>
              {" "} to see if we come to your area. Deliveries are made from our own fleet of vans with all staff employed by us.
            </>
          ),
        },
        {
          q: "Once ordered, how long will it take for my order to arrive",
          a: (
            <>
              Your order will be delivered within two working days from placing your order according to our {" "}
              <Link href="/delivery-schedule" className="text-[#368899] hover:underline">delivery schedule</Link>
              {" "} and providing it is placed before 3pm on a working day.
            </>
          ),
        },
        {
          q: "Can the driver call me to let me know when my order is arriving",
          a: (
            <>We give a two hour window but the driver can call when they are a certain amount of time away from you as well.</>
          ),
        },
        {
          q: "Where will the driver leave my order",
          a: (
            <>The driver will leave or take your order to wherever requested (within health and safety guidelines).</>
          ),
        },
        {
          q: "Are you able to deliver pallet and bulk orders",
          a: <>Yes, absolutely. Please call the office to discuss.</>,
        },
        {
          q: "Is it possible to collect from you",
          a: (
            <>We have a number of hubs in and around London and you can collect from the one closest to you. Please call the office to discuss.</>
          ),
        },
      ],
    },
    {
      group: "Ordering & Payments",
      items: [
        {
          q: "How can I place an order",
          a: (
            <>You can order through our website, by email or by telephone. Our office hours are 9am until 7pm Monday to Thursday and 9am to 3pm on Fridays.</>
          ),
        },
        {
          q: "Do you have a delivery charge",
          a: <>Our delivery charge is a flat £3.99 (which includes VAT) and remains the same whatever the size of your order.</>,
        },
        {
          q: "Do you have a minimum order value",
          a: <>Our minimum order value is £40 plus VAT.</>,
        },
        {
          q: "Do you have a maximum order value",
          a: <>We have no maximum order.</>,
        },
        {
          q: "How do I pay for my order",
          a: <>We take payment by credit card, debit card and bank transfer when you place your order.</>,
        },
      ],
    },
    {
      group: "Returns & Documents",
      items: [
        {
          q: "Returns and Refunds",
          a: <>If you wish to return a product for any reason, please inform us within 24 hours and we will arrange this for you.</>,
        },
        {
          q: "What happens if my order is damaged",
          a: <>If, in the unlikely event a product is delivered damaged please inform us within 24 hours of receipt and we will replace it.</>,
        },
        {
          q: "Do you provide a VAT invoice",
          a: <>Yes, the driver always leaves a VAT invoice and we can email you a copy as well.</>,
        },
      ],
    },
    {
      group: "Products & Sourcing",
      items: [
        {
          q: "Are you able to split packs",
          a: <>We are unable to split packs unfortunately.</>,
        },
        {
          q: "Can you source items that are not listed on your website",
          a: <>Yes, we can source most brands and products. Please either call or email to discuss.</>,
        },
      ],
    },
  ];

  return (
    <main className="w-full bg-white">
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Quick answers about ordering, delivery, payments and events. If you can’t find what you’re looking for, please{" "}
            <Link href="/contact" className="text-[#368899] hover:underline">contact us</Link>.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {faqs.map((section) => (
            <div key={section.group} className="space-y-3">
              <h2 className="text-lg font-semibold text-[#1f2937]">{section.group}</h2>
              {section.items.map((item, idx) => (
                <details key={idx} className="group rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm open:shadow-md transition-shadow">
                  <summary className="cursor-pointer list-none px-4 py-3 md:py-4 flex items-center justify-between">
                    <span className="text-sm md:text-base font-semibold text-gray-800">{item.q}</span>
                    <svg className="w-5 h-5 text-[#368899] transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 text-sm md:text-base text-gray-700 leading-relaxed">{item.a}</div>
                </details>
              ))}
            </div>
          ))}
        </div>

        <NeedHelpCTA />
      </section>
      
      {/* Brand Logos Section */}
      <BrandLogo />
    </main>
  );
}


