function loadFeed(page = 1) {
    if (loading || (totalItems && ((page - 1) * pageSize >= totalItems))) return;
    loading = true;
    document.getElementById('loading').style.display = 'block';

    fetch(`/api/feed.js?page=${page}&size=${pageSize}`) // 👈 CHANGE FROM 'php/feed.php'
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
