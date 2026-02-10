const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

function getToken() {
  return localStorage.getItem("token");
}

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function createCashOrder(cartId, shippingAddress) {
  const token = getToken();
  if (!token) throw new Error("You need to login first");
  if (!cartId) throw new Error("Cart id is missing");

  try {
    const res = await fetch(`${BASE_URL}/orders/${cartId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({ shippingAddress }),
    });

    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(data?.message || "Failed to create cash order");
    }

    return data;
  } catch (err) {
    throw new Error(err?.message || "Network error while creating order");
  }
}

export async function createOnlineCheckoutSession(
  cartId,
  shippingAddress,
  returnUrl
) {
  const token = getToken();
  if (!token) throw new Error("You need to login first");
  if (!cartId) throw new Error("Cart id is missing");

  const url = `${BASE_URL}/orders/checkout-session/${cartId}?url=${encodeURIComponent(
    returnUrl
  )}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({ shippingAddress }),
    });

    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(
        data?.message || "Failed to create online checkout session"
      );
    }

    return data;
  } catch (err) {
    throw new Error(
      err?.message || "Network error while creating checkout session"
    );
  }
}

export async function getUserOrders(userId) {
  const token = getToken();
  if (!token) return [];
  if (!userId) return [];

  const headers = { token };

  try {
    const direct = await fetch(`${BASE_URL}/orders/user/${userId}`, {
      headers,
    });

    const directData = await parseJsonSafe(direct);
    if (!direct.ok) return [];

    if (Array.isArray(directData)) return directData;
    if (Array.isArray(directData?.data)) return directData.data;

    return [];
  } catch {
    return [];
  }
}

export function getUserIdFromAuth(user, token) {
  if (user?._id) return user._id;
  if (user?.id) return user.id;

  if (!token) return null;

  try {
    const encoded = token.split(".")[1] || "";
    const base64 = encoded
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(encoded.length / 4) * 4, "=");

    const payload = JSON.parse(atob(base64));
    return payload?.id || payload?._id || payload?.userId || null;
  } catch {
    return null;
  }
}
