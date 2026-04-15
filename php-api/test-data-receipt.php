<?php
require_once 'config.php';
require_once 'utils.php';

header('Content-Type: application/json');

// Test endpoint to see what data is received
$data = getPostData();

$response = [
    'timestamp' => date('Y-m-d H:i:s'),
    'method' => $_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN',
    'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'UNKNOWN',
    'raw_post_keys' => array_keys($_POST),
    'raw_files_count' => count($_FILES),
    'parsed_data' => $data,
    'parsed_data_keys' => array_keys($data),
    'raw_input' => file_get_contents('php://input'),
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>