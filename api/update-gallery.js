import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { src, alt } = req.body;
    if (!src || !alt) return res.status(400).json({ message: 'Missing fields' });

    try {
      await sql`INSERT INTO gallery (src, alt) VALUES (${src}, ${alt})`;
      return res.status(200).json({ message: 'Image added successfully' });
    } catch (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const { src, alt } = req.body;
    if (!id || !src || !alt) return res.status(400).json({ message: 'Missing fields' });

    try {
      await sql`UPDATE gallery SET src = ${src}, alt = ${alt} WHERE id = ${id}`;
      return res.status(200).json({ message: 'Image updated successfully' });
    } catch (err) {
      console.error('Update error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
