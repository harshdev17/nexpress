"use client";

import Image from "next/image";
import Link from "next/link";

export default function EventsPage() {
  return (
    <main className="w-full bg-white">
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image */}
          <div className="w-full flex justify-center md:justify-start">
            <div className="relative w-[320px] h-[285px] md:w-[520px] md:h-[465px] rounded-xl overflow-hidden shadow-md border border-gray-100">
              <Image
                src="/events-img.jpg"
                alt="Pallet of bottled water ready for event supply"
                fill
                sizes="(min-width: 768px) 520px, 320px"
                priority
                className="object-contain bg-white"
              />
            </div>
          </div>

          {/* Copy */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Let us quote to supply you for your event
            </h1>
            <div className="h-1 w-16 bg-[#368899] rounded mt-3 mb-6" />

            <p className="text-gray-700 leading-relaxed mb-4">
              If you need a large amount of water or soft drinks for an upcoming event
              call us to discuss options.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We can deliver by the pallet (approx. 72 cases depending on brand)
              direct to your event address.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              Call{" "}
              <a href="tel:+442084450589" className="text-[#368899] hover:underline">
                020 8445 0589
              </a>{" "}
              or{" "}
              <a href="tel:+442084450680" className="text-[#368899] hover:underline">
                020 8445 0680
              </a>{" "}
              and speak to one of our friendly team
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              Or{" "}
              <Link href="/contact" className="text-[#368899] hover:underline">
                contact us
              </Link>{" "}
              for pricing
            </p>

            <p className="italic text-gray-600">
              We look forward to hearing from you.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
