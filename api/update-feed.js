// /api/update-feed.js

import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Missing title or content' });
    }

    const filePath = path.join(process.cwd(), 'json', 'feed.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const feed = JSON.parse(fileData);

    const newItem = {
      id: Date.now(),
      title,
      content,
      created: new Date().toISOString()
    };

    feed.unshift(newItem);
    await fs.writeFile(filePath, JSON.stringify(feed, null, 2));

    res.status(200).json({ message: 'Feed updated successfully', item: newItem });
  } catch (error) {
    console.error('Error updating feed:', error);
    res.status(500).json({ message: 'Failed to update feed' });
  }
}
