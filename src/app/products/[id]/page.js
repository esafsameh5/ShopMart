"use client";

import { useEffect, useState } from "react";
import { getProductById } from "@/services/productService";
import { addToCart, getCart } from "@/services/cartService";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLoading } from "@/context/LoadingContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { refreshCart, updateCartCount } = useCart();
  const { showLoader, hideLoader } = useLoading();
  const { wishlistIds, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [productCartCount, setProductCartCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  async function syncProductCartCount(productId) {
    const token = localStorage.getItem("token");
    if (!token || !productId) {
      setProductCartCount(0);
      return;
    }

    try {
      const cart = await getCart();
      const item = cart?.data?.products?.find(
        (p) => p.product?._id === productId
      );
      setProductCartCount(item?.count || 0);
    } catch {
      setProductCartCount(0);
    }
  }

  useEffect(() => {
    async function fetchProduct() {
      showLoader();
      try {
        const data = await getProductById(id);

        if (!data) {
          setError("Product not available");
          return;
        }

        setProduct(data);
        await syncProductCartCount(data._id);
      } finally {
        hideLoader();
      }
    }

    if (id) fetchProduct();
  }, [id]);

  const productImages = Array.isArray(product?.images) &&
    product.images.length > 0
    ? product.images
    : product?.imageCover
    ? [product.imageCover]
    : [];

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?._id]);

  useEffect(() => {
    if (productImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === productImages.length - 1 ? 0 : prev + 1
      );
    }, 2500);

    return () => clearInterval(timer);
  }, [productImages.length]);

  async function handleAddToCart() {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      setAdding(true);
      setErrorMsg("");
      const res = await addToCart(product._id);

      if (typeof res?.numOfCartItems === "number") {
        updateCartCount(res.numOfCartItems);
      }
      void refreshCart();
      setProductCartCount((prev) => prev + 1);

    } catch {
      setErrorMsg("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  }

  if (error)
    return (
      <div className="container py-5 text-center">
        <h4>{error}</h4>
        <button
          className="btn btn-outline-dark mt-3"
          onClick={() => router.push("/products")}
        >
          Back to Products
        </button>
      </div>
    );

  if (!product) return null;
  const isInWishlist = wishlistIds.includes(product._id);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-xl-9">
          <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: "20px" }}>
            <div className="row g-0 align-items-center">

              <div className="col-md-5 d-flex align-items-center justify-content-center"
                style={{
                  background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                  minHeight: "420px",
                }}
              >
                <div className="w-100 text-center px-3">
                  <img
                    src={productImages[currentImageIndex] || product.imageCover}
                    alt={product.title}
                    className="img-fluid"
                    style={{ maxHeight: "500px", objectFit: "contain" }}
                  />

                  {productImages.length > 1 && (
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      {productImages.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`Image ${index + 1}`}
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            border: "none",
                            background:
                              index === currentImageIndex
                                ? "#0f172a"
                                : "#cbd5e1",
                            padding: 0,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-7 p-5">
                <p className="text-uppercase text-muted small mb-1">
                  {product.category?.name}
                </p>

                <h2 className="fw-bold mb-3">{product.title}</h2>

                <h3 className="text-success fw-bold mb-4">
                  {product.price} EGP
                </h3>

                <p className="text-secondary mb-4">
                  {product.description}
                </p>

                <div className="d-flex gap-3">
                  <button
                    className="btn btn-warning btn-lg fw-bold px-5"
                    onClick={handleAddToCart}
                    disabled={adding}
                  >
                    {adding ? "Adding..." : "Add to Cart"}
                  </button>

                  <button
                    className={`btn btn-lg px-4 ${
                      isInWishlist ? "btn-danger" : "btn-outline-dark"
                    }`}
                    onClick={() => toggleWishlist(product._id)}
                  >
                    {isInWishlist ? "Remove Wishlist" : "Add Wishlist"}
                  </button>
                </div>

                <div className="mt-3">
                  <span className="badge text-bg-dark fs-6 px-3 py-2">
                    In cart: {productCartCount}
                  </span>
                </div>

                {errorMsg && (
                  <p className="text-danger mt-3">{errorMsg}</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
