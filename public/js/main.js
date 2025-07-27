import { loadFeed, displayFeed } from './feed.js';


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


// Load gallery and feed on page load
document.addEventListener('DOMContentLoaded', () => {
  loadGallery();
  loadFeed();
});


// Handle form submission for new posts
document.getElementById('feed-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.getElementById('feed-title').value;
  const content = document.getElementById('feed-input').value; // Corrected ID

  try {
    const response = await fetch('/api/update-feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Post added successfully!');
      document.getElementById('feed-form').reset();
      loadFeed(); // Reload feed to show new post
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error adding post:', error);
    alert('Failed to add post.');
  }
});


// Event delegation for edit and delete buttons on feed items
document.getElementById('feed-content').addEventListener('click', async (event) => {
  const target = event.target;
  const postElement = target.closest('.post');
  if (!postElement) return;

  const id = postElement.dataset.id;

  if (target.classList.contains('delete-btn')) {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/update-feed?id=${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          postElement.remove();
          alert('Post deleted successfully!');
        } else {
          const data = await response.json();
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
      }
    }
  }

  if (target.classList.contains('edit-btn')) {
    const titleElement = postElement.querySelector('h3');
    const contentElement = postElement.querySelector('p');

    // Store original content in case of cancellation
    const originalTitle = titleElement.textContent;
    const originalContent = contentElement.textContent;

    titleElement.contentEditable = true;
    contentElement.contentEditable = true;
    titleElement.focus();

    // Store the original edit button
    const originalEditButton = target;

    // Create Save and Cancel buttons
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'save-btn';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'cancel-btn';

    // Replace Edit button with Save and Cancel
    originalEditButton.style.display = 'none'; // Hide the original edit button
    postElement.appendChild(saveButton);
    postElement.appendChild(cancelButton);

    const cleanup = () => {
      titleElement.contentEditable = false;
      contentElement.contentEditable = false;
      saveButton.removeEventListener('click', handleSave);
      cancelButton.removeEventListener('click', handleCancel);
      saveButton.remove();
      cancelButton.remove();
      originalEditButton.style.display = ''; // Show the original edit button
    };

    const handleSave = async () => {
      const newTitle = titleElement.textContent;
      const newContent = contentElement.textContent;

      try {
        const response = await fetch(`/api/update-feed?id=${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle, content: newContent })
        });

        if (response.ok) {
          alert('Post updated successfully!');
          cleanup();
        } else {
          const data = await response.json();
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error updating post:', error);
        alert('Failed to update post.');
        cleanup(); // Ensure cleanup even on error
      }
    };

    const handleCancel = () => {
      titleElement.textContent = originalTitle;
      contentElement.textContent = originalContent;
      cleanup();
    };

    saveButton.addEventListener('click', handleSave);
    cancelButton.addEventListener('click', handleCancel);
  }
});