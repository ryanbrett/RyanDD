<?php
session_start();

$input = json_decode(file_get_contents('php://input'), true);

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    if (isset($input['id'])) {
        $feedFile = 'feed.json';
        $feedItems = [];
        if (file_exists($feedFile)) {
            $feedItems = json_decode(file_get_contents($feedFile), true);
        }

        if (isset($feedItems[$input['id']])) {
            array_splice($feedItems, $input['id'], 1);
            if (file_put_contents($feedFile, json_encode($feedItems)) !== false) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to write to feed.json']);
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
