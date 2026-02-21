# Bible TimeLine

Bible TimeLine is a React + Node.js app with real-time PvP gameplay using Socket.IO.

## Quick Deploy to Render Web Service

1. Push this repository to GitHub.
2. In Render, click **New -> Web Service**.
3. Connect this repository.
4. Use these service settings:
   - Runtime: `Node`
   - Root Directory: `.`
   - Build Command: `cd frontend && npm install && npm run build && cd ../server && npm install`
   - Start Command: `cd server && npm start`
   - Health Check Path: `/health`
5. In Render service settings, set these environment variables:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`
   - `REACT_APP_FIREBASE_MEASUREMENT_ID` (optional)
6. Wait for deployment to finish, then open `/health` on your Render URL.

Expected health response:

```json
{"ok":true}
```

For full details and optional Blueprint fallback, see [DEPLOY_RENDER.md](./DEPLOY_RENDER.md).
