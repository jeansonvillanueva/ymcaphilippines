<?php
require_once 'config.php';

header('Content-Type: application/json');

// This is a setup/maintenance script - should only be run by admin
// For production, consider adding authentication check

$conn = getDatabaseConnection();
if (!$conn) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed', 'details' => mysqli_connect_error()]);
    exit;
}

$results = [
    'status' => 'Database Schema Setup',
    'database' => 'ymcaph_db',
    'operations' => [],
    'errors' => []
];

// Function to check and add column if missing
function addColumnIfMissing($conn, $table, $column, $definition, &$results) {
    $result = $conn->query("SHOW COLUMNS FROM $table LIKE '$column'");
    
    if (!$result || $result->num_rows === 0) {
        $results['operations'][] = "Adding missing column: $table.$column";
        
        $alterResult = $conn->query("ALTER TABLE $table ADD COLUMN $column $definition");
        if ($alterResult) {
            $results['operations'][] = "✓ Successfully added $column";
            return true;
        } else {
            $results['errors'][] = "Failed to add $column: " . $conn->error;
            return false;
        }
    } else {
        $results['operations'][] = "✓ Column $table.$column already exists";
        return true;
    }
}

// Ensure contentBlocks column exists in news table
addColumnIfMissing($conn, 'news', 'contentBlocks', 'LONGTEXT', $results);

// Ensure body column exists in news table
addColumnIfMissing($conn, 'news', 'body', 'TEXT', $results);

// Ensure localYMCA column exists in news table
addColumnIfMissing($conn, 'news', 'localYMCA', 'VARCHAR(100)', $results);

// Get all columns in news table for verification
$columnResult = $conn->query("SHOW COLUMNS FROM news");
$columns = [];
if ($columnResult) {
    while ($row = $columnResult->fetch_assoc()) {
        $columns[] = [
            'name' => $row['Field'],
            'type' => $row['Type'],
            'null' => $row['Null'],
            'default' => $row['Default'] ?: 'NULL'
        ];
    }
}

// Get news statistics
$countResult = $conn->query("SELECT COUNT(*) as count FROM news");
$newsCount = $countResult ? $countResult->fetch_assoc()['count'] : 0;

$results['summary'] = [
    'news_table_columns' => count($columns),
    'news_table_columns_list' => $columns,
    'news_records' => $newsCount
];

$results['success'] = count($results['errors']) === 0;

echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

$conn->close();
?>
