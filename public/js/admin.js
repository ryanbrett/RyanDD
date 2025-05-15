document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const password = document.getElementById('admin-password').value;

    fetch('../php/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('update-feed-form').style.display = 'block';
            document.getElementById('update-gallery-form').style.display = 'block';
            document.getElementById('admin-feed').style.display = 'block';
            document.getElementById('admin-gallery').style.display = 'block';
            loadAdminFeed();
            loadAdminGallery();
            document.getElementById('admin-message').textContent = '';
        } else {
            document.getElementById('admin-message').textContent = data.message || 'Incorrect password!';
            document.getElementById('admin-message').style.color = 'red';
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('update-feed-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('feed-title').value;
    const content = document.getElementById('feed-content').value;

    fetch('../php/update_feed.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
    })
    .then(response => response.json())
    .then(data => {
        const messageDiv = document.getElementById('admin-message');
        if (data.success) {
            messageDiv.textContent = 'Feed item added successfully!';
            messageDiv.style.color = 'green';
            loadAdminFeed();
        } else {
            messageDiv.textContent = data.message || 'Error adding feed item!';
            messageDiv.style.color = 'red';
        }
        document.getElementById('update-feed-form').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('admin-message').textContent = 'An error occurred while adding the feed item.';
        document.getElementById('admin-message').style.color = 'red';
    });
});

document.getElementById('update-gallery-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const src = document.getElementById('gallery-src').value;
    const alt = document.getElementById('gallery-alt').value;
    const upload = document.getElementById('gallery-upload').files[0];

    if (upload) {
        const formData = new FormData();
        formData.append('upload', upload);

        fetch('../php/upload_image.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                addGalleryItem(data.url, alt);
            } else {
                document.getElementById('admin-message').textContent = data.message || 'Error uploading image!';
                document.getElementById('admin-message').style.color = 'red';
            }
        })
        .catch(error => console.error('Error:', error));
    } else if (src) {
        addGalleryItem(src, alt);
    } else {
        document.getElementById('admin-message').textContent = 'Please provide an image URL or upload a file.';
        document.getElementById('admin-message').style.color = 'red';
    }
});

function addGalleryItem(src, alt) {
    fetch('../php/update_gallery.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ src, alt })
    })
    .then(response => response.json())
    .then(data => {
        const messageDiv = document.getElementById('admin-message');
        if (data.success) {
            messageDiv.textContent = 'Gallery item added successfully!';
            messageDiv.style.color = 'green';
            loadAdminGallery();
        } else {
            messageDiv.textContent = data.message || 'Error adding gallery item!';
            messageDiv.style.color = 'red';
        }
        document.getElementById('update-gallery-form').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('admin-message').textContent = 'An error occurred while adding the gallery item.';
        document.getElementById('admin-message').style.color = 'red';
    });
}

function loadAdminFeed() {
    fetch('../php/feed.php')
        .then(response => response.json())
        .then(data => displayAdminFeed(data.items))
        .catch(error => console.error('Error loading feed:', error));
}

function displayAdminFeed(items) {
    const feedContent = document.getElementById('admin-feed-content');
    feedContent.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('feed-item');
        div.innerHTML = `<h3>${item.title}</h3><p>${item.content}</p><button onclick="deleteFeedItem(${index})">Delete</button>`;
        feedContent.appendChild(div);
    });
}

function deleteFeedItem(id) {
    fetch('../php/delete_feed.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadAdminFeed();
        } else {
            alert(data.message || 'Error deleting feed item!');
        }
    })
    .catch(error => console.error('Error:', error));
}

function loadAdminGallery() {
    fetch('../php/gallery.php')
        .then(response => response.json())
        .then(data => displayAdminGallery(data))
        .catch(error => console.error('Error loading gallery:', error));
}

function displayAdminGallery(items) {
    const galleryContent = document.getElementById('admin-gallery-content');
    galleryContent.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('gallery-item');
        div.innerHTML = `<img src="${item.src}" alt="${item.alt}"><button onclick="deleteGalleryItem(${index})">Delete</button>`;
        galleryContent.appendChild(div);
    });
}

function deleteGalleryItem(id) {
    fetch('../php/delete_gallery.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadAdminGallery();
        } else {
            alert(data.message || 'Error deleting gallery item!');
        }
    })
    .catch(error => console.error('Error:', error));
}
