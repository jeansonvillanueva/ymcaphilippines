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

    if (!isset($_FILES[$fieldName])) {
        error_log('[handleFileUpload] No file uploaded for field: ' . $fieldName);
        return null;
    }

    $file = $_FILES[$fieldName];
    $error = $file['error'];

    if ($error !== UPLOAD_ERR_OK) {
        error_log('[handleFileUpload] Upload error for ' . $fieldName . ': ' . $error);
        return null;
    }

    // Check if it's an image
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowedTypes)) {
        error_log('[handleFileUpload] Invalid file type: ' . $file['type']);
        return null;
    }

    // Check file size (2MB limit to match frontend compression)
    if ($file['size'] > 2 * 1024 * 1024) {
        error_log('[handleFileUpload] File too large: ' . $file['size']);
        return null;
    }

    // Generate unique filename
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = date('Y-m-d-H-i-s') . '-' . uniqid() . '.' . $ext;
    $filepath = $uploadDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        $url = getUploadBasePath() . '/backend/uploads/' . $filename;
        error_log('[handleFileUpload] File uploaded successfully: ' . $url);
        return $url;
    } else {
        error_log('[handleFileUpload] Failed to move uploaded file to: ' . $filepath);
        return null;
    }
}

function getUploadBasePath() {
    // On cPanel with structure: /testsite/php-api/
    // We need to return path that reaches /testsite/uploads/
    // (one level up from php-api)
    
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    error_log('[getUploadBasePath] SCRIPT_NAME: ' . $scriptName);
    
    // Extract the base path before /php-api/
    // Example: /testsite/php-api/index.php -> /testsite
    $basePath = preg_replace('#/php-api(/|$).*#', '', $scriptName);
    
    error_log('[getUploadBasePath] Calculated base path: ' . $basePath);
    
    if (empty($basePath) || $basePath === '/' || $basePath === '\\') {
        return '';
    }
    
    return rtrim($basePath, '/');
}

function getTableColumn($conn, $table, $column) {
    $snakeCase = strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $column));

    $result = $conn->query("SHOW COLUMNS FROM $table LIKE '$column'");
    if ($result && $result->num_rows > 0) {
        return $column;
    }

    $result = $conn->query("SHOW COLUMNS FROM $table LIKE '$snakeCase'");
    if ($result && $result->num_rows > 0) {
        return $snakeCase;
    }

    return $column;
}

// Function to get POST data - handles both JSON and FormData
function getPostData() {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    $requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    // Check for method override
    $methodOverride = $_POST['_method'] ?? $_GET['_method'] ?? null;
    if ($methodOverride) {
        $requestMethod = strtoupper($methodOverride);
    }

    error_log('[getPostData] Method: ' . $requestMethod . ', Content-Type: ' . $contentType);
    error_log('[getPostData] _POST count: ' . count($_POST) . ', _FILES count: ' . count($_FILES));

    // For PUT/DELETE requests, prioritize JSON parsing
    if (in_array($requestMethod, ['PUT', 'DELETE', 'PATCH'])) {
        $rawBody = file_get_contents('php://input');
        error_log('[getPostData] Raw body length: ' . strlen($rawBody));
        error_log('[getPostData] Raw body preview: ' . substr($rawBody, 0, 200));

        if (!empty($rawBody)) {
            // Try JSON first for PUT requests
            $data = json_decode($rawBody, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
                error_log('[getPostData] Successfully parsed as JSON: ' . json_encode($data));
                return $data;
            }

            // Try FormData parsing if JSON fails
            if (strpos($contentType, 'multipart/form-data') !== false) {
                $parsed = parseMultipartFormDataFromRaw($rawBody, $contentType);
                error_log('[getPostData] Using manual FormData parse: ' . json_encode($parsed));
                return $parsed;
            }
        }
    }

    // If Content-Type is FormData or application/x-www-form-urlencoded, use $_POST
    if (strpos($contentType, 'multipart/form-data') !== false ||
        strpos($contentType, 'application/x-www-form-urlencoded') !== false) {
        error_log('[getPostData] Using _POST: ' . json_encode($_POST));
        return $_POST;
    }

    // Otherwise try to parse as JSON
    $rawBody = file_get_contents('php://input');
    if (!empty($rawBody)) {
        $data = json_decode($rawBody, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
            error_log('[getPostData] Using JSON parse: ' . json_encode($data));
            return $data;
        }
    }

    // Fallback to $_POST if JSON parsing fails
    error_log('[getPostData] Fallback to _POST: ' . json_encode($_POST));
    return !empty($_POST) ? $_POST : [];
}

// Function to parse multipart form data manually for PUT requests
function parseMultipartFormData() {
    $data = [];

    // For PUT requests with multipart data, we need to parse the raw input
    $rawInput = file_get_contents('php://input');
    if (empty($rawInput)) {
        return $data;
    }

    // Simple multipart parser - extract field values
    // This is a basic implementation, might need enhancement for complex cases
    $boundary = getBoundaryFromContentType($_SERVER['CONTENT_TYPE'] ?? '');
    if (!$boundary) {
        return $data;
    }

    $parts = explode('--' . $boundary, $rawInput);
    foreach ($parts as $part) {
        $part = trim($part);
        if (empty($part) || $part === '--') continue;

        // Extract field name and value
        if (preg_match('/name="([^"]+)"/', $part, $nameMatch)) {
            $fieldName = $nameMatch[1];
            $value = '';

            // Find the value after the headers
            $headerEnd = strpos($part, "\r\n\r\n");
            if ($headerEnd !== false) {
                $value = substr($part, $headerEnd + 4);
                $value = rtrim($value, "\r\n");
            }

            $data[$fieldName] = $value;
        }
    }

    return $data;
}

// Alternative multipart parser for raw data
function parseMultipartFormDataFromRaw($rawInput, $contentType) {
    $data = [];

    if (empty($rawInput)) {
        return $data;
    }

    $boundary = getBoundaryFromContentType($contentType);
    if (!$boundary) {
        return $data;
    }

    $parts = explode('--' . $boundary, $rawInput);
    foreach ($parts as $part) {
        $part = trim($part);
        if (empty($part) || $part === '--') continue;

        // Extract field name and value
        if (preg_match('/name="([^"]+)"/', $part, $nameMatch)) {
            $fieldName = $nameMatch[1];
            $value = '';

            // Find the value after the headers
            $headerEnd = strpos($part, "\r\n\r\n");
            if ($headerEnd !== false) {
                $value = substr($part, $headerEnd + 4);
                $value = rtrim($value, "\r\n");
            }

            $data[$fieldName] = $value;
        }
    }

    return $data;
}

function getBoundaryFromContentType($contentType) {
    if (preg_match('/boundary=([^;]+)/', $contentType, $matches)) {
        return trim($matches[1], '"');
    }
    return null;
}

// Function to send JSON response
function sendResponse($data, $statusCode = 200) {
    if ($statusCode >= 500) {
        $logEntry = '[' . date('Y-m-d H:i:s') . '] ' . ($_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN') . ' ' . ($_SERVER['REQUEST_URI'] ?? 'UNKNOWN') . ' - ' . json_encode($data) . "\n";
        file_put_contents(__DIR__ . '/error.log', $logEntry, FILE_APPEND);
    }

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