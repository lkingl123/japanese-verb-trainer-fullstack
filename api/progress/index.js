import { sql } from '@vercel/postgres';
import { calculateNextReview } from '../lib/db';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { verb_id } = req.query;
      
      if (verb_id) {
        // Get progress for specific verb
        const { rows } = await sql`
          SELECT * FROM user_progress WHERE verb_id = ${verb_id}
        `;
        
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Progress not found' });
        }
        
        return res.status(200).json(rows[0]);
      } else {
        // Get all progress
        const { rows } = await sql`
          SELECT up.*, v.masu_form, v.romaji, v.english
          FROM user_progress up
          JOIN verbs v ON up.verb_id = v.id
          ORDER BY up.last_practiced DESC
        `;
        
        return res.status(200).json(rows);
      }
    }

    if (req.method === 'POST') {
      const { verb_id, correct } = req.body;
      
      if (!verb_id || correct === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if progress exists
      const { rows: existing } = await sql`
        SELECT * FROM user_progress WHERE verb_id = ${verb_id}
      `;

      const nextReview = calculateNextReview(existing[0], correct);

      let result;
      if (existing.length > 0) {
        // Update existing progress
        result = await sql`
          UPDATE user_progress
          SET attempts = attempts + 1,
              correct = correct + ${correct ? 1 : 0},
              last_practiced = NOW(),
              next_review = ${nextReview.nextReview},
              ease_factor = ${nextReview.easeFactor},
              interval_days = ${nextReview.interval}
          WHERE verb_id = ${verb_id}
          RETURNING *
        `;
      } else {
        // Create new progress
        result = await sql`
          INSERT INTO user_progress (
            verb_id, attempts, correct, last_practiced, 
            next_review, ease_factor, interval_days
          )
          VALUES (
            ${verb_id}, 1, ${correct ? 1 : 0}, NOW(),
            ${nextReview.nextReview}, ${nextReview.easeFactor}, ${nextReview.interval}
          )
          RETURNING *
        `;
      }

      return res.status(200).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in progress endpoint:', error);
    return res.status(500).json({ error: error.message });
  }
}
