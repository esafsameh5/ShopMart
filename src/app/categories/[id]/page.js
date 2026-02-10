"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getCategoryById } from "@/services/categoryService";
import { getProducts } from "@/services/productService";
import {
  addToCart,
  removeFromCart,
  getCartProductsIds,
} from "@/services/cartService";
import { useLoading } from "@/context/LoadingContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function CategoryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoading();
  const { refreshCart, updateCartCount } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartProductIds, setCartProductIds] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    async function fetchCategoryData() {
      if (!id) return;

      showLoader();
      setError("");

      try {
        // Load all required data in parallel for faster initial render.
        const [categoryData, allProducts, cartIds] = await Promise.all([
          getCategoryById(id),
          getProducts(),
          getCartProductsIds(),
        ]);

        if (!categoryData) {
          setError("Category not found.");
          return;
        }

        setCategory(categoryData);
        const filtered = (allProducts || []).filter(
          (product) => product.category?._id === id
        );
        setProducts(filtered);
        setCartProductIds(cartIds || []);
      } catch {
        setError("Failed to load category details.");
      } finally {
        hideLoader();
      }
    }

    fetchCategoryData();
  }, [id, showLoader, hideLoader]);

  const productsCount = useMemo(() => products.length, [products]);

  async function handleToggleCart(productId, isInCart) {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      setLoadingId(productId);
      setActionError("");

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
      setActionError("Failed to update cart.");
    } finally {
      setLoadingId(null);
    }
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h4>{error}</h4>
        <button
          className="btn btn-outline-dark mt-3"
          onClick={() => router.push("/categories")}
        >
          Back to Categories
        </button>
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="container py-4 category-details-page">
      <button
        className="btn btn-outline-secondary btn-sm mb-3"
        onClick={() => router.push("/categories")}
      >
        <i className="bi bi-arrow-left me-1"></i>
        Back to Categories
      </button>

      <div className="brand-hero mb-4">
        <div className="category-hero-icon">
          <i className="bi bi-grid fs-3"></i>
        </div>
        <div>
          <p className="text-uppercase text-muted small mb-1">Category</p>
          <h2 className="mb-2 text-black">{category.name}</h2>
          <p className="text-muted mb-0">
            Available products: <strong>{productsCount}</strong>
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Products in {category.name}</h4>
        <Link href="/products" className="btn btn-sm btn-outline-dark">
          View All Products
        </Link>
      </div>

      {actionError && (
        <div className="alert alert-danger py-2">{actionError}</div>
      )}

      {products.length === 0 ? (
        <div className="text-light py-4">
          No products available for this category right now.
        </div>
      ) : (
        <div className="row g-4">
          {products.map((product) => {
            const isInCart = cartProductIds.includes(product._id);
            const isInWishlist = wishlistIds.includes(product._id);
            const isLoading = loadingId === product._id;

            return (
              <div key={product._id} className="col-sm-6 col-lg-3">
                <div className="home-product-card category-product-card">
                  <div className="category-product-media">
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="home-product-image"
                    />

                    <div className="category-product-overlay">
                      <button
                        type="button"
                        className={`btn btn-sm fw-bold ${
                          isInCart
                            ? "btn-danger"
                            : "btn-warning text-dark"
                        }`}
                        onClick={() =>
                          handleToggleCart(product._id, isInCart)
                        }
                        disabled={isLoading}
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
                          isInWishlist
                            ? "btn-danger"
                            : "btn-light"
                        }`}
                        onClick={() => toggleWishlist(product._id)}
                      >
                        {isInWishlist ? "Remove Wishlist" : "Wishlist"}
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="home-product-category mb-1">
                      {product.brand?.name || "Brand"}
                    </p>
                    <h3 className="home-product-title">{product.title}</h3>
                    <p className="home-product-price mb-2">
                      {product.price} EGP
                    </p>

                    <Link
                      href={`/products/${product._id}`}
                      className="btn btn-sm w-100 view-details-accent"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
