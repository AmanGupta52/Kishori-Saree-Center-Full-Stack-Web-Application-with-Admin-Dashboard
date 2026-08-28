# Kishori Saree Center — Admin Panel

React + Vite + Tailwind, talking to the backend API via HTTP-only cookie auth.

## Setup

```bash
cd frontend-admin
npm install
cp .env.example .env
# set VITE_API_URL to your backend's /api URL
npm run dev
```

Runs on **http://localhost:5174** by default. Make sure the backend's
`CLIENT_ORIGINS` env var includes this origin so the auth cookie is accepted.

## What's built

- **Design system**: ivory/wine/zari-gold palette themed around saree textiles
  (see `tailwind.config.js`), Fraunces for headings + Inter for UI, and a
  signature repeating zari-border strip (`.zari-border` in `index.css`) used
  as a hairline accent instead of generic flat dashboard blocks.
- **Auth**: `src/context/AuthContext.jsx` + `src/components/layout/ProtectedRoute.jsx`
  — session comes from the `/auth/me` cookie check, no tokens in localStorage.
- **Add Saree form** (`src/components/saree/SareeForm.jsx`): every field from
  the spec (name, category, subcategory, fabric, colors/occasions as chip
  multi-selects, pattern, work, lengths, descriptions, pricing with a live
  discount → selling price preview, stock, SKU, featured/new/best-seller
  flags, status) plus the **image uploader**.
- **Image uploader** (`src/components/saree/ImageUploader.jsx`): drag-and-drop
  or click to pick up to 8 images, live previews, pick-a-main-image control,
  per-file remove, and an overall upload progress bar wired to the form's
  `axios` `onUploadProgress`. Files stay as in-memory `File` objects and are
  only sent to the backend (which streams them to Cloudinary) on submit.
- **All Sarees** list: search, status filter, duplicate, delete (which also
  purges that saree's Cloudinary images via the backend).
- **Dashboard**: stat cards pulling from `GET /admin/dashboard`.

## What's stubbed / next to build

The sidebar links to Categories, Colors, Fabrics, Occasions, Featured/New
Arrivals/Best Sellers views, Discounts, Enquiries, Feedback moderation, and
Settings — the backend routes for all of these already exist
(`/api/admin/...`). Each follows the same pattern as `AllSarees.jsx`
(list + search) and `SareeForm.jsx` (create/edit form), so they're a
straightforward next pass once you're happy with this direction. Let me know
which to build next.
