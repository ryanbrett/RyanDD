import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const adminPassword = 'pwopwo';
  const filePath = path.join(process.cwd(), 'public/json/gallery.json');

  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const { password, src, alt } = req.body;
  if (password !== adminPassword) return res.status(401).json({ success: false });

  if (!src || !alt) return res.status(400).json({ success: false });

  const normalizedSrc = src.startsWith('http') ? src : `https://${src}`;

  try {
    let items = [];
    try {
      const data = await fs.readFile(filePath, 'utf8');
      items = JSON.parse(data);
    } catch {}

    items.unshift({ src: normalizedSrc, alt });
    await fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf8');
    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
}
