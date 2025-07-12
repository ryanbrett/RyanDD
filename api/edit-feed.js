import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, title, content } = req.body;

    try {
      await sql`
        UPDATE feed
        SET title = ${title}, content = ${content}
        WHERE id = ${id}
      `;
      res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
