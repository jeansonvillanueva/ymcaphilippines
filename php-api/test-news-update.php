<?php
// Test endpoint for debugging news update

require_once 'config.php';
require_once 'utils.php';

error_log('[TEST-NEWS-UPDATE] === TEST STARTED ===');
error_log('[TEST-NEWS-UPDATE] REQUEST_METHOD: ' . $_SERVER['REQUEST_METHOD']);
error_log('[TEST-NEWS-UPDATE] REQUEST_URI: ' . $_SERVER['REQUEST_URI']);
error_log('[TEST-NEWS-UPDATE] CONTENT_TYPE: ' . ($_SERVER['CONTENT_TYPE'] ?? 'NOT SET'));
error_log('[TEST-NEWS-UPDATE] Query String: ' . ($_SERVER['QUERY_STRING'] ?? 'NOT SET'));

// Log all GET/POST/FILES
error_log('[TEST-NEWS-UPDATE] $_GET: ' . json_encode($_GET));
error_log('[TEST-NEWS-UPDATE] $_POST keys: ' . implode(', ', array_keys($_POST)));
error_log('[TEST-NEWS-UPDATE] $_FILES keys: ' . implode(', ', array_keys($_FILES)));

// Try to get raw input
$rawInput = file_get_contents('php://input');
error_log('[TEST-NEWS-UPDATE] Raw input length: ' . strlen($rawInput));
error_log('[TEST-NEWS-UPDATE] Raw input preview: ' . substr($rawInput, 0, 500));

// Try getPostData
$data = getPostData();
error_log('[TEST-NEWS-UPDATE] getPostData result: ' . json_encode($data));

// Test method override detection
$methodOverride = $_POST['_method'] ?? $_GET['_method'] ?? null;
error_log('[TEST-NEWS-UPDATE] Method override from POST/GET: ' . ($methodOverride ?? 'NOT FOUND'));

error_log('[TEST-NEWS-UPDATE] === TEST ENDED ===');

echo json_encode([
    'status' => 'OK',
    'message' => 'Check error.log for details',
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'has_form_data' => !empty($_POST),
    'has_files' => !empty($_FILES),
    'get_post_data_keys' => array_keys($data),
]);
