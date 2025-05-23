export function setupAdminForms() {
  const feedForm = document.getElementById('feed-form');
  const galleryForm = document.getElementById('gallery-form');

  feedForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('feed-title').value;
    const content = document.getElementById('feed-content').value;
    const password = document.getElementById('feed-password').value;

    const res = await fetch('/api/update-feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, password })
    });

    const data = await res.json();
    alert(data.success ? 'Feed updated!' : 'Failed to update feed');
    if (data.success) location.reload();
  });

  galleryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const src = document.getElementById('gallery-src').value;
    const alt = document.getElementById('gallery-alt').value;
    const password = document.getElementById('gallery-password').value;

    const res = await fetch('/api/update-gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ src, alt, password })
    });

    const data = await res.json();
    alert(data.success ? 'Gallery updated!' : 'Failed to update gallery');
    if (data.success) location.reload();
  });
}
