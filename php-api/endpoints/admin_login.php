<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

error_log('[admin_login] Request method: ' . ($_SERVER['REQUEST_METHOD'] ?? 'unknown') . ', Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'unknown'));

$data = getPostData();
error_log('[admin_login] Parsed request data: ' . json_encode($data));

validateRequired($data, ['username', 'password']);

$username = trim($data['username']);
$password = trim($data['password']);

if (loginAdmin($username, $password)) {
    sendResponse(['authenticated' => true, 'username' => $username]);
}

error_log('[admin_login] Failed login attempt for username: ' . $username);
sendResponse(['authenticated' => false, 'error' => 'Invalid username or password'], 401);
