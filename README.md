# Gym Storefront (gym-front-end)

Customer-facing e-commerce storefront for a gym/supplements brand. Part of the gym e-commerce platform alongside [gym-back](../gym-back) (API) and [gym-admin](../gym-admin) (admin dashboard).

The UI uses the **Crimson Forge** theme with dynamic branding loaded from backend site settings.

---

## Features

- **Homepage** — hero banners, category showcase, featured products, benefits, social proof
- **Catalog** — browse, search, filter, and sort products
- **Product detail** — gallery, variants, reviews, add to cart / wishlist
- **Categories & brands** — filtered product listings by slug
- **Cart & checkout** — cart drawer, full cart page, shipping/payment selection, coupons, place order
- **Wishlist** — save and merge items across sessions
- **Auth & account** — login, register, profile, addresses, order history, returns, reviews
- **Contact** — public contact form

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, shadcn/ui, `@base-ui/react` |
| Data fetching | TanStack React Query 5, axios |
| Forms | react-hook-form, zod |
| State | Zustand (cart drawer, site settings) |
| Animation | Motion, Lenis smooth scroll |
| Icons / toasts | lucide-react, sonner |

---

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/)
- [gym-back](../gym-back) running locally (PostgreSQL, Cloudinary, env configured)

---

## Local development

Recommended port layout when running the full platform:

| Service | URL |
|---------|-----|
| Backend API | `http://localhost:4000/api/v1` |
| Storefront (this repo) | `http://localhost:3000` |
| Admin dashboard | `http://localhost:5173` |

**Setup:**

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

**Production build:**

```bash
pnpm build
pnpm start
```

---

## Environment variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:4000/api/v1` |

Copy `.env.example` to `.env.local` and adjust if your backend runs on a different host or port.

---

## Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve production build |
| `lint` | `eslint` | Lint |
| `stitch:fetch-product-list` | `node scripts/fetch-stitch-screen.mjs` | Fetch Stitch design screen |

---

## Project structure

```
app/                    # Next.js App Router pages and layouts
components/
├── ui/                 # shadcn primitives
├── layout/             # SiteHeader, SiteFooter, SiteShell
├── home/               # Homepage sections
├── products/           # Catalog, PDP, filters
└── cart/               # Cart drawer
hooks/
├── api/storefront/     # React Query hooks per API domain
└── use-filter-params.ts
lib/                    # api-client, api wrapper, utils
stores/                 # Zustand stores
types/                  # API and domain types
config/                 # Env-based config
public/                 # Static assets
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/products` | Product catalog with filters |
| `/products/[slug]` | Product detail |
| `/categories/[slug]` | Category-filtered products |
| `/brands/[slug]` | Brand-filtered products |
| `/cart` | Full cart page |
| `/checkout` | Checkout flow |
| `/wishlist` | Wishlist |
| `/login`, `/register` | Authentication |
| `/contact` | Contact form |
| `/account` | Account overview (auth required) |
| `/account/profile` | Edit profile and password |
| `/account/addresses` | Manage addresses |
| `/account/orders` | Order history |
| `/account/orders/[orderId]` | Order detail, reviews, returns |

Account routes redirect unauthenticated users to `/login?redirect=...` via `app/account/layout.tsx`.

---

## API integration

The browser calls [gym-back](../gym-back) directly — there are no Next.js API routes or BFF layer.

- **Client:** `lib/api-client.ts` — axios with `withCredentials: true`, CSRF header on mutations
- **Hooks:** `hooks/api/storefront/*` — React Query wrappers
- **Response shape:** `{ success, message, data }` unwrapped by `lib/api.ts`

### Public endpoints (`/public/*`)

Site settings, banners, collections, categories, brands, products, reviews, contact form.

### Authenticated endpoints (`/user/*`)

Auth, cart, wishlist, checkout, addresses, orders, returns, reviews.

See [gym-back/docs/storefront-api-paths.md](../gym-back/docs/storefront-api-paths.md) for detailed API reference.
