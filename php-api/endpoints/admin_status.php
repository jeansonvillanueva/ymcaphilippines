<?php
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

sendResponse([
    'authenticated' => isAdminAuthenticated(),
    'username' => $_SESSION['admin_username'] ?? null,
]);
