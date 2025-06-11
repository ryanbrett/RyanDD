//only added code
import { loadFeed, displayFeed } from './feed.js';
//only added code

document.getElementById('feed-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('feed-title').value.trim();
  const content = document.getElementById('feed-input').value.trim();
  const status = document.getElementById('submit-status');

  if (!title || !content) {
    status.textContent = 'Please fill out both fields.';
    return;
  }

  try {
    const res = await fetch('/api/update-feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });

    const data = await res.json();

    if (res.ok) {
      status.textContent = '✅ Feed updated successfully!';
      document.getElementById('feed-form').reset();
    } else {
      status.textContent = `❌ ${data.message || 'Failed to update feed.'}`;
    }
  } catch (err) {
    console.error('Error submitting feed:', err);
    status.textContent = '❌ Error connecting to server.';
  }
});

//below and top line is only added code
// Load feed items on page load
document.addEventListener('DOMContentLoaded', async () => {
  const items = await loadFeed();
  displayFeed(items);
});
