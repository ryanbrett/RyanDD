import { loadFeed, displayFeed } from './feed.js';
import { loadGallery, displayGallery } from './gallery.js';

let currentPage = 1;
let loading = false;
let totalItems = 0;
const pageSize = 5;

document.addEventListener('DOMContentLoaded', async () => {
  // Load initial feed and gallery
  await initFeed();
  await initGallery();

  // Scroll event for infinite feed
  window.addEventListener('scroll', handleScroll);
});

async function initFeed() {
  const data = await loadFeed(currentPage);
  displayFeed(data.items);
  totalItems = data.total || 0;
}

async function initGallery() {
  const galleryItems = await loadGallery();
  displayGallery(galleryItems);
}

async function handleScroll() {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (nearBottom && !loading && (currentPage * pageSize < totalItems)) {
    loading = true;
    currentPage++;
    const data = await loadFeed(currentPage);
    displayFeed(data.items);
    loading = false;
  }
}
