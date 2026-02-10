"use client";

export default function Toast({ message, show }) {
  return (
    <div
      className={`toast-container position-fixed bottom-0 end-0 p-3 ${
        show ? "show" : ""
      }`}
      style={{ zIndex: 1055 }}
    >
      <div className="toast show align-items-center text-bg-dark border-0">
        <div className="d-flex">
          <div className="toast-body">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
