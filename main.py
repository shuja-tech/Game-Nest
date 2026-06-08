import os
from flask import Flask, render_template, request, jsonify, session
import bcrypt
from pymongo import MongoClient, ASCENDING
from bson.objectid import ObjectId


def _get_env(name: str, default: str | None = None) -> str:
    val = os.environ.get(name)
    if val is None or str(val).strip() == "":
        if default is None:
            raise RuntimeError(f"Missing {name} env var")
        return default
    return val


# NOTE: file had duplicate imports / duplicate get_mongo().
# Keep a single, correct implementation below.

app = Flask(__name__)


# Session secret for Flask cookies
# In production, set SESSION_SECRET to a strong random value.
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-change-me")


def get_mongo():
    # Local fallback so the app works even if env vars are not injected.
    mongo_uri = os.environ.get("MONGODB_URI") or "mongodb://localhost:27017"
    mongo_db = os.environ.get("MONGODB_DB") or "gamenest"

    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=3000)
    # Force a server ping so signup/login fails with a clear DB error instead of later.
    client.admin.command("ping")
    return client[mongo_db]



def get_user_collection(db):
    return db["users"]


def get_favourites_collection(db):
    return db["favourites"]


def get_game_activity_collection(db):
    return db["game_activity"]


def get_current_user_doc(db):
    """Returns current user's document from `users` collection or None."""
    user_id = get_current_user_id()
    if not user_id:
        return None
    return get_user_collection(db).find_one({"_id": ObjectId(user_id)})


def is_admin_user(user_doc):
    if not user_doc:
        return False
    role = user_doc.get("role")
    if role is None:
        role = "admin" if user_doc.get("is_admin") else "user"
    return role == "admin"


def require_login_or_401():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    return None


def require_admin_or_403(user_doc):
    if not is_admin_user(user_doc):
        return jsonify({"error": "Forbidden"}), 403
    return None



@app.route('/')
def home():
    # Provide username to template if logged in.
    user_id = get_current_user_id()
    username = None
    if user_id:
        try:
            db = get_mongo()
            _ensure_indexes(db)
            user = get_user_collection(db).find_one({"_id": ObjectId(user_id)})
            username = user.get("username") if user else None
        except Exception:
            username = None

    return render_template('index.html', user_name=username)



@app.route('/hoverthreed')
def games():
    return render_template('hoverthreed.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/signup')
def register():
    return render_template('signup.html')


@app.route('/snake')
def snake():
    _record_game_play_for_request('/snake')
    return render_template('snake.html')



@app.route('/tictactoe')
def tictactoe():
    _record_game_play_for_request('/tictactoe')
    return render_template('tictactoe.html')



@app.route('/flappy-bird')
def flappybird():
    _record_game_play_for_request('/flappy-bird')
    return render_template('flappy-bird.html')



@app.route('/wordle')
def wordle():
    _record_game_play_for_request('/wordle')
    return render_template('wordle.html')



@app.route('/twozerofoureight')
def twozerofoureight():
    _record_game_play_for_request('/twozerofoureight')
    return render_template('twozerofoureight.html')



@app.route('/pingpong')
def pingpong():
    _record_game_play_for_request('/pingpong')
    return render_template('pingpong.html')



@app.route('/dino-game')
def dino():
    _record_game_play_for_request('/dino-game')
    return render_template('dino-game.html')



@app.route('/puzzle')
def puzzle():
    _record_game_play_for_request('/puzzle')
    return render_template('puzzle.html')



@app.route('/slide-puzzle')
def slidepuzzle():
    _record_game_play_for_request('/slide-puzzle')
    return render_template('slide-puzzle.html')



@app.route('/space-invaders')
def spaceinvaders():
    _record_game_play_for_request('/space-invaders')
    return render_template('space-invaders.html')



@app.route('/blackjack')
def blackjack():
    _record_game_play_for_request('/blackjack')
    return render_template('blackjack.html')



@app.route('/candy-crush')
def candycrush():
    _record_game_play_for_request('/candy-crush')
    return render_template('candy-crush.html')



@app.route('/minesweeper')
def minesweeper():
    _record_game_play_for_request('/minesweeper')
    return render_template('minesweeper.html')



@app.route('/sudoku')
def sudoku():
    _record_game_play_for_request('/sudoku')
    return render_template('sudoku.html')



@app.route('/rockpaperscissors')
def rockpaperscissors():
    _record_game_play_for_request('rockpaperscissors')
    return render_template('rockpaperscissors.html')



@app.route('/whackamole')
def whackamole():
    _record_game_play_for_request('/whackamole')
    return render_template('whackamole.html')



@app.route('/doodle-jump')
def doodlejump():
    _record_game_play_for_request('/doodle-jump')
    return render_template('doodle-jump.html')



@app.route('/connect-four')
def connectfour():
    _record_game_play_for_request('/connect-four')
    return render_template('connect-four.html')



@app.route('/hangman')
def hangman():
    _record_game_play_for_request('/hangman')
    return render_template('hangman.html')



@app.route('/memory-cards')
def memorycards():
    _record_game_play_for_request('/memory-cards')
    return render_template('memory-cards.html')



@app.route('/hoverthreed')
def hoverthreed():
    _record_game_play_for_request('/hoverthreed')
    return render_template('hoverthreed.html')


@app.route('/admin')
def admin_page():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db = get_mongo()
    _ensure_indexes(db)
    user_doc = get_user_collection(db).find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        return jsonify({"error": "Unauthorized"}), 401

    # Restrict to username "Shuja" (as requested)
    if user_doc.get("username") != "Shuja":
        return jsonify({"error": "Forbidden"}), 403

    return render_template('admin.html')


def _ensure_indexes(db):
    users = get_user_collection(db)
    favs = get_favourites_collection(db)
    activity = get_game_activity_collection(db)

    # Unique username
    users.create_index([("username", ASCENDING)], unique=True, background=True)

    # One favourite per (user, route)
    favs.create_index([("user_id", ASCENDING), ("route", ASCENDING)], unique=True, background=True)

    # One activity document per user
    activity.create_index([("user_id", ASCENDING)], unique=True, background=True)



def get_current_user_id():
    user_id = session.get("user_id")
    if not user_id:
        return None
    return user_id


def _record_game_play_for_request(route):
    user_id = get_current_user_id()
    if not user_id:
        return
    
    try:
        db = get_mongo()
        _ensure_indexes(db)
        coll = get_game_activity_collection(db)
        
        doc = coll.find_one({"user_id": user_id})
        if not doc:
            doc = {"user_id": user_id, "games": {}, "recently_played": []}
        
        games = doc.get("games") or {}
        game_entry = games.get(route) or {"total_plays": 0, "last_played_at": None}
        
        game_entry["total_plays"] = int(game_entry.get("total_plays") or 0) + 1
        game_entry["last_played_at"] = __import__('datetime').datetime.utcnow().isoformat()
        
        games[route] = game_entry
        
        recently = list(doc.get("recently_played") or [])
        recently = [r for r in recently if r != route]
        recently.insert(0, route)
        recently = recently[:6]
        
        coll.update_one(
            {"user_id": user_id},
            {"$set": {"games": games, "recently_played": recently}},
            upsert=True,
        )
    except Exception:
        pass





@app.post('/api/auth/logout')
def auth_logout():
    session.pop('user_id', None)
    return jsonify({"ok": True})


@app.get('/api/auth/me')
def auth_me():

    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"loggedIn": False}), 401

    db = get_mongo()
    _ensure_indexes(db)
    users = get_user_collection(db)
    user = users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"loggedIn": False}), 401

    role = user.get("role") or ("admin" if user.get("is_admin") else "user")
    is_admin = (role == "admin")

    return jsonify({"loggedIn": True, "username": user.get("username"), "isAdmin": is_admin})



@app.post('/api/auth/signup')
def auth_signup():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    password_bytes = password.encode('utf-8')
    password_hash = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode('utf-8')

    db = get_mongo()
    _ensure_indexes(db)
    users = get_user_collection(db)

    try:
        res = users.insert_one({"username": username, "password_hash": password_hash})
    except Exception as e:
        # Likely duplicate username due to unique index
        return jsonify({"error": "Username already exists"}), 409

    # Auto login after signup
    session["user_id"] = str(res.inserted_id)

    return jsonify({"ok": True, "username": username}), 201


@app.post('/api/auth/login')
def auth_login():

    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    db = get_mongo()
    _ensure_indexes(db)
    users = get_user_collection(db)

    user = users.find_one({"username": username})
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    stored_hash = user.get("password_hash")
    if not stored_hash:
        return jsonify({"error": "Invalid username or password"}), 401

    ok = bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
    if not ok:
        return jsonify({"error": "Invalid username or password"}), 401

    session["user_id"] = str(user["_id"])
    return jsonify({"ok": True, "username": user.get("username")})


@app.get('/api/favourites')
def favourites_list():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db = get_mongo()
    _ensure_indexes(db)
    favs = get_favourites_collection(db)

    docs = favs.find({"user_id": user_id})
    routes = [d.get("route") for d in docs if d.get("route")]

    return jsonify({"routes": routes})


@app.post('/api/favourites/toggle')
def favourites_toggle():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(silent=True) or {}
    route = (data.get("route") or "").strip()

    if not route.startswith('/'):
        return jsonify({"error": "Invalid route"}), 400

    db = get_mongo()
    _ensure_indexes(db)
    favs = get_favourites_collection(db)

    # Toggle: if exists -> delete, else -> insert
    existing = favs.find_one({"user_id": user_id, "route": route})
    if existing:
        favs.delete_one({"_id": existing["_id"]})
        return jsonify({"ok": True, "favourited": False})

    favs.insert_one({"user_id": user_id, "route": route})
    return jsonify({"ok": True, "favourited": True})


def get_game_activity_collection(db):
    return db["game_activity"]


@app.post('/api/games/played')
def games_played():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(silent=True) or {}
    route = (data.get("route") or "").strip()
    if not route.startswith('/'):
        return jsonify({"error": "Invalid route"}), 400

    db = get_mongo()
    _ensure_indexes(db)
    coll = get_game_activity_collection(db)

    # Increment total plays and update recently_played (last 6 unique routes).
    # We do this in Python to keep logic clear and consistent.
    doc = coll.find_one({"user_id": user_id})
    if not doc:
        doc = {"user_id": user_id, "games": {}, "recently_played": []}

    games = doc.get("games") or {}
    game_entry = games.get(route) or {"total_plays": 0, "last_played_at": None}

    game_entry["total_plays"] = int(game_entry.get("total_plays") or 0) + 1
    game_entry["last_played_at"] = __import__('datetime').datetime.utcnow().isoformat()

    games[route] = game_entry

    recently = list(doc.get("recently_played") or [])
    recently = [r for r in recently if r != route]
    recently.insert(0, route)
    recently = recently[:6]

    coll.update_one(
        {"user_id": user_id},
        {"$set": {"games": games, "recently_played": recently}},
        upsert=True,
    )

    return jsonify({"ok": True, "route": route, "recent": recently})


@app.get('/api/games/recent')
def games_recent():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db = get_mongo()
    _ensure_indexes(db)
    coll = get_game_activity_collection(db)

    doc = coll.find_one({"user_id": user_id}, projection={"recently_played": 1})
    recently = doc.get("recently_played", []) if doc else []

    # Always return both route and title so frontend doesn't need to map.
    titles = {
        '/twozerofoureight': '2048',
        '/pingpong': 'PING PONG',
        '/sudoku': 'SUDOKU',
        '/puzzle': 'PUZZLE',
        '/memory-cards': 'MEMORY CARDS',
        '/tictactoe': 'TIC TAC TOE',
        '/rockpaperscissors': 'ROCK PAPER SCISSORS',
        '/slide-puzzle': 'SLIDE PUZZLE',
        '/space-invaders': 'SPACE INVADERS',
        '/hangman': 'HANGMAN',
        '/blackjack': 'BLACKJACK',
        '/wordle': 'WORDLE',
        '/whackamole': 'WHACK-A-MOLE',
        '/flappy-bird': 'FLAPPY BIRD',
        '/minesweeper': 'MINESWEEPER',
        '/connect-four': 'CONNECT FOUR',
        '/dino-game': 'DINO GAME',
        '/doodle-jump': 'DOODLE JUMP',
        '/snake': 'SNAKE',
        '/candy-crush': 'CANDY CRUSH',
    }

    games = []
    for route in recently:
        title = titles.get(route)
        if not title:
            # Skip unknown routes like /hoverthreed
            continue
        games.append({"route": route, "title": title})

    return jsonify({"games": games})



@app.get('/api/games/stats')
def games_stats():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db = get_mongo()
    _ensure_indexes(db)
    coll = get_game_activity_collection(db)

    doc = coll.find_one({"user_id": user_id}, projection={"games": 1})
    games = doc.get("games", {}) if doc else {}

    totals = []
    for route, entry in games.items():
        if not isinstance(entry, dict):
            continue
        totals.append({
            "route": route,
            "total_plays": int(entry.get('total_plays') or 0),
            "last_played_at": entry.get('last_played_at'),
        })

    totals.sort(key=lambda x: x.get('total_plays', 0), reverse=True)
    return jsonify({"top_games": totals[:10]})


# ===================== Admin APIs =====================

def _require_admin_by_username():
    user_id = get_current_user_id()
    if not user_id:
        return None, (jsonify({"error": "Unauthorized"}), 401)

    db = get_mongo()
    _ensure_indexes(db)
    user_doc = get_user_collection(db).find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        return None, (jsonify({"error": "Unauthorized"}), 401)

    if user_doc.get("username") != "Shuja":
        return None, (jsonify({"error": "Forbidden"}), 403)

    return db, None


@app.route('/api/admin/users', methods=['GET', 'PATCH', 'DELETE'])
def admin_users_api():
    db, err = _require_admin_by_username()
    if err:
        return err

    users = get_user_collection(db)

    if request.method == 'GET':
        docs = list(users.find({}, projection={"username": 1, "password_hash": 1}))
        payload = []
        for d in docs:
            payload.append({
                "user_id": str(d.get('_id')),
                "username": d.get('username'),
                "password_hash": d.get('password_hash'),
            })
        return jsonify({"users": payload})

    if request.method == 'PATCH':
        data = request.get_json(silent=True) or {}
        target_id = (data.get('user_id') or '').strip()
        username = (data.get('username') or '').strip()
        password_hash = data.get('password_hash')

        if not target_id:
            return jsonify({"error": "user_id is required"}), 400

        try:
            update_doc = {}
            if username:
                update_doc['username'] = username
            if isinstance(password_hash, str) and password_hash.strip() != '':
                update_doc['password_hash'] = password_hash

            if not update_doc:
                return jsonify({"error": "Nothing to update"}), 400

            users.update_one({"_id": ObjectId(target_id)}, {"$set": update_doc})
        except Exception:
            return jsonify({"error": "Invalid user_id"}), 400

        return jsonify({"ok": True})

    # DELETE
    target_id = (request.args.get('user_id') or '').strip()
    if not target_id:
        return jsonify({"error": "user_id query param is required"}), 400

    try:
        users.delete_one({"_id": ObjectId(target_id)})
    except Exception:
        return jsonify({"error": "Invalid user_id"}), 400

    return jsonify({"ok": True})


if __name__ == '__main__':
    app.run(debug=True)

