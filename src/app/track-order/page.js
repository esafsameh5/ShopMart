import Link from "next/link";

export default function TrackOrderPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Track Your Order</h1>

      <div className="card p-3 p-md-4 mb-4">
        <h2 className="h4 mb-3">Enter Your Order Information</h2>

        <form>
          <div className="mb-3">
            <label htmlFor="orderNumber" className="form-label">
              Order Number
            </label>
            <input
              id="orderNumber"
              type="text"
              className="form-control"
              placeholder="Enter your order number"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="orderEmail" className="form-label">
              Email Address
            </label>
            <input
              id="orderEmail"
              type="email"
              className="form-control"
              placeholder="Enter your email address"
            />
          </div>

          <button type="button" className="btn btn-warning">
            Track Order
          </button>
        </form>
      </div>

      <div className="card p-3 p-md-4">
        <h2 className="h4 mb-3">Order Status</h2>
        <p>
          Enter your order number and email above to track your order
          status.
        </p>

        <h3 className="h5 mt-3">Need Help?</h3>
        <p>
          If you&apos;re having trouble tracking your order, please contact
          our customer service team.
        </p>

        <Link href="/contact-us" className="btn btn-outline-light">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
