"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import {
  addToCart,
  removeFromCart,
  getCartProductsIds,
} from "@/services/cartService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useLoading } from "@/context/LoadingContext";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [cartProductIds, setCartProductIds] = useState([]);

  const router = useRouter();
  const { refreshCart, updateCartCount } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    async function fetchData() {
      try {
        showLoader();

        const productsData = await getProducts();
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch {
        setProducts([]);
      } finally {
        hideLoader();
      }

      // Load cart ids in background so page appears faster.
      try {
        const ids = await getCartProductsIds();
        setCartProductIds(ids || []);
      } catch {
        setCartProductIds([]);
      }
    }

    fetchData();
  }, []);

  async function handleToggleCart(productId, isInCart) {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      setLoadingId(productId);

      if (isInCart) {
        const res = await removeFromCart(productId);
        setCartProductIds((prev) =>
          prev.filter((id) => id !== productId)
        );
        if (typeof res?.numOfCartItems === "number") {
          updateCartCount(res.numOfCartItems);
        }
      } else {
        const res = await addToCart(productId);
        setCartProductIds((prev) => [...prev, productId]);
        if (typeof res?.numOfCartItems === "number") {
          updateCartCount(res.numOfCartItems);
        }
      }

      void refreshCart();
    } catch {
      // Keep current UI state if request fails.
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="container py-4 products-page">
      <h2 className="mb-4">Products</h2>

      <div className="row g-4">
        {products.map((product) => {
          const isInCart = cartProductIds.includes(product._id);
          const isInWishlist = wishlistIds.includes(product._id);
          const isLoading = loadingId === product._id;

          return (
            <div key={product._id} className="col-md-3">
              <div className="card h-100 shadow-sm product-card">
                <div className="category-product-media">
                  <img
                    src={product.imageCover}
                    className="card-img-top product-image"
                    alt={product.title}
                  />

                  <div className="category-product-overlay">
                    <button
                      type="button"
                      className={`btn btn-sm fw-bold ${
                        isInCart
                          ? "btn-danger"
                          : "btn-warning text-dark"
                      }`}
                      disabled={isLoading}
                      onClick={() =>
                        handleToggleCart(product._id, isInCart)
                      }
                    >
                      {isLoading
                        ? "Please wait..."
                        : isInCart
                        ? "Remove Cart"
                        : "Add to Cart"}
                    </button>

                    <button
                      type="button"
                      className={`btn btn-sm fw-bold ${
                        isInWishlist ? "btn-danger" : "btn-light"
                      }`}
                      onClick={() => toggleWishlist(product._id)}
                    >
                      {isInWishlist ? "Remove Wishlist" : "Wishlist"}
                    </button>
                  </div>
                </div>

                <div className="card-body d-flex flex-column product-body">
                  <h6 className="fw-bold product-title mb-1">
                    {product.title}
                  </h6>

                  <p className="text-muted mb-1">
                    {product.category?.name}
                  </p>

                  <p className="fw-bold mb-2">
                    {product.price} EGP
                  </p>

                  <Link
                    href={`/products/${product._id}`}
                    className="btn btn-sm w-100 view-details-accent mt-auto"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
