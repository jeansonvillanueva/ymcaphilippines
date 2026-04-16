<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$data = getPostData();
validateRequired($data, ['username', 'password']);

$username = trim($data['username']);
$password = trim($data['password']);

if (loginAdmin($username, $password)) {
    sendResponse(['authenticated' => true, 'username' => $username]);
}

sendResponse(['authenticated' => false, 'error' => 'Invalid username or password'], 401);
