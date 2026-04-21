<?php
// Debug script - no includes, no rewrites, no dependencies
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
header('Content-Type: application/json');

$debug = [
    'timestamp' => date('Y-m-d H:i:s'),
    'test' => 'FULL_DEBUG_CHECK',
    'checks' => [],
    'errors' => [],
];

// Check 1: Can we read config.php?
$debug['checks']['config_readable'] = false;
$configPath = __DIR__ . '/config.php';
if (file_exists($configPath)) {
    $debug['checks']['config_exists'] = true;
    $debug['checks']['config_readable'] = is_readable($configPath);
    if (!is_readable($configPath)) {
        $debug['errors'][] = "config.php exists but is NOT readable";
    }
} else {
    $debug['errors'][] = "config.php NOT FOUND at: " . $configPath;
}

// Check 2: Try to require config.php
$debug['checks']['config_require_test'] = false;
try {
    if (file_exists($configPath)) {
        require_once $configPath;
        $debug['checks']['config_require_test'] = true;
        $debug['info']['database_config_loaded'] = 'true';
    }
} catch (Exception $e) {
    $debug['errors'][] = "Failed to require config.php: " . $e->getMessage();
}

// Check 3: Check utils.php
$debug['checks']['utils_readable'] = false;
$utilsPath = __DIR__ . '/utils.php';
if (file_exists($utilsPath)) {
    $debug['checks']['utils_exists'] = true;
    $debug['checks']['utils_readable'] = is_readable($utilsPath);
    if (!is_readable($utilsPath)) {
        $debug['errors'][] = "utils.php exists but is NOT readable";
    }
} else {
    $debug['errors'][] = "utils.php NOT FOUND at: " . $utilsPath;
}

// Check 4: Database connection
$debug['checks']['database_test'] = 'NOT_ATTEMPTED';
if (function_exists('getDatabaseConnection')) {
    try {
        $conn = getDatabaseConnection();
        if ($conn && !$conn->connect_error) {
            $debug['checks']['database_test'] = 'CONNECTED';
            $debug['database']['host'] = 'localhost';
            $debug['database']['database'] = 'ymcaph_db';
            
            // Try a simple query
            $result = $conn->query("SELECT 1 as test");
            if ($result) {
                $debug['checks']['database_query'] = 'SUCCESS';
            } else {
                $debug['checks']['database_query'] = 'FAILED: ' . $conn->error;
                $debug['errors'][] = "Database query failed: " . $conn->error;
            }
        } else {
            $debug['checks']['database_test'] = 'FAILED';
            $debug['database']['error'] = $conn ? $conn->connect_error : 'Connection failed';
            $debug['errors'][] = "Database connection failed";
        }
    } catch (Exception $e) {
        $debug['checks']['database_test'] = 'EXCEPTION';
        $debug['errors'][] = "Database exception: " . $e->getMessage();
    }
} else {
    $debug['errors'][] = "getDatabaseConnection() function not available - config.php may not have loaded";
}

// Check 5: File system
$debug['checks']['uploads_exists'] = is_dir(__DIR__ . '/../backend/uploads/');
$debug['checks']['uploads_writable'] = is_writable(__DIR__ . '/../backend/uploads/');
if ($debug['checks']['uploads_exists'] && !$debug['checks']['uploads_writable']) {
    $debug['errors'][] = "Uploads directory exists but is NOT writable";
}

// Check 6: Endpoint files
$endpointsDir = __DIR__ . '/endpoints';
$debug['checks']['endpoints_dir_exists'] = is_dir($endpointsDir);
$debug['checks']['admin_login_exists'] = file_exists($endpointsDir . '/admin_login.php');
$debug['checks']['admin_locals_update_exists'] = file_exists($endpointsDir . '/admin_locals_update.php');

// Check 7: Server info
$debug['server'] = [
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'N/A',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'N/A',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
    'php_version' => phpversion(),
    'os' => php_uname('s'),
];

// Summary
$debug['summary'] = [
    'php_working' => true,
    'all_files_readable' => $debug['checks']['config_readable'] && $debug['checks']['utils_readable'],
    'database_connected' => $debug['checks']['database_test'] === 'CONNECTED',
    'error_count' => count($debug['errors']),
];

echo json_encode($debug, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
