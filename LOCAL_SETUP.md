# Local Development Setup

This guide explains how to set up and run the Japanese Verb Trainer locally for development and testing.

## Quick Start

### 1. Initial Setup (Run Once)
```bash
# Double-click setup.bat or run:
setup.bat
```

This will:
- Install all npm dependencies
- Verify/install Vercel CLI globally
- Prepare your environment

### 2. Set Up Database Connection

You have two options:

#### Option A: Using Vercel Postgres (Recommended)
If you have a Vercel project already connected to this repository with Postgres:

```bash
vercel env pull .env.local
```

Then run:
```bash
start-app.bat
```

#### Option B: Local Testing (Frontend Only)
If you just want to test the frontend without a real database:

```bash
npm run dev
```

This will:
- Start the Vite dev server on http://localhost:3000
- Open your browser automatically
- API calls will fail (no backend), but you can see the UI

### 3. Start Development Server

#### With Full Stack (Frontend + API):
```bash
# Double-click start-app.bat or run:
vercel dev
```

This will start both:
- Frontend: http://localhost:3000
- API functions: http://localhost:3000/api/*

#### Frontend Only:
```bash
npm run dev
```

## Environment Variables

### .env.local
This file stores your database credentials. It's created by `vercel env pull` and should NEVER be committed to git.

See `.env.example` for available variables.

## Troubleshooting

### "vercel dev" not found
Install Vercel CLI globally:
```bash
npm install -g vercel
```

### ".env.local not found"
You need to set up your database connection. Run:
```bash
vercel env pull .env.local
```

Or create `.env.local` manually with your database credentials.

### Port already in use
If port 3000 is already in use:
- Change the port in `vite.config.js`
- Or kill the process using port 3000

### Database connection errors
Ensure your `.env.local` file has the correct `POSTGRES_URLSTATE` value.

## File Structure

```
japanese-verb-trainer-fullstack/
├── api/                    # Serverless API functions
│   ├── lib/db.js          # Database utilities
│   ├── verbs/             # Verb endpoints
│   └── progress/          # Progress tracking endpoints
├── src/                   # React frontend
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── services/api.js    # API client
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── .env.local             # Environment variables (DO NOT COMMIT)
├── .env.example           # Example env variables
├── vite.config.js         # Vite configuration
├── vercel.json            # Vercel deployment config
└── package.json           # Dependencies
```

## Development Scripts

- `npm run dev` - Start Vite dev server (frontend only)
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build locally
- `vercel dev` - Start full stack (frontend + API)
- `vercel env pull` - Pull environment variables from Vercel

## Next Steps: Deployment

When ready to deploy to Vercel:

1. Push to GitHub
2. Link repository to Vercel project
3. Add Vercel Postgres from Storage tab
4. Deploy!

See README.md for full deployment instructions.
