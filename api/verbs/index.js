import { sql } from '@vercel/postgres';
import { initDB, seedVerbs } from '../lib/db';

export default async function handler(req, res) {
  // Initialize DB and seed if needed (only runs once)
  try {
    await initDB();
    await seedVerbs();
  } catch (error) {
    console.log('DB already initialized');
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { rows } = await sql`
        SELECT * FROM verbs ORDER BY difficulty, masu_form
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { masu_form, romaji, english, verb_type, difficulty } = req.body;
      
      if (!masu_form || !romaji || !english) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { rows } = await sql`
        INSERT INTO verbs (masu_form, romaji, english, verb_type, difficulty)
        VALUES (${masu_form}, ${romaji}, ${english}, ${verb_type || null}, ${difficulty || 'beginner'})
        RETURNING *
      `;

      return res.status(201).json(rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in verbs endpoint:', error);
    return res.status(500).json({ error: error.message });
  }
}
