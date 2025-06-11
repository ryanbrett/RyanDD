export async function loadFeed() {
  try {
    const res = await fetch('/api/get-feed');
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to load feed');

    return data.items;
  } catch (err) {
    console.error('Error loading feed:', err);
    return [];
  }
}

export function displayFeed(items) {
  const container = document.getElementById('feed-content');
  container.innerHTML = ''; // Clear existing

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'feed-item';
    div.innerHTML = `<h3>${item.title}</h3><p>${item.content}</p><small>${new Date(item.created).toLocaleString()}</small>`;
    container.appendChild(div);
  });
}
