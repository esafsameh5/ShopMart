"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { getBrands } from "@/services/brandService";

export default function Home() {
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoading();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHomeData() {
      setError("");
      showLoader();

      try {
        const [productsData, categoriesData, brandsData] =
          await Promise.all([
            getProducts(),
            getCategories(),
            getBrands(),
          ]);

        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(
          Array.isArray(categoriesData) ? categoriesData : []
        );
        setBrands(Array.isArray(brandsData) ? brandsData : []);
      } catch {
        setError("Failed to load homepage data.");
      } finally {
        hideLoader();
      }
    }

    fetchHomeData();
  }, []);

  const featuredProducts = useMemo(
    () => products.slice(0, 8),
    [products]
  );
  const topCategories = useMemo(
    () => categories.slice(0, 6),
    [categories]
  );
  const topBrands = useMemo(() => brands.slice(0, 8), [brands]);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <p className="home-eyebrow mb-2">Shop Smarter Daily</p>
              <h1 className="home-title mb-3">
                Everything You Need,
                <span> Delivered in Style.</span>
              </h1>
              <p className="home-subtitle mb-4">
                Discover trending products, top brands, and categories
                hand-picked for your next order.
              </p>

              <div className="d-flex flex-wrap gap-2">
                <Link href="/products" className="btn home-btn-primary">
                  Shop Now
                </Link>
                <Link
                  href={user ? "/wishlist" : "/auth/login"}
                  className="btn home-btn-ghost"
                >
                  {user ? "My Wishlist" : "Start with Login"}
                </Link>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="hero-panel">
                <div className="hero-stat">
                  <span>{products.length}+</span>
                  <p>Products</p>
                </div>
                <div className="hero-stat">
                  <span>{categories.length}+</span>
                  <p>Categories</p>
                </div>
                <div className="hero-stat">
                  <span>{brands.length}+</span>
                  <p>Brands</p>
                </div>
                <p className="hero-note mb-0">
                  {user
                    ? `Welcome back, ${user.name}`
                    : "Create an account to track your cart and wishlist."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="section-head">
            <h2>Featured Products</h2>
            <Link href="/products" className="section-link">
              View all
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger py-2 mb-4">{error}</div>
          )}

          <div className="row g-4">
            {featuredProducts.length === 0 ? (
              <div className="col-12">
                <p className="text-muted mb-0">
                  No products available right now.
                </p>
              </div>
            ) : (
              featuredProducts.map((product) => (
                <div key={product._id} className="col-sm-6 col-lg-3">
                  <Link
                    href={`/products/${product._id}`}
                    className="home-product-card"
                  >
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="home-product-image"
                    />
                    <div className="p-3">
                      <p className="home-product-category mb-1">
                        {product.category?.name || "General"}
                      </p>
                      <h3 className="home-product-title">
                        {product.title}
                      </h3>
                      <p className="home-product-price mb-0">
                        {product.price} EGP
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="home-section home-section-soft">
        <div className="container">
          <div className="section-head">
            <h2>Top Categories</h2>
            <Link href="/categories" className="section-link">
              View all
            </Link>
          </div>
          <div className="row g-3">
            {topCategories.length === 0 ? (
              <div className="col-12">
                <p className="text-muted mb-0">
                  Categories will appear here soon.
                </p>
              </div>
            ) : (
              topCategories.map((category) => (
                <div key={category._id} className="col-6 col-md-4 col-lg-2">
                  <Link
                    href={`/categories/${category._id}`}
                    className="category-chip text-decoration-none d-block"
                  >
                    <span>{category.name}</span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="section-head">
            <h2>Trusted Brands</h2>
            <Link href="/brands" className="section-link">
              View all
            </Link>
          </div>
          <div className="row g-3">
            {topBrands.length === 0 ? (
              <div className="col-12">
                <p className="text-muted mb-0">
                  Brands will appear here soon.
                </p>
              </div>
            ) : (
              topBrands.map((brand) => (
                <div key={brand._id} className="col-6 col-md-3">
                  <Link
                    href={`/brands/${brand._id}`}
                    className="brand-card text-decoration-none"
                  >
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="brand-image"
                    />
                    <p className="mb-0">{brand.name}</p>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="home-cta">
            <h2 className="mb-2">Ready to build your next order?</h2>
            <p className="mb-3">
              Explore fresh deals and complete your cart in minutes.
            </p>
            <Link href="/products" className="btn home-btn-primary">
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
