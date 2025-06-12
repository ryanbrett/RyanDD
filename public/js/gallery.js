export async function loadGallery() {
  try {
    const res = await fetch('/api/get-gallery');
    const { items } = await res.json();

    const container = document.getElementById('gallery-content');
    container.innerHTML = '';

    items.forEach(({ src, alt }) => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      div.innerHTML = `<img src="${src}" alt="${alt}">`;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error loading gallery:', err);
  }
}
