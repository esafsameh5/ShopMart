import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LoadingProvider } from "@/context/LoadingContext";

import Navbar from "@/components/Navbar";
import GlobalLoader from "@/components/GlobalLoader";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ShopMart",
  description: "ShopMart ecommerce app",
  icons: {
    icon: "/shopmartt.ico",
    shortcut: "/shopmartt.ico",
    apple: "/shopmartt.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LoadingProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                <GlobalLoader />
                {children}
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
