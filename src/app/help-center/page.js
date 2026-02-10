import Link from "next/link";

export default function HelpCenterPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Help Center</h1>

      <h2 className="h4 mb-3">Frequently Asked Questions</h2>

      <div className="card p-3 mb-3">
        <h3 className="h6">How do I place an order?</h3>
        <p className="mb-0">
          Simply browse our products, add items to your cart, and proceed
          to checkout. You&apos;ll need to create an account or sign in to
          complete your purchase.
        </p>
      </div>

      <div className="card p-3 mb-3">
        <h3 className="h6">What payment methods do you accept?</h3>
        <p className="mb-0">
          We accept all major credit cards, PayPal, and other secure
          payment methods.
        </p>
      </div>

      <div className="card p-3 mb-3">
        <h3 className="h6">How long does shipping take?</h3>
        <p className="mb-0">
          Standard shipping takes 3-5 business days. Express shipping
          options are available for faster delivery.
        </p>
      </div>

      <div className="card p-3 mb-3">
        <h3 className="h6">Can I return or exchange items?</h3>
        <p className="mb-0">
          Yes, we offer a 30-day return policy for most items. Items must
          be in original condition with tags attached.
        </p>
      </div>

      <div className="card p-3 mb-3">
        <h3 className="h6">How do I track my order?</h3>
        <p className="mb-0">
          Once your order ships, you&apos;ll receive a tracking number via
          email. You can also track your order in your account.
        </p>
      </div>

      <h2 className="h4 mt-4">Still Need Help?</h2>
      <p>
        If you can&apos;t find the answer you&apos;re looking for, our
        customer service team is here to help.
      </p>

      <div className="d-flex gap-2 flex-wrap">
        <Link href="/contact-us" className="btn btn-warning">
          Contact Us
        </Link>
        <a href="mailto:support@shopmart.com" className="btn btn-outline-light">
          Email Support
        </a>
      </div>
    </div>
  );
}
