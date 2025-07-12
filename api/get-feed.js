// /api/get-feed.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await sql`SELECT title, content, created FROM feed ORDER BY created DESC LIMIT 10;`;

    return res.status(200).json({ items: result.rows });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return res.status(500).json({ message: 'Failed to fetch feed items.' });
  }
}
