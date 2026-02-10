"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getBrands } from "@/services/brandService";
import { useLoading } from "@/context/LoadingContext";

export default function BrandsPage() {
  const { showLoader, hideLoader } = useLoading();
  const [brands, setBrands] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBrands() {
      showLoader();
      setError("");

      try {
        const data = await getBrands();
        setBrands(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load brands.");
      } finally {
        hideLoader();
      }
    }

    fetchBrands();
  }, [showLoader, hideLoader]);

  const filteredBrands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return brands;
    return brands.filter((brand) =>
      brand.name?.toLowerCase().includes(normalized)
    );
  }, [brands, query]);

  return (
    <div className="container py-4 brands-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 className="mb-0">Brands</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control brands-search"
          placeholder="Search brands..."
        />
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {filteredBrands.length === 0 ? (
        <div className="text-center py-5 text-muted">
          No brands found.
        </div>
      ) : (
        <div className="row g-4">
          {filteredBrands.map((brand) => (
            <div key={brand._id} className="col-6 col-md-4 col-lg-3">
              <Link
                href={`/brands/${brand._id}`}
                className="brand-list-card"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="brand-list-image"
                />
                <h6 className="mb-0">{brand.name}</h6>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
