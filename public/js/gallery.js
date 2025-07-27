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
        <p>${item.alt}</p>
        <div class="actions">
          <button class="edit-gallery" data-id="${item.id}" data-src="${item.src}" data-alt="${item.alt}">✏️</button>
          <button class="delete-gallery" data-id="${item.id}">🗑️</button>
        </div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error loading gallery:', err);
  }
}
