// /api/update-gallery.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { src, alt, password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ message: 'Unauthorized' });

  try {
    await sql`INSERT INTO gallery (src, alt) VALUES (${src}, ${alt})`;
    res.status(200).json({ message: 'Image added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error' });
  }
}
