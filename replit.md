# Kalapi Restaurant Platform

## Overview

Premium full-stack restaurant web application for **Kalapi Restaurant** — a luxury vegetarian multi-cuisine fine dining restaurant in Ahmedabad. Built as a Swiggy/Zomato-level platform.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS (dark luxury theme, glassmorphism)
- **Backend**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: Zod, drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **Animations**: Framer Motion
- **Charts**: Recharts

## Structure

```text
artifacts/
├── api-server/         # Express API server (port 8080, path: /api)
│   └── src/
│       ├── routes/     # auth, menu, cart, orders, user, contact
│       ├── middlewares/# auth middleware (requireAuth, requireAdmin)
│       └── lib/        # jwt utilities
├── kalapi-restaurant/  # React frontend (port 19814, path: /)
│   ├── src/
│   │   ├── pages/      # Home, Menu, Cart, Checkout, OrderSuccess, About, Contact, Login, Signup, Dashboard, Admin
│   │   ├── components/ # Layout, Navbar, MenuItemCard
│   │   └── lib/        # auth context
│   └── public/images/  # AI-generated dish/hero images
lib/
├── api-spec/           # OpenAPI spec + Orval codegen config
├── api-client-react/   # Generated React Query hooks
├── api-zod/            # Generated Zod schemas
└── db/                 # Drizzle ORM schema + DB connection
    └── src/schema/     # users, menu, orders, cart, wishlist, addresses, contacts
scripts/
└── src/seed.ts         # Database seeder (admin + 24 menu items)
```

## Pages

1. **Home** `/` — Hero, featured dishes carousel, reviews (4.3⭐), popular times graph, CTAs
2. **Menu** `/menu` — Dynamic menu with category filters + search, veg badges, add to cart, favorites
3. **Cart** `/cart` — Quantity controls, remove items, subtotal, coupon
4. **Checkout** `/checkout` — Delivery form, coupon input, place order
5. **Order Success** `/order-success/:id` — Order confirmation + mock payment
6. **About** `/about` — Restaurant story, values, ambiance
7. **Contact** `/contact` — Map, call, contact form, opening hours, book table
8. **Login** `/login` — JWT auth
9. **Signup** `/signup` — User registration
10. **Dashboard** `/dashboard` — Orders, wishlist, addresses, profile
11. **Admin** `/admin` — Menu management, order status, user list

## Database Schema

- **users** — id, name, email, password (bcrypt), phone, role (user|admin)
- **menu_items** — id, name, description, price, category, image, isVeg, isAvailable, isFeatured, rating
- **orders** — id, userId, total, status (pending|preparing|out_for_delivery|delivered|cancelled), paymentStatus, paymentId, deliveryName/Phone/Address, coupon, discount
- **order_items** — id, orderId, menuItemId, quantity, price
- **cart_items** — id, userId, menuItemId, quantity
- **wishlist** — id, userId, menuItemId
- **addresses** — id, userId, label, street, city, pincode, isDefault
- **contacts** — id, name, email, phone, message, bookingDate

## API Routes

- `POST /api/auth/signup` — Register
- `POST /api/auth/login` — Login (returns JWT)
- `GET /api/menu` — Get menu (optional ?category= ?search=)
- `POST/PUT/DELETE /api/menu/:id` — Admin: manage menu
- `GET/POST/PUT/DELETE /api/cart` — Cart management
- `POST /api/orders` — Place order (clears cart)
- `GET /api/orders` — User order history
- `POST /api/orders/:id/pay` — Mock payment
- `GET /api/admin/orders` — All orders (admin)
- `PUT /api/admin/orders/:id/status` — Update order status (admin)
- `GET /api/admin/users` — All users (admin)
- `GET/PUT /api/user/profile` — Profile
- `GET/POST /api/user/wishlist` — Toggle wishlist
- `GET/POST/DELETE /api/user/addresses` — Addresses
- `POST /api/contact` — Contact form

## Admin Access

- **Email**: admin@kalapi.com
- **Password**: admin123

## Coupons

- `KALAPI10` — ₹10 off
- `VEGFEST20` — ₹20 off
- `FIRST50` — ₹50 off

## Seeding

```bash
pnpm --filter @workspace/scripts run seed
```

## Development

```bash
pnpm --filter @workspace/api-server run dev     # API server
pnpm --filter @workspace/kalapi-restaurant run dev  # Frontend
```

## API Codegen

```bash
pnpm --filter @workspace/api-spec run codegen
```
