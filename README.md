# Japanese Verb Trainer

A lightweight, offline-first web application for practicing Japanese verb conjugations with spaced repetition.

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Data Storage**: Browser localStorage + JSON
- **State Management**: React hooks + localStorage persistence
- **Deployment**: Vercel (static hosting)

## 📁 Project Structure

```
japanese-verb-trainer-fullstack/
├── src/
│   ├── components/
│   │   ├── FlashcardMode.jsx      # Flashcard practice interface
│   │   └── Navbar.jsx              # Navigation component
│   ├── pages/
│   │   ├── HomePage.jsx            # Home page with stats overview
│   │   ├── PracticePage.jsx        # Main practice interface
│   │   ├── StatsPage.jsx           # Detailed statistics view
│   │   └── VerbListPage.jsx        # Browse all verbs
│   ├── services/
│   │   └── dataService.js          # All data operations (verbs, progress)
│   ├── hooks/
│   │   └── useLocalStorage.js      # Custom hook for localStorage state
│   ├── App.jsx                     # Main app component
│   ├── App.css                     # Global styles
│   └── main.jsx                    # Entry point
├── public/                         # Static assets
├── verbs.json                      # Verb database (49 verbs)
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── vercel.json                     # Vercel deployment config
├── start-app.bat                   # Windows dev launcher
├── setup.bat                       # Windows setup script
└── package.json
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ installed

### Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

   Or on Windows, double-click `start-app.bat`

3. **Access the app**:
   - Frontend: http://localhost:5173

### Data Storage
- **Verbs**: Loaded from `verbs.json` (included in repo)
- **Progress**: Stored in browser localStorage under key `userProgress`
- **Offline**: App works completely offline after initial load

## 📊 Data Service

All data operations are handled by `src/services/dataService.js`:

- `getAllVerbs()` - Get all verbs from verbs.json
- `getRandomVerb(difficulty, exclude)` - Get a random verb (with optional filtering)
- `getVerbById(id)` - Get a specific verb by ID
- `recordAttempt(verbId, correct)` - Record practice attempt (stores in localStorage)
- `getStats()` - Get user statistics from localStorage
- `resetProgress()` - Clear all progress data
- `getVerbProgress(verbId)` - Get progress for specific verb

## 🚀 Deployment

### Deploy to Vercel

The app is already configured for Vercel deployment. To deploy your changes:

```bash
vercel --prod
```

Or use the Vercel CLI:
```bash
npm install -g vercel
vercel link
vercel --prod
```

**Deployment details:**
- No backend server needed
- No database configuration required
- Static file hosting on Vercel CDN
- Builds with Vite (optimized bundle)
- Frontend deployed at: https://japanese-verb-trainer-fullstack-*.vercel.app

## 💾 Storage Format

### Verbs (verbs.json)
```json
{
  "id": 1,
  "masu_form": "する",
  "romaji": "suru",
  "english": "to do",
  "verb_type": "Irregular",
  "difficulty": "beginner"
}
```

### Progress (localStorage)
```javascript
{
  "userProgress": {
    "1": {
      "verb_id": 1,
      "attempts": 5,
      "correct": 4,
      "last_practiced": "2025-11-11T19:00:00Z",
      "next_review": "2025-11-17T19:00:00Z",
      "ease_factor": 2.6,
      "interval_days": 6
    }
  }
}
```

The progress is stored locally in the browser and uses the SM-2 spaced repetition algorithm.

## ✨ Features

- **Offline-First**: Works completely offline after initial load
- **Spaced Repetition**: SM-2 algorithm for optimal learning intervals
- **Progress Tracking**: Automatic progress tracking with localStorage
- **Difficulty Levels**: Beginner, intermediate, and advanced verbs (49 total)
- **Responsive Design**: Mobile-friendly with hamburger menu
- **No Backend Required**: Everything runs in the browser
- **Flashcard Mode**: Interactive verb conjugation practice

## 🎯 Learning Algorithm

Uses the **SM-2 (SuperMemo 2)** spaced repetition algorithm:
- Tracks ease factor for each verb (difficulty adjustment)
- Calculates optimal review intervals
- Adapts difficulty based on your performance
- Data persists across sessions in localStorage

## 📝 Notes

- All progress data is stored in browser localStorage
- Clear browser data to reset progress
- No user accounts needed - everything is local
- 49 Japanese verbs included in verbs.json
- All conjugation practice happens offline

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this project for learning purposes.
