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
    // Get overall statistics
    const { rows: stats } = await sql`
      SELECT 
        COUNT(*) as total_verbs_practiced,
        COALESCE(SUM(attempts), 0) as total_attempts,
        COALESCE(SUM(correct), 0) as total_correct,
        ROUND(
          CAST(COALESCE(SUM(correct), 0) AS NUMERIC) / 
          NULLIF(COALESCE(SUM(attempts), 0), 0) * 100, 
          2
        ) as accuracy
      FROM user_progress
    `;
    
    // Get recent sessions
    const { rows: recentSessions } = await sql`
      SELECT * FROM training_sessions 
      ORDER BY session_date DESC 
      LIMIT 10
    `;
    
    return res.status(200).json({
      ...stats[0],
      recent_sessions: recentSessions
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    return res.status(500).json({ error: error.message });
  }
}
