# Rose Uju storefront

React 19 + Vite storefront for Rose Uju. It talks to the Rose Uju API (FastAPI) for the catalogue, accounts, orders, reviews and admin.

## Run locally

```
cp .env.example .env
npm install
npm run dev
```

`VITE_API_URL` must point at the running API (default `http://localhost:8000`). The API's `FRONTEND_URL` and `CORS_ORIGINS` must include this app's origin (default `http://localhost:5173`).

## Scripts

- `npm run dev` starts the dev server
- `npm run build` creates the production build in `dist`
- `npm run lint` runs Oxlint

## Pages

Home, Shop, Product, Collections, Customise, Cart, Checkout (hands off to Stripe), Order confirmation, Journal, Journal article, About, Account, Reset password and Admin.

## Deploy (Vercel)

Set `VITE_API_URL` to the deployed API URL. `vercel.json` rewrites every path to `index.html` so deep links such as `/order/RU-ABC123` and the Stripe return URL work.

## Admin

Sign in with an admin account at `/account`, then open Admin. Manage products, journal articles, orders (status and refunds), comments and reviews.
