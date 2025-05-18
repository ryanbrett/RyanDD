// api/update-feed.js

let sessionLoggedIn = false; // TEMP: Simulates session

export default async function handler(req, res) {
  const adminPassword = 'pwopwo'; // Use your real password
  const fs = require('fs').promises;
  const path = require('path');
  const feedFilePath = path.join(process.cwd(), 'json', 'feed.json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Invalid request method' });
  }

  const input = req.body;

  // 1. Handle Login
  if (input.password) {
    if (input.password === adminPassword) {
      sessionLoggedIn = true; // TEMP — in-memory only
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  }

  // 2. Auth Required
  if (!sessionLoggedIn) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  // 3. Handle Feed Update
  if (!input.title || !input.content) {
    console.error('Invalid input:', input);
    return res.status(400).json({ success: false, message: 'Invalid input' });
  }

  const newItem = {
    title: input.title,
    content: input.content,
  };

  try {
    let feedItems = [];

    try {
      const existing = await fs.readFile(feedFilePath, 'utf8');
      feedItems = JSON.parse(existing);
    } catch {
      console.log('No existing feed file, starting fresh.');
    }

    feedItems.unshift(newItem);

    await fs.writeFile(feedFilePath, JSON.stringify(feedItems, null, 2), 'utf8');
    console.log('New item added:', newItem);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to update feed:', err);
    return res.status(500).json({ success: false, message: 'Failed to write feed' });
  }
}
