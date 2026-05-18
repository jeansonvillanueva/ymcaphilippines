<?php
// Ultra-simple test - no database, no includes
header('Content-Type: application/json');

$response = [
    'status' => 'OK',
    'message' => 'PHP is executing!',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'server_name' => $_SERVER['SERVER_NAME'] ?? 'unknown',
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'unknown',
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
