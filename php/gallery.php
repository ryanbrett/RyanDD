<?php
$galleryFile = '../json/gallery.json';

if (file_exists($galleryFile)) {
    $galleryItems = json_decode(file_get_contents($galleryFile), true);
} else {
    $galleryItems = [];
}

header('Content-Type: application/json');
echo json_encode($galleryItems);
?>
