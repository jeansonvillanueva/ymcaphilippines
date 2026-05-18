<?php
// Test create news endpoint
include 'config.php';
include 'utils.php';

echo "=== Test Create News ===\n";

// Test database connection
if ($conn->connect_error) {
    echo "Database connection failed: " . $conn->connect_error . "\n";
    exit;
}
echo "Database connected successfully\n";

// Test simple INSERT first
echo "\n--- Testing simple INSERT ---\n";
$simpleSql = "INSERT INTO news (title, created_at) VALUES ('Test Simple " . time() . "', NOW())";
echo "Simple SQL: $simpleSql\n";
$simpleResult = $conn->query($simpleSql);
echo "Simple result: " . ($simpleResult ? 'TRUE' : 'FALSE') . "\n";
echo "Simple error: '" . $conn->error . "'\n";
echo "Simple insert ID: " . $conn->insert_id . "\n";
echo "Simple affected rows: " . $conn->affected_rows . "\n";

if ($simpleResult && $conn->insert_id > 0) {
    echo "Simple insert SUCCESS\n";
    // Clean up
    $conn->query("DELETE FROM news WHERE id = " . $conn->insert_id);
} else {
    echo "Simple insert FAILED - this indicates a database issue\n";
}

echo "\n--- Testing full INSERT like create endpoint ---\n";

// Test table structure
$result = $conn->query("DESCRIBE news");
if ($result) {
    echo "News table columns:\n";
    while ($row = $result->fetch_assoc()) {
        echo "- {$row['Field']}: {$row['Type']} ({$row['Null']}) Key: {$row['Key']}\n";
    }
} else {
    echo "Error describing table: " . $conn->error . "\n";
}

// Test basic insert
$testTitle = 'Test News ' . time();
$testData = [
    'title' => $testTitle,
    'date' => 'April 15, 2026',
    'subtitle' => 'Test subtitle',
    'body' => 'Test body content',
    'category' => 'News',
    'topic' => 'Test'
];

echo "\nTest data: " . json_encode($testData) . "\n";

// Test the create logic
$title = $conn->real_escape_string($testData['title']);
$path = createNewsPath($testData['title']);
$date = $conn->real_escape_string($testData['date']);
$subtitle = $conn->real_escape_string($testData['subtitle']);
$body = $conn->real_escape_string($testData['body']);
$localYMCA = '';
$imageUrl = '';
$category = $conn->real_escape_string($testData['category']);
$topic = $conn->real_escape_string($testData['topic']);

// Ensure path uniqueness
$originalPath = $path;
$counter = 1;
while (true) {
    $checkPath = $conn->query("SELECT id FROM news WHERE path = '$path'");
    if (!$checkPath || $checkPath->num_rows == 0) {
        break;
    }
    $path = $originalPath . '-' . $counter;
    $counter++;
}

$columns = ['path', 'title', 'date', 'subtitle', 'imageUrl', 'category', 'topic'];
$values = ["'$path'", "'$title'", "'$date'", "'$subtitle'", "'$imageUrl'", "'$category'", "'$topic'"];

$createdAtExists = $conn->query("SHOW COLUMNS FROM news LIKE 'created_at'");
if ($createdAtExists && $createdAtExists->num_rows > 0) {
    $columns[] = 'created_at';
    $values[] = 'NOW()';
}

$updatedAtExists = $conn->query("SHOW COLUMNS FROM news LIKE 'updated_at'");
if ($updatedAtExists && $updatedAtExists->num_rows > 0) {
    $columns[] = 'updated_at';
    $values[] = 'NOW()';
}

// Add the remaining columns that come after timestamps
$columns = array_merge($columns, ['body', 'localYMCA']);
$values = array_merge($values, ["'$body'", "'$localYMCA'"]);

$sql = "INSERT INTO news (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $values) . ")";

echo "SQL: $sql\n";

$result = $conn->query($sql);
echo "Query result: " . ($result ? 'TRUE' : 'FALSE') . "\n";
echo "Connection error: '" . $conn->error . "'\n";
echo "Affected rows: " . $conn->affected_rows . "\n";
echo "Insert ID: " . $conn->insert_id . "\n";

if ($result === TRUE && $conn->affected_rows > 0) {
    $newId = $conn->insert_id;
    echo "SUCCESS: Inserted with ID $newId\n";

    // Verify
    $verify = $conn->query("SELECT id, title, path FROM news WHERE id = $newId");
    if ($verify && $verify->num_rows > 0) {
        $row = $verify->fetch_assoc();
        echo "VERIFIED: " . json_encode($row) . "\n";
    } else {
        echo "VERIFICATION FAILED\n";
    }
} else {
    echo "INSERT FAILED\n";
}

echo "\n=== End Test ===\n";

function createNewsPath($title) {
    $slug = preg_replace('/[^a-z0-9]+/', '-', strtolower(trim($title)));
    $slug = trim($slug, '-');
    return '/news/' . ($slug ?: 'news-' . time());
}
?>