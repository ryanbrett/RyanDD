// /api/get-gallery.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    const { rows } = await sql`SELECT * FROM gallery ORDER BY created DESC`;
    res.status(200).json({ items: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load gallery' });
  }
}
