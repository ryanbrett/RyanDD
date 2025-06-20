//only added code
import { loadFeed, displayFeed } from './feed.js';
//only added code

document.getElementById('feed-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('feed-title').value.trim();
  const content = document.getElementById('feed-content').value.trim();
  const form = document.getElementById('feed-form');
  const editingId = form.dataset.editingId;
  const status = document.getElementById('submit-status');

  if (!title || !content) {
    status.textContent = 'Please fill out both fields.';
    return;
  }

  const method = editingId ? 'PUT' : 'POST';
  const url = editingId ? `/api/update-feed?id=${editingId}` : '/api/update-feed';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });

    const data = await res.json();

    if (res.ok) {
      status.textContent = editingId ? '✅ Post updated!' : '✅ Feed updated successfully!';
      form.reset();
      delete form.dataset.editingId;

      const items = await loadFeed();
      displayFeed(items);
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

//Show/Hide admin tools
document.getElementById('toggle-admin').addEventListener('click', () => {
  const adminTools = document.getElementById('admin-tools');
  const toggleBtn = document.getElementById('toggle-admin');

  const isHidden = adminTools.style.display === 'none';

  adminTools.style.display = isHidden ? 'block' : 'none';
  toggleBtn.textContent = isHidden ? '▲ Hide Admin Tools' : '▼ Show Admin Tools';
});

// LOAD GALLERY
import { loadGallery } from './gallery.js';

document.getElementById('gallery-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const src = document.getElementById('gallery-src').value.trim();
  const alt = document.getElementById('gallery-alt').value.trim();
  const status = document.getElementById('submit-status');

  const form = document.getElementById('gallery-form');
  const editingId = form.dataset.editingId;

  const method = editingId ? 'PUT' : 'POST';
  const url = editingId ? `/api/update-gallery?id=${editingId}` : '/api/update-gallery';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ src, alt })
    });

    const data = await res.json();
    if (res.ok) {
      alert(editingId ? '✅ Image updated' : '✅ Image added');
      form.reset();
      delete form.dataset.editingId;
      loadGallery();
    } else {
      alert(`❌ ${data.message}`);
    }
  } catch (err) {
    console.error(err);
    alert('❌ Failed to submit image');
  }
});


// Load gallery on page load
document.addEventListener('DOMContentLoaded', () => {
  loadGallery();
});
