import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { src, alt } = req.body;

  if (!src || !alt) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    await sql`INSERT INTO gallery (src, alt) VALUES (${src}, ${alt})`;
    return res.status(200).json({ message: 'Image added successfully' });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
