<?php
// This script tests if the API routing works correctly
header('Content-Type: application/json');

// Suppress errors initially to prevent HTML output
ini_set('display_errors', '0');
error_log('[test-api-routing] Starting test');

$result = [
    'test' => 'api_routing',
    'timestamp' => date('Y-m-d H:i:s'),
    'tests' => [],
];

try {
    // Test 1: Load config
    error_log('[test-api-routing] Test 1: Loading config...');
    if (!file_exists('config.php')) {
        $result['tests'][] = ['name' => 'config.php exists', 'status' => 'FAIL', 'error' => 'File not found'];
    } else {
        require_once 'config.php';
        $result['tests'][] = ['name' => 'config.php loaded', 'status' => 'PASS'];
    }

    // Test 2: Load utils
    error_log('[test-api-routing] Test 2: Loading utils...');
    if (!file_exists('utils.php')) {
        $result['tests'][] = ['name' => 'utils.php exists', 'status' => 'FAIL', 'error' => 'File not found'];
    } else {
        require_once 'utils.php';
        $result['tests'][] = ['name' => 'utils.php loaded', 'status' => 'PASS'];
    }

    // Test 3: Load auth
    error_log('[test-api-routing] Test 3: Loading auth...');
    if (!file_exists('auth.php')) {
        $result['tests'][] = ['name' => 'auth.php exists', 'status' => 'FAIL', 'error' => 'File not found'];
    } else {
        require_once 'auth.php';
        $result['tests'][] = ['name' => 'auth.php loaded', 'status' => 'PASS'];
    }

    // Test 4: Database connection
    error_log('[test-api-routing] Test 4: Testing database...');
    $conn = getDatabaseConnection();
    if ($conn === null) {
        $result['tests'][] = ['name' => 'database.connection', 'status' => 'FAIL', 'error' => 'getDatabaseConnection returned null'];
    } else {
        $result['tests'][] = ['name' => 'database.connection', 'status' => 'PASS'];
        
        // Test 5: Simple query
        error_log('[test-api-routing] Test 5: Running test query...');
        $test_result = $conn->query("SELECT 1 as test");
        if ($test_result === false) {
            $result['tests'][] = ['name' => 'database.query', 'status' => 'FAIL', 'error' => $conn->error];
        } else {
            $result['tests'][] = ['name' => 'database.query', 'status' => 'PASS'];
            $row = $test_result->fetch_assoc();
            $result['tests'][] = ['name' => 'database.result', 'status' => 'PASS', 'data' => $row];
        }
    }

    // Test 6: Check endpoint files
    error_log('[test-api-routing] Test 6: Checking endpoint files...');
    $endpoint_dir = 'endpoints';
    if (!is_dir($endpoint_dir)) {
        $result['tests'][] = ['name' => 'endpoints.directory', 'status' => 'FAIL', 'error' => 'endpoints directory not found'];
    } else {
        $files = @scandir($endpoint_dir);
        if ($files === false) {
            $result['tests'][] = ['name' => 'endpoints.directory', 'status' => 'FAIL', 'error' => 'Cannot read endpoints directory'];
        } else {
            $php_files = array_filter($files, fn($f) => strpos($f, '.php') > 0);
            $result['tests'][] = ['name' => 'endpoints.count', 'status' => 'PASS', 'count' => count($php_files)];
        }
    }

    // Test 7: Test a simple endpoint directly
    error_log('[test-api-routing] Test 7: Testing news.php endpoint...');
    if (file_exists('endpoints/news.php')) {
        // Simulate GET request
        $_SERVER['REQUEST_METHOD'] = 'GET';
        ob_start();
        try {
            include 'endpoints/news.php';
            $output = ob_get_clean();
            if (empty($output)) {
                $result['tests'][] = ['name' => 'endpoints.news', 'status' => 'OK', 'note' => 'Endpoint executed but produced no output'];
            } else {
                $result['tests'][] = ['name' => 'endpoints.news', 'status' => 'PASS', 'output_length' => strlen($output)];
            }
        } catch (Throwable $e) {
            ob_end_clean();
            $result['tests'][] = ['name' => 'endpoints.news', 'status' => 'FAIL', 'error' => $e->getMessage()];
        }
    } else {
        $result['tests'][] = ['name' => 'endpoints.news', 'status' => 'FAIL', 'error' => 'news.php not found'];
    }

    $result['status'] = 'completed';
} catch (Throwable $e) {
    error_log('[test-api-routing] Exception: ' . $e->getMessage());
    $result['status'] = 'error';
    $result['error'] = $e->getMessage();
    $result['trace'] = $e->getTraceAsString();
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
