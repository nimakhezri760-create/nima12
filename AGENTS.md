# Earthed (Base44 sandbox notes)

- One-page electrician site, plain HTML/CSS/JS in `site/` — no framework, no build step. All copy/data lives in `site/assets/data.js` (BUSINESS, STORE.requestUrl, SERVICES, CIRCUITS, ROOM_CIRCUITS, STEPS, TESTS, AREAS); cable runs live in `site/assets/geometry.js`.
- Run: `docker compose -f docker-compose.base44.yml up -d` (node:22-alpine serving `site/` via `site/server.mjs` on port 3000, no-store caching so edits show on refresh). `npm run dev` inside `site/` does the same locally.
- Page is Persian RTL (`dir="rtl"`, Vazirmatn via Google Fonts with Tahoma fallback). Verifying: the master switch auto-flips ~1.4s after load and rooms light one by one (~4s total); `prefers-reduced-motion` lights the house instantly.
- Form submit honestly reports "not sent" until `STORE.requestUrl` is set — it is a placeholder, like the business name/phone/email in data.js.
