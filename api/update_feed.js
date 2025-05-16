// api/update_feed.js

export default async function handler(req, res) {
    const adminPassword = 'admin012222'; // 🔐 Replace with your actual password
    const feedFilePath = 'json/feed.json';
  
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Invalid request method' });
    }
  
    const input = req.body;
  
    // Authenticate
    if (input.password) {
      if (input.password === adminPassword) {
        // In a real setup, you'd return a token
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ success: false, message: 'Incorrect password' });
      }
    }
  
    // Feed update request (assumes already "authenticated")
    if (input.title && input.content) {
      const fs = require('fs').promises;
      const path = require('path');
  
      const newItem = {
        title: input.title,
        content: input.content,
      };
  
      try {
        const fullPath = path.join(process.cwd(), feedFilePath);
        let feedItems = [];
  
        try {
          const fileContents = await fs.readFile(fullPath, 'utf8');
          feedItems = JSON.parse(fileContents);
        } catch (err) {
          // File might not exist yet — that's okay
          console.log('No existing feed file, creating new one.');
        }
  
        feedItems.unshift(newItem);
  
        await fs.writeFile(fullPath, JSON.stringify(feedItems, null, 2), 'utf8');
        return res.status(200).json({ success: true });
      } catch (err) {
        console.error('Error updating feed:', err);
        return res.status(500).json({ success: false, message: 'Failed to write feed file' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }
  }