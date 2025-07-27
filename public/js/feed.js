function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

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
  if (!container) return;
  container.innerHTML = '';

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'post'; // Use 'post' to match main.js event listener
    div.dataset.id = item.id;
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.content}</p>
      <small>${new Date(item.created).toLocaleString()}</small>
      <div class="actions">
        <button class="edit-btn" data-title="${escapeHTML(item.title)}" data-content="${escapeHTML(item.content)}">✏️</button>
        <button class="delete-btn">🗑️</button>
      </div>
    `;
    container.appendChild(div);
  });
}

