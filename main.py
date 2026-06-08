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



@app.route('/games')
def games():
    return render_template('games.html')


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
    return render_template('snake.html')


@app.route('/tictactoe')
def tictactoe():
    return render_template('tictactoe.html')


@app.route('/flappy-bird')
def flappybird():
    return render_template('flappy-bird.html')


@app.route('/wordle')
def wordle():
    return render_template('wordle.html')


@app.route('/twozerofoureight')
def twozerofoureight():
    return render_template('twozerofoureight.html')


@app.route('/pingpong')
def pingpong():
    return render_template('pingpong.html')


@app.route('/dino-game')
def dino():
    return render_template('dino-game.html')


@app.route('/puzzle')
def puzzle():
    return render_template('puzzle.html')


@app.route('/slide-puzzle')
def slidepuzzle():
    return render_template('slide-puzzle.html')


@app.route('/space-invaders')
def spaceinvaders():
    return render_template('space-invaders.html')


@app.route('/blackjack')
def blackjack():
    return render_template('blackjack.html')


@app.route('/candy-crush')
def candycrush():
    return render_template('candy-crush.html')


@app.route('/minesweeper')
def minesweeper():
    return render_template('minesweeper.html')


@app.route('/sudoku')
def sudoku():
    return render_template('sudoku.html')


@app.route('/rockpaperscissors')
def rockpaperscissors():
    return render_template('rockpaperscissors.html')


@app.route('/whackamole')
def whackamole():
    return render_template('whackamole.html')


@app.route('/doodle-jump')
def doodlejump():
    return render_template('doodle-jump.html')


@app.route('/connect-four')
def connectfour():
    return render_template('connect-four.html')


@app.route('/hangman')
def hangman():
    return render_template('hangman.html')


@app.route('/memory-cards')
def memorycards():
    return render_template('memory-cards.html')


@app.route('/hoverthreed')
def hoverthreed():
    return render_template('hoverthreed.html')


def _ensure_indexes(db):
    users = get_user_collection(db)
    favs = get_favourites_collection(db)

    # Unique username
    users.create_index([("username", ASCENDING)], unique=True, background=True)

    # One favourite per (user, route)
    favs.create_index([("user_id", ASCENDING), ("route", ASCENDING)], unique=True, background=True)


def get_current_user_id():
    user_id = session.get("user_id")
    if not user_id:
        return None
    return user_id


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

    return jsonify({"loggedIn": True, "username": user.get("username")})


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


if __name__ == '__main__':
    app.run(debug=True)

