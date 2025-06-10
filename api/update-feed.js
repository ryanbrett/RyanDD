// /api/update-feed.js

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Missing title or content' });
  }

  try {
    const result = await sql`
      INSERT INTO feed (title, content, created)
      VALUES (${title}, ${content}, NOW())
      RETURNING *;
    `;
    
    return res.status(200).json({ success: true, item: result.rows[0] });
  } catch (error) {
    console.error('DB error:', error);
    return res.status(500).json({ message: 'Database insert failed' });
  }
}
