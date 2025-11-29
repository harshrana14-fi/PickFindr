# PicFindr (MERN) – OAuth + Unsplash Image Search

A full‑stack MERN application with OAuth (Google, GitHub), persistent sessions, and Unsplash search with a modern UI. Includes top searches banner, trending images, searchable results with multi‑select and download, and personal search history.

## Features
- OAuth login (Google, GitHub) with Passport.js
- Persistent login via `express-session` + `connect-mongo` (30‑day TTL)
- Top 5 most frequent search terms banner (with thumbnails)
- Beautiful homepage with suggestions and trending images
- Image search powered by Unsplash API
- Multi‑select overlay + download button per image
- Personal search history page with modern card UI

## Tech Stack
- Server: Node.js, Express.js, Passport.js, MongoDB, connect‑mongo, express‑session
- Client: React + Vite + TypeScript, Axios
- Images: Unsplash API

## Monorepo Structure
```
./
├─ client/                 # React frontend (Vite)
│  ├─ src/
│  │  ├─ pages/            # SearchPage, HistoryPage
│  │  ├─ components/       # TopBanner, ProtectedRoute
│  │  ├─ context/          # AuthContext
│  │  ├─ api.ts            # Axios instance + types
│  │  └─ style.css         # App styles
│  └─ index.html, main.tsx, App.tsx, ...
│
└─ server/                 # Express backend
   ├─ src/
   │  ├─ config/           # db.js, passport.js, session.js
   │  ├─ middleware/       # auth.js
   │  ├─ models/           # User.js, Search.js
   │  ├─ routes/           # auth.js, index.js, search.js
   │  └─ index.js          # App bootstrap
   └─ package.json, ...
```

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Unsplash developer account + Access Key
- OAuth apps for Google, GitHub (optional to start; you can enable any subset)



## OAuth App Configuration
Configure any of the providers you wish to support:

- Google
  - Authorized JavaScript origins: `http://localhost:5173`
  - Authorized redirect URIs: `http://localhost:4000/auth/google/callback`
- GitHub
  - Homepage URL: `http://localhost:5173`
  - Authorization callback URL: `http://localhost:4000/auth/github/callback`

Ensure the client IDs and secrets are placed in `server/.env`.

## Local Development

1) Install dependencies
```
# from repo root
cd server && npm install
cd ../client && npm install
```

2) Setup env files
```
# server
cp server/.env.example server/.env  # or create from the block above and fill values
# client
# create client/.env with VITE_SERVER_ORIGIN=http://localhost:4000
```

3) Run the server
```
cd server
npm run dev
# server on http://localhost:4000
```

4) Run the client
```
cd client
npm run dev
# open the shown Vite URL (default http://localhost:5173)
```

## API Endpoints (Server)
Base URL: `${PORT || 4000}/api`

- GET `/api/top-searches`
  - Returns top 5 frequent search terms and up to 3 thumbnails per term.

- POST `/api/search`
  - Body: `{ "term": "Nature" }`
  - Performs an Unsplash search, stores history for the authenticated user.

- GET `/api/history`
  - Returns the authenticated user’s search history.

- GET `/api/popular-images`
  - Returns trending/popular images from Unsplash.

- Auth routes (examples)
  - GET `/auth/google` → redirect to Google
  - GET `/auth/github` → redirect to GitHub
  - GET `/auth/logout` → logs out, destroys session, clears cookie

### cURL Examples
```
# Top searches
curl -X GET http://localhost:4000/api/top-searches -H "Content-Type: application/json" -c cookies.txt -b cookies.txt

# Search (requires session cookie)
curl -X POST http://localhost:4000/api/search \
  -H "Content-Type: application/json" \
  -d '{"term":"Nature"}' \
  -c cookies.txt -b cookies.txt

# History (requires session cookie)
curl -X GET http://localhost:4000/api/history -H "Content-Type: application/json" -c cookies.txt -b cookies.txt

# Popular images
curl -X GET http://localhost:4000/api/popular-images -H "Content-Type: application/json"
```
Tip: After logging in via the browser, export cookies (or use `-c/-b` with curl in the same shell) to hit authenticated endpoints.

## Folder Structure Explained
- `server/src/config/db.js`: Mongo connection
- `server/src/config/session.js`: `express-session` + `connect-mongo` with 30‑day TTL and cookie name `picfindr.sid`
- `server/src/config/passport.js`: OAuth strategies (Google/GitHub) with serialize/deserialize
- `server/src/routes/search.js`: `/api/search`, `/api/top-searches`, `/api/popular-images`, `/api/history`
- `server/src/routes/auth.js`: OAuth entry points and `/logout`
- `client/src/context/AuthContext.tsx`: Auth state, auto-refresh on focus/visibility
- `client/src/pages/SearchPage.tsx`: Hero, search, suggestions, results grid, select/download buttons, trending
- `client/src/pages/HistoryPage.tsx`: Modern card layout with relative dates, click to re-search
- `client/src/components/TopBanner.tsx`: Top searches banner with thumbnails

## Visual Proof
Add screenshots/GIFs to `docs/` and update the links below (or keep the placeholders):

- Home Page :
  <img width="1439" height="908" alt="image" src="https://github.com/user-attachments/assets/0977cec2-310f-4d90-8210-13d7728754d9" />

- OAuth login:
 <img width="1579" height="966" alt="image" src="https://github.com/user-attachments/assets/ffaf9afb-4d92-4ebc-b060-af23d8a52f48" />

- Top Searches banner:
  <img width="1405" height="913" alt="image" src="https://github.com/user-attachments/assets/40703924-6755-4abb-9e5d-b1ca13bae784" />

- Search results + multi-select:
  <img width="1410" height="914" alt="image" src="https://github.com/user-attachments/assets/979fab94-1a52-45b9-813d-8ce2674dc8ec" />

- Search history section:
  <img width="1411" height="912" alt="image" src="https://github.com/user-attachments/assets/dcbae5e9-cdc5-462d-ac83-a4d64c87ffb2" />


## Notes
- Sessions are persistent (30 days). Cookie name: `picfindr.sid`.
- Logout destroys the session and clears the cookie, then redirects to `CLIENT_ORIGIN`.
- If Unsplash Access Key is not set, the app will gracefully return empty images for top searches and trending endpoints.
- Ensure `CLIENT_ORIGIN` in the server matches your running client URL for correct CORS and redirects.


