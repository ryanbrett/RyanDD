export async function loadFeed() {
  try {
    const response = await fetch('/api/get-feed');
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error loading feed:', error);
    return [];
  }
}

export function displayFeed(items) {
  const feedContent = document.getElementById('feed-content');
  feedContent.innerHTML = ''; // Clear existing content
  items.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('feed-item');
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.content}</p>
      <small>${new Date(item.created).toLocaleString()}</small>
    `;
    feedContent.appendChild(div);
  });
}
