const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export async function getBrands() {
  try {
    const res = await fetch(`${BASE_URL}/brands`, {
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

export async function getBrandById(id) {
  try {
    const res = await fetch(`${BASE_URL}/brands/${id}`, {
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
