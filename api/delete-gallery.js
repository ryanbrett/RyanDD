import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'Missing ID' });

  try {
    await sql`DELETE FROM gallery WHERE id = ${id}`;
    return res.status(200).json({ message: 'Image deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
