<?php
/**
 * Diagnostic endpoint to debug news update requests
 * Access via: https://ymca.ph/php-api/index.php?path=/diagnose-news-update-request
 */

header('Content-Type: application/json');

// Get raw input
$rawInput = file_get_contents('php://input');
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN';

// Parse FormData manually
$boundary = null;
if (preg_match('/boundary=([^;]+)/', $contentType, $match)) {
    $boundary = trim($match[1], '"');
}

$formData = [];
if ($boundary && !empty($rawInput)) {
    $parts = explode('--' . $boundary, $rawInput);
    foreach ($parts as $part) {
        if (preg_match('/name=["\']?([^"\'\s]+)["\']?/i', $part, $nameMatch)) {
            $fieldName = $nameMatch[1];
            
            // Find value after headers
            $headerEnd = strpos($part, "\r\n\r\n");
            if ($headerEnd === false) {
                $headerEnd = strpos($part, "\n\n");
                if ($headerEnd !== false) {
                    $value = substr($part, $headerEnd + 2);
                } else {
                    continue;
                }
            } else {
                $value = substr($part, $headerEnd + 4);
            }
            
            $value = trim($value, "\r\n ");
            $formData[$fieldName] = substr($value, 0, 100); // Limit output for readability
        }
    }
}

// Check for _method field
$hasMethodOverride = isset($_POST['_method']) || isset($formData['_method']);
$methodValue = $_POST['_method'] ?? $formData['_method'] ?? 'NOT FOUND';

// Check for id field
$hasId = isset($_GET['id']) || isset($_POST['id']) || isset($formData['id']);
$idValue = $_GET['id'] ?? $_POST['id'] ?? $formData['id'] ?? 'NOT FOUND';

$response = [
    'status' => 'diagnostic',
    'timestamp' => date('Y-m-d H:i:s'),
    'request_method' => $requestMethod,
    'content_type' => $contentType,
    'boundary_found' => $boundary !== null,
    'boundary_value' => $boundary,
    'raw_input_length' => strlen($rawInput),
    'raw_input_preview' => substr($rawInput, 0, 200),
    'form_data_fields' => array_keys($formData),
    'form_data' => $formData,
    'get_parameters' => $_GET,
    'post_data_keys' => array_keys($_POST),
    'has_method_override' => $hasMethodOverride,
    'method_value' => $methodValue,
    'has_id' => $hasId,
    'id_value' => $idValue,
    'server_request_method' => $_SERVER['REQUEST_METHOD'] ?? 'NOT SET',
];

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
