Bloom & Bow
Hand-tied bouquets and pocket-sized gifts, delivered the same day across the Kathmandu valley.

A full-stack e-commerce website for a flower and gift delivery business based in Kathmandu, Nepal. Built with Next.js 16, TypeScript, Tailwind CSS 4, Prisma (SQLite), and shadcn/ui.

Features
Customer-Facing Store
Homepage — Hero section, how-it-works steps, dynamic category filtering, occasion-based browsing, product grid, story section, delivery areas, contact form, careers page, newsletter signup
Product Browsing — Filter by category (dynamic from database) and occasion (Birthday, Anniversary, Just Because, Thank You, Sorry, New Home)
Product Detail — Full product page with image, description, stock status, occasion tags, quantity selector, related products
Search — Live search dialog with instant results and click-to-navigate
Cart — Slide-out drawer with quantity controls, item removal, price totals
Build a Bouquet — Custom bouquet builder with stem picker, add-ons, and live price calculation
Checkout — Recipient details, delivery address, delivery slot (Same Day / Next Day / Scheduled), gift note, order summary, COD payment
Order Tracking — Track order by order number with status timeline
Admin Panel
Dashboard — Stats overview (total orders, revenue, pending orders, products, categories)
Products — Full CRUD with category/status/search filtering, image upload, occasion multi-select, badges, sort order
Categories — Full CRUD with active/inactive toggle and sort order
Orders — View all orders, filter by status, update order status (Placed → Preparing → Out for Delivery → Delivered / Cancelled), order detail dialog
Newsletter — View all subscriber emails, copy all emails
Tech Stack
Layer
Technology
Framework	Next.js 16 (App Router)
Language	TypeScript 5
Styling	Tailwind CSS 4
UI Components	shadcn/ui (New York style)
Icons	Lucide React
Database	SQLite via Prisma ORM
State Management	Zustand (cart), TanStack Query
Forms	React Hook Form + Zod
Animations	Framer Motion
Fonts	Fraunces, Karla, Space Mono (Google Fonts)
Package Manager	Bun
Notifications	Sonner (toast)

Project Structure
text

bloom-and-bow/
│   │   └── api/
│   │       ├── categories/
│   │       │   └── route.ts           # GET public categories
│   │       ├── products/
│   │       │   ├── route.ts           # GET products (filter by category/occasion/categoryId)
│   │       │   └── [id]/route.ts      # GET single product + related
│   │       ├── orders/
│   │       │   └── route.ts           # POST create order
│   │       ├── newsletter/
│   │       │   └── route.ts           # POST subscribe
│   │       └── admin/
│   │           ├── login/route.ts             # POST admin login
│   │           ├── logout/route.ts            # POST admin logout
│   │           ├── stats/route.ts             # GET dashboard stats
│   │           ├── upload/route.ts            # POST image upload
│   │           ├── categories/
│   │           │   ├── route.ts               # GET list + POST create
│   │           │   └── [id]/route.ts          # PATCH update + DELETE
│   │           ├── products/
│   │           │   ├── route.ts               # GET list + POST create
│   │           │   └── [id]/route.ts          # PATCH update + DELETE
│   │           ├── orders/
│   │           │   ├── route.ts               # GET list
│   │           │   └── [id]/route.ts          # PATCH update status
│   │           └── newsletter/
│   │               └── route.ts               # GET subscribers
│   ├── components/
│   │   ├── bloom/                 # Business components
│   │   │   ├── admin-panel.tsx    # Full admin overlay (5 tabs, ~2267 lines)
│   │   │   ├── navbar.tsx         # Sticky navigation bar
│   │   │   ├── hero.tsx           # Hero section with CTA
│   │   │   ├── vine-divider.tsx   # Animated SVG wave divider
│   │   │   ├── how-it-works.tsx   # 3-step delivery process
│   │   │   ├── occasions.tsx      # Occasion filter chips
│   │   │   ├── product-card.tsx   # Product card with image/SVG art
│   │   │   ├── product-grid.tsx   # Responsive product grid
│   │   │   ├── story-section.tsx  # Brand story section
│   │   │   ├── delivery-section.tsx # Delivery zones & info
│   │   │   ├── contact-section.tsx  # Contact form + info
│   │   │   ├── careers-section.tsx  # Job listings
│   │   │   ├── newsletter.tsx     # Newsletter signup
│   │   │   ├── footer.tsx         # Site footer with nav links
│   │   │   ├── cart-drawer.tsx    # Slide-out cart
│   │   │   ├── search-dialog.tsx  # Live search dialog
│   │   │   ├── build-bouquet-dialog.tsx # Custom bouquet builder
│   │   │   ├── track-order-dialog.tsx   # Order tracking
│   │   │   └── brand-mark.tsx     # SVG logo component
│   │   └── ui/                    # shadcn/ui components (40+)
│   ├── lib/
│   │   ├── db.ts                  # Prisma client singleton
│   │   ├── types.ts               # Shared TypeScript types
│   │   ├── admin-auth.ts          # Admin password + token logic
│   │   ├── admin-api.ts           # requireAdmin() middleware
│   │   └── utils.ts               # Utility functions (cn, etc.)
│   ├── store/
│   │   └── cart-store.ts          # Zustand cart with localStorage persist
│   └── hooks/
│       ├── use-mobile.ts          # Mobile breakpoint hook
│       └── use-toast.ts           # Toast hook
├── .env                          # Environment variables
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── package.json
Database Schema
The database has 5 models using Prisma with SQLite:

Model
Purpose
User	Customer accounts (name, phone, email, role)
Category	Product categories (name, slug, description, isActive, sortOrder)
Product	Products (title, description, price, imageUrl, stockStatus, occasions, badges, category relation)
Order	Orders (orderNumber, recipient info, delivery details, payment, status flow)
OrderItem	Line items within an order
Newsletter	Email subscribers

Price Storage: Prices are stored as integers in paisa (Nepali currency, 1 Rs = 100 paisa). Display conversion: price / 100 = Rs.

Order Status Flow: placed → preparing → out_for_delivery → delivered (any state → cancelled)

Setup & Installation
Prerequisites
Node.js v18 or newer — nodejs.org
Bun — run npm install -g bun
Steps
bash

# 1. Navigate to the project
cd bloom-and-bow

# 2. Install dependencies
bun install

# 3. Create .env file
Create a .env file in the project root:

env

DATABASE_URL=file:./db/custom.db
ADMIN_PASSWORD=bloom2024
bash

# 4. Push database schema
bun run db:push

# 5. (Optional) Seed sample products
bun run seed.ts

# 6. Start the development server
bun run dev
Open http://localhost:3000 in your browser.

Available Scripts
Command
Description
bun run dev	Start development server on port 3000
bun run build	Production build (standalone output)
bun run start	Start production server
bun run lint	Run ESLint
bun run db:push	Push Prisma schema to database
bun run db:generate	Regenerate Prisma client
bun run db:migrate	Run database migrations
bun run db:reset	Reset database (destroys all data)
bun run seed.ts	Seed 9 sample products

Admin Panel
Access the admin panel by clicking "Admin" in the footer.

Password: Configured via ADMIN_PASSWORD in .env (default: bloom2024)
Features: Dashboard, Products CRUD, Categories CRUD, Orders management, Newsletter subscribers
Image Upload: Supports JPG, PNG, WebP, GIF (max 5MB) — saved to public/uploads/
Design System
Fonts
Font
Usage
Fraunces	Headings, product titles, serif display
Karla	Body text, labels, UI elements
Space Mono	Prices, codes, badges, small caps

Colors
Token
Color
Usage
--paper	#F7F4EF	Page background
--ink	#1A1A1A	Primary text
--ink-soft	#6B6B6B	Secondary text
--berry	#B23A52	Accent (CTAs, highlights)
--berry-deep	#8A1E36	Darker accent (hover)
--sage	#5E7355	Success, nature elements
--butter	#EFB94A	Warnings, badges, warmth
--twine	#C4A868	Borders, subtle accents
--paper-warm	#F0EBE3	Card backgrounds, sections

Deployment
The project is configured with output: "standalone" in next.config.ts for optimized production builds.

Build for Production
bash

bun run build
bun run start
Environment Variables for Production
env

DATABASE_URL=file:./db/custom.db
ADMIN_PASSWORD=your-secure-password-here
Note: Change the admin password before deploying to production.

API Reference
Public Endpoints
Method
Endpoint
Description
GET	/api/products	List products (?category=flowers, ?occasion=birthday, ?categoryId=xxx)
GET	/api/products/[id]	Single product with related products
GET	/api/categories	List active categories
POST	/api/orders	Place a new order
POST	/api/newsletter	Subscribe to newsletter

Admin Endpoints
Method
Endpoint
Description
POST	/api/admin/login	Admin login (returns token)
POST	/api/admin/logout	Admin logout
GET	/api/admin/stats	Dashboard statistics
GET/POST	/api/admin/products	List/Create products
PATCH/DELETE	/api/admin/products/[id]	Update/Delete product
GET/POST	/api/admin/categories	List/Create categories
PATCH/DELETE	/api/admin/categories/[id]	Update/Delete category
GET	/api/admin/orders	List orders (?status=placed)
PATCH	/api/admin/orders/[id]	Update order status
POST	/api/admin/upload	Upload image (multipart)
GET	/api/admin/newsletter	List subscribers

License
Private project. All rights reserved.
