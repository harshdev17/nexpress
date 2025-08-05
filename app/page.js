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

export default function Home() {
  return (
    <>
      <div className="hidden md:block">
        <HeroSection />
        <CategorySection />
      </div>
      <Products />
      <Features />
      <About />
      <Reviews />
      <BrandLogo />
    </>
  );
}
