<?php
require_once 'config.php';
require_once 'utils.php';

header('Content-Type: application/json');

$diagnostics = [
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'database' => [
        'host' => 'localhost',
        'user' => 'ymcaph_user',
        'database' => 'ymcaph_db',
        'connected' => false,
        'character_set' => null,
        'error' => null,
        'tables' => [],
        'local_table_info' => null,
    ],
    'directories' => [
        'uploads' => [
            'path' => __DIR__ . '/../backend/uploads/',
            'exists' => false,
            'writable' => false,
            'permissions' => null,
            'files_count' => 0,
            'sample_files' => [],
        ],
    ],
    'server' => [
        'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'N/A',
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'N/A',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
    ],
    'paths' => [
        'upload_base_path' => getUploadBasePath(),
        'example_upload_url' => getUploadBasePath() . '/uploads/example.jpg',
    ],
];

// Test database connection
$conn = getDatabaseConnection();
if (!$conn || $conn->connect_error) {
    $diagnostics['database']['error'] = $conn ? $conn->connect_error : 'Failed to establish connection';
    $diagnostics['status'] = 'ERROR: Database not connected';
} else {
    $diagnostics['database']['connected'] = true;
    $diagnostics['database']['character_set'] = $conn->get_charset()->charset;
    
    // Get tables
    $result = $conn->query("SHOW TABLES");
    if ($result) {
        while ($row = $result->fetch_row()) {
            $diagnostics['database']['tables'][] = $row[0];
        }
    }
    
    // Get detailed info about 'local' table (if it exists)
    $tableExists = in_array('local', $diagnostics['database']['tables'] ?? []);
    
    if (!$tableExists) {
        $diagnostics['database']['local_table_info'] = ['error' => 'Table "local" does not exist in database'];
        $diagnostics['database']['local_record_count'] = 0;
        $diagnostics['database']['sample_locals'] = [];
    } else {
        $tableCheck = $conn->query("SHOW COLUMNS FROM `local`");
        if ($tableCheck) {
            $columns = [];
            while ($row = $tableCheck->fetch_assoc()) {
                $columns[] = [
                    'name' => $row['Field'],
                    'type' => $row['Type'],
                    'null' => $row['Null'],
                    'key' => $row['Key'],
                ];
            }
            $diagnostics['database']['local_table_info'] = [
                'columns' => $columns,
                'column_names' => array_map(fn($c) => $c['name'], $columns),
            ];
        }
        
        // Check if 'local' table exists and get record count
        $localResult = $conn->query("SELECT COUNT(*) as count FROM `local`");
        if ($localResult) {
            $localCount = $localResult->fetch_assoc();
            $diagnostics['database']['local_record_count'] = $localCount['count'];
            
            // Get sample records
            if ($localCount['count'] > 0) {
                $sampleResult = $conn->query("SELECT local_id, name FROM `local` LIMIT 5");
                if ($sampleResult) {
                    $samples = [];
                    while ($row = $sampleResult->fetch_assoc()) {
                        $samples[] = $row;
                    }
                    $diagnostics['database']['sample_locals'] = $samples;
                }
            }
        } else {
            $diagnostics['database']['error'] = "Could not query local table: " . $conn->error;
        }
    }
}

// Check uploads directory
$uploadsPath = __DIR__ . '/../backend/uploads/';
$diagnostics['directories']['uploads']['exists'] = is_dir($uploadsPath);

if ($diagnostics['directories']['uploads']['exists']) {
    $diagnostics['directories']['uploads']['writable'] = is_writable($uploadsPath);
    $perms = fileperms($uploadsPath);
    $diagnostics['directories']['uploads']['permissions'] = substr(sprintf('%o', $perms), -4);
    
    $files = glob($uploadsPath . '*');
    $diagnostics['directories']['uploads']['files_count'] = count($files);
    $diagnostics['directories']['uploads']['sample_files'] = array_slice(array_map('basename', $files), 0, 10);
} else {
    $diagnostics['directories']['uploads']['error'] = 'Directory does not exist';
}

// Add status summary
$statusChecks = [
    'Database Connected' => $diagnostics['database']['connected'],
    'Local Table Exists' => in_array('local', $diagnostics['database']['tables'] ?? []),
    'Local Records > 0' => ($diagnostics['database']['local_record_count'] ?? 0) > 0,
    'Uploads Directory Exists' => $diagnostics['directories']['uploads']['exists'],
    'Uploads Directory Writable' => $diagnostics['directories']['uploads']['writable'],
];

$allPassed = array_reduce($statusChecks, fn($carry, $stat) => $carry && $stat, true);
$diagnostics['summary'] = [
    'status' => $allPassed ? 'OK' : 'ISSUES FOUND',
    'checks' => $statusChecks,
];

echo json_encode($diagnostics, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
