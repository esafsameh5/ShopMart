"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getBrandById } from "@/services/brandService";
import { getProducts } from "@/services/productService";
import { useLoading } from "@/context/LoadingContext";

export default function BrandDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoading();

  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBrandData() {
      if (!id) return;

      showLoader();
      setError("");

      try {
        const [brandData, allProducts] = await Promise.all([
          getBrandById(id),
          getProducts(),
        ]);

        if (!brandData) {
          setError("Brand not found.");
          return;
        }

        setBrand(brandData);
        const filtered = (allProducts || []).filter(
          (product) => product.brand?._id === id
        );
        setProducts(filtered);
      } catch {
        setError("Failed to load brand details.");
      } finally {
        hideLoader();
      }
    }

    fetchBrandData();
  }, [id, showLoader, hideLoader]);

  const productsCount = useMemo(() => products.length, [products]);

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h4>{error}</h4>
        <button
          className="btn btn-outline-dark mt-3"
          onClick={() => router.push("/brands")}
        >
          Back to Brands
        </button>
      </div>
    );
  }

  if (!brand) return null;

  return (
    <div className="container py-4 brand-details-page">
      <button
        className="btn btn-outline-secondary btn-sm mb-3"
        onClick={() => router.push("/brands")}
      >
        <i className="bi bi-arrow-left me-1"></i>
        Back to Brands
      </button>

      <div className="brand-hero mb-4">
        <img
          src={brand.image}
          alt={brand.name}
          className="brand-hero-image"
        />
        <div>
          <p className="text-uppercase text-muted small mb-1">Brand</p>
          <h2 className="mb-2">{brand.name}</h2>
          <p className="text-muted mb-0">
            Available products: <strong>{productsCount}</strong>
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Products by {brand.name}</h4>
        <Link href="/products" className="btn btn-sm btn-outline-dark">
          View All Products
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-muted py-4">
          No products available for this brand right now.
        </div>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
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
                  <h3 className="home-product-title">{product.title}</h3>
                  <p className="home-product-price mb-0">
                    {product.price} EGP
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
