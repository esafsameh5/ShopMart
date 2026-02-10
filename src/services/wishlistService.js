const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function getWishlist() {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const res = await fetch(`${BASE_URL}/wishlist`, {
      headers: { token },
    });

    if (!res.ok) return [];

    const data = await parseJsonSafe(res);
    if (!Array.isArray(data.data)) return [];

    return data.data
      .filter((item) => item?.product?._id)
      .map((item) => item.product._id);
  } catch {
    return [];
  }
}

export async function addToWishlist(productId) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({ productId }),
    });

    const data = await parseJsonSafe(res);

    if (!res.ok) {
      throw new Error(data?.message || "Failed to add to wishlist");
    }

    return data;
  } catch (err) {
    throw new Error(err?.message || "Network error while adding to wishlist");
  }
}

export async function removeFromWishlist(productId) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/wishlist/${productId}`, {
      method: "DELETE",
      headers: { token },
    });

    const data = await parseJsonSafe(res);

    if (!res.ok) {
      throw new Error(data?.message || "Failed to remove from wishlist");
    }

    return data;
  } catch (err) {
    throw new Error(
      err?.message || "Network error while removing from wishlist"
    );
  }
}
