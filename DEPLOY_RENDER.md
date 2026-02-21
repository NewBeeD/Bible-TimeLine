# Deploy to Render (Manual Web Service)

## 1) Push current branch to GitHub

Render deploys from your GitHub repo, so first push your latest code.

## 2) Create a Web Service (not Blueprint)

1. Open Render Dashboard.
2. Click New -> Web Service.
3. Connect this repository.
4. Use these settings:
   - Name: bible-timeline
   - Runtime: Node
   - Root Directory: .
   - Build Command: npm install --prefix frontend && npm install --prefix server && npm run build --prefix frontend
   - Start Command: npm start --prefix server

## 3) Set environment variables

In the bible-timeline web service, set:

- NODE_VERSION = 20
- NODE_ENV = production
- REACT_APP_FIREBASE_API_KEY
- REACT_APP_FIREBASE_AUTH_DOMAIN
- REACT_APP_FIREBASE_PROJECT_ID
- REACT_APP_FIREBASE_STORAGE_BUCKET
- REACT_APP_FIREBASE_MESSAGING_SENDER_ID
- REACT_APP_FIREBASE_APP_ID
- REACT_APP_FIREBASE_MEASUREMENT_ID

## 4) Health check

In Render service settings, set Health Check Path to:

- /health

After deploy, verify:

- https://<your-render-host>/health

Expected response: {"ok":true}

## Notes

- Frontend build output is served by the Node server from frontend/build.
- SPA routing fallback is handled by the Node server (unknown routes return index.html).
- WebSockets and HTTP are served from the same Render URL.
