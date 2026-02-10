"use client";

import Link from "next/link";

export default function Footer() {
  function handleBackToTop(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="shop-footer mt-5">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="footer-logo-mark">S</span>
              <h4 className="mb-0 fw-bold text-white">ShopMart</h4>
            </div>

            <p className="footer-text mb-3">
              Your one-stop destination for the latest technology,
              fashion, and lifestyle products. Quality guaranteed with
              fast shipping and excellent customer service.
            </p>

            <p className="footer-text mb-1">
              <i className="bi bi-geo-alt me-2"></i>
              123 Shop Street, Octoper City, DC 12345
            </p>
            <p className="footer-text mb-1">
              <i className="bi bi-telephone me-2"></i>
              (+20) 01093333333
            </p>
            <p className="footer-text mb-0">
              <i className="bi bi-envelope me-2"></i>
              support@shopmart.com
            </p>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <h6 className="footer-title">SHOP</h6>
            <ul className="footer-list">
              <li>
                <Link href="/categories" className="footer-list-link">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/categories" className="footer-list-link">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/categories" className="footer-list-link">
                  Home &amp; Garden
                </Link>
              </li>
              <li>
                <Link href="/categories" className="footer-list-link">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/categories" className="footer-list-link">
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <h6 className="footer-title">CUSTOMER SERVICE</h6>
            <ul className="footer-list">
              <li>
                <Link href="/contact-us" className="footer-list-link">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/help-center" className="footer-list-link">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="footer-list-link">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  href="/returns-exchanges"
                  className="footer-list-link"
                >
                  Returns &amp; Exchanges
                </Link>
              </li>
              <li>Size Guide</li>
            </ul>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <h6 className="footer-title">ABOUT</h6>
            <ul className="footer-list">
              <li>
                <Link href="/about" className="footer-list-link">
                  About shopmart
                </Link>
              </li>
              <li>Careers</li>
              <li>Press</li>
              <li>Investor Relations</li>
              <li>Sustainability</li>
            </ul>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <h6 className="footer-title">POLICIES</h6>
            <ul className="footer-list">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
              <li>Shipping Policy</li>
              <li>Refund Policy</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom mt-4 pt-3">
          <small>
            &copy; {new Date().getFullYear()} ShopMart. All rights
            reserved.
          </small>
          <a
            href="#"
            className="footer-back-link"
            onClick={handleBackToTop}
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
