// import Card from "@/components/common/ProductCard";
// // import Hero from "@/components/index/Hero";
// import HeroSection from "@/components/index/Test";



// export default function Home() {
//   return (
//     <>
//       {/* <Hero /> */}
//    <HeroSection />
//    <Card />
//     </>
//   );
// }



import CategorySection from "@/components/common/ProductCategories";
import Features from "@/components/index/Features";
import Products from "@/components/index/Products";
import HeroSection from "@/components/index/Test";
import About from "@/components/index/About";
import Reviews from "@/components/common/Reviews";
import BrandLogo from "@/components/common/BrandLogo";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <div className="hidden md:block">
        <HeroSection />
        <CategorySection />
      </div>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#368899] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      }>
        <Products />
      </Suspense>
      <Features />
      <About />
      <Reviews />
      <BrandLogo />
    </>
  );
}
