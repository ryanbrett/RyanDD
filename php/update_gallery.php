<?php
session_start();

$adminPassword = 'pwopwo'; // Replace with your actual password

$input = json_decode(file_get_contents('php://input'), true);

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    if (isset($input['src']) && isset($input['alt'])) {
        // Normalize URL
        if (!preg_match('/^https?:\/\//', $input['src'])) {
            $input['src'] = 'https://' . $input['src'];
        }

        $newItem = [
            'src' => $input['src'],
            'alt' => $input['alt']
        ];

        $galleryFile = '../json/gallery.json';
        $galleryItems = [];
        if (file_exists($galleryFile)) {
            $galleryItems = json_decode(file_get_contents($galleryFile), true);
        }

        // Add new item at the beginning
        array_unshift($galleryItems, $newItem);

        // Write to the gallery file
        if (file_put_contents($galleryFile, json_encode($galleryItems)) === false) {
            echo json_encode(['success' => false, 'message' => 'Failed to write to gallery.json']);
        } else {
            echo json_encode(['success' => true]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
}
?>
