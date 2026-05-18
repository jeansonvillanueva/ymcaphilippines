<?php
require_once 'config.php';
require_once 'utils.php';

header('Content-Type: application/json');

$conn = getDatabaseConnection();
if (!$conn) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Get all columns in news table
$result = $conn->query("SHOW COLUMNS FROM news");
$columns = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $columns[] = [
            'Field' => $row['Field'],
            'Type' => $row['Type'],
            'Null' => $row['Null'],
            'Key' => $row['Key'],
            'Default' => $row['Default'],
            'Extra' => $row['Extra']
        ];
    }
}

// Try to add contentBlocks column if missing
$contentBlocksExists = false;
foreach ($columns as $col) {
    if ($col['Field'] === 'contentBlocks') {
        $contentBlocksExists = true;
        break;
    }
}

$message = '';
if (!$contentBlocksExists) {
    error_log('[check_news_schema] Adding missing contentBlocks column');
    $alterResult = $conn->query("ALTER TABLE news ADD COLUMN contentBlocks LONGTEXT AFTER body");
    if ($alterResult) {
        $message = 'Added contentBlocks column successfully';
        $contentBlocksExists = true;
        // Re-fetch columns
        $result = $conn->query("SHOW COLUMNS FROM news");
        $columns = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $columns[] = [
                    'Field' => $row['Field'],
                    'Type' => $row['Type'],
                    'Null' => $row['Null'],
                    'Key' => $row['Key'],
                    'Default' => $row['Default'],
                    'Extra' => $row['Extra']
                ];
            }
        }
    } else {
        $message = 'Error adding column: ' . $conn->error;
    }
}

// Get sample data from news table
$sampleData = [];
$dataResult = $conn->query("SELECT * FROM news LIMIT 1");
if ($dataResult && $dataResult->num_rows > 0) {
    $sampleData = $dataResult->fetch_assoc();
}

echo json_encode([
    'database' => 'ymcaph_db',
    'table' => 'news',
    'contentBlocks_exists' => $contentBlocksExists,
    'message' => $message,
    'columns' => $columns,
    'sample_data' => $sampleData,
    'news_count' => $conn->query("SELECT COUNT(*) as count FROM news")->fetch_assoc()['count']
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

$conn->close();
?>
