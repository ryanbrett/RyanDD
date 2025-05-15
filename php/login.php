<?php
session_start();

$adminPassword = 'pwopwo'; // Replace with your actual password

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['password']) && $input['password'] === $adminPassword) {
    $_SESSION['loggedin'] = true;
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>

