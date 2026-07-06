<?php
require_once 'config.php';

// Create uploads directory if it doesn't exist
$uploadDir = __DIR__ . '/../backend/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Function to handle file uploads
function handleDocumentUpload($fieldName = 'document') {
    if (!isset($_FILES[$fieldName])) {
        error_log('[handleDocumentUpload] No file uploaded for field: ' . $fieldName);
        return null;
    }

    $file = $_FILES[$fieldName];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        error_log('[handleDocumentUpload] Upload error for ' . $fieldName . ': ' . $file['error']);
        return null;
    }

    $allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
    ];

    if (!in_array($file['type'], $allowedTypes)) {
        sendResponse(['error' => 'Only PDF, DOC, DOCX, XLS, XLSX, and TXT files are allowed'], 400);
    }

    if ($file['size'] > 10 * 1024 * 1024) {
        sendResponse(['error' => 'Document file size must be less than 10MB'], 400);
    }

    $uploadDir = __DIR__ . '/uploads/documents/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $uniqueFilename = time() . '_' . basename($file['name']);
    $filePath = $uploadDir . $uniqueFilename;

    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        sendResponse(['error' => 'Failed to save document file'], 500);
    }

    $basePath = getUploadBasePath();
    $urlPrefix = $basePath !== '' ? $basePath . '/php-api/uploads/documents/' : '/php-api/uploads/documents/';

    return [
        'url' => $urlPrefix . $uniqueFilename,
        'name' => $file['name'],
        'type' => $file['type'],
        'size' => (int)$file['size'],
    ];
}

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

function firstNonEmptyMatch($matches, $indexes) {
    foreach ($indexes as $index) {
        if (isset($matches[$index]) && $matches[$index] !== '') {
            return $matches[$index];
        }
    }

    return null;
}

function getPathRouteParam($segment) {
    $paths = [];

    if (isset($_GET['path']) && $_GET['path'] !== '') {
        $paths[] = parse_url($_GET['path'], PHP_URL_PATH) ?: $_GET['path'];
    }

    if (isset($_SERVER['REQUEST_URI']) && $_SERVER['REQUEST_URI'] !== '') {
        $requestUri = $_SERVER['REQUEST_URI'];
        $paths[] = parse_url($requestUri, PHP_URL_PATH) ?: $requestUri;

        $query = parse_url($requestUri, PHP_URL_QUERY);
        if ($query) {
            parse_str($query, $queryParams);
            if (isset($queryParams['path'])) {
                $paths[] = parse_url($queryParams['path'], PHP_URL_PATH) ?: $queryParams['path'];
            }
        }
    }

    $segment = preg_quote($segment, '#');
    foreach ($paths as $path) {
        if (preg_match('~/' . $segment . '/([^/?#]+)~', $path, $matches)) {
            return urldecode($matches[1]);
        }
    }

    return null;
}

function getNumericRouteId($segment) {
    $value = getPathRouteParam($segment);
    return ($value !== null && ctype_digit((string)$value)) ? (int)$value : 0;
}

// Function to get POST data - handles both JSON and FormData
function getPostData() {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    $actualMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $requestMethod = $actualMethod;

    // Check for method override
    $methodOverride = $_POST['_method'] ?? $_GET['_method'] ?? null;
    if ($methodOverride) {
        $requestMethod = strtoupper($methodOverride);
    }

    error_log('[getPostData] Method: ' . $requestMethod . ', Content-Type: ' . $contentType);
    error_log('[getPostData] _POST count: ' . count($_POST) . ', _FILES count: ' . count($_FILES));

    // POST multipart (including _method=PUT overrides): PHP already parsed fields/files.
    if ($actualMethod === 'POST' && !empty($_POST)) {
        error_log('[getPostData] Using _POST from actual POST request');
        return $_POST;
    }

    // For PUT/DELETE requests, prioritize JSON parsing
    if (in_array($requestMethod, ['PUT', 'DELETE', 'PATCH'])) {
        // Use cached input if available, otherwise read from stream
        if (function_exists('getPhpInput')) {
            $rawBody = getPhpInput();
        } else {
            $rawBody = file_get_contents('php://input');
        }
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
                if (!empty($parsed)) {
                    return $parsed;
                }

                if (!empty($_POST)) {
                    error_log('[getPostData] Manual parse empty; falling back to _POST: ' . json_encode($_POST));
                    return $_POST;
                }
            }
        }

        if (!empty($_POST)) {
            error_log('[getPostData] Raw body empty/unparsed; falling back to _POST: ' . json_encode($_POST));
            return $_POST;
        }
    }

    // If Content-Type is FormData or application/x-www-form-urlencoded, use $_POST
    if (strpos($contentType, 'multipart/form-data') !== false ||
        strpos($contentType, 'application/x-www-form-urlencoded') !== false) {
        error_log('[getPostData] Using _POST: ' . json_encode($_POST));
        return $_POST;
    }

    // Otherwise try to parse as JSON
    if (function_exists('getPhpInput')) {
        $rawBody = getPhpInput();
    } else {
        $rawBody = file_get_contents('php://input');
    }
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
        error_log('[parseMultipartFormDataFromRaw] Raw input is empty');
        return $data;
    }

    $boundary = getBoundaryFromContentType($contentType);
    if (!$boundary) {
        error_log('[parseMultipartFormDataFromRaw] Could not extract boundary from Content-Type: ' . $contentType);
        return $data;
    }

    error_log('[parseMultipartFormDataFromRaw] Using boundary: ' . $boundary);
    $parts = explode('--' . $boundary, $rawInput);
    
    foreach ($parts as $idx => $part) {
        $part = trim($part, "\r\n ");
        if (empty($part) || $part === '--') {
            continue;
        }

        // Extract field name and value
        if (preg_match('/name=["\']?([^"\'\s]+)["\']?/i', $part, $nameMatch)) {
            $fieldName = $nameMatch[1];
            
            // Find the value after the headers (handle both \r\n\r\n and \n\n)
            $headerEnd = strpos($part, "\r\n\r\n");
            if ($headerEnd === false) {
                $headerEnd = strpos($part, "\n\n");
                if ($headerEnd === false) {
                    // Try finding after single newline if double newline not found
                    $lines = preg_split('/\r?\n/', $part, 2);
                    if (count($lines) === 2) {
                        $value = trim($lines[1]);
                    } else {
                        continue;
                    }
                } else {
                    $value = substr($part, $headerEnd + 2);
                    $value = trim($value, "\r\n ");
                }
            } else {
                $value = substr($part, $headerEnd + 4);
                $value = trim($value, "\r\n ");
            }

            $data[$fieldName] = $value;
            error_log('[parseMultipartFormDataFromRaw] Parsed field: ' . $fieldName . ' = ' . (strlen($value) > 50 ? substr($value, 0, 50) . '...' : $value));
        }
    }

    error_log('[parseMultipartFormDataFromRaw] Total fields parsed: ' . count($data) . ', keys: ' . implode(', ', array_keys($data)));
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
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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

// Ensure news table/columns support 4-byte UTF-8 (emojis, etc.)
function ensureNewsUtf8Mb4($conn) {
    if (!$conn) {
        return;
    }

    $result = $conn->query(
        "SELECT TABLE_COLLATION FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'news'"
    );

    if (!$result || $result->num_rows === 0) {
        return;
    }

    $collation = $result->fetch_assoc()['TABLE_COLLATION'] ?? '';
    if (stripos($collation, 'utf8mb4') !== false) {
        return;
    }

    error_log('[ensureNewsUtf8Mb4] Converting news table from ' . $collation . ' to utf8mb4');
    $converted = $conn->query(
        'ALTER TABLE news CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
    );

    if (!$converted) {
        error_log('[ensureNewsUtf8Mb4] Conversion failed: ' . $conn->error);
    }
}

function getMysqliError($conn, $stmt = null) {
    if ($stmt instanceof mysqli_stmt && $stmt->error) {
        return $stmt->error;
    }
    if ($conn && $conn->error) {
        return $conn->error;
    }
    return 'Unknown database error';
}

function sanitizeNewsImageUrl($imageUrl) {
    $imageUrl = trim((string)$imageUrl);
    if ($imageUrl === '' || stripos($imageUrl, 'data:') === 0) {
        return '';
    }
    if (strlen($imageUrl) > 500) {
        error_log('[sanitizeNewsImageUrl] imageUrl exceeded 500 chars, clearing value');
        return '';
    }
    return $imageUrl;
}

// Function to ensure database has required columns
function ensureDatabaseSchema($conn) {
    if (!$conn) {
        return;
    }

    require_once __DIR__ . '/pillars_helper.php';

    try {
        ensureLocalPillarTables($conn);
        if (function_exists('ensureLocalProgramsColumns')) {
            ensureLocalProgramsColumns($conn);
        }
        migrateLegacyBulletsToCanonical($conn);
    } catch (Throwable $e) {
        error_log('[ensureDatabaseSchema] Pillars migration skipped: ' . $e->getMessage());
    }

    $localColumns = [
        'embedded_map_url' => 'varchar(1000) DEFAULT NULL',
    ];
    foreach ($localColumns as $column => $definition) {
        $localTableCheck = $conn->query("SHOW TABLES LIKE 'local'");
        if (!$localTableCheck || $localTableCheck->num_rows === 0) {
            break;
        }
        $columnCheck = $conn->query("SHOW COLUMNS FROM `local` LIKE '$column'");
        if ($columnCheck && $columnCheck->num_rows > 0) {
            continue;
        }
        $alterResult = $conn->query("ALTER TABLE `local` ADD COLUMN `$column` $definition");
        if (!$alterResult) {
            error_log("[ensureDatabaseSchema] Failed to add local.$column: " . $conn->error);
        }
    }

    ensureNewsUtf8Mb4($conn);

    $calendarColumns = [
        'documentTitle' => 'VARCHAR(255) DEFAULT NULL',
        'documentUrl' => 'VARCHAR(500) DEFAULT NULL',
        'documentFileName' => 'VARCHAR(255) DEFAULT NULL',
        'documentFileType' => 'VARCHAR(100) DEFAULT NULL',
        'documentFileSize' => 'INT DEFAULT NULL',
    ];

    $calendarTableCheck = $conn->query("SHOW TABLES LIKE 'calendar_events'");
    if ($calendarTableCheck && $calendarTableCheck->num_rows > 0) {
        foreach ($calendarColumns as $column => $definition) {
            $columnCheck = $conn->query("SHOW COLUMNS FROM calendar_events LIKE '$column'");
            if ($columnCheck && $columnCheck->num_rows > 0) {
                continue;
            }
            $alterResult = $conn->query("ALTER TABLE calendar_events ADD COLUMN `$column` $definition");
            if (!$alterResult) {
                error_log("[ensureDatabaseSchema] Failed to add calendar_events.$column: " . $conn->error);
            }
        }
    }

    $newsColumns = [
        'body' => 'TEXT',
        'localYMCA' => 'VARCHAR(100)',
        'contentBlocks' => 'LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
    ];

    foreach ($newsColumns as $column => $definition) {
        $result = $conn->query("SHOW COLUMNS FROM news LIKE '$column'");
        if ($result && $result->num_rows > 0) {
            continue;
        }

        error_log("[ensureDatabaseSchema] Adding news.$column column");
        $after = $column === 'contentBlocks' ? ' AFTER body' : '';
        $alterResult = $conn->query("ALTER TABLE news ADD COLUMN $column $definition$after");
        if ($alterResult) {
            error_log("[ensureDatabaseSchema] Successfully added news.$column");
        } else {
            error_log("[ensureDatabaseSchema] Failed to add news.$column: " . $conn->error);
        }
    }
}
?>
