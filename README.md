# Japanese Verb Trainer - Fullstack

A fullstack web application for practicing Japanese verb conjugations with spaced repetition.

## 🚀 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Vercel Serverless Functions
- **Database**: Vercel Postgres
- **Deployment**: Vercel

## 📁 Project Structure

```
japanese-verb-trainer-fullstack/
├── api/                    # Serverless API functions
│   ├── lib/
│   │   └── db.js          # Database utilities
│   ├── verbs/
│   │   ├── index.js       # GET/POST all verbs
│   │   ├── [id].js        # GET/PUT/DELETE single verb
│   │   └── random.js      # GET random verb
│   └── progress/
│       └── stats.js       # GET progress statistics
├── src/                   # React frontend
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── public/                # Static assets
├── verbs.json            # Initial verb data for seeding
├── index.html
├── vite.config.js
├── vercel.json           # Vercel configuration
└── package.json
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ installed
- Vercel CLI installed: `npm i -g vercel`

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Vercel Postgres**:
   - Create a new project on Vercel
   - Add Vercel Postgres from the Storage tab
   - Pull environment variables:
     ```bash
     vercel env pull .env.local
     ```

3. **Run development server**:
   ```bash
   vercel dev
   ```

   This will start both the frontend (Vite) and API functions locally.

4. **Access the app**:
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api/verbs

## 📡 API Endpoints

### Verbs
- `GET /api/verbs` - Get all verbs
- `POST /api/verbs` - Create a new verb
- `GET /api/verbs/[id]` - Get a specific verb
- `PUT /api/verbs/[id]` - Update a verb
- `DELETE /api/verbs/[id]` - Delete a verb
- `GET /api/verbs/random?difficulty=beginner&exclude=1,2,3` - Get a random verb

### Progress
- `GET /api/progress/stats` - Get user statistics

## 🚀 Deployment

### Deploy to Vercel

1. **Link your project**:
   ```bash
   vercel link
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

The app will be automatically deployed with:
- Frontend built with Vite
- API functions deployed as serverless functions
- Database connected to Vercel Postgres

## 🗃️ Database Schema

### `verbs` table
```sql
CREATE TABLE verbs (
  id SERIAL PRIMARY KEY,
  masu_form TEXT NOT NULL,
  romaji TEXT NOT NULL,
  english TEXT NOT NULL,
  verb_type TEXT,
  difficulty TEXT DEFAULT 'beginner',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `user_progress` table
```sql
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  verb_id INTEGER NOT NULL REFERENCES verbs(id),
  attempts INTEGER DEFAULT 0,
  correct INTEGER DEFAULT 0,
  last_practiced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  next_review TIMESTAMP,
  ease_factor REAL DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1
);
```

### `training_sessions` table
```sql
CREATE TABLE training_sessions (
  id SERIAL PRIMARY KEY,
  session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verbs_practiced INTEGER,
  accuracy REAL,
  duration_seconds INTEGER
);
```

## ✨ Features

- **Multiple Practice Modes**: Flashcards and fill-in-the-blank
- **Spaced Repetition**: Uses SM-2 algorithm for optimal learning
- **Progress Tracking**: Track your learning progress and statistics
- **Difficulty Levels**: Beginner, intermediate, and advanced verbs
- **Responsive Design**: Works on desktop and mobile

## 📝 Notes

- The database is automatically initialized on first API call
- Verbs are automatically seeded from `verbs.json` on first run
- All API routes support CORS for local development

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this project for learning purposes.
