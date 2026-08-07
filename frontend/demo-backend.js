// demo-backend.js
// Offline fallback "backend" for the Hapyshop frontend.
//
// The real backend is the Express + Firestore API at http://localhost:5000/api.
// When that server isn't reachable (e.g. the site is opened online, or Node
// isn't running locally), api.js falls back to this in-browser implementation
// so every page — products, product details, cart, checkout, orders and the
// admin dashboard — keeps working with the exact same response shapes.
//
// Data: product catalog is seeded below; cart + orders persist in localStorage.

const DemoAPI = (() => {
  const IMG = (id) => `https://images.unsplash.com/${id}?w=800&q=80`;

  const V = (list) => list.map(([colorName, filter]) => ({ colorName, filter }));

  const CATALOG = [
    {
      id: '1', title: 'Wireless Noise-Cancelling Headphones', category: 'Electronics',
      price: 199.99, originalPrice: 249.99, rating: 4.6, reviewsCount: 214, badge: 'Best Seller',
      image: IMG('photo-1505740420928-5e560c06d30e'), stock: 24, featured: 1,
      description: 'Immersive over-ear headphones with active noise cancellation, 30-hour battery life and plush memory-foam earcups for all-day comfort.',
      specs: [{ label: 'Battery', value: '30 hours' }, { label: 'Bluetooth', value: '5.3' }, { label: 'Weight', value: '250 g' }],
      variants: V([['Midnight Black', 'none'], ['Rose', 'hue-rotate(-40deg)'], ['Ocean', 'hue-rotate(160deg)'], ['Sand', 'sepia(0.4)']]),
    },
    {
      id: '2', title: 'Classic Leather Watch', category: 'Accessories',
      price: 149.0, originalPrice: 189.0, rating: 4.8, reviewsCount: 132, badge: 'New',
      image: IMG('photo-1523275335684-37898b6baf30'), stock: 15, featured: 2,
      description: 'A timeless analog watch with sapphire glass, stainless-steel case and a hand-stitched genuine leather strap.',
      specs: [{ label: 'Case', value: '40 mm steel' }, { label: 'Water resist', value: '5 ATM' }, { label: 'Strap', value: 'Leather' }],
      variants: V([['Brown', 'none'], ['Black', 'grayscale(1)'], ['Tan', 'sepia(0.5)'], ['Slate', 'hue-rotate(200deg)']]),
    },
    {
      id: '3', title: 'Minimalist Canvas Backpack', category: 'Accessories',
      price: 79.5, rating: 4.4, reviewsCount: 87,
      image: IMG('photo-1553062407-98eeb64c6a62'), stock: 40, featured: 3,
      description: 'Water-resistant canvas backpack with a padded 15" laptop sleeve, hidden back pocket and lifetime stitching warranty.',
      specs: [{ label: 'Capacity', value: '22 L' }, { label: 'Laptop', value: 'Up to 15"' }, { label: 'Material', value: 'Waxed canvas' }],
      variants: V([['Charcoal', 'none'], ['Olive', 'hue-rotate(60deg)'], ['Navy', 'hue-rotate(200deg)'], ['Camel', 'sepia(0.6)']]),
    },
    {
      id: '4', title: 'Smart Fitness Tracker', category: 'Electronics',
      price: 89.99, originalPrice: 119.99, rating: 4.3, reviewsCount: 341, badge: 'Sale',
      image: IMG('photo-1576243345690-4e4b79b63288'), stock: 60, featured: 4,
      description: 'Track heart rate, sleep quality, SpO2 and 20+ workout modes with a 10-day battery and always-on AMOLED display.',
      specs: [{ label: 'Display', value: '1.4" AMOLED' }, { label: 'Battery', value: '10 days' }, { label: 'Rating', value: '5 ATM' }],
      variants: V([['Black', 'none'], ['Pink', 'hue-rotate(-30deg)'], ['Blue', 'hue-rotate(180deg)'], ['Silver', 'grayscale(0.8)']]),
    },
    {
      id: '5', title: 'Organic Cotton Oversized Tee', category: 'Clothing',
      price: 34.0, rating: 4.5, reviewsCount: 76,
      image: IMG('photo-1521572163474-6864f9cf17ab'), stock: 120, featured: 5,
      description: '100% GOTS-certified organic cotton, garment-dyed for a lived-in feel with a relaxed drop-shoulder fit.',
      specs: [{ label: 'Fabric', value: '220 gsm cotton' }, { label: 'Fit', value: 'Oversized' }, { label: 'Care', value: 'Machine wash' }],
      variants: V([['White', 'none'], ['Sage', 'hue-rotate(90deg)'], ['Clay', 'sepia(0.4)'], ['Ink', 'grayscale(1) brightness(0.7)']]),
    },
    {
      id: '6', title: 'Everyday Denim Jacket', category: 'Clothing',
      price: 118.0, originalPrice: 145.0, rating: 4.7, reviewsCount: 54,
      image: IMG('photo-1543087903-1ac2ec7aa8c5'), stock: 18, featured: 6,
      description: 'Rigid selvedge denim trucker jacket that fades beautifully over time. Reinforced seams and antique brass hardware.',
      specs: [{ label: 'Denim', value: '13 oz selvedge' }, { label: 'Origin', value: 'Japan' }, { label: 'Fit', value: 'Regular' }],
      variants: V([['Indigo', 'none'], ['Washed', 'brightness(1.2) saturate(0.7)'], ['Black', 'grayscale(1)'], ['Ecru', 'sepia(0.5)']]),
    },
    {
      id: '7', title: 'Ceramic Pour-Over Coffee Set', category: 'Home',
      price: 64.0, rating: 4.6, reviewsCount: 98, badge: 'Popular',
      image: IMG('photo-1495474472287-4d71bcdd2085'), stock: 33, featured: 7,
      description: 'Hand-glazed ceramic dripper, matching carafe and reusable stainless filter for a clean, balanced cup every morning.',
      specs: [{ label: 'Volume', value: '600 ml' }, { label: 'Material', value: 'Stoneware' }, { label: 'Filter', value: 'Reusable' }],
      variants: V([['Cream', 'none'], ['Terracotta', 'hue-rotate(-20deg)'], ['Slate', 'grayscale(0.9)'], ['Moss', 'hue-rotate(80deg)']]),
    },
    {
      id: '8', title: 'Linen Throw Blanket', category: 'Home',
      price: 92.0, rating: 4.4, reviewsCount: 41,
      image: IMG('photo-1522771739844-6a9f6d5f14af'), stock: 27, featured: 8,
      description: 'Stonewashed European linen throw that gets softer with every wash — breathable in summer, cosy in winter.',
      specs: [{ label: 'Size', value: '130 × 170 cm' }, { label: 'Material', value: '100% linen' }, { label: 'Weight', value: '450 g' }],
      variants: V([['Oat', 'none'], ['Blush', 'hue-rotate(-30deg)'], ['Sky', 'hue-rotate(180deg)'], ['Charcoal', 'grayscale(1)']]),
    },
    {
      id: '9', title: 'Mirrorless Camera Kit 24MP', category: 'Photography',
      price: 899.0, originalPrice: 999.0, rating: 4.9, reviewsCount: 167, badge: 'Pro Pick',
      image: IMG('photo-1502920917128-1aa500764cbd'), stock: 8, featured: 9,
      description: 'Compact 24MP APS-C mirrorless body with 4K60 video, in-body stabilisation and a versatile 18-55mm kit lens.',
      specs: [{ label: 'Sensor', value: '24 MP APS-C' }, { label: 'Video', value: '4K 60fps' }, { label: 'Mount', value: 'E-mount' }],
      variants: V([['Black', 'none'], ['Silver', 'grayscale(0.7) brightness(1.2)'], ['Graphite', 'brightness(0.8)'], ['Retro', 'sepia(0.4)']]),
    },
    {
      id: '10', title: 'Pro Tripod with Ball Head', category: 'Photography',
      price: 159.0, rating: 4.5, reviewsCount: 63,
      image: IMG('photo-1519638831568-d9897f54ed69'), stock: 21, featured: 10,
      description: 'Carbon-fibre travel tripod that folds to 38 cm, holds 12 kg and includes an Arca-compatible ball head.',
      specs: [{ label: 'Material', value: 'Carbon fibre' }, { label: 'Max height', value: '158 cm' }, { label: 'Load', value: '12 kg' }],
      variants: V([['Carbon', 'none'], ['Black', 'grayscale(1)'], ['Bronze', 'sepia(0.6)'], ['Steel', 'brightness(1.2)']]),
    },
    {
      id: '11', title: 'Aluminium Laptop Stand', category: 'Electronics',
      price: 54.0, rating: 4.2, reviewsCount: 129,
      image: IMG('photo-1527864550417-7fd91fc51a46'), stock: 75, featured: 11,
      description: 'CNC-milled aluminium stand that lifts your screen to eye level and keeps airflow moving under the chassis.',
      specs: [{ label: 'Fits', value: '11"–16"' }, { label: 'Material', value: 'Aluminium' }, { label: 'Finish', value: 'Anodised' }],
      variants: V([['Silver', 'none'], ['Space Grey', 'brightness(0.7)'], ['Gold', 'sepia(0.5)'], ['Black', 'grayscale(1) brightness(0.5)']]),
    },
    {
      id: '12', title: 'Woven Straw Sun Hat', category: 'Accessories',
      price: 42.0, rating: 4.1, reviewsCount: 38,
      image: IMG('photo-1515886657613-9f3515b0c78f'), stock: 0, featured: 12,
      description: 'Hand-woven wide-brim straw hat with an inner drawstring for a snug fit and UPF 50+ sun protection.',
      specs: [{ label: 'Brim', value: '10 cm' }, { label: 'UPF', value: '50+' }, { label: 'Material', value: 'Straw' }],
      variants: V([['Natural', 'none'], ['Bleached', 'brightness(1.3)'], ['Cocoa', 'sepia(0.7)'], ['Black band', 'grayscale(0.4)']]),
    },
  ].map((p, idx) => ({
    ...p,
    inStock: p.stock > 0,
    createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
  }));

  // ---------- storage helpers ----------
  const uid = () => {
    try {
      const u = window.FirebaseAuth && FirebaseAuth.getCurrentFirebaseUser && FirebaseAuth.getCurrentFirebaseUser();
      if (u && u.uid) return u.uid;
    } catch (e) { /* ignore */ }
    return 'guest';
  };
  const key = (name) => `hapyshop:demo:${name}:${uid()}`;
  const read = (name, fallback) => {
    try { return JSON.parse(localStorage.getItem(key(name))) ?? fallback; }
    catch (e) { return fallback; }
  };
  const write = (name, value) => localStorage.setItem(key(name), JSON.stringify(value));

  const findProduct = (id) => CATALOG.find((p) => String(p.id) === String(id));

  const round = (n) => Math.round(n * 100) / 100;

  const buildCart = () => {
    const raw = read('cart', []);
    const items = raw
      .map((line) => {
        const product = findProduct(line.productId);
        if (!product) return null;
        return {
          productId: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          quantity: line.quantity,
        };
      })
      .filter(Boolean);
    const subtotal = round(items.reduce((s, i) => s + i.price * i.quantity, 0));
    const shipping = items.length === 0 || subtotal >= 100 ? 0 : 9.99;
    const tax = round(subtotal * 0.08);
    return { items, subtotal, shipping, tax, total: round(subtotal + shipping + tax) };
  };

  const ok = (data, message = 'OK') => ({ success: true, message, data });
  const fail = (status, message) => {
    const err = new Error(message);
    err.status = status;
    throw err;
  };

  const listProducts = (params) => {
    const category = params.get('category');
    const sort = params.get('sort') || 'featured';
    const search = (params.get('search') || '').toLowerCase();
    const page = Math.max(1, parseInt(params.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(params.get('limit') || '12', 10));

    let items = CATALOG.slice();
    if (category && category !== 'All') items = items.filter((p) => p.category === category);
    if (search) items = items.filter((p) => p.title.toLowerCase().includes(search));

    if (sort === 'price_asc') items.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') items.sort((a, b) => b.price - a.price);
    else if (sort === 'newest') items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else items.sort((a, b) => a.featured - b.featured);

    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const start = (page - 1) * limit;

    return ok({
      items: items.slice(start, start + limit),
      pagination: { currentPage: page, totalPages, totalItems, limit },
    });
  };

  const createOrder = (payload) => {
    const cart = buildCart();
    if (cart.items.length === 0) fail(400, 'Your cart is empty.');

    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      status: 'processing',
      createdAt: new Date().toISOString(),
      items: cart.items,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      tax: cart.tax,
      total: cart.total,
      contact: payload.contact,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
    };

    const orders = read('orders', []);
    orders.unshift(order);
    write('orders', orders);
    write('cart', []);
    return ok(order, 'Order placed successfully');
  };

  const currentProfile = () => {
    const u = window.FirebaseAuth && FirebaseAuth.getCurrentFirebaseUser && FirebaseAuth.getCurrentFirebaseUser();
    if (!u) fail(401, 'Not authenticated');
    return ok({
      id: u.uid,
      name: u.displayName || (u.email || '').split('@')[0],
      email: u.email,
      role: 'admin', // demo mode: signed-in users can preview the admin dashboard
    });
  };

  /**
   * Routes a request the same way the Express backend does.
   * `path` looks like "/products?limit=4"; method/body come from api.js.
   */
  const handle = (path, method = 'GET', body = null) => {
    const [rawPath, queryString] = path.split('?');
    const params = new URLSearchParams(queryString || '');
    const segments = rawPath.split('/').filter(Boolean);
    const [root, second] = segments;

    if (root === 'products') {
      if (!second) return listProducts(params);
      const product = findProduct(second);
      return product ? ok(product) : fail(404, 'Product not found');
    }

    if (root === 'users' && second === 'me') return currentProfile();
    if (root === 'auth') return ok({ synced: true });

    if (root === 'cart') {
      const lines = read('cart', []);
      if (method === 'GET') return ok(buildCart());
      if (method === 'POST') {
        const product = findProduct(body.productId);
        if (!product) fail(404, 'Product not found');
        if (!product.inStock) fail(400, 'This product is out of stock.');
        const existing = lines.find((l) => String(l.productId) === String(body.productId));
        if (existing) existing.quantity += body.quantity || 1;
        else lines.push({ productId: String(product.id), quantity: body.quantity || 1 });
        write('cart', lines);
        return ok(buildCart(), 'Item added to cart');
      }
      if (method === 'PUT') {
        const next = lines
          .map((l) => (String(l.productId) === String(second) ? { ...l, quantity: body.quantity } : l))
          .filter((l) => l.quantity > 0);
        write('cart', next);
        return ok(buildCart(), 'Cart updated');
      }
      if (method === 'DELETE') {
        if (second) write('cart', lines.filter((l) => String(l.productId) !== String(second)));
        else write('cart', []);
        return ok(buildCart(), 'Cart updated');
      }
    }

    if (root === 'orders') {
      const orders = read('orders', []);
      if (method === 'POST' && !second) return createOrder(body || {});
      if (second === 'my') return ok({ items: orders });
      if (second) {
        const order = orders.find((o) => o.id === second);
        return order ? ok(order) : fail(404, 'Order not found');
      }
      return ok({ items: orders });
    }

    if (root === 'admin') {
      const orders = read('orders', []);
      if (second === 'stats') {
        const revenue = round(orders.reduce((s, o) => s + o.total, 0));
        const unitsSold = orders.reduce(
          (s, o) => s + o.items.reduce((n, i) => n + i.quantity, 0), 0);
        return ok({
          totalProducts: CATALOG.length,
          totalOrders: orders.length,
          revenue,
          unitsSold,
          lowStock: CATALOG.filter((p) => p.stock > 0 && p.stock < 20).length,
          outOfStock: CATALOG.filter((p) => p.stock === 0).length,
        });
      }
      if (second === 'orders') return ok({ items: orders });
      if (second === 'products') return ok({ items: CATALOG });
    }

    return fail(404, `No demo route for ${method} ${rawPath}`);
  };

  return { handle, CATALOG };
})();

window.DemoAPI = DemoAPI;
