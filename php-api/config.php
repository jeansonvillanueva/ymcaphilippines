<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Enable error reporting for debugging on cPanel
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/error.log');
error_reporting(E_ALL);

set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    $message = "PHP Error [$errno] $errstr in $errfile on line $errline";
    error_log($message);
    if (!headers_sent()) {
        http_response_code(500);
        echo json_encode(['error' => $message]);
    }
    exit();
});

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_PARSE], true)) {
        $message = "Fatal error: {$error['message']} in {$error['file']} on line {$error['line']}";
        error_log($message);
        if (!headers_sent()) {
            http_response_code(500);
            echo json_encode(['error' => $message]);
        }
        exit();
    }
});

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$host = 'localhost'; // cPanel MySQL usually uses localhost
$user = 'ymcaph_user';
$password = 'e8f133def539f610fe95fa789ac08d6ee8f133def539f610fe95fa789ac08d6e';
$database = 'ymcaph_db';

// Create database connection (lazy loading - only connect when needed)
$conn = null;

function getDatabaseConnection() {
    global $conn, $host, $user, $password, $database;
    if ($conn === null) {
        if (!class_exists('mysqli')) {
            error_log('MySQLi extension not available');
            return null;
        }
        $conn = new mysqli($host, $user, $password, $database);
        if ($conn->connect_error) {
            error_log('Database connection failed: ' . $conn->connect_error);
            // Don't exit here - let individual endpoints handle it
            return null;
        }
        $conn->set_charset('utf8');
    }
    return $conn;
}
?>