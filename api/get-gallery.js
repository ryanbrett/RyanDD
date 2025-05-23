// api/get-gallery.js
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), '/json/gallery.json');

  if (req.method !== 'GET') return res.status(405).json({ success: false });

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const items = JSON.parse(data);
    res.status(200).json({ success: true, items });
  } catch {
    res.status(500).json({ success: false, items: [] });
  }
}