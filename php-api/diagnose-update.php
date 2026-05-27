<?php
// Diagnostic endpoint to understand the update request

require_once 'config.php';
require_once 'utils.php';

$output = [];

// 1. Check request details
$output['request'] = [
    'method' => $_SERVER['REQUEST_METHOD'],
    'uri' => $_SERVER['REQUEST_URI'],
    'path' => parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH),
    'query_string' => $_SERVER['QUERY_STRING'] ?? 'NONE',
    'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'NOT SET',
];

// 2. Check GET parameters
$output['get'] = $_GET;

// 3. Check POST parameters (keys only, not values to keep it short)
$output['post_keys'] = array_keys($_POST);

// 4. Check FILES
$output['files_keys'] = array_keys($_FILES);

// 5. Try to get form data
$data = getPostData();
$output['getPostData_keys'] = array_keys($data);
$output['getPostData_id'] = $data['id'] ?? 'NOT IN DATA';
$output['getPostData_method'] = $data['_method'] ?? 'NOT IN DATA';

// 6. Check if method override worked
$output['request_method_after_override'] = $_SERVER['REQUEST_METHOD'];

// 7. Test the regex on the path
$path = $_GET['path'] ?? parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$output['extracted_path'] = $path;

$matches = [];
$regex_match = preg_match('/^(\/n2r8k5j9m1\/news\/(\d+)|\/admin\/news\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/news\/(\d+))$/', $path, $matches);
$output['regex_match'] = $regex_match ? 'YES' : 'NO';
$output['regex_matches'] = $matches;
$output['extracted_id_from_regex'] = $matches[2] ?? $matches[3] ?? $matches[4] ?? 'NONE';

// 7. Check all possible ID sources
$output['id_from_get'] = $_GET['id'] ?? 'NOT SET';
$output['id_from_post'] = $_POST['id'] ?? 'NOT SET';
$output['id_from_data'] = $data['id'] ?? 'NOT SET';
$output['final_id'] = intval($_GET['id'] ?? $_POST['id'] ?? $data['id'] ?? 0);

echo json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
