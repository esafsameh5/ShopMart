"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useLoading } from "@/context/LoadingContext";
import { getProducts } from "@/services/productService";
import { addToCart } from "@/services/cartService";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const router = useRouter();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { refreshCart, updateCartCount } = useCart();
  const { showLoader, hideLoader } = useLoading();

  const [products, setProducts] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    async function fetchWishlist() {
      if (!wishlistIds) return;

      showLoader();

      if (wishlistIds.length === 0) {
        setProducts([]);
        hideLoader();
        return;
      }

      try {
        const allProducts = await getProducts();

        const filtered = allProducts.filter((p) =>
          wishlistIds.includes(p._id)
        );

        setProducts(filtered);
      } finally {
        hideLoader();
      }
    }

    fetchWishlist();
  }, [wishlistIds]);

  async function handleAddToCart(productId) {
    try {
      setLoadingId(productId);
      const res = await addToCart(productId);
      if (typeof res?.numOfCartItems === "number") {
        updateCartCount(res.numOfCartItems);
      }
      void refreshCart();
    } catch {
      // Keep current UI state if request fails.
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-4">
        <h2 className="mb-4">Wishlist</h2>

        {products.length === 0 ? (
          <div className="text-center text-light py-5">
            Your wishlist is empty
            <div>
              <button
                className="btn btn-warning mt-3"
                onClick={() => router.push("/products")}
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {products.map((product) => (
              <div key={product._id} className="col-md-3">
                <div className="card h-100 shadow-sm product-card">
                  <img
                    src={product.imageCover}
                    className="card-img-top"
                    alt={product.title}
                  />

                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-bold">{product.title}</h6>
                    <p className="fw-bold mb-2">{product.price} EGP</p>

                    <button
                      className="btn btn-warning btn-sm mb-2"
                      disabled={loadingId === product._id}
                      onClick={() => handleAddToCart(product._id)}
                    >
                      {loadingId === product._id
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm mb-2"
                      onClick={() => toggleWishlist(product._id)}
                    >
                      Remove
                    </button>

                    <Link
                      href={`/products/${product._id}`}
                      className="btn btn-outline-dark btn-sm mt-auto"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
