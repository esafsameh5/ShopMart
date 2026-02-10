export default function AboutPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">About ShopMart</h1>

      <p>
        ShopMart is your one-stop destination for the latest technology,
        fashion, and lifestyle products. We are committed to providing
        quality products with fast shipping and excellent customer
        service.
      </p>

      <h2 className="h4 mt-4">Our Mission</h2>
      <p>
        To make shopping for quality products easy, convenient, and
        enjoyable for everyone. We believe that everyone deserves access
        to the latest and best products at competitive prices.
      </p>

      <h2 className="h4 mt-4">Our Values</h2>
      <ul>
        <li>Quality: We only sell products that meet our high standards</li>
        <li>Customer Service: Your satisfaction is our priority</li>
        <li>
          Innovation: We stay ahead of trends to bring you the latest
          products
        </li>
        <li>Trust: We build lasting relationships with our customers</li>
      </ul>

      <h2 className="h4 mt-4">Why Choose ShopMart?</h2>

      <div className="row g-3 mt-1">
        <div className="col-md-6">
          <div className="card h-100 p-3">
            <h3 className="h6">Fast Shipping</h3>
            <p className="mb-0">
              Quick and reliable delivery to your doorstep
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 p-3">
            <h3 className="h6">Quality Guarantee</h3>
            <p className="mb-0">
              All products are carefully selected and tested
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 p-3">
            <h3 className="h6">24/7 Support</h3>
            <p className="mb-0">
              Our customer service team is always here to help
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 p-3">
            <h3 className="h6">Easy Returns</h3>
            <p className="mb-0">
              Hassle-free return policy for your peace of mind
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
