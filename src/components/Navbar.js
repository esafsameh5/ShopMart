"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", icon: "bi-house-door", label: "Home" },
  { href: "/products", icon: "bi-box-seam", label: "Products" },
  { href: "/brands", icon: "bi-award", label: "Brands" },
  { href: "/categories", icon: "bi-grid", label: "Categories" },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { cartCount, resetCart } = useCart();
  const { wishlistIds, resetWishlist } = useWishlist();
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleLogout() {
    resetCart();
    resetWishlist();
    logout();
    closeMenu();
    router.push("/auth/login");
  }

  function linkClass(href) {
    const isActive = href === "/"
      ? pathname === "/"
      : pathname?.startsWith(href);

    return `nav-link shop-nav-link d-flex align-items-center gap-2 ${
      isActive ? "active" : ""
    }`;
  }

  if (loading) return null;

  return (
    <nav className="navbar navbar-expand-lg shop-navbar fixed-top px-3 px-lg-4">
      <div className="container-fluid px-0">
        <Link
          className="navbar-brand d-flex align-items-center gap-2 m-0 shop-brand-link"
          href="/"
          onClick={closeMenu}
        >
          <span className="footer-logo-mark">S</span>
          <span className="shop-brand-text me-3">ShopMart</span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none text-white"
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          <i className="bi bi-list fs-4"></i>
        </button>

        <div
          className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-2 pt-3 pt-lg-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="nav-item">
                <Link
                  className={linkClass(link.href)}
                  href={link.href}
                  onClick={closeMenu}
                >
                  <i className={`bi ${link.icon}`}></i>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="navbar-nav ms-auto align-items-lg-center gap-2 pb-2 pb-lg-0">
            {user && (
              <>
                <li className="nav-item position-relative">
                  <Link
                    href="/cart"
                    className="nav-icon-link"
                    onClick={closeMenu}
                    aria-label="Cart"
                  >
                    <i className="bi bi-cart3 fs-5"></i>
                    {cartCount > 0 && (
                      <span className="cart-badge">{cartCount}</span>
                    )}
                  </Link>
                </li>

                <li className="nav-item position-relative">
                  <Link
                    href="/wishlist"
                    className="nav-icon-link"
                    onClick={closeMenu}
                    aria-label="Wishlist"
                  >
                    <i className="bi bi-heart fs-5"></i>
                    {wishlistIds.length > 0 && (
                      <span className="cart-badge">{wishlistIds.length}</span>
                    )}
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="btn shop-btn-outline btn-sm"
                    href="/address"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-geo-alt me-1"></i>
                    Address
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="btn shop-btn-outline btn-sm"
                    href="/orders"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-receipt me-1"></i>
                    Orders
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="btn shop-btn-outline btn-sm"
                    href="/auth/change-password"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-shield-lock me-1"></i>
                    Change Password
                  </Link>
                </li>

                <li className="nav-item d-flex align-items-center shop-user-text px-1">
                  Hello, <strong className="ms-1">{user.name}</strong>
                </li>

                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm shop-btn-primary d-flex align-items-center gap-1"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                  </button>
                </li>
              </>
            )}

            {!user && (
              <>
                <li className="nav-item">
                  <Link
                    className="btn shop-btn-outline btn-sm"
                    href="/auth/login"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="btn btn-sm shop-btn-primary"
                    href="/auth/register"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
