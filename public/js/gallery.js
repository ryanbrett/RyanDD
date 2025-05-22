export async function loadGallery() {
  try {
    const response = await fetch('/api/get-gallery');
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error loading gallery:', error);
    return [];
  }
}

export function displayGallery(items) {
  const galleryContent = document.getElementById('gallery-content');
  galleryContent.innerHTML = ''; // Clear existing items
  items.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('gallery-item');
    div.innerHTML = `<img src="${item.src}" alt="${item.alt}">`;
    galleryContent.appendChild(div);
  });
}
