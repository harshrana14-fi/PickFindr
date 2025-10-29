MERN OAuth Unsplash Search

Quick start

1) Server setup
- Copy `server/.env.example` to `server/.env` and fill values.
- Run MongoDB locally or provide a cloud URI.
- From `server/`: `npm run dev`

2) Client setup
- From `client/`: create `.env` with `VITE_SERVER_ORIGIN=http://localhost:4000`
- `npm run dev` and open shown URL.

OAuth
- Set `CLIENT_ORIGIN` to the Vite dev URL (default http://localhost:5173).
- Set `OAUTH_CALLBACK_BASE` to your server origin (default http://localhost:4000).
- Configure Google, GitHub, Facebook apps and paste client IDs and secrets.

APIs
- GET `/api/top-searches`
- POST `/api/search` { term }
- GET `/api/history`


