<?php
require_once 'config.php';

// Create uploads directory if it doesn't exist
$uploadDir = __DIR__ . '/../backend/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Function to handle file uploads
function handleFileUpload($fieldName = 'image') {
    global $uploadDir;

    if (!isset($_FILES[$fieldName]) || $_FILES[$fieldName]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $file = $_FILES[$fieldName];

    // Check if it's an image
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Only image files are allowed']);
        exit();
    }

    // Check file size (5MB limit)
    if ($file['size'] > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['error' => 'File size too large. Maximum 5MB allowed.']);
        exit();
    }

    // Generate unique filename
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = date('Y-m-d-H-i-s') . '-' . uniqid() . '.' . $ext;
    $filepath = $uploadDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        return '/uploads/' . $filename;
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload file']);
        exit();
    }
}

// Function to get POST data
function getPostData() {
    return json_decode(file_get_contents('php://input'), true);
}

// Function to send JSON response
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

// Function to validate required fields
function validateRequired($data, $requiredFields) {
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            sendResponse(['error' => "Field '$field' is required"], 400);
        }
    }
}
?>