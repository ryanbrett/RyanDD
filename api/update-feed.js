// /api/update-feed.js

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
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
      
      return res.status(200).json({ message: 'Post added successfully', item: result.rows[0] });
    } catch (error) {
      console.error('DB error:', error);
      return res.status(500).json({ message: 'Database insert failed' });
    }
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const { title, content } = req.body;
    if (!id || !title || !content) return res.status(400).json({ message: 'Missing fields' });

    try {
      await sql`UPDATE feed SET title = ${title}, content = ${content} WHERE id = ${id}`;
      return res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
      console.error('Update error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: 'Missing id' });

    try {
      await sql`DELETE FROM feed WHERE id = ${id}`;
      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
