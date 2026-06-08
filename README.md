# 🎮 Play Portal

A modern web-based gaming platform built with Flask and Supabase, featuring 20+ interactive games with user authentication and personalized game tracking.

![Play Portal](https://img.shields.io/badge/Version-2.0-blue)
![Python](https://img.shields.io/badge/Python-3.x-green)
![Flask](https://img.shields.io/badge/Flask-3.1.0-orange)
![Supabase](https://img.shields.io/badge/Supabase-Auth-red)

## 🌐 Live Demo

**Production URL:** [https://play-portal-2-8rohhlbqz-shujas-projects-88f2bcbc.vercel.app]

**GitHub Repository:** [https://github.com/shuja-tech/Play-Portal-2-dep.git]

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Games Included](#games-included)
- [Setup & Installation](#setup--installation)
- [Supabase Configuration](#supabase-configuration)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Authentication
- **Email/Password Registration** - Users can create accounts with username, email, and password
- **Secure Login** - Authenticated sessions using Supabase Auth
- **Persistent Sessions** - Users stay logged in across browser sessions
- **Profile Management** - Automatic user profile creation on signup

### Game Dashboard
- **Personalized Dashboard** - Welcome message with username
- **Games Played Counter** - Tracks total unique games played
- **Favorites System** - Users can favorite games (persisted to Supabase)
- **Recently Played** - Shows last 6 games played
- **Recommendations** - Random game suggestions on each visit

### User Data Management
- **Cloud Sync** - All user data saved to Supabase database
- **Separate User Records** - Each user has independent:
  - Games played history
  - Favorite games list
  - Recently played games
- **Guest Mode** - Local storage fallback for non-authenticated users

### Responsive Design
- **Mobile-Friendly** - Works on all device sizes
- **Modern UI** - Dark theme with accent colors
- **Smooth Animations** - Interactive hover effects and transitions

## 🛠 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with CSS variables
- **JavaScript (ES6+)** - Client-side functionality
- **Supabase JS SDK** - Frontend authentication

### Backend
- **Python 3.x** - Server runtime
- **Flask 3.1.0** - Web framework
- **Jinja2** - Template engine

### Database & Auth
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - User authentication
  - Row Level Security (RLS)

### Deployment
- **Vercel** - Cloud platform for serverless deployment
- **Flask** - Python web server

## 📁 Project Structure

```
Play-portal-2/
├── main.py                    # Flask application entry point
├── requirements.txt           # Python dependencies
├── vercel.json               # Vercel configuration
├── .gitignore                # Git ignore rules
├── README.md                  # Project documentation
├── TODO.md                   # Development tasks
├── static/
│   ├── image/               # Game assets and images
│   │   ├── main-img/       # Website logo
│   │   ├── dino-img/       # Game-specific images
│   │   ├── blackjack-img/  # Card game assets
│   │   └── ... (other game images)
│   ├── java/               # JavaScript files
│   │   ├── supabase-client.js    # Supabase initialization
│   │   ├── signup.js            # Registration logic
│   │   ├── main.js              # Main app logic
│   │   └── ... (game-specific JS)
│   └── style/              # CSS stylesheets
│       ├── home.css         # Homepage styles
│       ├── login.css        # Auth pages styling
│       ├── games.css        # Games page
│       └── ... (game-specific CSS)
└── templates/               # HTML templates
    ├── index.html           # Homepage with dashboard
    ├── login.html           # Login page
    ├── signup.html          # Registration page
    ├── logout.html          # Logout handler
    ├── about.html           # About page
    ├── games.html           # Games listing
    └── ... (20+ game HTML files)
```

## 🎮 Games Included

| Category | Games |
|----------|-------|
| **Puzzle** | 2048, Sudoku, Puzzle, Slide Puzzle |
| **Strategy** | Tic Tac Toe, Connect 4, Rock Paper Scissors |
| **Arcade** | Snake, Dino Game, Flappy Bird, PingPong, Doodle Jump, Whack-a-mole |
| **Card** | Blackjack, Memory Cards |
| **Word** | Wordle, Hangman |
| **Action** | Space Invaders, Candy Crush |

## 🚀 Setup & Installation

### Prerequisites
- Python 3.8+
- Node.js (optional, for development)
- Supabase account

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Play portal 2"
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python main.py
   ```

5. **Open browser**
   ```
   http://localhost:5000
   ```

## 🗄 Supabase Configuration

### Database Schema

Create a `user_profiles` table with these columns:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (user ID) |
| username | text | User's display name |
| email | text | User's email |
| games_played | jsonb | Array of played games |
| favorites | jsonb | Array of favorited games |
| recently_played | jsonb | Array of recent games |
| created_at | timestamp | Account creation time |

### Row Level Security (RLS)

Enable RLS policies:
- Users can only read their own profile
- Users can only update their own data
- Authenticated users can insert profiles

### Authentication Settings

1. Go to **Authentication → Providers → Email**
2. Enable **Email provider**
3. Optionally disable "Confirm email" for immediate signup

## 📦 Deployment

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy to production:
   ```bash
   vercel --prod
   ```

3. Set environment variables in Vercel dashboard if needed

### Alternative: PythonAnywhere

```bash
# Upload files to PythonAnywhere
# Configure WSGI application as: main:app
```

## 🔐 Security Features

- **Password Hashing** - Handled by Supabase
- **SQL Injection Prevention** - Parameterized queries via Supabase
- **XSS Protection** - Jinja2 auto-escapes output
- **CSRF Protection** - Flask-WTF (optional enhancement)
- **RLS Policies** - Database-level access control

## 🎨 Customization

### Adding New Games

1. Create game HTML in `templates/`
2. Add CSS in `static/style/`
3. Add JavaScript in `static/java/`
4. Update `main.py` with new route
5. Add to games array in `index.html`

### Modifying Styles

Edit CSS variables in `static/style/home.css`:
```css
:root {
    --primary-color: #001f3f;
    --secondary-color: #003366;
    --accent-color: #fad106;
    --accent-secondary: #e55b38;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-game`)
3. Commit changes (`git commit -m 'Add amazing game'`)
4. Push to branch (`git push origin feature/amazing-game`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

**Muhammad Shuja Salman**

---

<p align="center">Made with ❤️ for gamers, by gamers</p>
<p align="center">🎮 Enjoy playing! 🎮</p>
