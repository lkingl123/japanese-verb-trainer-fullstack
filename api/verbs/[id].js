import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Verb ID is required' });
  }

  try {
    if (req.method === 'GET') {
      const { rows } = await sql`SELECT * FROM verbs WHERE id = ${id}`;
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Verb not found' });
      }
      
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const { masu_form, romaji, english, verb_type, difficulty } = req.body;
      
      const { rows } = await sql`
        UPDATE verbs 
        SET masu_form = ${masu_form}, 
            romaji = ${romaji}, 
            english = ${english}, 
            verb_type = ${verb_type}, 
            difficulty = ${difficulty}
        WHERE id = ${id}
        RETURNING *
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Verb not found' });
      }

      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const { rows } = await sql`DELETE FROM verbs WHERE id = ${id} RETURNING id`;
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Verb not found' });
      }

      return res.status(200).json({ message: 'Verb deleted successfully', id: rows[0].id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in verb [id] endpoint:', error);
    return res.status(500).json({ error: error.message });
  }
}
