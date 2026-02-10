const BASE_URL = "https://ecommerce.routemisr.com/api/v1";
const PRODUCTS_CACHE_TTL = 60 * 1000;
const FETCH_TIMEOUT_MS = 12000;

let productsCache = {
  data: [],
  expiresAt: 0,
};
let productsRequest = null;

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

export async function getProducts() {
  const now = Date.now();

  if (productsCache.data.length > 0 && now < productsCache.expiresAt) {
    return productsCache.data;
  }

  if (productsRequest) {
    return productsRequest;
  }

  productsRequest = (async () => {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/products`);

      const data = await res.json();

      if (!res.ok || !Array.isArray(data?.data)) {
        return productsCache.data.length > 0 ? productsCache.data : [];
      }

      productsCache = {
        data: data.data,
        expiresAt: Date.now() + PRODUCTS_CACHE_TTL,
      };

      return data.data;
    } catch {
      return productsCache.data.length > 0 ? productsCache.data : [];
    } finally {
      productsRequest = null;
    }
  })();

  return productsRequest;
}

export async function getProductById(id) {
  const cached = productsCache.data.find((p) => p._id === id);
  if (cached) return cached;

  try {
    const res = await fetchWithTimeout(`${BASE_URL}/products/${id}`);

    const data = await res.json();

    if (!res.ok || !data?.data) {
      return null;
    }

    return data.data;
  } catch {
    return null;
  }
}
