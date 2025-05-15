<?php
session_start();

$adminPassword = 'pwopwo'; // Replace with your actual password

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($input['password'])) {
        // Handle login request
        if ($input['password'] === $adminPassword) {
            $_SESSION['loggedin'] = true;
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Incorrect password']);
        }
    } elseif (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
        // Handle feed update request
        if (isset($input['title']) && isset($input['content'])) {
            $newItem = [
                'title' => $input['title'],
                'content' => $input['content']
            ];

            $feedFile = '../json/feed.json';
            $feedItems = [];
            if (file_exists($feedFile)) {
                $feedItems = json_decode(file_get_contents($feedFile), true);
            }

            // Add new item at the beginning
            array_unshift($feedItems, $newItem);

            // Log the operation
            error_log("Adding new item: " . json_encode($newItem));
            error_log("Updated feed items: " . json_encode($feedItems));

            // Write to the feed file
            if (file_put_contents($feedFile, json_encode($feedItems)) === false) {
                error_log("Failed to write to feed.json");
                echo json_encode(['success' => false, 'message' => 'Failed to write to feed.json']);
            } else {
                echo json_encode(['success' => true]);
            }
        } else {
            error_log("Invalid input: " . json_encode($input));
            echo json_encode(['success' => false, 'message' => 'Invalid input']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
