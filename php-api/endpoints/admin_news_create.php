<?php
// POST /admin/news
$data = getPostData();

error_log('[admin_news_create] Received POST data: ' . json_encode($data));
error_log('[admin_news_create] Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));
error_log('[admin_news_create] REQUEST_METHOD: ' . ($_SERVER['REQUEST_METHOD'] ?? 'not set'));

// Log all POST data for debugging
error_log('[admin_news_create] _POST keys: ' . implode(', ', array_keys($_POST)));
error_log('[admin_news_create] _FILES keys: ' . implode(', ', array_keys($_FILES)));

if (!isset($data['title']) || empty(trim($data['title']))) {
    error_log('[admin_news_create] ERROR: Title missing or empty. Data keys: ' . implode(', ', array_keys($data)));
    sendResponse(['error' => "Field 'title' is required"], 400);
}

$title = trim($data['title']);
if (empty($title)) {
    error_log('[admin_news_create] ERROR: Title is empty after trimming');
    sendResponse(['error' => "Field 'title' is required"], 400);
}

$title = $conn->real_escape_string($title);
$path = isset($data['path']) && !empty($data['path']) ? $conn->real_escape_string($data['path']) : createNewsPath($title);

// Ensure path uniqueness
$originalPath = $path;
$counter = 1;
while (true) {
    $checkPath = $conn->query("SELECT id FROM news WHERE path = '$path'");
    if (!$checkPath || $checkPath->num_rows == 0) {
        break; // Path is unique
    }
    $path = $originalPath . '-' . $counter;
    $counter++;
    if ($counter > 100) { // Prevent infinite loop
        $path = $originalPath . '-' . time();
        break;
    }
}
$date = isset($data['date']) ? $conn->real_escape_string($data['date']) : '';
$subtitle = isset($data['subtitle']) ? $conn->real_escape_string($data['subtitle']) : '';
$body = isset($data['body']) ? $conn->real_escape_string($data['body']) : '';
$contentBlocks = isset($data['contentBlocks']) ? $conn->real_escape_string($data['contentBlocks']) : '[]';
$localYMCA = isset($data['localYMCA']) ? $conn->real_escape_string($data['localYMCA']) : '';
$imageUrl = isset($data['imageUrl']) ? $conn->real_escape_string($data['imageUrl']) : '';
$category = isset($data['category']) ? $conn->real_escape_string($data['category']) : 'News';
$topic = isset($data['topic']) ? $conn->real_escape_string($data['topic']) : '';

// Handle file upload
$uploadedImagePath = handleFileUpload('image');
if ($uploadedImagePath) {
    $imageUrl = $uploadedImagePath;
}

$createdAtExists = $conn->query("SHOW COLUMNS FROM news LIKE 'created_at'");
$updatedAtExists = $conn->query("SHOW COLUMNS FROM news LIKE 'updated_at'");

// Match the EXACT table column order: path, title, date, subtitle, imageUrl, category, topic, created_at, updated_at, body, contentBlocks, localYMCA
$columns = ['path', 'title', 'date', 'subtitle', 'imageUrl', 'category', 'topic'];
$values = ["'$path'", "'$title'", "'$date'", "'$subtitle'", "'$imageUrl'", "'$category'", "'$topic'"];

if ($createdAtExists && $createdAtExists->num_rows > 0) {
    $columns[] = 'created_at';
    $values[] = 'NOW()';
}

if ($updatedAtExists && $updatedAtExists->num_rows > 0) {
    $columns[] = 'updated_at';
    $values[] = 'NOW()';
}

// Add the remaining columns that come after timestamps
$columns = array_merge($columns, ['body', 'contentBlocks', 'localYMCA']);
$values = array_merge($values, ["'$body'", "'$contentBlocks'", "'$localYMCA'"]);

$sql = "INSERT INTO news (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $values) . ")";

error_log('[admin_news_create] Final data to insert:');
error_log('[admin_news_create] Columns: ' . implode(', ', $columns));
error_log('[admin_news_create] Values: ' . implode(', ', $values));
error_log('[admin_news_create] SQL: ' . $sql);
$result = $conn->query($sql);

error_log('[admin_news_create] Query result: ' . ($result ? 'TRUE' : 'FALSE'));
error_log('[admin_news_create] Connection error: ' . $conn->error);
error_log('[admin_news_create] Affected rows: ' . $conn->affected_rows);
error_log('[admin_news_create] Insert ID: ' . $conn->insert_id);

if ($result !== false && $conn->affected_rows > 0) {
    $newId = $conn->insert_id;
    error_log('[admin_news_create] Insert succeeded. ID: ' . $newId . ', Affected rows: ' . $conn->affected_rows);

    if ($newId > 0) {
        // Verify the record was actually inserted
        $verify = $conn->query("SELECT id, title, path FROM news WHERE id = $newId");
        if ($verify && $verify->num_rows > 0) {
            $row = $verify->fetch_assoc();
            error_log('[admin_news_create] Verification SUCCESS - record exists: ' . json_encode($row));
            error_log('[admin_news_create] Full inserted record: ID=' . $newId . ', Title=' . substr($title, 0, 50) . ', ContentBlocks size: ' . strlen($contentBlocks));
            sendResponse(['id' => $newId, 'message' => 'News added successfully', 'title' => $row['title']]);
        } else {
            error_log('[admin_news_create] Verification FAILED - record not found after insert');
            sendResponse(['error' => 'Record verification failed after insert'], 500);
        }
    } else {
        error_log('[admin_news_create] ERROR: Insert ID is 0 or invalid');
        sendResponse(['error' => 'Failed to get insert ID'], 500);
    }
} else {
    $error = $conn->error ?: 'Unknown database error';
    error_log('[admin_news_create] INSERT FAILED. Error: ' . $error . ', Result type: ' . gettype($result) . ', Affected rows: ' . $conn->affected_rows);
    sendResponse(['error' => 'Database error: ' . $error], 500);
}
function createNewsPath($title) {
    $slug = preg_replace('/[^a-z0-9]+/', '-', strtolower(trim($title)));
    $slug = trim($slug, '-');
    return '/news/' . ($slug ?: 'news-' . time());
}
?>