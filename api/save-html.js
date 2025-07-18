// /api/save-html.js (Vercel serverless function)
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token, file, content } = req.body;
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  const safeFiles = ['index.html', 'about.html'];
  if (!safeFiles.includes(file)) {
    return res.status(400).json({ message: 'Invalid file path' });
  }

  const filePath = path.join(process.cwd(), 'public', file);

  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return res.status(200).json({ message: 'File saved successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to save file' });
  }
}

