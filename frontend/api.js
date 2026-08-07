// api.js
// Shared API client for the Hapyshop frontend. Every page loads this before
// its own *-app.js file. It centralizes the backend base URL and provides
// small helpers for auth, cart, products, and orders so each page's React
// code stays focused on rendering (no UI/HTML/CSS changes here).
//
// IMPORTANT: Auth is Firebase Authentication. Every request attaches a
// fresh Firebase ID token as `Authorization: Bearer <token>` — there are no
// auth cookies. Requires firebase-init.js (FirebaseAuth) to be loaded first.

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Low-level fetch wrapper. Attaches a fresh Firebase ID token (if signed
 * in), always expects/returns JSON, and throws a plain Error with the
 * backend's message on failure so callers can catch() and show it to the user.
 */
async function apiRequest(path, options = {}) {
  const idToken = await FirebaseAuth.getIdToken();

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (networkError) {
    // The Express backend isn't reachable (not started locally, or the site is
    // being viewed online). Fall back to the in-browser demo backend so the
    // storefront still works end-to-end with identical response shapes.
    if (window.DemoAPI) {
      return DemoAPI.handle(path, options.method || 'GET', options.body || null);
    }
    throw networkError;
  }

  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    // Non-JSON response (rare) — fall through with json = null
  }

  if (!res.ok) {
    const message = (json && json.message) || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.errors = json && json.errors;
    throw error;
  }

  return json; // { success, message, data }
}

const Auth = {
  /** Creates the Firebase Auth account, then syncs the Firestore profile (name/role). */
  register: async ({ name, email, password }) => {
    await FirebaseAuth.signUp(name, email, password);
    // Force-refresh the token so it (and our own /users/me lookups) reflect
    // the displayName we just set, then create the Firestore profile.
    await FirebaseAuth.getIdToken(true);
    return apiRequest('/auth/sync', { method: 'POST', body: { name } });
  },
  login: ({ email, password }) => FirebaseAuth.signIn(email, password),
  logout: () => FirebaseAuth.signOutUser(),
  /** Returns the current user's profile, or null if not authenticated (no throw). */
  getCurrentUser: async () => {
    try {
      const res = await apiRequest('/users/me');
      return res.data;
    } catch (err) {
      return null;
    }
  },
};

const Products = {
  list: (query = {}) => {
    const params = new URLSearchParams(
      Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    return apiRequest(`/products${params ? `?${params}` : ''}`);
  },
  getById: (id) => apiRequest(`/products/${id}`),
};

const Cart = {
  get: () => apiRequest('/cart'),
  addItem: (productId, quantity = 1) =>
    apiRequest('/cart', { method: 'POST', body: { productId, quantity } }),
  updateItem: (productId, quantity) =>
    apiRequest(`/cart/${productId}`, { method: 'PUT', body: { quantity } }),
  removeItem: (productId) => apiRequest(`/cart/${productId}`, { method: 'DELETE' }),
  clear: () => apiRequest('/cart', { method: 'DELETE' }),
};

const Orders = {
  create: (payload) => apiRequest('/orders', { method: 'POST', body: payload }),
  getMyOrders: () => apiRequest('/orders/my'),
  getById: (id) => apiRequest(`/orders/${id}`),
};

/**
 * Broadcasts a "cart-updated" event so the Navbar (mounted on every page)
 * can refresh its cart badge count right after an add/update/remove/clear,
 * without needing prop drilling between independent page components.
 */
function notifyCartUpdated() {
  window.dispatchEvent(new Event('cart-updated'));
}

// Exposed as plain globals (no bundler/modules in this project — every
// *-app.js file can reference Auth / Products / Cart / Orders directly,
// same pattern as the existing Navbar/Footer/ProductCard components).

/** Admin dashboard reads (stats, all orders, product inventory). */
const Admin = {
  getStats: () => apiRequest('/admin/stats'),
  getOrders: () => apiRequest('/admin/orders'),
  getProducts: () => apiRequest('/admin/products'),
};
