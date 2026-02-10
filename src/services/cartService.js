const BASE_URL = "https://ecommerce.routemisr.com/api/v1";
const FETCH_TIMEOUT_MS = 12000;

async function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function getCart() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetchWithTimeout(`${BASE_URL}/cart`, {
      headers: { token },
    });

    const data = await parseJsonSafe(res);
    if (!res.ok) return null;

    return data;
  } catch {
    return null;
  }
}

export async function addToCart(productId) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetchWithTimeout(`${BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({ productId }),
    });

    const data = await parseJsonSafe(res);

    if (!res.ok) {
      throw new Error(data?.message || "Failed to add to cart");
    }

    return data;
  } catch (err) {
    throw new Error(err?.message || "Network error while adding to cart");
  }
}

export async function removeFromCart(productId) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetchWithTimeout(`${BASE_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: { token },
    });

    const data = await parseJsonSafe(res);

    if (!res.ok) {
      throw new Error(data?.message || "Failed to remove from cart");
    }

    return data;
  } catch (err) {
    throw new Error(err?.message || "Network error while removing from cart");
  }
}
export async function updateCartQuantity(productId, count) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetchWithTimeout(
      `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ count }),
      }
    );

    const data = await parseJsonSafe(res);

    if (!res.ok) {
      throw new Error(data?.message || "Failed to update quantity");
    }

    return data;
  } catch (err) {
    throw new Error(err?.message || "Network error while updating cart");
  }
}

export async function getCartProductsIds() {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const res = await fetchWithTimeout(`${BASE_URL}/cart`, {
      headers: { token },
    });

    const data = await parseJsonSafe(res);

    return (
      data?.data?.products?.map((item) => item.product._id) || []
    );
  } catch {
    return [];
  }
}
