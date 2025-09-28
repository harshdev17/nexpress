
import Header from "@/components/common/Header";
import "./globals.css";
import Footer from "@/components/common/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import FloatingCartNotification from "@/components/common/FloatingCartNotification";

export const metadata = {
  title: "Nexpress Delivery",
  description: "London's original home and business delivery service",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <WishlistProvider>
            <Header />
            {children}
            <Footer />
            <FloatingCartNotification />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
