<?php
// Direct login test - bypasses routing system
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
header('Content-Type: application/json');

$testResult = [
    'test_name' => 'DIRECT_LOGIN_TEST',
    'timestamp' => date('Y-m-d H:i:s'),
    'steps' => [],
];

// Step 1: Include config
$testResult['steps'][] = ['name' => 'Loading config.php', 'status' => 'pending'];
try {
    require_once __DIR__ . '/config.php';
    $testResult['steps'][0]['status'] = 'success';
} catch (Exception $e) {
    $testResult['steps'][0]['status'] = 'failed';
    $testResult['steps'][0]['error'] = $e->getMessage();
    echo json_encode($testResult, JSON_PRETTY_PRINT);
    exit;
}

// Step 2: Include utils
$testResult['steps'][] = ['name' => 'Loading utils.php', 'status' => 'pending'];
try {
    require_once __DIR__ . '/utils.php';
    $testResult['steps'][1]['status'] = 'success';
} catch (Exception $e) {
    $testResult['steps'][1]['status'] = 'failed';
    $testResult['steps'][1]['error'] = $e->getMessage();
    echo json_encode($testResult, JSON_PRETTY_PRINT);
    exit;
}

// Step 3: Include auth
$testResult['steps'][] = ['name' => 'Loading auth.php', 'status' => 'pending'];
try {
    require_once __DIR__ . '/auth.php';
    $testResult['steps'][2]['status'] = 'success';
} catch (Exception $e) {
    $testResult['steps'][2]['status'] = 'failed';
    $testResult['steps'][2]['error'] = $e->getMessage();
    echo json_encode($testResult, JSON_PRETTY_PRINT);
    exit;
}

// Step 4: Test database connection
$testResult['steps'][] = ['name' => 'Testing database connection', 'status' => 'pending'];
$conn = getDatabaseConnection();
if ($conn && !$conn->connect_error) {
    $testResult['steps'][3]['status'] = 'success';
    $testResult['steps'][3]['database'] = 'connected';
} else {
    $testResult['steps'][3]['status'] = 'failed';
    $testResult['steps'][3]['error'] = $conn ? $conn->connect_error : 'Connection failed';
    echo json_encode($testResult, JSON_PRETTY_PRINT);
    exit;
}

// Step 5: Test login with correct credentials
$testResult['steps'][] = ['name' => 'Testing login function', 'status' => 'pending'];
if (function_exists('loginAdmin')) {
    $loginResult = loginAdmin('ymcaph', 'Ymc@19!1');
    $testResult['steps'][4]['status'] = 'success';
    $testResult['steps'][4]['login_result'] = $loginResult ? 'AUTHENTICATED' : 'INVALID_CREDENTIALS';
    
    if ($loginResult) {
        $testResult['final_result'] = 'LOGIN_WORKS';
    } else {
        // Try to debug why login failed
        $testResult['steps'][] = ['name' => 'Checking admin user in database', 'status' => 'pending'];
        $checkUser = $conn->query("SELECT * FROM admin WHERE username='ymcaph' LIMIT 1");
        if ($checkUser && $checkUser->num_rows > 0) {
            $admin = $checkUser->fetch_assoc();
            $testResult['steps'][5]['status'] = 'success';
            $testResult['steps'][5]['user_exists'] = true;
            $testResult['steps'][5]['user_data'] = [
                'username' => $admin['username'],
                'password_hash_length' => strlen($admin['password']),
            ];
        } else {
            $testResult['steps'][5]['status'] = 'failed';
            $testResult['steps'][5]['error'] = 'User ymcaph not found in database';
        }
        $testResult['final_result'] = 'LOGIN_FAILED';
    }
} else {
    $testResult['steps'][4]['status'] = 'failed';
    $testResult['steps'][4]['error'] = 'loginAdmin() function not found in auth.php';
    $testResult['final_result'] = 'AUTH_FUNCTION_NOT_FOUND';
}

echo json_encode($testResult, JSON_PRETTY_PRINT);
?>
