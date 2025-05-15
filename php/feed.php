<?php
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$size = isset($_GET['size']) ? (int)$_GET['size'] : 5;

$feedFile = '../json/feed.json';

if (file_exists($feedFile)) {
    $feedItems = json_decode(file_get_contents($feedFile), true);
} else {
    $feedItems = [];
}

// Calculate start and end indices for pagination
$start = ($page - 1) * $size;
$pagedItems = array_slice($feedItems, $start, $size);

header('Content-Type: application/json');
echo json_encode([
    'items' => $pagedItems,
    'total' => count($feedItems)
]);
?>
