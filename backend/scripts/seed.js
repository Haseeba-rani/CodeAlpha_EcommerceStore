// scripts/seed.js
//
// One-time seed script for Firestore + Firebase Auth. Run with: npm run seed
// Creates the admin test account (in Firebase Auth, plus its Firestore
// profile) and the 12 starter products. Safe to re-run — products use fixed
// document IDs, and the admin user is looked up by email before creating.

const { db, admin } = require('../config/firebase');

const products = [
  { id: '1', title: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: 299.99, originalPrice: 349.99, rating: 4.8, reviewsCount: 124, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', variants: [{ filter: 'none', colorName: 'Classic Red' }, { filter: 'hue-rotate(90deg)', colorName: 'Lime Green' }, { filter: 'hue-rotate(200deg)', colorName: 'Ocean Blue' }, { filter: 'grayscale(100%) brightness(0.8)', colorName: 'Matte Black' }], badge: 'New', description: 'Experience pure audio bliss with our industry-leading wireless noise-cancelling headphones. Featuring 30 hours of battery life, touch controls, and a lightweight, comfortable design for all-day listening.', specs: [{ label: 'Bluetooth', value: '5.0' }, { label: 'Battery Life', value: 'Up to 30 hours' }, { label: 'Weight', value: '254g' }, { label: 'Charging Time', value: '3 hours' }], inStock: true, stockQuantity: 42 },
  { id: '2', title: 'Minimalist Leather Watch', category: 'Accessories', price: 129.50, originalPrice: null, rating: 4.5, reviewsCount: 88, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', variants: [{ filter: 'none', colorName: 'Classic Brown' }, { filter: 'sepia(1) hue-rotate(180deg) saturate(2)', colorName: 'Navy Blue' }, { filter: 'sepia(1) hue-rotate(320deg) saturate(2)', colorName: 'Rose Gold' }, { filter: 'sepia(1) hue-rotate(40deg) saturate(1.5)', colorName: 'Tan' }], badge: null, description: 'A timeless minimalist watch crafted with genuine leather strap and a scratch-resistant sapphire crystal face. Perfect for both casual and formal occasions.', specs: [{ label: 'Movement', value: 'Quartz' }, { label: 'Water Resistance', value: '30m' }, { label: 'Case Diameter', value: '40mm' }, { label: 'Strap', value: 'Genuine Leather' }], inStock: true, stockQuantity: 30 },
  { id: '3', title: 'Premium Canvas Backpack', category: 'Accessories', price: 115.00, originalPrice: null, rating: 4.9, reviewsCount: 210, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', variants: [{ filter: 'none', colorName: 'Olive Green' }, { filter: 'hue-rotate(-50deg)', colorName: 'Charcoal' }, { filter: 'hue-rotate(150deg)', colorName: 'Forest' }, { filter: 'hue-rotate(250deg)', colorName: 'Slate Blue' }], badge: 'Popular', description: 'Durable, water-resistant canvas backpack with padded laptop compartment, ideal for daily commutes, travel, or campus life.', specs: [{ label: 'Capacity', value: '25L' }, { label: 'Laptop Sleeve', value: 'Up to 15.6"' }, { label: 'Material', value: 'Water-resistant Canvas' }, { label: 'Weight', value: '800g' }], inStock: true, stockQuantity: 60 },
  { id: '4', title: 'Classic Aviator Sunglasses', category: 'Accessories', price: 45.00, originalPrice: null, rating: 4.6, reviewsCount: 76, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80', variants: [{ filter: 'none', colorName: 'Gold Frame' }, { filter: 'sepia(0.8) hue-rotate(100deg)', colorName: 'Silver Frame' }, { filter: 'sepia(0.8) hue-rotate(200deg)', colorName: 'Black Frame' }], badge: null, description: 'Classic aviator sunglasses with polarized UV400 protection lenses, offering timeless style and complete eye protection.', specs: [{ label: 'Lens', value: 'Polarized UV400' }, { label: 'Frame Material', value: 'Metal Alloy' }, { label: 'Category', value: 'Unisex' }], inStock: true, stockQuantity: 100 },
  { id: '5', title: 'Smart Home Speaker', category: 'Electronics', price: 89.99, originalPrice: 109.99, rating: 4.7, reviewsCount: 302, image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&q=80', variants: [{ filter: 'none', colorName: 'Charcoal' }, { filter: 'sepia(1) hue-rotate(300deg)', colorName: 'Sandstone' }, { filter: 'sepia(1) hue-rotate(100deg)', colorName: 'Sage Green' }], badge: 'Sale', description: 'Voice-controlled smart speaker with rich, room-filling sound and built-in virtual assistant support for your connected home.', specs: [{ label: 'Connectivity', value: 'WiFi + Bluetooth 5.0' }, { label: 'Voice Assistant', value: 'Built-in' }, { label: 'Power', value: 'AC Adapter' }], inStock: true, stockQuantity: 75 },
  { id: '6', title: 'Organic Cotton T-Shirt', category: 'Clothing', price: 25.00, originalPrice: null, rating: 4.4, reviewsCount: 54, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', variants: [{ filter: 'none', colorName: 'White' }, { filter: 'hue-rotate(100deg) saturate(2)', colorName: 'Forest Green' }, { filter: 'hue-rotate(200deg) saturate(2)', colorName: 'Sky Blue' }, { filter: 'grayscale(100%)', colorName: 'Heather Gray' }], badge: null, description: 'Soft, breathable, 100% organic cotton t-shirt, ethically manufactured for everyday comfort.', specs: [{ label: 'Material', value: '100% Organic Cotton' }, { label: 'Fit', value: 'Regular' }, { label: 'Care', value: 'Machine Washable' }], inStock: true, stockQuantity: 200 },
  { id: '7', title: 'Vintage Camera Lens', category: 'Photography', price: 349.00, originalPrice: null, rating: 4.9, reviewsCount: 41, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', variants: [{ filter: 'none', colorName: 'Black' }, { filter: 'sepia(0.5)', colorName: 'Vintage Sepia' }, { filter: 'grayscale(100%)', colorName: 'Monochrome' }, { filter: 'hue-rotate(45deg)', colorName: 'Warm Tone' }], badge: 'Rare', description: 'A vintage manual-focus camera lens prized for its unique bokeh and character, fully compatible with modern mirrorless adapters.', specs: [{ label: 'Mount', value: 'Universal Adapter' }, { label: 'Focal Length', value: '50mm' }, { label: 'Aperture', value: 'f/1.4 - f/16' }], inStock: true, stockQuantity: 8 },
  { id: '8', title: 'Ceramic Coffee Mug', category: 'Home', price: 18.50, originalPrice: null, rating: 4.8, reviewsCount: 133, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', variants: [{ filter: 'none', colorName: 'White' }, { filter: 'hue-rotate(90deg) saturate(2) brightness(1.2)', colorName: 'Mint' }, { filter: 'hue-rotate(180deg) saturate(2) brightness(1.2)', colorName: 'Sky Blue' }, { filter: 'hue-rotate(270deg) saturate(2) brightness(1.2)', colorName: 'Lavender' }], badge: null, description: 'Handcrafted ceramic coffee mug with a comfortable handle and glossy glaze finish, microwave and dishwasher safe.', specs: [{ label: 'Capacity', value: '350ml' }, { label: 'Material', value: 'Ceramic' }, { label: 'Care', value: 'Dishwasher & Microwave Safe' }], inStock: true, stockQuantity: 150 },
  { id: '9', title: 'Mechanical Keyboard', category: 'Electronics', price: 145.00, originalPrice: null, rating: 4.8, reviewsCount: 189, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80', variants: [{ filter: 'none', colorName: 'Black' }, { filter: 'hue-rotate(90deg)', colorName: 'White/RGB' }], badge: null, description: 'Tactile mechanical keyboard with hot-swappable switches, per-key RGB lighting, and a durable aluminum frame for gamers and typists alike.', specs: [{ label: 'Switch Type', value: 'Hot-swappable Mechanical' }, { label: 'Backlight', value: 'Per-key RGB' }, { label: 'Connection', value: 'USB-C / Bluetooth' }], inStock: true, stockQuantity: 55 },
  { id: '10', title: 'Aesthetic Desk Lamp', category: 'Home', price: 42.00, originalPrice: null, rating: 4.6, reviewsCount: 67, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80', variants: [{ filter: 'none', colorName: 'Wood/White' }, { filter: 'hue-rotate(120deg)', colorName: 'Sage' }, { filter: 'hue-rotate(240deg)', colorName: 'Navy' }], badge: 'Trending', description: 'Adjustable LED desk lamp with touch dimming controls and a warm-to-cool color temperature range, designed to reduce eye strain.', specs: [{ label: 'Light Source', value: 'LED' }, { label: 'Brightness Levels', value: '5' }, { label: 'Power', value: 'USB-C' }], inStock: true, stockQuantity: 90 },
  { id: '11', title: 'Running Shoes', category: 'Clothing', price: 110.00, originalPrice: null, rating: 4.7, reviewsCount: 245, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', variants: [{ filter: 'none', colorName: 'White/Black' }, { filter: 'hue-rotate(120deg)', colorName: 'Green/Black' }, { filter: 'hue-rotate(240deg)', colorName: 'Blue/Black' }], badge: null, description: 'Lightweight, breathable running shoes engineered with responsive cushioning for maximum comfort on long runs.', specs: [{ label: 'Upper Material', value: 'Engineered Mesh' }, { label: 'Sole', value: 'Responsive Foam' }, { label: 'Use', value: 'Road Running' }], inStock: true, stockQuantity: 120 },
  { id: '12', title: 'Leather Wallet', category: 'Accessories', price: 55.00, originalPrice: null, rating: 4.5, reviewsCount: 58, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80', variants: [{ filter: 'none', colorName: 'Brown' }, { filter: 'grayscale(100%) brightness(0.7)', colorName: 'Black' }, { filter: 'sepia(1) hue-rotate(340deg) saturate(2)', colorName: 'Burgundy' }], badge: null, description: 'Slim genuine leather bifold wallet with RFID-blocking technology and multiple card slots.', specs: [{ label: 'Material', value: 'Genuine Leather' }, { label: 'Card Slots', value: '8' }, { label: 'RFID Protection', value: 'Yes' }], inStock: true, stockQuantity: 140 },
];

async function seed() {
  console.log('Seeding Firestore...');

  // Products — fixed doc IDs "1".."12" so they're stable and re-runnable.
  const productBatch = db.batch();
  const now = new Date().toISOString();
  for (const { id, ...data } of products) {
    const ref = db.collection('products').doc(id);
    productBatch.set(ref, { ...data, createdAt: now, updatedAt: now });
  }
  await productBatch.commit();
  console.log(`  ✓ Seeded ${products.length} products`);

  // Admin user — created in Firebase Auth (identity) plus a matching
  // Firestore profile document (role). Looked up by email first so
  // re-running this script doesn't error on "email already exists".
  const adminEmail = 'admin@hapyshop.com';
  const adminPassword = 'Admin@123';

  let adminUserRecord;
  try {
    adminUserRecord = await admin.auth().getUserByEmail(adminEmail);
    console.log('  • Admin auth user already exists, reusing it');
  } catch (err) {
    adminUserRecord = await admin.auth().createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: 'Store Admin',
    });
    console.log('  ✓ Created admin user in Firebase Auth');
  }

  await db.collection('users').doc(adminUserRecord.uid).set({
    name: 'Store Admin',
    email: adminEmail,
    role: 'admin',
    createdAt: now,
    updatedAt: now,
  }, { merge: true });
  console.log(`  ✓ Seeded admin profile (${adminEmail} / ${adminPassword})`);

  console.log('Done.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
