import { sql } from '@vercel/postgres';
import { calculateNextReview } from '../lib/db';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { verb_id, correct } = req.body;
    
    if (!verb_id || correct === undefined) {
      return res.status(400).json({ error: 'Missing required fields: verb_id and correct' });
    }

    // Get or create progress entry
    const { rows: existingProgress } = await sql`
      SELECT * FROM user_progress WHERE verb_id = ${verb_id}
    `;
    
    if (existingProgress.length === 0) {
      // Create new progress entry
      const { rows } = await sql`
        INSERT INTO user_progress (verb_id, attempts, correct)
        VALUES (${verb_id}, 1, ${correct ? 1 : 0})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    // Update existing progress
    const progress = existingProgress[0];
    const newAttempts = progress.attempts + 1;
    const newCorrect = progress.correct + (correct ? 1 : 0);
    
    // Calculate next review using spaced repetition
    const { nextReview, easeFactor, interval } = calculateNextReview(progress, correct);
    
    const { rows } = await sql`
      UPDATE user_progress 
      SET attempts = ${newAttempts}, 
          correct = ${newCorrect}, 
          last_practiced = CURRENT_TIMESTAMP,
          next_review = ${nextReview},
          ease_factor = ${easeFactor},
          interval_days = ${interval}
      WHERE verb_id = ${verb_id}
      RETURNING *
    `;
    
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error recording attempt:', error);
    return res.status(500).json({ error: error.message });
  }
}
