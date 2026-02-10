const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export async function getCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !Array.isArray(data?.data)) {
      return [];
    }

    return data.data;
  } catch {
    return [];
  }
}

export async function getCategoryById(id) {
  try {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data?.data) {
      return null;
    }

    return data.data;
  } catch {
    return null;
  }
}
