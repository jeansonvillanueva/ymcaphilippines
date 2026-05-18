<?php
header('Content-Type: application/json');

$result = [
    'php_version' => phpversion(),
    'php_sapi' => php_sapi_name(),
    'php_ini_display_errors' => ini_get('display_errors'),
    'php_ini_error_reporting' => ini_get('error_reporting'),
    'php_ini_log_errors' => ini_get('log_errors'),
    'php_ini_error_log' => ini_get('error_log'),
    'extensions' => [
        'mysqli' => extension_loaded('mysqli'),
        'pdo' => extension_loaded('pdo'),
        'pdo_mysql' => extension_loaded('pdo_mysql'),
        'curl' => extension_loaded('curl'),
        'json' => extension_loaded('json'),
    ],
    'files' => [
        'config_readable' => is_readable('config.php'),
        'utils_readable' => is_readable('utils.php'),
        'auth_readable' => is_readable('auth.php'),
        'index_readable' => is_readable('index.php'),
        'endpoints_exists' => is_dir('endpoints'),
    ],
    'paths' => [
        'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'N/A',
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'N/A',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
        'cwd' => getcwd(),
    ],
];

// Try to load config
$config_error = null;
try {
    if (is_readable('config.php')) {
        ob_start();
        require_once 'config.php';
        $output = ob_get_clean();
        if (!empty($output)) {
            $config_error = 'Output from config.php: ' . substr($output, 0, 200);
        }
        $result['config_loaded'] = true;
    } else {
        $result['config_loaded'] = false;
        $config_error = 'config.php not readable';
    }
} catch (Throwable $e) {
    $config_error = $e->getMessage();
    $result['config_loaded'] = false;
}

if ($config_error) {
    $result['config_error'] = $config_error;
}

// Try database connection
$db_error = null;
try {
    $conn = new mysqli('localhost', 'ymcaph_user', 'e8f133def539f610fe95fa789ac08d6ee8f133def539f610fe95fa789ac08d6e', 'ymcaph_db');
    if ($conn->connect_error) {
        $db_error = $conn->connect_error;
        $result['database'] = [
            'connected' => false,
            'error' => $db_error,
        ];
    } else {
        $result['database'] = [
            'connected' => true,
            'error' => null,
        ];
        $conn->close();
    }
} catch (Throwable $e) {
    $db_error = $e->getMessage();
    $result['database'] = [
        'connected' => false,
        'error' => $db_error,
    ];
}

// Check endpoint files
$result['endpoint_files'] = [];
if (is_dir('endpoints')) {
    $files = scandir('endpoints');
    foreach ($files as $file) {
        if (strpos($file, '.php') > 0) {
            $result['endpoint_files'][] = [
                'file' => $file,
                'readable' => is_readable('endpoints/' . $file),
                'size' => filesize('endpoints/' . $file),
            ];
        }
    }
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
