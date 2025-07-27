import { loadFeed, displayFeed } from './feed.js';
import { loadGallery } from './gallery.js';

// --- UTILITY FUNCTIONS ---
function
escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}


// --- DOM ELEMENTS ---
const feedContent = document.getElementById('feed-content');
const galleryContent = document.getElementById('gallery-content');
const feedForm = document.getElementById('feed-form');
const galleryForm = document.getElementById('gallery-form');
const feedTitleInput = document.getElementById('feed-title');
const feedContentInput = document.getElementById('feed-input-content');
const gallerySrcInput = document.getElementById('gallery-src');
const galleryAltInput = document.getElementById('gallery-alt');
const toggleAdminBtn = document.getElementById('toggle-admin');
const adminTools = document.getElementById('admin-tools');


// --- EVENT LISTENERS ---

// Toggle Admin Tools
toggleAdminBtn.addEventListener('click', () => {
  const isHidden = adminTools.style.display === 'none';
  adminTools.style.display = isHidden ? 'block' : 'none';
  toggleAdminBtn.textContent = isHidden ? '▲ Hide Admin Tools' : '▼ Show Admin Tools';
});

// Feed Form Submission (Add/Update)
feedForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = feedTitleInput.value.trim();
  const content = feedContentInput.value.trim();
  const editingId = feedForm.dataset.editingId;

  if (!title || !content) {
    alert('❌ Title and content are required.');
    return;
  }

  const url = editingId ? `/api/update-feed?id=${editingId}` : '/api/update-feed';
  const method = editingId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    const result = await res.json();

    if (res.ok) {
      alert(`✅ ${result.message}`);
      feedForm.reset();
      delete feedForm.dataset.editingId;
      const items = await loadFeed();
      displayFeed(items);
    } else {
      alert(`❌ ${result.message}`);
    }
  } catch (err) {
    console.error('Feed form submission error:', err);
    alert('❌ An error occurred.');
  }
});

// Gallery Form Submission (Add/Update)
galleryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const src = gallerySrcInput.value.trim();
  const alt = galleryAltInput.value.trim();
  const editingId = galleryForm.dataset.editingId;

  if (!src || !alt) {
    alert('❌ Image URL and alt text are required.');
    return;
  }

  const url = editingId ? `/api/update-gallery?id=${editingId}` : '/api/update-gallery';
  const method = editingId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ src, alt }),
    });
    const result = await res.json();

    if (res.ok) {
      alert(`✅ ${result.message}`);
      galleryForm.reset();
      delete galleryForm.dataset.editingId;
      await loadGallery();
    } else {
      alert(`❌ ${result.message}`);
    }
  } catch (err) {
    console.error('Gallery form submission error:', err);
    alert('❌ An error occurred.');
  }
});

// Feed Content Event Delegation (Edit/Delete)
feedContent.addEventListener('click', async (e) => {
  const target = e.target;
  const post = target.closest('.post');
  if (!post) return;

  const id = post.dataset.id;

  // Handle Edit
  if (target.classList.contains('edit-btn')) {
    feedTitleInput.value = target.dataset.title;
    feedContentInput.value = target.dataset.content;
    feedForm.dataset.editingId = id;
    feedTitleInput.focus();
  }

  // Handle Delete
  if (target.classList.contains('delete-btn')) {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const res = await fetch(`/api/delete-feed?id=${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (res.ok) {
          alert(`✅ ${result.message}`);
          const items = await loadFeed();
          displayFeed(items);
        } else {
          alert(`❌ ${result.message}`);
        }
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('❌ An error occurred while deleting the post.');
      }
    }
  }
});

// Gallery Content Event Delegation (Edit/Delete)
galleryContent.addEventListener('click', async (e) => {
  const target = e.target;
  const item = target.closest('.gallery-item');
  if (!item) return;

  const id = target.dataset.id;

  // Handle Edit
  if (target.classList.contains('edit-gallery')) {
    gallerySrcInput.value = target.dataset.src;
    galleryAltInput.value = target.dataset.alt;
    galleryForm.dataset.editingId = id;
    gallerySrcInput.focus();
  }

  // Handle Delete
  if (target.classList.contains('delete-gallery')) {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      try {
        const res = await fetch(`/api/delete-gallery?id=${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (res.ok) {
          alert(`✅ ${result.message}`);
          await loadGallery();
        } else {
          alert(`❌ ${result.message}`);
        }
      } catch (err) {
        console.error('Error deleting gallery item:', err);
        alert('❌ An error occurred while deleting the item.');
      }
    }
  }
});


// --- INITIALIZATION ---
async function init() {
  const items = await loadFeed();
  displayFeed(items);
  await loadGallery();
}

document.addEventListener('DOMContentLoaded', init);
