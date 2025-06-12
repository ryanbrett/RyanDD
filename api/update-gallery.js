// This is likely in your `api/update-gallery.js` or another API route.
// The error `SyntaxError: Unexpected token '{'` suggests a malformed export or top-level syntax issue.

// ✅ Let's double check your update-gallery.js file.
// Here's a clean working template you can use:

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { src, alt, password } = req.body;

  if (!src || !alt || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { sql } = require('@vercel/postgres');

    await sql`INSERT INTO gallery (src, alt) VALUES (${src}, ${alt})`;

    return res.status(200).json({ message: 'Image added successfully' });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
