# Deploy to Render Web Service

This app is configured to run as a single Render **Web Service**:

- React app is built from `frontend`
- Node + Socket.IO server runs from `server`
- Node server serves `frontend/build` + SPA fallback

## Option A (recommended): Manual Web Service deploy

1. Push this repo to GitHub.
2. In Render, click **New** -> **Web Service**.
3. Connect this repository.
4. Use these service settings:
   - Runtime: `Node`
   - Root Directory: `.`
   - Build Command: `cd frontend && npm install && npm run build && cd ../server && npm install`
   - Start Command: `cd server && npm start`
   - Health Check Path: `/health`
5. In the service env vars, set these secrets:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`
   - `REACT_APP_FIREBASE_MEASUREMENT_ID` (optional if unused)
   - `NODE_VERSION=20`
   - `NODE_ENV=production`

## Option B: Blueprint deploy (optional)

If you later prefer Blueprint, this repo includes `render.yaml` with the same commands.

## Verify after deploy

- Open `https://<your-render-host>/health` and confirm: `{"ok":true}`
- Open your site root URL and test PvP create/join flow (WebSocket upgrade)

## Successful deploy checklist

- Build logs show both frontend build and server install completed.
- Service shows **Live** status (not Deploy Failed / Crashed).
- Health check path is `/health` and returns `200`.
- Browser loads app from your Render URL with no blank page.
- PvP host/join works in two separate browsers/devices.

## If deploy fails

- If build fails with missing Firebase values, confirm all `REACT_APP_FIREBASE_*` env vars are set in Render.
- If service fails to boot, confirm Start Command is `cd server && npm start`.
- If health check fails, confirm Health Check Path is exactly `/health`.
- After changing env vars, trigger **Manual Deploy -> Deploy latest commit**.

## Notes

- WebSockets and HTTP are served from the same Render URL.
- No separate static site is required for this architecture.
