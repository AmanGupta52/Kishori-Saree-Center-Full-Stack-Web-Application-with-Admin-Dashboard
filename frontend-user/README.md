# Kishori Saree Center — Public Website

React + Vite + Tailwind. Talks to the same backend as the admin panel, but only
uses public (unauthenticated) endpoints plus the enquiry/feedback POST routes.

## Setup

```bash
cd frontend-user
npm install
cp .env.example .env
# set VITE_API_URL to your backend's /api URL
npm run dev
```

Runs on **http://localhost:5173** by default.

## Pages

| Route | Page |
|---|---|
| `/` | Home — hero, category rail, new arrivals, featured, best sellers, offers |
| `/sarees` | All Sarees — search, filters (category/color/fabric/occasion/price/discount), sort, pagination. Also handles `?search=`, `?featured=true`, `?newArrival=true`, `?bestSeller=true`, `?minDiscount=` from Home links |
| `/saree/:slug` | Saree detail — image gallery w/ zoom, full spec table, related sarees, customer feedback (list + submit form), enquiry form, WhatsApp button |
| `/categories` | All categories grid |
| `/category/:slug` | Sarees within one category |
| `/about` | About Us |
| `/contact` | Contact Us + general enquiry form |

## Key pieces

- **`src/utils/shopConfig.js`** — single place to edit shop name, phone,
  WhatsApp number, email, and address. Everything else (header, footer,
  WhatsApp button, contact page) reads from here.
- **`src/components/enquiry/WhatsAppButton.jsx`** — builds a `wa.me` link
  with a pre-filled message; when passed a `saree` prop it includes the
  saree's name, SKU, and price automatically.
- **`src/components/saree/FilterSidebar.jsx`** — all the filter groups from
  the spec (price ranges, color swatches, fabric, occasion, discount %),
  synced to the URL query string so filtered views are shareable/bookmarkable.
- **`src/components/saree/ImageGallery.jsx`** — thumbnail rail + main image +
  a full-screen zoom overlay.
- Feedback goes through the same pending → admin-approval flow as the
  backend: `FeedbackForm` submits, `FeedbackList` only ever shows what the
  admin panel has approved.
- 2-column product grid on mobile per the spec (`SareeGrid.jsx`), scaling up
  to 4 columns on desktop.

## Design system

Shares the same brand tokens as `frontend-admin` (ivory/wine/zari-gold,
Fraunces + Inter, the repeating zari-border accent strip) so the storefront
and admin panel read as one brand, just with a warmer, more editorial hero
section on the public side.
