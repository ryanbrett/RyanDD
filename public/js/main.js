import { loadFeed, displayFeed } from './feed.js';

document.addEventListener('DOMContentLoaded', () => {
  loadFeed();

  const form = document.getElementById('feed-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('feed-title').value.trim();
    const content = document.getElementById('feed-content').value.trim();

    if (!title || !content) return alert('Please enter both title and content.');

    try {
      const res = await fetch('/api/update-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      const result = await res.json();

      if (res.ok) {
        // Optionally clear form
        form.reset();

        // Display the new item immediately
        displayFeed([result.item]);

        // Optionally scroll to the top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(result.message || 'Error submitting feed');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('An error occurred');
    }
  });
});

/*
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
*/