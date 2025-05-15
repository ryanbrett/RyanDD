<?php
session_start();

$input = json_decode(file_get_contents('php://input'), true);

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    if (isset($input['id'])) {
        $galleryFile = 'gallery.json';
        $galleryItems = [];
        if (file_exists($galleryFile)) {
            $galleryItems = json_decode(file_get_contents($galleryFile), true);
        }

        if (isset($galleryItems[$input['id']])) {
            array_splice($galleryItems, $input['id'], 1);
            if (file_put_contents($galleryFile, json_encode($galleryItems)) !== false) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to write to gallery.json']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Item not found']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
}
?>
