# MongoDB setup for this project (local + Vercel)

## 1) Required environment variables
The backend reads:
- `MONGODB_URI` (string)
- `MONGODB_DB` (string)
- optional: `SESSION_SECRET` (string)

Example values:
- `MONGODB_URI`: `mongodb://localhost:27017` (local)
- `MONGODB_DB`: `gamenest`

Collections (`users`, `favourites`) are created automatically by the app after signup/favourite.

---

## 2) Local development (Windows PowerShell)
In the same terminal you use to run the app:

```powershell
$env:MONGODB_URI="mongodb://localhost:27017"
$env:MONGODB_DB="gamenest"
$env:SESSION_SECRET="change-me-please-123"

python main.py
```

---

## 3) MongoDB Compass
Create DB name `gamenest` (collections are optional). The app will create:
- `users`
- `favourites`
when you sign up / favourite games.

---

## 4) Deploying to Vercel
### Step A: Create a MongoDB Atlas cluster
1. Create Atlas account
2. Create Cluster
3. Create Database User
4. Get connection string in Atlas format (example):
   - `mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority`

### Step B: Add environment variables in Vercel
In Vercel project settings:
- `MONGODB_URI` = your Atlas connection string
- `MONGODB_DB` = `gamenest`
- `SESSION_SECRET` = random long string

### Step C: Ensure cookies work
This app uses Flask server-side sessions stored in the cookie. For Vercel, ensure you have:
- correct domain
- HTTPS enabled (Vercel provides this)

---

## 5) Quick smoke test
1. Deploy/run
2. Visit `/signup`
3. Create account
4. Visit `/login`
5. Login and verify `/api/favourites` returns `401` when logged out and `200` when logged in.

