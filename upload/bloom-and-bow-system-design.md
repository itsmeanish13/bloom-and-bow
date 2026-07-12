# Bloom & Bow — System Design

E-commerce platform for flowers and small gifts, Nepal market. Same-day delivery, local payment rails, single-vendor to start (structured so it can become multi-vendor later, same pattern as MobileMantra).

---

## 1. Tech stack and why

| Layer | Choice | Why this over the alternative |
|---|---|---|
| Frontend | **Next.js 14 (App Router) + TypeScript** | SSR for product pages (SEO matters for "flower delivery Kathmandu" search traffic), file-based routing keeps the team fast, same stack you already teach and use on MobileMantra so no context switch |
| Styling | **Tailwind CSS** | Matches the token system from the homepage mockup directly — colors and spacing become `tailwind.config` values, not a rewrite |
| Backend | **FastAPI (Python 3.12)** | Async by default (matters for payment webhooks + delivery status polling), Pydantic gives you request/response validation for free, you already have production FastAPI experience so velocity is high |
| Database | **MongoDB Atlas** | Product catalogs are naturally document-shaped (variable attributes per bouquet/gift), and it's your established stack. A relational DB would fight you on catalog flexibility for no real gain here |
| Auth | **JWT (access + refresh) via FastAPI** | Stateless, works cleanly with Next.js middleware for route protection, no session store needed at this scale |
| Payments | **eSewa + Khalti** | The two dominant Nepal wallets; card payments (Stripe-equivalent) are optional-later, not day-one |
| Image storage | **Cloudinary** (or S3 + CloudFront if you want AWS-native) | On-the-fly image transforms (thumbnail, card, zoom sizes) without you writing resize logic |
| Notifications | **Twilio/Sparrow SMS for SMS, Resend/SES for email** | Order confirmations and delivery updates — SMS matters more than email for this audience |
| Hosting | **Frontend: Vercel · Backend: Railway or a small VPS (Hetzner/DigitalOcean) · DB: Atlas free/shared tier to start** | Vercel is the natural home for Next.js; FastAPI doesn't need serverless, a small always-on box is simpler and cheaper for a low-traffic launch |
| Background jobs | **Celery + Redis**, or start with FastAPI `BackgroundTasks` and upgrade later | Order status emails, delivery reminders don't need to block the request |

---

## 2. High-level flow

Browser → Next.js (SSR pages + API routes for BFF concerns) → FastAPI (all real business logic, auth, payments) → MongoDB. Payments, image storage, and SMS are called out to third parties from the backend, never from the browser directly — this keeps API keys server-side.

---

## 3. Frontend structure (Next.js App Router)

```
apps/web/
├── app/
│   ├── (shop)/
│   │   ├── page.tsx                  # homepage — hero, occasions, featured grid
│   │   ├── shop/
│   │   │   ├── page.tsx              # full catalog, filters, pagination
│   │   │   └── [slug]/page.tsx       # product detail
│   │   ├── occasions/[slug]/page.tsx # "Birthday", "Anniversary" landing pages
│   │   ├── cart/page.tsx
│   │   └── checkout/
│   │       ├── page.tsx              # address + delivery slot
│   │       └── payment/page.tsx      # eSewa/Khalti handoff
│   ├── (account)/
│   │   ├── login/page.tsx
│   │   ├── orders/page.tsx
│   │   └── orders/[id]/page.tsx      # order tracking
│   ├── (admin)/                      # separate layout, role-gated
│   │   ├── products/page.tsx
│   │   ├── orders/page.tsx
│   │   └── layout.tsx                # checks admin role in middleware
│   ├── api/
│   │   └── payments/callback/route.ts # eSewa/Khalti redirect handler (thin — verifies then calls FastAPI)
│   └── layout.tsx
├── components/
│   ├── ui/                           # buttons, tags, chips — matches the design tokens
│   ├── product/
│   └── checkout/
├── lib/
│   ├── api-client.ts                 # typed fetch wrapper to FastAPI
│   ├── auth.ts                       # JWT read/refresh, middleware helpers
│   └── types.ts                      # shared types, ideally generated from FastAPI's OpenAPI schema
└── middleware.ts                     # route protection for (account) and (admin)
```

**Key decision:** the Next.js API routes stay thin — just payment-redirect handling and anything that must run on Vercel's edge. All real logic lives in FastAPI so the backend can be reused later (mobile app, admin CLI) without duplicating rules.

---

## 4. Backend structure (FastAPI)

```
apps/api/
├── main.py
├── core/
│   ├── config.py            # settings via pydantic-settings, env-driven
│   ├── security.py          # JWT encode/decode, password hashing
│   └── database.py          # Motor (async MongoDB) client
├── models/                  # Pydantic schemas — request/response, not ORM
│   ├── product.py
│   ├── order.py
│   ├── user.py
│   └── payment.py
├── routers/
│   ├── auth.py              # /auth/register, /auth/login, /auth/refresh
│   ├── products.py          # /products, /products/{slug}
│   ├── cart.py              # /cart
│   ├── orders.py            # /orders, /orders/{id}
│   ├── payments.py          # /payments/esewa/initiate, /payments/khalti/verify, webhooks
│   └── admin.py             # product CRUD, order management — role-gated
├── services/                # business logic, kept separate from route handlers
│   ├── order_service.py
│   ├── payment_service.py   # eSewa/Khalti signature verification, status polling
│   └── notification_service.py
├── repositories/            # MongoDB collection access, one per collection
│   ├── product_repo.py
│   ├── order_repo.py
│   └── user_repo.py
└── tests/
```

**Pattern:** routers stay thin (parse request → call service → return response). Services hold logic and are unit-testable without spinning up FastAPI. Repositories are the only layer that touches MongoDB directly — if you ever swap databases, this is the only layer that changes.

---

## 5. Database schema (MongoDB collections)

**`users`**
```json
{
  "_id": ObjectId,
  "name": "string",
  "phone": "string (unique, indexed)",
  "email": "string (optional)",
  "password_hash": "string",
  "role": "customer | admin",
  "addresses": [{ "label": "Home", "line1": "", "city": "", "landmark": "" }],
  "created_at": "datetime"
}
```

**`products`**
```json
{
  "_id": ObjectId,
  "slug": "string (unique, indexed)",
  "title": "string",
  "description": "string",
  "category": "flowers | gifts",
  "occasions": ["birthday", "anniversary"],
  "price": "number (paisa, stored as integer to avoid float rounding)",
  "images": ["cloudinary_url"],
  "stock_status": "in_stock | made_to_order | sold_out",
  "badges": ["bestseller", "new"],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**`orders`**
```json
{
  "_id": ObjectId,
  "order_number": "string (human-readable, e.g. BB-2026-0341)",
  "user_id": ObjectId,
  "items": [{ "product_id": ObjectId, "title": "string", "price": "number", "qty": "number" }],
  "delivery": {
    "address": {},
    "slot": "same_day | next_day",
    "recipient_name": "string",
    "recipient_phone": "string",
    "gift_note": "string"
  },
  "payment": {
    "method": "esewa | khalti | cod",
    "status": "pending | paid | failed | refunded",
    "transaction_id": "string",
    "amount": "number"
  },
  "status": "placed | confirmed | out_for_delivery | delivered | cancelled",
  "status_history": [{ "status": "string", "at": "datetime" }],
  "created_at": "datetime"
}
```

**Indexes to create day one:**
- `users.phone` — unique
- `products.slug` — unique
- `products.category`, `products.occasions` — for filtering
- `orders.user_id`, `orders.order_number` — unique on order_number

---

## 6. Core API surface

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` | — | Create account (phone + OTP or password) |
| POST | `/auth/login` | — | Returns access + refresh token |
| GET | `/products` | — | List/filter/paginate catalog |
| GET | `/products/{slug}` | — | Product detail |
| POST | `/cart` | user | Add/update cart (or client-side cart synced at checkout) |
| POST | `/orders` | user | Place order, status `placed` |
| GET | `/orders/{id}` | user | Order + delivery tracking |
| POST | `/payments/esewa/initiate` | user | Returns eSewa redirect payload |
| GET | `/payments/esewa/callback` | — (signature-verified) | eSewa success/failure redirect target |
| POST | `/payments/khalti/verify` | user | Verify Khalti token server-side, mark order paid |
| GET/POST/PATCH | `/admin/products` | admin | Catalog management |
| PATCH | `/admin/orders/{id}` | admin | Update order status, triggers customer SMS |

**Payment flow specifics:** both eSewa and Khalti confirm payment via a server-to-server verification call — never trust the browser redirect alone. `payment_service.py` calls the gateway's verification endpoint with the transaction ID before flipping `payment.status` to `paid`. This is the one place fraud actually happens if skipped.

---

## 7. Infrastructure and deployment

```
Frontend  → Vercel (auto-deploy on push to main, preview deploys per PR)
Backend   → Railway / small VPS running Docker (FastAPI + Uvicorn behind Nginx or Caddy)
Database  → MongoDB Atlas (M0/M2 tier to start, upgrade when order volume grows)
Images    → Cloudinary (free tier covers early volume)
Env/secrets → .env per environment, never committed; Railway/Vercel secret managers in prod
```

**CI/CD:** GitHub Actions — lint + type-check + tests on PR, deploy on merge to `main`. Keep it to two environments (staging, production) until there's a real reason for more.

---

## 8. Security checklist

- Passwords hashed with bcrypt/argon2, never stored plain
- JWT access tokens short-lived (15 min), refresh tokens longer-lived and rotated
- Payment webhook/callback endpoints verify gateway signatures server-side, not just trust query params
- Rate-limit `/auth/login` and `/payments/*` to blunt brute-force and replay attempts
- CORS locked to the actual frontend origin, not `*`
- All admin routes check role from the JWT claim, re-verified server-side on every request — never trust a frontend-only role check

---

## 9. What to build first (sequencing)

1. Product catalog + homepage (read-only, no auth) — gets something live fast
2. Auth + cart + checkout without payment (order status `placed`, manual confirmation)
3. eSewa/Khalti integration — the highest-risk piece, build and test in sandbox early
4. Admin panel for order/product management
5. SMS notifications on status change
6. Delivery slot logic and same-day cutoff rules

This order gets a demoable product in front of people before the payment integration — usually the slowest part to get right with a new gateway — is even started.
