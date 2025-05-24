const pageSize = 5;

export async function loadFeed(page = 1) {
  try {
    const response = await fetch(`/api/get-feed?page=${page}&size=${pageSize}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading feed:', error);
    return { items: [], total: 0 };
  }
}

export function displayFeed(items) {
  const feedContent = document.getElementById('feed-content');
  items.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('feed-item');
    div.innerHTML = `<h3>${item.title}</h3><p>${item.content}</p>`;
    feedContent.appendChild(div);
  });
}

export async function updateFeed({ password, title, content }) {
  try {
    const res = await fetch('/api/update-feed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, title, content }),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Failed to update feed:', error);
    return { success: false };
  }
}
