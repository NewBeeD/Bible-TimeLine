# Deploy to Render

## 1) Push current branch to GitHub

Render deploys from your GitHub repo, so first push your latest code.

## 2) Create services from blueprint

1. Open Render Dashboard
2. Click **New** -> **Blueprint**
3. Select this repository
4. Render will read `render.yaml` and propose:
   - `bible-timeline-pvp-server` (Node web service)
   - `bible-timeline-frontend` (Static site)

## 3) Set environment variables

In the **frontend static service**, set:

- `REACT_APP_PVP_SERVER_URL` = your backend service URL (e.g. `https://bible-timeline-pvp-server.onrender.com`)
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_FIREBASE_MEASUREMENT_ID`

## 4) Verify backend health

After deploy, verify:

- `https://<your-backend-host>/health`

Should return JSON with `ok: true`.

## 5) Rebuild frontend after backend URL changes

If backend URL changes, update `REACT_APP_PVP_SERVER_URL` in Render and trigger a frontend redeploy.

## Notes

- Frontend SPA routing is handled by `frontend/public/_redirects`.
- WebSockets are supported on Render web services.
