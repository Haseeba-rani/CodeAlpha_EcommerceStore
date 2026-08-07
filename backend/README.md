# Hapyshop Backend

A production-quality REST API for the Hapyshop e-commerce frontend (CodeAlpha Internship Project).

## Stack
Node.js, Express.js, **Firebase Authentication** (identity), **Firestore** (data, via firebase-admin), Helmet, Morgan, express-validator, dotenv, CORS.

**Auth:** Firebase Authentication. The frontend signs users in/up directly against Firebase using the client SDK, then sends the resulting ID token as `Authorization: Bearer <idToken>` on every request. This backend verifies that token server-side — it never sees a password and never issues its own tokens.

**Data storage:** Cloud Firestore. Built with a repository pattern (`/models`) — every model exports the same function names/signatures regardless of what's underneath, so the database could be swapped again later without touching routes or controllers.

## Architecture (MVC + modular)

```
backend/
├── server.js                    # Entry point — binds the app to a port
├── app.js                       # Express app config (middleware, route mounting)
├── config/env.js                # Centralized environment variable loader
├── config/firebase.js           # Firebase Admin SDK init — exports { admin, db }
├── config/serviceAccountKey.json  # Your Firebase service account key (you provide this, gitignored)
├── scripts/seed.js              # Creates the admin Firebase Auth user + pushes starter products
├── firestore.rules              # Security rules (client access is fully locked down — see below)
├── models/                       # Data access layer — Firestore reads/writes live here only
├── controllers/                  # Business logic — fully implemented, no placeholders
├── routes/                       # Route definitions, wire validators + middleware + controllers
├── middlewares/                  # auth.middleware.js verifies Firebase ID tokens; admin guard; validation; error handling; 404
├── validators/                    # express-validator rule chains per resource
└── utils/                        # ApiError, ApiResponse, asyncHandler
```

## Firebase Setup

1. Create a Firestore database in the [Firebase Console](https://console.firebase.google.com) (any region, "production mode" is fine — the security rules below already lock out all client access).
2. Enable **Authentication → Sign-in method → Email/Password** in the console.
3. Go to **Project Settings → Service Accounts → Generate new private key**. This downloads a JSON file — treat it as a secret, never commit or share it.
4. Give the backend that key, one of two ways:
   - Save the file as `backend/config/serviceAccountKey.json` (already gitignored), **or**
   - Paste its entire contents as a single-line JSON string into `FIREBASE_SERVICE_ACCOUNT` in your `.env`.
5. Deploy `firestore.rules` to your project (Firebase Console → Firestore → Rules → paste → Publish). These rules block **all** direct client reads/writes — that's intentional. This backend talks to Firestore exclusively through the Admin SDK using your service account, which always bypasses security rules.
6. Seed the starter data (12 products + one admin account):
   ```bash
   npm run seed
   ```

## Setup

```bash
cd backend
npm install
cp .env.example .env    # edit values as needed (Firebase credentials)
npm run seed              # one-time: creates the admin Firebase Auth user + populates Firestore
npm run dev                # or: npm start
```

Server runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

### Seeded admin account
The seed script creates an admin user (in Firebase Auth) for testing the admin panel immediately:
```
email:    admin@hapyshop.com
password: Admin@123
```
**Change or remove this before any real deployment.**

### A note on async
Firestore reads are network calls, unlike a synchronous in-memory store. Every model function is `async` and every controller call site has `await` where needed — the logic and control flow are otherwise unchanged.

## CORS & Auth headers
`CLIENT_URL` in `.env` must match your frontend's exact origin (e.g. `http://localhost:3000`). Auth is stateless Bearer-token based (no cookies) — the frontend must send `Authorization: Bearer <idToken>` on every authenticated request, where `idToken` comes from Firebase's `getIdToken()` and refreshes automatically via the client SDK.

## API Reference

All responses follow: `{ success, message, data }` on success, `{ success, message, errors }` on failure.

### Auth — `/api/auth`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/sync` | Private | Creates/updates this user's Firestore profile (`{ name }`) right after Firebase signup. |

Sign-up, sign-in, sign-out, and token refresh all happen on the frontend directly against Firebase — there's no backend endpoint for them.

### Users — `/api/users`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/me` | Private | Get own profile (name, role) |
| PUT | `/me` | Private | Update `{ name }` |

Email/password changes go through the Firebase client SDK directly, not this backend.

### Products — `/api/products`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List products — query: `category, search, minPrice, maxPrice, sort, page, limit` |
| GET | `/:id` | Public | Get single product |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |

`sort` values: `price_asc`, `price_desc`, `rating_desc`, `newest`, `featured` (default).

### Cart — `/api/cart` (all Private)
| Method | Route | Description |
|---|---|---|
| GET | `/` | Get current user's cart + computed totals |
| POST | `/` | Add item `{ productId, quantity }` |
| PUT | `/:productId` | Set exact quantity `{ quantity }` (0 removes it) |
| DELETE | `/:productId` | Remove one item |
| DELETE | `/` | Clear entire cart |

Totals returned: `subtotal`, `shipping` (flat $10 if cart non-empty), `tax` (10%), `total`.

### Orders — `/api/orders` (all Private)
| Method | Route | Description |
|---|---|---|
| POST | `/` | Checkout — body: `{ contact, shippingAddress, paymentMethod }`. Builds order from current cart, decrements stock, clears cart. |
| GET | `/my` | Current user's order history |
| GET | `/:id` | Single order (owner or admin only) |

`paymentMethod` must be `"card"` or `"cod"`.

### Admin — `/api/admin` (all Admin-only)
| Method | Route | Description |
|---|---|---|
| GET | `/users` | List all users |
| GET | `/orders` | List all orders |
| PUT | `/orders/:id/status` | Update order status |
| GET | `/stats` | Dashboard summary (totals, revenue, low stock count) |

## Notes for any future changes
Only `config/firebase.js` and the files in `/models` know that Firestore/Firebase Auth exist. Swapping either again later means rewriting those files with the same exported function names/signatures — no route, validator, or controller business logic would need to change.
