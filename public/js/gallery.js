export async function loadGallery() {
  try {
    const res = await fetch('/api/get-gallery');
    const data = await res.json();

    const container = document.getElementById('gallery-content');
    container.innerHTML = '';

    data.items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      div.innerHTML = `
        <img src="${item.src}" alt="${item.alt}">
        <div class="actions">
          <button class="edit-gallery" data-id="${item.id}" data-src="${item.src}" data-alt="${item.alt}">✏️</button>
          <button class="delete-gallery" data-id="${item.id}">🗑️</button>
        </div>
      `;
      container.appendChild(div);
    });

    // Set up delete event listeners
    document.querySelectorAll('.delete-gallery').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this image?')) {
          const res = await fetch(`/api/delete-gallery?id=${id}`, { method: 'DELETE' });
          const result = await res.json();
          if (res.ok) {
            alert('✅ Image deleted');
            loadGallery();
          } else {
            alert(`❌ ${result.message}`);
          }
        }
      });
    });

    // Set up edit event listeners
    document.querySelectorAll('.edit-gallery').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const src = btn.getAttribute('data-src');
        const alt = btn.getAttribute('data-alt');

        // Fill form with existing values
        document.getElementById('gallery-src').value = src;
        document.getElementById('gallery-alt').value = alt;
        document.getElementById('gallery-form').dataset.editingId = id;

        // Show admin tools section
        document.getElementById('admin-tools').style.display = 'block';
        document.getElementById('toggle-admin').textContent = '▲ Hide Admin Tools';
      });
    });

  } catch (err) {
    console.error('Error loading gallery:', err);
  }
}
