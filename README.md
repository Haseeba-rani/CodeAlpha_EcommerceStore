# Hapyshop — Full Stack E-Commerce (CodeAlpha Internship Project)

This project has two independent parts:

```
hapyshop-fullstack/
├── frontend/   # Static React (CDN) + Tailwind MPA — unchanged UI/design
└── backend/    # Node.js + Express REST API, Firestore (data) + Firebase Authentication (identity)
```

## One-time Firebase setup

1. Create a Firestore database at https://console.firebase.google.com (any region)
2. **Enable Authentication → Sign-in method → Email/Password** — required, or sign-up/login will fail
3. Project Settings → Service Accounts → **Generate new private key** → save the file as `backend/config/serviceAccountKey.json`
4. Deploy `backend/firestore.rules` to your project (Firestore Database → Rules tab → paste → Publish). These lock out all direct client access — correct and intentional, since the backend talks to Firestore only via the Admin SDK (service account), which always bypasses rules.
5. The frontend's `firebase-config.js` already has the public Web SDK config for this project wired in (safe to keep — it's not a secret, unlike the service account key).

## Run both together

**1. Start the backend (port 5000):**
```bash
cd backend
npm install
cp .env.example .env
npm run seed      # one-time: creates the admin Firebase Auth user + pushes 12 starter products into Firestore
npm run dev
```

**2. Serve the frontend (port 3000 — must match `CLIENT_URL` in backend/.env):**
```bash
cd frontend
npx serve -l 3000 .
# OR
python -m http.server 3000
```

**3. Open** `http://localhost:3000/index.html`

## Test account
```
Admin:  admin@hapyshop.com / Admin@123
```
Or register a new shopper account from the UI.

## How auth works here
- Sign-up/sign-in/sign-out happen **directly between the browser and Firebase** (via the Firebase Web SDK) — the backend never sees a password.
- After signing in, the frontend attaches a fresh Firebase ID token as `Authorization: Bearer <token>` on every API call (see `frontend/api.js` and `frontend/firebase-init.js`).
- The backend verifies that token per-request via the Firebase Admin SDK, then looks up the matching profile (name, role) in Firestore's `users` collection, keyed by Firebase UID.
- "Forgot password" on the login page sends a real Firebase password-reset email.

## What's wired up
- Home & Products pages fetch real products from the backend (category/sort/pagination)
- Product detail page loads the real product by `?id=` in the URL, plus related products
- Add to Cart (from product cards, product detail, or related products) hits the real cart API
- Cart page: real per-user cart, working quantity +/- and remove, live totals
- Checkout: real order creation, decrements stock (via a Firestore transaction), clears cart, shows an order confirmation
- Login/Register/Forgot-password: real Firebase Authentication; Navbar reflects login state and live cart count
- Admin role, dashboard stats, product CRUD, order management: see `backend/README.md` for the full API reference

No HTML, CSS, colors, layout, or animations were changed in the frontend — only the JavaScript logic was updated to call real APIs/Firebase instead of hardcoded data.
