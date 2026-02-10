import Link from "next/link";

export default function ReturnsExchangesPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Returns &amp; Exchanges</h1>

      <h2 className="h4">Return Policy</h2>
      <p>
        We want you to be completely satisfied with your purchase. If
        you&apos;re not happy with your order, we&apos;ll make it right.
      </p>

      <h3 className="h5 mt-4">30-Day Return Window</h3>
      <p>
        You have 30 days from the delivery date to return or exchange your
        items.
      </p>

      <h3 className="h5 mt-4">Return Conditions</h3>
      <ul>
        <li>
          Items must be in original condition with all tags attached
        </li>
        <li>Items must be unworn, unwashed, and unused</li>
        <li>
          Original packaging should be included when possible
        </li>
        <li>
          Some items may be excluded from returns (see product page for
          details)
        </li>
      </ul>

      <h3 className="h5 mt-4">How to Return</h3>
      <div className="row g-3 mt-1">
        <div className="col-md-6">
          <div className="card p-3 h-100">
            <h4 className="h6 mb-2">1</h4>
            <h5 className="h6">Contact Us</h5>
            <p className="mb-0">
              Email us at returns@shopmart.com with your order number
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 h-100">
            <h4 className="h6 mb-2">2</h4>
            <h5 className="h6">Get Return Label</h5>
            <p className="mb-0">
              We&apos;ll send you a prepaid return shipping label
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 h-100">
            <h4 className="h6 mb-2">3</h4>
            <h5 className="h6">Ship Your Return</h5>
            <p className="mb-0">
              Package your items and drop off at any authorized location
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 h-100">
            <h4 className="h6 mb-2">4</h4>
            <h5 className="h6">Receive Refund</h5>
            <p className="mb-0">
              We&apos;ll process your refund within 5-7 business days
            </p>
          </div>
        </div>
      </div>

      <h3 className="h5 mt-4">Questions?</h3>
      <p>
        If you have any questions about returns or exchanges, please
        don&apos;t hesitate to contact us.
      </p>

      <Link href="/contact-us" className="btn btn-outline-light">
        Contact Support
      </Link>
    </div>
  );
}
