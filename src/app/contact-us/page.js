export default function ContactUsPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-2">Contact Us</h1>
      <h2 className="h4 mb-3">Get in Touch</h2>
      <p>
        We&apos;d love to hear from you. Send us a message and we&apos;ll
        respond as soon as possible.
      </p>

      <div className="row g-4 mt-1">
        <div className="col-md-5">
          <div className="card p-3 h-100">
            <h3 className="h5">Email</h3>
            <p>support@shopmart.com</p>

            <h3 className="h5 mt-3">Phone</h3>
            <p>(+20) 01093333333</p>

            <h3 className="h5 mt-3">Address</h3>
            <p className="mb-0">123 Shop Street, Octoper City, DC 12345</p>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card p-3 h-100">
            <h3 className="h5 mb-3">Send us a Message</h3>
            {/* Static contact form layout for now (no submit handler yet). */}
            <form>
              <div className="mb-3">
                <label htmlFor="contactName" className="form-label">
                  Name
                </label>
                <input id="contactName" type="text" className="form-control" />
              </div>

              <div className="mb-3">
                <label htmlFor="contactEmail" className="form-label">
                  Email
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="contactMessage" className="form-label">
                  Message
                </label>
                <textarea
                  id="contactMessage"
                  rows="4"
                  className="form-control"
                ></textarea>
              </div>

              <button type="button" className="btn btn-warning">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
