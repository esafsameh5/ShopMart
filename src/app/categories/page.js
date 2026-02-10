"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/services/categoryService";
import { useLoading } from "@/context/LoadingContext";

export default function CategoriesPage() {
  const { showLoader, hideLoader } = useLoading();
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      showLoader();
      setError("");

      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load categories.");
      } finally {
        hideLoader();
      }
    }

    fetchCategories();
  }, [showLoader, hideLoader]);

  // Keep filtering cheap by memoizing against query/categories changes.
  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return categories;
    return categories.filter((category) =>
      category.name?.toLowerCase().includes(normalized)
    );
  }, [categories, query]);

  return (
    <div className="container py-4 categories-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 className="mb-0">Categories</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control brands-search"
          placeholder="Search categories..."
        />
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {filteredCategories.length === 0 ? (
        <div className="text-center py-5 text-muted">
          No categories found.
        </div>
      ) : (
        <div className="row g-4">
          {filteredCategories.map((category) => (
            <div key={category._id} className="col-6 col-md-4 col-lg-3">
              <Link
                href={`/categories/${category._id}`}
                className="category-list-card"
              >
                <div className="category-list-content">
                  <h6 className="mb-1">{category.name}</h6>
                  <small className="text-muted">View products</small>
                </div>

                <div className="category-list-image-wrap">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="category-list-image"
                    />
                  ) : (
                    <i className="bi bi-grid fs-4 text-secondary"></i>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
