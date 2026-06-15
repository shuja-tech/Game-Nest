# 🎮 Game Nest

A Flask-based web gaming portal with multiple built-in games, user authentication, and per-user game tracking (favorites + recently played + play counts).

Repository: https://github.com/shuja-tech/Game-Nest.git

---

## ✨ Features

### ✅ Authentication (Flask sessions)
- `/login` and `/signup` pages
- Passwords are hashed using `bcrypt`
- Session-based auth (`user_id` stored in Flask session)

### ✅ Personalized gameplay tracking
Server records gameplay per logged-in user:
- Total plays per game route
- `recently_played` list (top 6 unique routes)

APIs:
- `POST /api/games/played` — record a game play and return updated recent list
- `GET /api/games/recent` — fetch recent games with titles
- `GET /api/games/stats` — fetch top games by total plays

### ✅ Favorites system
- `GET /api/favourites` — returns favorited routes for the current user
- `POST /api/favourites/toggle` — toggles favorites per route

### ✅ Admin page
- `/admin` is protected server-side
- Admin access is restricted in backend by checking the logged-in user (username must match `Shuja`)

Admin APIs:
- `GET /api/admin/users`
- `PATCH /api/admin/users`
- `DELETE /api/admin/users`

---

## 🗄 Backend data store

This project uses **MongoDB** as the database.

Collections used by the Flask app:
- `users` (username + password hash + optional role fields)
- `favourites` (one document per user+route)
- `game_activity` (one document per user with `games` and `recently_played`)

Indexes created at runtime:
- Unique index on `users.username`
- Unique index on `favourites(user_id, route)`
- Unique index on `game_activity(user_id)`

---

## 🧠 Frontend

Games are served as Jinja templates under `templates/` and are styled with CSS under `static/style/`.

Each game route in `main.py`:
1. Calls `_record_game_play_for_request(<route>)`
2. Renders the corresponding HTML template

Game play tracking is also supported via APIs used by frontend JS (example: `static/java/game-play-tracker.js`).

---

## 🧰 Project structure

```
. (repo root)
├── main.py
├── requirements.txt
├── templates/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── admin.html
│   ├── user.html
│   └── *.html (each game page)
└── static/
    ├── java/   (*.js game logic + app logic)
    └── style/  (*.css)
```

---

## 🚀 Setup & Local development

### 1) Install Python dependencies
```bash
pip install -r requirements.txt
```

### 2) Configure MongoDB
Set environment variables (optional, defaults exist):
- `MONGODB_URI` (default: `mongodb://localhost:27017`)
- `MONGODB_DB` (default: `gamenest`)

Optional:
- `SESSION_SECRET` (default: `dev-secret-change-me`)

### 3) Run the server
```bash
python main.py
```

Then open:
- http://localhost:5000

---

## 🧪 API quick reference

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Games
- `POST /api/games/played`
- `GET /api/games/recent`
- `GET /api/games/stats`

### Favorites
- `GET /api/favourites`
- `POST /api/favourites/toggle`

### Admin
- `GET/PATCH/DELETE /api/admin/users`

---

## 📝 Notes / Roadmap
- Track additional game routes if you add new games.
- Consider moving admin authorization logic from “username == Shuja” to role/claims in `users`.
- Improve merge/consistency between different front-end trackers and server recording (some games record on route-load, others call APIs).

---

## 📜 License
MIT

