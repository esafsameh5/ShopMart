"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "@/services/cartService";
import { useCart } from "@/context/CartContext";
import { useLoading } from "@/context/LoadingContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { updateCartCount } = useCart();
  const { showLoader, hideLoader } = useLoading();
  const router = useRouter();

  const [cart, setCart] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    async function fetchCart() {
      showLoader();
      try {
        const data = await getCart();
        setCart(data);
      } catch {
        setCart(null);
      } finally {
        hideLoader();
      }
    }

    fetchCart();
  }, []);

  async function handleRemove(productId) {
    if (!cart) return;

    try {
      setLoadingId(productId);

      const removedItem = cart.data.products.find(
        (p) => p.product._id === productId
      );

      if (!removedItem) return;

      setCart((prev) => {
        const newProducts = prev.data.products.filter(
          (p) => p.product._id !== productId
        );

        const newTotal =
          prev.data.totalCartPrice -
          removedItem.price * removedItem.count;

        return {
          ...prev,
          numOfCartItems: prev.numOfCartItems - removedItem.count,
          data: {
            ...prev.data,
            products: newProducts,
            totalCartPrice: newTotal,
          },
        };
      });

      updateCartCount(cart.numOfCartItems - removedItem.count);
      await removeFromCart(productId);
    } catch {
      // Keep current UI state if request fails.
    } finally {
      setLoadingId(null);
    }
  }

  async function handleUpdateQuantity(productId, newCount) {
    if (newCount < 1 || !cart) return;

    try {
      setLoadingId(productId);

      const currentItem = cart.data.products.find(
        (item) => item.product._id === productId
      );

      if (!currentItem) return;

      const diff = newCount - currentItem.count;

      setCart((prev) => {
        const products = prev.data.products.map((item) => {
          if (item.product._id === productId) {
            return { ...item, count: newCount };
          }
          return item;
        });

        const total = products.reduce(
          (sum, item) => sum + item.price * item.count,
          0
        );

        return {
          ...prev,
          numOfCartItems: products.reduce(
            (sum, item) => sum + item.count,
            0
          ),
          data: {
            ...prev.data,
            products,
            totalCartPrice: total,
          },
        };
      });

      updateCartCount(cart.numOfCartItems + diff);
      await updateCartQuantity(productId, newCount);
    } catch {
      // Keep current UI state if request fails.
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-5">
        <h2 className="mb-4">Your Cart</h2>

        {!cart || cart.numOfCartItems === 0 ? (
          <div className="text-center py-5">
            <h5>Your cart is empty</h5>
            <button
              className="btn btn-warning mt-3"
              onClick={() => router.push("/products")}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {cart.data.products.map((item) => (
                <div key={item.product._id} className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-body d-flex align-items-center gap-4">
                      <img
                        src={item.product.imageCover}
                        alt={item.product.title}
                        style={{
                          width: 90,
                          height: 90,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />

                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">
                          {item.product.title}
                        </h6>
                        <p className="mb-1 text-muted">{item.price} EGP</p>

                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-outline-dark btn-sm"
                            disabled={loadingId === item.product._id}
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.count - 1
                              )
                            }
                          >
                            -
                          </button>

                          <span className="fw-bold">{item.count}</span>

                          <button
                            className="btn btn-outline-dark btn-sm"
                            disabled={loadingId === item.product._id}
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.count + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        disabled={loadingId === item.product._id}
                        onClick={() => handleRemove(item.product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card mt-4 shadow-sm">
              <div className="card-body d-flex justify-content-between">
                <h5>Total</h5>
                <h5 className="fw-bold text-success">
                  {cart.data.totalCartPrice} EGP
                </h5>
              </div>
              <div className="card-body pt-0 text-end">
                <button
                  className="btn btn-warning fw-bold"
                  onClick={() => router.push("/address")}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
