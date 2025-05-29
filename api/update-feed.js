// /api/update-feed.js

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Missing title or content' });
    }

    const result = await sql`
      INSERT INTO feed (title, content)
      VALUES (${title}, ${content})
      RETURNING id, title, content, created;
    `;

    const newItem = result.rows[0];

    res.status(200).json({ message: 'Feed updated successfully', item: newItem });
  } catch (error) {
    console.error('Error updating feed:', error);
    res.status(500).json({ message: 'Failed to update feed' });
  }
}
