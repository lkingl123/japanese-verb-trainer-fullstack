import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database tables
export async function initDB() {
  try {
    // Create verbs table
    await sql`
      CREATE TABLE IF NOT EXISTS verbs (
        id SERIAL PRIMARY KEY,
        masu_form TEXT NOT NULL,
        romaji TEXT NOT NULL,
        english TEXT NOT NULL,
        verb_type TEXT,
        difficulty TEXT DEFAULT 'beginner',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create user_progress table
    await sql`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        verb_id INTEGER NOT NULL REFERENCES verbs(id) ON DELETE CASCADE,
        attempts INTEGER DEFAULT 0,
        correct INTEGER DEFAULT 0,
        last_practiced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        next_review TIMESTAMP,
        ease_factor REAL DEFAULT 2.5,
        interval_days INTEGER DEFAULT 1
      )
    `;

    // Create training_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS training_sessions (
        id SERIAL PRIMARY KEY,
        session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verbs_practiced INTEGER,
        accuracy REAL,
        duration_seconds INTEGER
      )
    `;

    return { success: true, message: 'Database initialized' };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Seed database with initial verbs from JSON
export async function seedVerbs() {
  try {
    // Check if verbs already exist
    const { rows } = await sql`SELECT COUNT(*) as count FROM verbs`;
    
    if (parseInt(rows[0].count) > 0) {
      return { success: true, message: 'Verbs already seeded', count: rows[0].count };
    }

    // Read verbs from JSON file
    // Use path relative to project root (two levels up from api/lib/)
    const verbsPath = path.join(__dirname, '../../verbs.json');
    const verbsData = JSON.parse(fs.readFileSync(verbsPath, 'utf8'));

    // Insert verbs
    for (const verb of verbsData) {
      await sql`
        INSERT INTO verbs (masu_form, romaji, english, verb_type, difficulty)
        VALUES (${verb.masu_form}, ${verb.romaji}, ${verb.english}, ${verb.verb_type}, ${verb.difficulty})
      `;
    }

    return { success: true, message: `Seeded ${verbsData.length} verbs`, count: verbsData.length };
  } catch (error) {
    console.error('Error seeding verbs:', error);
    throw error;
  }
}

// Calculate next review date using SM-2 algorithm (simplified)
export function calculateNextReview(progress, correct) {
  let easeFactor = progress?.ease_factor || 2.5;
  let interval = progress?.interval_days || 1;
  
  if (correct) {
    if (interval === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    easeFactor = Math.max(1.3, easeFactor + 0.1);
  } else {
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  }
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  
  return {
    nextReview: nextReview.toISOString(),
    easeFactor,
    interval
  };
}
