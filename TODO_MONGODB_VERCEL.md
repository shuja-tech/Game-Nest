# Vercel notes (important for this stack)

- Flask sessions require `SESSION_SECRET`.
- Ensure the app runs with HTTPS on Vercel (cookies).
- MongoDB connection string must be Atlas (recommended for Vercel).
- Environment variables are set in Vercel dashboard (Project Settings → Environment Variables).

Checklist:
- [ ] Atlas cluster created
- [ ] Vercel env vars set: `MONGODB_URI`, `MONGODB_DB`, `SESSION_SECRET`
- [ ] Test signup/login from a different device/browser
- [ ] Test favourites flow from logged-out vs logged-in

