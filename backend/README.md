# Kishori Saree Center — Backend API

Node.js + Express + MongoDB (Mongoose) + Cloudinary.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, and Cloudinary credentials in .env
npm run dev
```

## Creating your first admin

There's no public signup — the **first** admin is created via a one-time bootstrap route
that automatically disables itself once an admin exists:

```bash
curl -X POST http://localhost:5000/api/auth/bootstrap \
  -H "Content-Type: application/json" \
  -d '{"name":"Owner","email":"admin@kishorisaree.com","password":"changeme123"}'
```

After that, log in normally at `POST /api/auth/login` — subsequent calls to `/bootstrap`
will return a 403.

## Route map

### Public (`/api/...`)
| Method | Route | Description |
|---|---|---|
| GET | `/sarees` | List sarees — search, filters (`category`, `color`, `fabric`, `occasion`, `minPrice`, `maxPrice`, `minDiscount`), sort, pagination |
| GET | `/sarees/:slug` | Saree detail (increments view count) |
| GET | `/sarees/:slug/related` | Rule-based related/recommended sarees |
| GET | `/sarees/:sareeId/feedback` | Approved feedback for a saree |
| POST | `/sarees/:sareeId/feedback` | Submit feedback (goes to "pending") — multipart, field `photo` optional |
| GET | `/categories` \| `/colors` \| `/fabrics` \| `/occasions` | Taxonomy lists |
| POST | `/enquiries` | Submit an enquiry |
| POST | `/auth/login` | Admin login |

### Admin (`/api/admin/...`, all require the admin cookie)
| Method | Route | Description |
|---|---|---|
| GET | `/sarees` | All sarees (any status), search + pagination |
| POST | `/sarees` | Create saree — multipart, field `images` (up to 8 files) |
| PUT | `/sarees/:id` | Update saree fields (price/discount auto-recalculates) |
| DELETE | `/sarees/:id` | Delete saree + all its Cloudinary images |
| POST | `/sarees/:id/duplicate` | Duplicate a saree |
| POST | `/sarees/:id/images` | Add more images to a saree |
| DELETE | `/sarees/:id/images/:publicId` | Delete one image (Cloudinary + Mongo) |
| PUT | `/sarees/:id/images/:publicId` | Replace one image — multipart, field `image` |
| PUT | `/sarees/:id/images/:publicId/main` | Set an image as the main/cover image |
| POST | `/sarees/preview-price` | Live discount → selling price preview |
| CRUD | `/categories`, `/colors`, `/fabrics`, `/occasions` | Taxonomy management |
| GET/PUT/DELETE | `/feedback` | Moderate customer feedback (approve/reject/delete) |
| GET/PUT/DELETE | `/enquiries` | Manage customer enquiries |
| POST/DELETE | `/upload` | Generic Cloudinary upload/delete (banners etc.) |
| GET | `/dashboard` | Stats: total sarees, categories, enquiries, stock, feedback, views |

## Notes

- **Images never touch MongoDB or disk** — `multer` keeps uploads in memory, then
  `src/utils/cloudinaryUpload.js` streams them straight to Cloudinary and only the
  returned `url` + `publicId` are saved on the document.
- **Discount math** happens in a Mongoose `pre('save')` hook on `Saree` (see
  `src/models/Saree.js`), so `sellingPrice` and `discountAmount` are always derived —
  never manually set them from the client.
- Cloudinary `fetch_format: auto, quality: auto` is applied on upload, which is what
  delivers WebP/AVIF automatically to browsers that support it.
- Auth uses an HTTP-only cookie (`kishori_admin_token`) rather than a token in
  `localStorage`, to reduce XSS risk. `CLIENT_ORIGINS` in `.env` must exactly match
  your frontend's origin for cookies to work cross-origin (`credentials: true` is set
  on both CORS config and expected on the frontend's axios/fetch calls).
