document.addEventListener('DOMContentLoaded', function() {
    loadFeed();
    loadGallery();
    window.addEventListener('scroll', handleScroll);
});

let currentPage = 1;
const pageSize = 5;
let loading = false;
let totalItems = 0;

function loadFeed(page = 1) {
    if (loading || (totalItems && ((page - 1) * pageSize >= totalItems))) return;
    loading = true;
    document.getElementById('loading').style.display = 'block';

    fetch(`php/feed.php?page=${page}&size=${pageSize}`)
        .then(response => response.json())
        .then(data => {
            displayFeed(data.items);
            totalItems = data.total;
            loading = false;
            document.getElementById('loading').style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading feed:', error);
            loading = false;
            document.getElementById('loading').style.display = 'none';
        });
}

function displayFeed(items) {
    const feedContent = document.getElementById('feed-content');
    items.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('feed-item');
        div.innerHTML = `<h3>${item.title}</h3><p>${item.content}</p>`;
        feedContent.appendChild(div);
    });
}

function loadGallery() {
    fetch('php/gallery.php')
        .then(response => response.json())
        .then(galleryItems => displayGallery(galleryItems))
        .catch(error => console.error('Error loading gallery:', error));
}

function displayGallery(items) {
    const galleryContent = document.getElementById('gallery-content');
    galleryContent.innerHTML = ''; // Clear existing items
    items.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('gallery-item');
        div.innerHTML = `<img src="${item.src}" alt="${item.alt}">`;
        galleryContent.appendChild(div);
    });
}

function handleScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        currentPage++;
        loadFeed(currentPage);
    }
}
