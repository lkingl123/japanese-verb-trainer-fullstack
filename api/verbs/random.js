import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { difficulty, exclude } = req.query;
    
    let query = 'SELECT * FROM verbs WHERE 1=1';
    const params = [];

    if (difficulty && difficulty !== 'all') {
      params.push(difficulty);
      query += ` AND difficulty = $${params.length}`;
    }

    if (exclude) {
      const excludeIds = exclude.split(',').map(id => parseInt(id));
      if (excludeIds.length > 0) {
        params.push(...excludeIds);
        const placeholders = excludeIds.map((_, i) => `$${params.length - excludeIds.length + i + 1}`).join(',');
        query += ` AND id NOT IN (${placeholders})`;
      }
    }

    query += ' ORDER BY RANDOM() LIMIT 1';

    const result = await sql.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No verbs found' });
    }
    
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error in random verb endpoint:', error);
    return res.status(500).json({ error: error.message });
  }
}
