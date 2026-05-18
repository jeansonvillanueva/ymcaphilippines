<?php
// This file tests endpoints by directly including them
// It bypasses the .htaccess routing to see if the endpoints work

header('Content-Type: application/json');
ini_set('display_errors', '0');

$tests = [];

try {
    // Load dependencies
    require_once 'config.php';
    require_once 'utils.php';
    require_once 'auth.php';
    
    $tests['config_loaded'] = true;

    // Test 1: test-db endpoint
    $tests['test_db'] = [];
    try {
        ob_start();
        $_SERVER['REQUEST_METHOD'] = 'GET';
        include 'endpoints/test_db.php';
        $output = ob_get_clean();
        $tests['test_db']['status'] = 'executed';
        $tests['test_db']['output'] = $output;
    } catch (Throwable $e) {
        ob_end_clean();
        $tests['test_db']['status'] = 'error';
        $tests['test_db']['error'] = $e->getMessage();
    }

    // Test 2: news endpoint
    $tests['news'] = [];
    try {
        ob_start();
        $_SERVER['REQUEST_METHOD'] = 'GET';
        include 'endpoints/news.php';
        $output = ob_get_clean();
        $tests['news']['status'] = 'executed';
        $tests['news']['output'] = $output;
    } catch (Throwable $e) {
        ob_end_clean();
        $tests['news']['status'] = 'error';
        $tests['news']['error'] = $e->getMessage();
    }

    // Test 3: locals endpoint
    $tests['locals'] = [];
    try {
        ob_start();
        $_SERVER['REQUEST_METHOD'] = 'GET';
        include 'endpoints/locals.php';
        $output = ob_get_clean();
        $tests['locals']['status'] = 'executed';
        $tests['locals']['output'] = $output;
    } catch (Throwable $e) {
        ob_end_clean();
        $tests['locals']['status'] = 'error';
        $tests['locals']['error'] = $e->getMessage();
    }

} catch (Throwable $e) {
    $tests['error'] = $e->getMessage();
}

echo json_encode($tests, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
